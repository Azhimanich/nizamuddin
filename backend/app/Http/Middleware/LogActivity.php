<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\ActivityLog;

class LogActivity
{
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        // Log admin activities only
        if ($request->user() && $request->is('api/admin/*')) {
            $method = $request->method();
            $path = $request->path();
            
            // Only log POST, PUT, DELETE
            if (in_array($method, ['POST', 'PUT', 'PATCH', 'DELETE'])) {
                ActivityLog::create([
                    'user_id' => $request->user()->id,
                    'action' => strtolower($method),
                    'model_type' => $this->getModelType($path),
                    'description' => "{$method} {$path}",
                    'ip_address' => $request->ip(),
                    'user_agent' => $request->userAgent(),
                ]);
            }
        }

        return $response;
    }

    private function getModelType($path)
    {
        $segments = explode('/', $path);
        $model = end($segments);
        return 'App\\Models\\' . ucfirst(str_singular($model));
    }
}

