<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\SocialMedia;
use Illuminate\Http\Request;

class SocialMediaController extends Controller
{
    public function index()
    {
        $socialMedia = SocialMedia::orderBy('order')->get();
        return response()->json($socialMedia);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'icon' => 'nullable|string|max:255',
            'url' => 'required|url',
            'order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        $socialMedia = SocialMedia::create([
            'name' => $validated['name'],
            'icon' => $validated['icon'] ?? $this->getDefaultIcon($validated['name']),
            'url' => $validated['url'],
            'order' => $validated['order'] ?? 0,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        return response()->json($socialMedia, 201);
    }

    public function update(Request $request, $id)
    {
        $socialMedia = SocialMedia::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'icon' => 'nullable|string|max:255',
            'url' => 'required|url',
            'order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        $socialMedia->update([
            'name' => $validated['name'],
            'icon' => $validated['icon'] ?? $socialMedia->icon ?? $this->getDefaultIcon($validated['name']),
            'url' => $validated['url'],
            'order' => $validated['order'] ?? $socialMedia->order,
            'is_active' => $validated['is_active'] ?? $socialMedia->is_active,
        ]);

        return response()->json($socialMedia);
    }

    public function destroy($id)
    {
        $socialMedia = SocialMedia::findOrFail($id);
        $socialMedia->delete();

        return response()->json(['message' => 'Social media deleted successfully']);
    }

    private function getDefaultIcon($name)
    {
        $icons = [
            'instagram' => 'fa-instagram',
            'facebook' => 'fa-facebook',
            'youtube' => 'fa-youtube',
            'whatsapp' => 'fa-whatsapp',
            'twitter' => 'fa-twitter',
            'tiktok' => 'fa-tiktok',
            'linkedin' => 'fa-linkedin',
        ];

        $nameLower = strtolower($name);
        foreach ($icons as $key => $icon) {
            if (str_contains($nameLower, $key)) {
                return $icon;
            }
        }

        return 'fa-link';
    }
}
