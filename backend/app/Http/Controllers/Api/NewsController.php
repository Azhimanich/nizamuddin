<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\News;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class NewsController extends Controller
{
    public function index(Request $request)
    {
        $category = $request->get('category');
        $limit = $request->get('limit', 10);
        $pinned = $request->get('pinned', false);
        
        // Create cache key
        $cacheKey = "news_" . md5(serialize($request->all()));
        
        $result = Cache::remember($cacheKey, 3600, function() use ($category, $limit, $pinned) {
            $query = News::where('is_published', true)
                ->with(['category:id,name,slug', 'user:id,name', 'tags:id,name,slug']);
            
            // If pinned is requested, return only pinned news
            if ($pinned) {
                $query->where('is_pinned', true)
                    ->orderBy('published_at', 'desc')
                    ->limit(2);
            } else {
                $query->orderBy('published_at', 'desc');
            }
            
            if ($category) {
                $query->whereHas('category', function ($q) use ($category) {
                    $q->where('slug', $category);
                });
            }
            
            if ($pinned) {
                $news = $query->get();
                // Transform featured_image URLs
                $news = $news->map(function ($item) {
                    $item->featured_image = $this->transformImageUrl($item->featured_image);
                    return $item;
                });
                return ['data' => $news];
            } else {
                $news = $query->paginate($limit);
                // Transform featured_image URLs
                $news->getCollection()->transform(function ($item) {
                    $item->featured_image = $this->transformImageUrl($item->featured_image);
                    return $item;
                });
                return $news;
            }
        });
        
        return response()->json($result);
    }

    public function show($slug)
    {
        $cacheKey = "news_{$slug}";
        
        $news = Cache::remember($cacheKey, 3600, function() use ($slug) {
            $news = News::where('slug', $slug)
                ->where('is_published', true)
                ->with(['category:id,name,slug', 'user:id,name', 'comments.user:id,name', 'tags:id,name,slug'])
                ->firstOrFail();
            
            // Increment views (non-cached)
            $news->increment('views');
            
            // Transform featured_image URL
            $news->featured_image = $this->transformImageUrl($news->featured_image);

            // Load related articles
            if ($news->related_articles && is_array($news->related_articles) && count($news->related_articles) > 0) {
                $related = News::whereIn('id', $news->related_articles)
                    ->where('is_published', true)
                    ->where('id', '!=', $news->id)
                    ->select('id', 'title', 'slug', 'excerpt', 'featured_image', 'published_at')
                    ->get();
                
                // Transform featured_image URLs for related articles
                $related = $related->map(function ($item) {
                    $item->featured_image = $this->transformImageUrl($item->featured_image);
                    return $item;
                });
                
                $news->related_articles_data = $related;
            }
            
            return $news;
        });

        return response()->json($news);
    }
    
    /**
     * Transform image URL to full path
     */
    private function transformImageUrl($image)
    {
        if ($image && !str_starts_with($image, 'http')) {
            return url('storage/' . $image);
        }
        return $image;
    }
}

