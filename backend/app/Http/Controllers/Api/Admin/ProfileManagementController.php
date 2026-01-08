<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Profile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProfileManagementController extends Controller
{
    public function index()
    {
        $profiles = Profile::orderBy('order')->get()->map(function ($item) {
            return [
                'id' => $item->id,
                'type' => $item->type,
                'key' => $item->key,
                'content' => $item->content,
                'image' => $item->image ? (request()->getSchemeAndHttpHost() . '/storage/' . $item->image) : null,
                'video_url' => $item->video_url,
                'order' => $item->order,
                'is_active' => $item->is_active,
            ];
        });
        return response()->json($profiles);
    }

    public function getIdentityKeys()
    {
        $identityKeys = [
            ['key' => 'nama_pesantren', 'label' => 'Nama Pesantren'],
            ['key' => 'npsn', 'label' => 'NPSN'],
            ['key' => 'akreditasi', 'label' => 'Akreditasi'],
            ['key' => 'no_sk_pendirian', 'label' => 'No. SK Pendirian'],
            ['key' => 'alamat', 'label' => 'Alamat'],
            ['key' => 'telepon', 'label' => 'Telepon'],
            ['key' => 'email', 'label' => 'Email'],
            ['key' => 'website', 'label' => 'Website'],
        ];

        return response()->json($identityKeys);
    }

    public function getVideoKeys()
    {
        $videoKeys = [
            ['key' => 'video_profil', 'label' => 'Video Profil'],
        ];

        return response()->json($videoKeys);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|string',
            'key' => 'required|string|unique:profiles,key',
            'content' => 'required|string', // Accept JSON string from FormData
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'video_url' => 'nullable|url',
            'order' => 'nullable|integer',
            'is_active' => 'sometimes|boolean',
        ]);

        // Convert JSON string to array
        if (isset($validated['content']) && is_string($validated['content'])) {
            $decoded = json_decode($validated['content'], true);
            if (json_last_error() === JSON_ERROR_NONE) {
                $validated['content'] = $decoded;
            } else {
                return response()->json([
                    'message' => 'Invalid JSON format for content field.',
                    'errors' => ['content' => ['Format JSON tidak valid']]
                ], 422);
            }
        }

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('profiles', 'public');
        }

        // Handle is_active - FormData sends as string '1' or '0'
        if ($request->has('is_active')) {
            $isActiveValue = $request->input('is_active');
            $validated['is_active'] = $isActiveValue === '1' || $isActiveValue === true || $isActiveValue === 'true';
        } else {
            $validated['is_active'] = true;
        }

        $profile = Profile::create($validated);

        $imageUrl = null;
        if ($profile->image) {
            $imageUrl = request()->getSchemeAndHttpHost() . '/storage/' . $profile->image;
        }

        return response()->json([
            'id' => $profile->id,
            'type' => $profile->type,
            'key' => $profile->key,
            'content' => $profile->content,
            'image' => $imageUrl,
            'video_url' => $profile->video_url,
            'order' => $profile->order,
            'is_active' => $profile->is_active,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $profile = Profile::findOrFail($id);

        $validated = $request->validate([
            'type' => 'sometimes|string',
            'key' => 'sometimes|string|unique:profiles,key,' . $id,
            'content' => 'sometimes|string', // Accept JSON string from FormData
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'video_url' => 'nullable|url',
            'order' => 'nullable|integer',
            'is_active' => 'sometimes|boolean',
        ]);

        // Convert JSON string to array if content is provided
        if (isset($validated['content']) && is_string($validated['content'])) {
            $decoded = json_decode($validated['content'], true);
            if (json_last_error() === JSON_ERROR_NONE) {
                $validated['content'] = $decoded;
            } else {
                return response()->json([
                    'message' => 'Invalid JSON format for content field.',
                    'errors' => ['content' => ['Format JSON tidak valid']]
                ], 422);
            }
        }

        if ($request->hasFile('image')) {
            if ($profile->image) {
                Storage::disk('public')->delete($profile->image);
            }
            $validated['image'] = $request->file('image')->store('profiles', 'public');
        } else {
            // Keep existing image if no new file is provided
            unset($validated['image']);
        }

        // Handle is_active - FormData sends as string '1' or '0'
        if ($request->has('is_active')) {
            $isActiveValue = $request->input('is_active');
            $validated['is_active'] = $isActiveValue === '1' || $isActiveValue === true || $isActiveValue === 'true';
        }

        $profile->update($validated);
        
        // Reload to get updated data
        $profile->refresh();

        $imageUrl = null;
        if ($profile->image) {
            $imageUrl = request()->getSchemeAndHttpHost() . '/storage/' . $profile->image;
        }

        return response()->json([
            'id' => $profile->id,
            'type' => $profile->type,
            'key' => $profile->key,
            'content' => $profile->content,
            'image' => $imageUrl,
            'video_url' => $profile->video_url,
            'order' => $profile->order,
            'is_active' => $profile->is_active,
        ]);
    }

    public function destroy($id)
    {
        $profile = Profile::findOrFail($id);
        if ($profile->image) {
            Storage::disk('public')->delete($profile->image);
        }
        $profile->delete();

        return response()->json(['message' => 'Profile deleted successfully']);
    }
}

