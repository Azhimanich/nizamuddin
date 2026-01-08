<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Slider;
use Illuminate\Http\Request;

class SliderController extends Controller
{
    public function index(Request $request)
    {
        $locale = $request->get('locale', 'id');
        
        $sliders = Slider::where('is_active', true)
            ->orderBy('order')
            ->get()
            ->map(function ($item) use ($locale) {
                $title = $item->{"title_{$locale}"} ?? $item->title_id;
                $subtitle = $item->{"subtitle_{$locale}"} ?? $item->subtitle_id;
                $ctaText = $item->{"cta_text_{$locale}"} ?? $item->cta_text_id;
                
                $imageUrl = null;
                if ($item->image) {
                    $imageUrl = request()->getSchemeAndHttpHost() . '/storage/' . $item->image;
                }
                
                return [
                    'id' => $item->id,
                    'title' => $title,
                    'subtitle' => $subtitle,
                    'cta_text' => $ctaText,
                    'cta_link' => $item->cta_link,
                    'image' => $imageUrl,
                ];
            });

        return response()->json($sliders);
    }
}

