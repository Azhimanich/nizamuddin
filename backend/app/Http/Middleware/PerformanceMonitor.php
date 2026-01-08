<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class PerformanceMonitor
{
    public function handle(Request $request, Closure $next)
    {
        $startTime = microtime(true);
        $startMemory = memory_get_usage(true);
        
        $response = $next($request);
        
        $endTime = microtime(true);
        $endMemory = memory_get_usage(true);
        
        $executionTime = ($endTime - $startTime) * 1000; // in ms
        $memoryUsage = $endMemory - $startMemory; // in bytes
        $peakMemory = memory_get_peak_usage(true);
        
        // Log slow queries
        $queries = DB::getQueryLog();
        $slowQueries = collect($queries)->filter(function ($query) {
            return $query['time'] > 100; // queries longer than 100ms
        });
        
        // Log performance metrics
        if ($executionTime > 1000 || $memoryUsage > 10 * 1024 * 1024 || $slowQueries->isNotEmpty()) {
            Log::warning('Performance Alert', [
                'url' => $request->fullUrl(),
                'method' => $request->method(),
                'execution_time' => round($executionTime, 2) . 'ms',
                'memory_usage' => round($memoryUsage / 1024 / 1024, 2) . 'MB',
                'peak_memory' => round($peakMemory / 1024 / 1024, 2) . 'MB',
                'query_count' => count($queries),
                'slow_queries' => $slowQueries->count(),
                'user_agent' => $request->userAgent(),
                'ip' => $request->ip(),
            ]);
        }
        
        // Add performance headers
        $response->headers->set('X-Response-Time', round($executionTime, 2) . 'ms');
        $response->headers->set('X-Memory-Usage', round($memoryUsage / 1024 / 1024, 2) . 'MB');
        
        return $response;
    }
}
