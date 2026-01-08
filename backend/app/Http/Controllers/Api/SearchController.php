<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\News;
use App\Models\Staff;
use App\Models\Download;

class SearchController extends Controller
{
    public function search(Request $request)
    {
        $query = $request->get('q', '');
        $limit = $request->get('limit', 10);

        if (empty($query)) {
            return response()->json([
                'news' => [],
                'staff' => [],
                'downloads' => [],
            ]);
        }

        $results = [
            'news' => News::where('is_published', true)
                ->where(function ($q) use ($query) {
                    $q->where('title', 'like', "%{$query}%")
                        ->orWhere('content', 'like', "%{$query}%");
                })
                ->limit($limit)
                ->get(['id', 'title', 'slug', 'excerpt', 'featured_image']),
            
            'staff' => Staff::where('is_active', true)
                ->where(function ($q) use ($query) {
                    $q->where('name', 'like', "%{$query}%")
                        ->orWhere('specialization', 'like', "%{$query}%");
                })
                ->limit($limit)
                ->get(['id', 'name', 'photo', 'position', 'specialization']),
            
            'downloads' => Download::where('is_active', true)
                ->where(function ($q) use ($query) {
                    $q->where('title', 'like', "%{$query}%")
                        ->orWhere('description', 'like', "%{$query}%");
                })
                ->limit($limit)
                ->get(['id', 'title', 'file_type', 'download_count']),
        ];

        return response()->json($results);
    }
}
