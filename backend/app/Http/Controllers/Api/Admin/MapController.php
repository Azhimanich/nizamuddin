<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Map;
use Illuminate\Http\Request;

class MapController extends Controller
{
    public function index()
    {
        $maps = Map::orderBy('order')->orderBy('name')->get();
        return response()->json($maps);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'nullable|string|max:255',
            'address' => 'nullable|string',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'embed_url' => 'nullable|string',
            'api_key' => 'nullable|string|max:255',
            'zoom_level' => 'nullable|integer|min:1|max:20',
            'map_type' => 'nullable|string|in:roadmap,satellite,hybrid,terrain',
            'order' => 'nullable|integer',
            'is_active' => 'sometimes|boolean',
        ]);

        if (!isset($validated['is_active'])) {
            $validated['is_active'] = true;
        }

        if (!isset($validated['order'])) {
            $validated['order'] = 0;
        }

        if (!isset($validated['zoom_level'])) {
            $validated['zoom_level'] = 15;
        }

        if (!isset($validated['map_type'])) {
            $validated['map_type'] = 'roadmap';
        }

        $map = Map::create($validated);

        return response()->json($map, 201);
    }

    public function update(Request $request, $id)
    {
        $map = Map::findOrFail($id);

        $validated = $request->validate([
            'name' => 'nullable|string|max:255',
            'address' => 'nullable|string',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'embed_url' => 'nullable|string',
            'api_key' => 'nullable|string|max:255',
            'zoom_level' => 'nullable|integer|min:1|max:20',
            'map_type' => 'nullable|string|in:roadmap,satellite,hybrid,terrain',
            'order' => 'nullable|integer',
            'is_active' => 'sometimes|boolean',
        ]);

        $map->update($validated);

        return response()->json($map);
    }

    public function destroy($id)
    {
        $map = Map::findOrFail($id);
        $map->delete();

        return response()->json(['message' => 'Map deleted successfully']);
    }
}

