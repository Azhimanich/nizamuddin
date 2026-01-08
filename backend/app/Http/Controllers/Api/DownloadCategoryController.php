<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DownloadCategory;
use Illuminate\Http\Request;

class DownloadCategoryController extends Controller
{
    public function index()
    {
        $categories = DownloadCategory::where('is_active', true)
            ->orderBy('order')
            ->orderBy('name')
            ->get();
        return response()->json($categories);
    }
}

