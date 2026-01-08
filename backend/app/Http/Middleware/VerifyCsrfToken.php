<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    /**
     * The URIs that should be excluded from CSRF verification.
     *
     * @var array<int, string>
     */
    protected $except = [
        'api/login',
        'api/psb/register',
        'api/psb/check-status',
        'api/announcements',
        'api/profile',
        'api/academic*',
        'api/staff*',
        'api/news*',
        'api/gallery*',
        'api/downloads*',
        'api/sliders*',
        'api/about*',
        'api/social-media*',
        'api/organization-structure*',
        'api/contact*',
        'api/map*',
        'api/psb*',
        'api/search',
    ];
}

