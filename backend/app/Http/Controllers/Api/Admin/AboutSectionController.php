<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\AboutSection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class AboutSectionController extends Controller
{
    public function index()
    {
        $about = AboutSection::where('is_active', true)->first();
        
        if (!$about) {
            return response()->json(null);
        }

        $imageUrl = $about->image ? (request()->getSchemeAndHttpHost() . '/storage/' . $about->image) : null;

        return response()->json([
            'id' => $about->id,
            'title_id' => $about->title_id,
            'title_en' => $about->title_en,
            'title_ar' => $about->title_ar,
            'content_id' => $about->content_id,
            'content_en' => $about->content_en,
            'content_ar' => $about->content_ar,
            'cta_text_id' => $about->cta_text_id,
            'cta_text_en' => $about->cta_text_en,
            'cta_text_ar' => $about->cta_text_ar,
            'cta_link' => $about->cta_link,
            'image' => $imageUrl,
            'video_url' => $about->video_url,
            'is_active' => $about->is_active,
        ]);
    }

    public function store(Request $request)
    {
        // Validate required fields
        $validated = $request->validate([
            'title_id' => 'required|string|max:255',
            'content_id' => 'required|string',
            'title_en' => 'nullable|string|max:255',
            'title_ar' => 'nullable|string|max:255',
            'content_en' => 'nullable|string',
            'content_ar' => 'nullable|string',
            'cta_text_id' => 'nullable|string|max:255',
            'cta_text_en' => 'nullable|string|max:255',
            'cta_text_ar' => 'nullable|string|max:255',
            'cta_link' => 'nullable|string|max:255',
            'image' => 'nullable|image|max:5120',
            'video_url' => 'nullable|string|max:500',
            'is_active' => 'sometimes',
        ]);

        // Deactivate others
        DB::table('about_sections')->where('is_active', true)->update(['is_active' => false]);

        // Handle image
        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('about', 'public');
        }

        // Handle is_active
        $validated['is_active'] = $request->has('is_active') 
            ? ($request->input('is_active') == '1' || $request->input('is_active') === true) 
            : true;

        // Convert empty strings to null
        foreach (['title_en', 'title_ar', 'content_en', 'content_ar', 'cta_text_id', 'cta_text_en', 'cta_text_ar', 'cta_link', 'video_url'] as $field) {
            if (isset($validated[$field]) && $validated[$field] === '') {
                $validated[$field] = null;
            }
        }

        $about = AboutSection::create($validated);

        $imageUrl = $about->image ? (request()->getSchemeAndHttpHost() . '/storage/' . $about->image) : null;

        return response()->json([
            'id' => $about->id,
            'title_id' => $about->title_id,
            'title_en' => $about->title_en,
            'title_ar' => $about->title_ar,
            'content_id' => $about->content_id,
            'content_en' => $about->content_en,
            'content_ar' => $about->content_ar,
            'cta_text_id' => $about->cta_text_id,
            'cta_text_en' => $about->cta_text_en,
            'cta_text_ar' => $about->cta_text_ar,
            'cta_link' => $about->cta_link,
            'image' => $imageUrl,
            'video_url' => $about->video_url,
            'is_active' => $about->is_active,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $about = AboutSection::findOrFail($id);

        // Validate required fields - make sure to handle FormData properly
        $validated = $request->validate([
            'title_id' => 'required|string|max:255',
            'content_id' => 'required|string',
            'title_en' => 'nullable|string|max:255',
            'title_ar' => 'nullable|string|max:255',
            'content_en' => 'nullable|string',
            'content_ar' => 'nullable|string',
            'cta_text_id' => 'nullable|string|max:255',
            'cta_text_en' => 'nullable|string|max:255',
            'cta_text_ar' => 'nullable|string|max:255',
            'cta_link' => 'nullable|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'video_url' => 'nullable|string|max:500',
            'is_active' => 'nullable|boolean',
        ]);

        // Handle image - only update if new file is provided
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($about->image) {
                Storage::disk('public')->delete($about->image);
            }
            $validated['image'] = $request->file('image')->store('about', 'public');
        } else {
            // Keep existing image if no new file is provided
            // Don't include 'image' in validated array, so it won't be updated
            unset($validated['image']);
        }

        // Handle is_active - FormData sends as string '1' or '0'
        if ($request->has('is_active')) {
            $isActiveValue = $request->input('is_active');
            $validated['is_active'] = $isActiveValue === '1' || $isActiveValue === true || $isActiveValue === 'true';
        } else {
            // If not provided, keep existing value
            $validated['is_active'] = $about->is_active;
        }

        // Convert empty strings to null
        foreach (['title_en', 'title_ar', 'content_en', 'content_ar', 'cta_text_id', 'cta_text_en', 'cta_text_ar', 'cta_link', 'video_url'] as $field) {
            if (isset($validated[$field]) && $validated[$field] === '') {
                $validated[$field] = null;
            }
        }

        // If activating this one, deactivate others
        if (isset($validated['is_active']) && $validated['is_active']) {
            DB::table('about_sections')->where('is_active', true)->where('id', '!=', $id)->update(['is_active' => false]);
        }

        // Update using DB directly to ensure it works
        DB::table('about_sections')->where('id', $id)->update($validated);

        // Reload from database
        $about = AboutSection::findOrFail($id);

        $imageUrl = $about->image ? (request()->getSchemeAndHttpHost() . '/storage/' . $about->image) : null;

        return response()->json([
            'id' => $about->id,
            'title_id' => $about->title_id,
            'title_en' => $about->title_en,
            'title_ar' => $about->title_ar,
            'content_id' => $about->content_id,
            'content_en' => $about->content_en,
            'content_ar' => $about->content_ar,
            'cta_text_id' => $about->cta_text_id,
            'cta_text_en' => $about->cta_text_en,
            'cta_text_ar' => $about->cta_text_ar,
            'cta_link' => $about->cta_link,
            'image' => $imageUrl,
            'video_url' => $about->video_url,
            'is_active' => $about->is_active,
        ]);
    }

    public function destroy($id)
    {
        $about = AboutSection::findOrFail($id);
        
        if ($about->image) {
            Storage::disk('public')->delete($about->image);
        }
        
        $about->delete();

        return response()->json(['message' => 'About section deleted successfully']);
    }
}
