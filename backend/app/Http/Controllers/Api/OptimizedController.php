<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class OptimizedController extends Controller
{
    /**
     * Cache helper method with automatic cache invalidation
     */
    protected function cacheRemember($key, $duration, $callback)
    {
        if (app()->environment('local')) {
            // Skip caching in local development
            return $callback();
        }
        
        return Cache::remember($key, $duration, $callback);
    }
    
    /**
     * Clear cache for specific pattern
     */
    protected function clearCachePattern($pattern)
    {
        $cache = Cache::getStore();
        
        // For file cache driver
        if (method_exists($cache, 'getDirectory')) {
            $directory = $cache->getDirectory();
            if (is_dir($directory)) {
                $files = glob($directory . '/' . $pattern);
                foreach ($files as $file) {
                    if (is_file($file)) {
                        unlink($file);
                    }
                }
            }
        }
    }
    
    /**
     * Get cache key with prefix
     */
    protected function getCacheKey($prefix, $params = [])
    {
        $paramString = is_array($params) ? serialize($params) : $params;
        return $prefix . '_' . md5($paramString);
    }
}
