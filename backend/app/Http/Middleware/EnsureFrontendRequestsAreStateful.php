<?php

namespace App\Http\Middleware;

use Illuminate\Routing\Pipeline;
use Illuminate\Support\Collection;
use Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful as Middleware;

class EnsureFrontendRequestsAreStateful extends Middleware
{
    protected $except = [
        //
    ];
}

