<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\OrganizationStructure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class OrganizationStructureController extends Controller
{
    public function index()
    {
        $structures = OrganizationStructure::orderBy('level')
            ->orderBy('order')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'name' => $item->name,
                    'position' => $item->position,
                    'level' => $item->level,
                    'order' => $item->order,
                    'parent_id' => $item->parent_id,
                    'photo' => $item->photo ? (request()->getSchemeAndHttpHost() . '/storage/' . $item->photo) : null,
                    'bio_id' => $item->bio_id,
                    'bio_en' => $item->bio_en,
                    'bio_ar' => $item->bio_ar,
                    'email' => $item->email,
                    'phone' => $item->phone,
                    'is_active' => $item->is_active,
                ];
            });
        return response()->json($structures);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'position' => 'required|string|max:255',
            'level' => 'required|integer|min:1',
            'order' => 'nullable|integer',
            'parent_id' => 'nullable|exists:organization_structures,id',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'bio_id' => 'nullable|string',
            'bio_en' => 'nullable|string',
            'bio_ar' => 'nullable|string',
            'email' => 'nullable|email',
            'phone' => 'nullable|string',
            'is_active' => 'sometimes|boolean',
        ]);

        if ($request->hasFile('photo')) {
            $validated['photo'] = $request->file('photo')->store('organization', 'public');
        }

        if (!isset($validated['order'])) {
            $validated['order'] = OrganizationStructure::where('level', $validated['level'])->max('order') + 1;
        }

        $structure = OrganizationStructure::create($validated);

        $photoUrl = null;
        if ($structure->photo) {
            $photoUrl = request()->getSchemeAndHttpHost() . '/storage/' . $structure->photo;
        }

        return response()->json([
            'id' => $structure->id,
            'name' => $structure->name,
            'position' => $structure->position,
            'level' => $structure->level,
            'order' => $structure->order,
            'parent_id' => $structure->parent_id,
            'photo' => $photoUrl,
            'bio_id' => $structure->bio_id,
            'bio_en' => $structure->bio_en,
            'bio_ar' => $structure->bio_ar,
            'email' => $structure->email,
            'phone' => $structure->phone,
            'is_active' => $structure->is_active,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $structure = OrganizationStructure::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'position' => 'sometimes|required|string|max:255',
            'level' => 'sometimes|required|integer|min:1',
            'order' => 'nullable|integer',
            'parent_id' => 'nullable|exists:organization_structures,id',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'bio_id' => 'nullable|string',
            'bio_en' => 'nullable|string',
            'bio_ar' => 'nullable|string',
            'email' => 'nullable|email',
            'phone' => 'nullable|string',
            'is_active' => 'sometimes|boolean',
        ]);

        // Prevent circular reference
        if (isset($validated['parent_id']) && $validated['parent_id'] == $id) {
            return response()->json(['message' => 'Cannot set parent to itself'], 422);
        }

        if ($request->hasFile('photo')) {
            if ($structure->photo) {
                Storage::disk('public')->delete($structure->photo);
            }
            $validated['photo'] = $request->file('photo')->store('organization', 'public');
        } else {
            unset($validated['photo']);
        }

        $structure->update($validated);
        $structure->refresh();

        $photoUrl = null;
        if ($structure->photo) {
            $photoUrl = request()->getSchemeAndHttpHost() . '/storage/' . $structure->photo;
        }

        return response()->json([
            'id' => $structure->id,
            'name' => $structure->name,
            'position' => $structure->position,
            'level' => $structure->level,
            'order' => $structure->order,
            'parent_id' => $structure->parent_id,
            'photo' => $photoUrl,
            'bio_id' => $structure->bio_id,
            'bio_en' => $structure->bio_en,
            'bio_ar' => $structure->bio_ar,
            'email' => $structure->email,
            'phone' => $structure->phone,
            'is_active' => $structure->is_active,
        ]);
    }

    public function destroy($id)
    {
        $structure = OrganizationStructure::findOrFail($id);
        
        // Check if has children
        if ($structure->children()->count() > 0) {
            return response()->json(['message' => 'Cannot delete structure with children. Please delete or reassign children first.'], 422);
        }

        if ($structure->photo) {
            Storage::disk('public')->delete($structure->photo);
        }

        $structure->delete();

        return response()->json(['message' => 'Organization structure deleted successfully']);
    }
}
