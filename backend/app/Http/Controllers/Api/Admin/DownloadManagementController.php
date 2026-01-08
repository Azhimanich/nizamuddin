<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Download;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DownloadManagementController extends Controller
{
    public function index()
    {
        $downloads = Download::with('category')->orderBy('order')->get();
        return response()->json($downloads);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'description' => 'nullable|string',
            'file' => 'required|file|max:10240',
            'category_id' => 'nullable|exists:download_categories,id',
            'category' => 'nullable|string', // Keep for backward compatibility
        ]);

        $file = $request->file('file');
        $validated['file_path'] = $file->store('downloads', 'public');
        $validated['file_type'] = $file->getClientOriginalExtension();
        $validated['file_size'] = $file->getSize();
        
        // Set default is_active
        if (!isset($validated['is_active'])) {
            $validated['is_active'] = true;
        }

        $download = Download::create($validated);
        return response()->json($download, 201);
    }

    public function update(Request $request, $id)
    {
        $download = Download::findOrFail($id);
        
        $validated = $request->validate([
            'title' => 'sometimes|string',
            'description' => 'nullable|string',
            'file' => 'nullable|file|max:10240',
            'category_id' => 'nullable|exists:download_categories,id',
            'category' => 'nullable|string', // Keep for backward compatibility
            'is_active' => 'sometimes|boolean',
        ]);

        if ($request->hasFile('file')) {
            if ($download->file_path) {
                Storage::disk('public')->delete($download->file_path);
            }
            $file = $request->file('file');
            $validated['file_path'] = $file->store('downloads', 'public');
            $validated['file_type'] = $file->getClientOriginalExtension();
            $validated['file_size'] = $file->getSize();
        }

        $download->update($validated);
        return response()->json($download);
    }

    public function destroy($id)
    {
        $download = Download::findOrFail($id);
        if ($download->file_path) {
            Storage::disk('public')->delete($download->file_path);
        }
        $download->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}

