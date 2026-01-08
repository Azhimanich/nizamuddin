<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Album;
use App\Models\Photo;
use App\Models\Video;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class GalleryManagementController extends Controller
{
    public function index()
    {
        $albums = Album::orderBy('date', 'desc')->get()->map(function ($album) {
            if ($album->cover_image && !str_starts_with($album->cover_image, 'http')) {
                $album->cover_image = request()->getSchemeAndHttpHost() . '/storage/' . $album->cover_image;
            }
            return $album;
        });

        $photos = Photo::with('album')->orderBy('order')->get()->map(function ($photo) {
            if ($photo->image && !str_starts_with($photo->image, 'http')) {
                $photo->image = request()->getSchemeAndHttpHost() . '/storage/' . $photo->image;
            }
            return $photo;
        });

        return response()->json([
            'albums' => $albums,
            'photos' => $photos,
            'videos' => Video::orderBy('order')->get(),
        ]);
    }

    public function storeAlbum(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'description' => 'nullable|string',
            'cover_image' => 'nullable|image|max:2048',
            'date' => 'required|date',
        ]);

        if ($request->hasFile('cover_image')) {
            $validated['cover_image'] = $request->file('cover_image')->store('albums', 'public');
        }

        $album = Album::create($validated);
        return response()->json($album, 201);
    }

    public function storePhoto(Request $request)
    {
        $validated = $request->validate([
            'album_id' => 'nullable|exists:albums,id',
            'title' => 'nullable|string',
            'description' => 'nullable|string',
            'image' => 'required|image|max:5120',
        ]);

        $validated['image'] = $request->file('image')->store('photos', 'public');
        
        // Set default is_active
        if (!isset($validated['is_active'])) {
            $validated['is_active'] = true;
        }
        
        $photo = Photo::create($validated);
        
        // Return full URL for image
        if ($photo->image && !str_starts_with($photo->image, 'http')) {
            $photo->image = request()->getSchemeAndHttpHost() . '/storage/' . $photo->image;
        }
        
        return response()->json($photo, 201);
    }

    public function storeVideo(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'description' => 'nullable|string',
            'youtube_id' => 'required|string',
        ]);

        $video = Video::create($validated);
        return response()->json($video, 201);
    }

    public function updatePhoto(Request $request, $id)
    {
        try {
            $photo = Photo::findOrFail($id);
            
            // Handle FormData for file uploads
            if ($request->hasFile('image')) {
                $validated = $request->validate([
                    'album_id' => 'nullable|exists:albums,id',
                    'title' => 'nullable|string',
                    'description' => 'nullable|string',
                    'image' => 'nullable|image|max:5120',
                    'is_active' => 'sometimes|boolean',
                ]);

                if ($photo->image) {
                    Storage::disk('public')->delete($photo->image);
                }
                $validated['image'] = $request->file('image')->store('photos', 'public');
            } else {
                // Handle JSON data for updates without file
                $validated = $request->validate([
                    'album_id' => 'nullable|exists:albums,id',
                    'title' => 'nullable|string',
                    'description' => 'nullable|string',
                    'is_active' => 'sometimes|boolean',
                ]);
            }

            $photo->update($validated);
            $photo->refresh();
            
            // Return full URL for image
            if ($photo->image && !str_starts_with($photo->image, 'http')) {
                $photo->image = request()->getSchemeAndHttpHost() . '/storage/' . $photo->image;
            }
            
            return response()->json([
                'message' => 'Photo updated successfully',
                'data' => $photo
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('Photo Update Validation Error:', [
                'errors' => $e->errors(),
                'request_data' => $request->all(),
                'files' => $request->allFiles()
            ]);
            return response()->json([
                'error' => 'Validation failed',
                'message' => 'The given data was invalid.',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Photo Update Error: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to update photo',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function destroyPhoto($id)
    {
        $photo = Photo::findOrFail($id);
        if ($photo->image) {
            Storage::disk('public')->delete($photo->image);
        }
        $photo->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }

    public function updateVideo(Request $request, $id)
    {
        try {
            $video = Video::findOrFail($id);
            
            $validated = $request->validate([
                'title' => 'nullable|string',
                'description' => 'nullable|string',
                'youtube_id' => 'nullable|string',
                'is_active' => 'sometimes|boolean',
            ]);
            
            $video->update($validated);
            
            return response()->json([
                'message' => 'Video updated successfully',
                'data' => $video
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'error' => 'Validation failed',
                'message' => 'The given data was invalid.',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to update video',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function destroyVideo($id)
    {
        Video::findOrFail($id)->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}
