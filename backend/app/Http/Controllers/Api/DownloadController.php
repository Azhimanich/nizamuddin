<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Download;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DownloadController extends Controller
{
    public function index(Request $request)
    {
        $category = $request->get('category'); // Can be slug or id
        
        $query = Download::where('is_active', true)->with('category');
        
        if ($category) {
            // Try to find by slug first, then by id
            $categoryModel = \App\Models\DownloadCategory::where('slug', $category)
                ->orWhere('id', $category)
                ->first();
            
            if ($categoryModel) {
                $query->where('category_id', $categoryModel->id);
            } else {
                // Fallback to old category string field for backward compatibility
                $query->where('category', $category);
            }
        }
        
        $downloads = $query->orderBy('order')->get();

        return response()->json($downloads);
    }

    public function download($id)
    {
        $download = Download::findOrFail($id);
        
        // Check if file exists in public disk
        $filePath = $download->file_path;
        if (!$filePath || !Storage::disk('public')->exists($filePath)) {
            return response()->json(['error' => 'File not found'], 404);
        }
        
        $download->increment('download_count');
        
        // Get full path to file
        $fullPath = Storage::disk('public')->path($filePath);
        
        // Get original filename or use title
        $fileName = $download->title;
        if ($download->file_type) {
            $fileName .= '.' . $download->file_type;
        }
        
        return response()->download($fullPath, $fileName);
    }
}

