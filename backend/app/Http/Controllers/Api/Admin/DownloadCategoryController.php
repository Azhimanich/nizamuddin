<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\DownloadCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class DownloadCategoryController extends Controller
{
    public function index()
    {
        $categories = DownloadCategory::orderBy('order')->orderBy('name')->get();
        return response()->json($categories);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|unique:download_categories,slug',
            'description' => 'nullable|string',
            'order' => 'nullable|integer',
            'is_active' => 'sometimes|boolean',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        if (!isset($validated['is_active'])) {
            $validated['is_active'] = true;
        }

        if (!isset($validated['order'])) {
            $validated['order'] = 0;
        }

        $category = DownloadCategory::create($validated);

        return response()->json($category, 201);
    }

    public function update(Request $request, $id)
    {
        $category = DownloadCategory::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'slug' => 'nullable|string|unique:download_categories,slug,' . $id,
            'description' => 'nullable|string',
            'order' => 'nullable|integer',
            'is_active' => 'sometimes|boolean',
        ]);

        if (isset($validated['name']) && empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $category->update($validated);

        return response()->json($category);
    }

    public function destroy($id)
    {
        $category = DownloadCategory::findOrFail($id);
        
        // Check if category has downloads
        if ($category->downloads()->count() > 0) {
            return response()->json([
                'message' => 'Tidak dapat menghapus kategori yang memiliki file download',
                'error' => 'Category has associated downloads'
            ], 422);
        }

        $category->delete();

        return response()->json(['message' => 'Category deleted successfully']);
    }
}

