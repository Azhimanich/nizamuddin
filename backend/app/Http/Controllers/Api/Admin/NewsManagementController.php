<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\News;
use App\Models\Category;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class NewsManagementController extends Controller
{
    public function index()
    {
        $news = News::with(['category', 'user', 'tags'])->latest()->paginate(20);
        return response()->json($news);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'author' => 'nullable|string|max:255',
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|unique:news,slug',
            'excerpt' => 'required|string',
            'content' => 'required|string',
            'featured_image' => 'nullable|image|max:2048',
            'image_caption' => 'nullable|string',
            'related_articles' => 'nullable|array',
            'related_articles.*' => 'exists:news,id',
            'meta_title' => 'nullable|string',
            'meta_description' => 'nullable|string',
            'is_published' => 'sometimes|boolean',
            'is_pinned' => 'sometimes|boolean',
            'allow_comments' => 'sometimes|boolean',
            'published_at' => 'nullable|date',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:255',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        if ($request->hasFile('featured_image')) {
            $validated['featured_image'] = $request->file('featured_image')->store('news', 'public');
        }

        $validated['user_id'] = $request->user()->id;
        
        // Set default values
        if (!isset($validated['is_published'])) {
            $validated['is_published'] = false;
        }
        if (!isset($validated['is_pinned'])) {
            $validated['is_pinned'] = false;
        }
        if (!isset($validated['published_at']) && $validated['is_published']) {
            $validated['published_at'] = now();
        }

        // Handle tags
        $tags = $request->input('tags', []);
        unset($validated['tags']);

        $news = News::create($validated);

        // Sync tags
        if (!empty($tags)) {
            $tagIds = [];
            foreach ($tags as $tagName) {
                $tagName = trim($tagName);
                if (!empty($tagName)) {
                    $tag = Tag::firstOrCreate(
                        ['slug' => Str::slug($tagName)],
                        ['name' => $tagName]
                    );
                    $tagIds[] = $tag->id;
                }
            }
            $news->tags()->sync($tagIds);
        }

        return response()->json($news->load(['category', 'user', 'tags']), 201);
    }

    public function update(Request $request, $id)
    {
        $news = News::findOrFail($id);
        
        $validated = $request->validate([
            'category_id' => 'sometimes|exists:categories,id',
            'author' => 'nullable|string|max:255',
            'title' => 'sometimes|string|max:255',
            'slug' => 'nullable|string|unique:news,slug,' . $id,
            'excerpt' => 'sometimes|string',
            'content' => 'sometimes|string',
            'featured_image' => 'nullable|image|max:2048',
            'image_caption' => 'nullable|string',
            'related_articles' => 'nullable|array',
            'related_articles.*' => 'exists:news,id',
            'meta_title' => 'nullable|string',
            'meta_description' => 'nullable|string',
            'is_published' => 'sometimes|boolean',
            'is_pinned' => 'sometimes|boolean',
            'allow_comments' => 'sometimes|boolean',
            'published_at' => 'nullable|date',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:255',
        ]);

        if ($request->hasFile('featured_image')) {
            if ($news->featured_image) {
                Storage::disk('public')->delete($news->featured_image);
            }
            $validated['featured_image'] = $request->file('featured_image')->store('news', 'public');
        } else {
            // Keep existing image if no new file is provided
            unset($validated['featured_image']);
        }

        // Handle tags
        $tags = $request->input('tags', []);
        unset($validated['tags']);

        $news->update($validated);

        // Sync tags
        if ($request->has('tags')) {
            $tagIds = [];
            foreach ($tags as $tagName) {
                $tagName = trim($tagName);
                if (!empty($tagName)) {
                    $tag = Tag::firstOrCreate(
                        ['slug' => Str::slug($tagName)],
                        ['name' => $tagName]
                    );
                    $tagIds[] = $tag->id;
                }
            }
            $news->tags()->sync($tagIds);
        }

        return response()->json($news->load(['category', 'user', 'tags']));
    }

    public function destroy($id)
    {
        $news = News::findOrFail($id);
        if ($news->featured_image) {
            Storage::disk('public')->delete($news->featured_image);
        }
        $news->delete();

        return response()->json(['message' => 'News deleted successfully']);
    }
}

