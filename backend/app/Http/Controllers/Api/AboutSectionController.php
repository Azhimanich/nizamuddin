<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AboutSection;
use Illuminate\Http\Request;

class AboutSectionController extends Controller
{
    public function index(Request $request)
    {
        $locale = $request->get('locale', 'id');
        
        $about = AboutSection::where('is_active', true)->first();
        
        if (!$about) {
            return response()->json(null);
        }

        $title = $about->{"title_{$locale}"} ?? $about->title_id;
        $content = $about->{"content_{$locale}"} ?? $about->content_id;
        $ctaText = $about->{"cta_text_{$locale}"} ?? $about->cta_text_id;

        $imageUrl = $about->image ? (request()->getSchemeAndHttpHost() . '/storage/' . $about->image) : null;

        return response()->json([
            'id' => $about->id,
            'title' => $title,
            'content' => $content,
            'cta_text' => $ctaText,
            'cta_link' => $about->cta_link,
            'image' => $imageUrl,
            'video_url' => $about->video_url,
        ]);
    }
}

