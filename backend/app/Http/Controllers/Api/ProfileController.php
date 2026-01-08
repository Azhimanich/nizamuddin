<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Profile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class ProfileController extends Controller
{
    public function index(Request $request)
    {
        $locale = $request->get('locale', 'id');
        $cacheKey = "profiles_{$locale}";
        
        $grouped = Cache::remember($cacheKey, 7200, function() use ($locale) {
            $profiles = Profile::where('is_active', true)
                ->orderBy('order')
                ->get()
                ->map(function ($profile) use ($locale) {
                    $content = $profile->content[$locale] ?? $profile->content['id'] ?? [];
                    return [
                        'id' => $profile->id,
                        'type' => $profile->type,
                        'key' => $profile->key,
                        'content' => $content,
                        'image' => $profile->image ? (request()->getSchemeAndHttpHost() . '/storage/' . $profile->image) : null,
                        'video_url' => $profile->video_url,
                    ];
                });

            // Group by type for easier access
            $grouped = [];
            foreach ($profiles as $profile) {
                if (!isset($grouped[$profile['type']])) {
                    $grouped[$profile['type']] = [];
                }
                $grouped[$profile['type']][$profile['key']] = $profile;
            }
            
            return $grouped;
        });

        return response()->json($grouped);
    }
}

