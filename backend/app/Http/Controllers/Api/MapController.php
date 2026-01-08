<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Map;
use Illuminate\Http\Request;

class MapController extends Controller
{
    public function index()
    {
        $map = Map::where('is_active', true)
            ->orderBy('order')
            ->first();

        return response()->json($map);
    }
}

