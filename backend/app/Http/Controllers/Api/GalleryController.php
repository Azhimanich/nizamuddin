<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Album;
use App\Models\Photo;
use App\Models\Video;
use Illuminate\Http\Request;

class GalleryController extends Controller
{
    public function index()
    {
        $albums = Album::where('is_active', true)
            ->orderBy('date', 'desc')
            ->get();

        return response()->json($albums);
    }

    public function photos(Request $request)
    {
        $albumId = $request->get('album_id');
        
        $query = Photo::where('is_active', true);
        
        if ($albumId) {
            $query->where('album_id', $albumId);
        }
        
        $photos = $query->orderBy('order')->get();
        
        // Transform image URLs
        $photos->transform(function ($photo) {
            if ($photo->image && !str_starts_with($photo->image, 'http')) {
                $photo->image = request()->getSchemeAndHttpHost() . '/storage/' . $photo->image;
            }
            return $photo;
        });

        return response()->json($photos);
    }

    public function videos()
    {
        $videos = Video::where('is_active', true)
            ->orderBy('order')
            ->get();

        return response()->json($videos);
    }
}

