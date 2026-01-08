<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\SpecializationCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SpecializationCategoryController extends Controller
{
    public function index(Request $request)
    {
        // If no auth token, return only active categories (for public)
        if (!$request->user()) {
            $categories = SpecializationCategory::where('is_active', true)
                ->orderBy('order')
                ->get();
            return response()->json($categories);
        }
        
        // For admin, return all categories
        $categories = SpecializationCategory::orderBy('order')->get();
        return response()->json($categories);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'order' => 'nullable|integer',
        ]);

        $validated['slug'] = Str::slug($validated['name']);
        
        // Check if slug exists
        if (SpecializationCategory::where('slug', $validated['slug'])->exists()) {
            $validated['slug'] = $validated['slug'] . '-' . time();
        }

        $category = SpecializationCategory::create($validated);

        return response()->json($category, 201);
    }

    public function update(Request $request, $id)
    {
        $category = SpecializationCategory::findOrFail($id);
        
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'order' => 'nullable|integer',
            'is_active' => 'sometimes|boolean',
        ]);

        if (isset($validated['name']) && $validated['name'] !== $category->name) {
            $validated['slug'] = Str::slug($validated['name']);
            
            // Check if slug exists
            if (SpecializationCategory::where('slug', $validated['slug'])->where('id', '!=', $id)->exists()) {
                $validated['slug'] = $validated['slug'] . '-' . time();
            }
        }

        $category->update($validated);

        return response()->json($category);
    }

    public function destroy($id)
    {
        $category = SpecializationCategory::findOrFail($id);
        $category->delete();

        return response()->json(['message' => 'Category deleted successfully']);
    }
}
