<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Program;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class ProgramController extends Controller
{
    public function index()
    {
        $programs = Program::orderBy('order')->get()->map(function ($item) {
            return [
                'id' => $item->id,
                'name' => $item->name,
                'description_id' => $item->description_id,
                'description_en' => $item->description_en,
                'description_ar' => $item->description_ar,
                'icon' => $item->icon,
                'image' => $item->image ? asset('storage/' . $item->image) : null,
                'type' => $item->type,
                'order' => $item->order,
                'is_active' => $item->is_active,
            ];
        });
        return response()->json($programs);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'description_id' => 'required|string',
            'description_en' => 'nullable|string',
            'description_ar' => 'nullable|string',
            'icon' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
            'type' => 'required|string|in:academic,extracurricular,character',
            'order' => 'nullable|integer',
            'is_active' => 'sometimes|boolean',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('programs', 'public');
        }

        if (!isset($validated['is_active'])) {
            $validated['is_active'] = true;
        }

        $program = Program::create($validated);
        
        return response()->json([
            'id' => $program->id,
            'name' => $program->name,
            'description_id' => $program->description_id,
            'description_en' => $program->description_en,
            'description_ar' => $program->description_ar,
            'icon' => $program->icon,
            'image' => $program->image ? asset('storage/' . $program->image) : null,
            'type' => $program->type,
            'order' => $program->order,
            'is_active' => $program->is_active,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        Log::info('ProgramController::update called with ID: ' . $id);
        Log::info('Request content type: ' . $request->header('Content-Type'));
        Log::info('Request method: ' . $request->method());
        Log::info('Request data: ', $request->all());
        
        $program = Program::findOrFail($id);
        Log::info('Program found - Before update: ' . $program->name);
        
        // Handle both JSON and FormData
        if ($request->header('Content-Type') === 'application/json') {
            $validated = $request->validate([
                'name' => 'sometimes|string',
                'description_id' => 'sometimes|string',
                'description_en' => 'nullable|string',
                'description_ar' => 'nullable|string',
                'icon' => 'nullable|string',
                'type' => 'sometimes|string|in:academic,extracurricular,character',
                'order' => 'nullable|integer',
                'is_active' => 'sometimes|boolean',
            ]);
        } else {
            $validated = $request->validate([
                'name' => 'sometimes|string',
                'description_id' => 'sometimes|string',
                'description_en' => 'nullable|string',
                'description_ar' => 'nullable|string',
                'icon' => 'nullable|string',
                'image' => 'nullable|image|max:2048',
                'type' => 'sometimes|string|in:academic,extracurricular,character',
                'order' => 'nullable|integer',
                'is_active' => 'sometimes|boolean',
            ]);
        }
        
        Log::info('Validated data: ', $validated);

        if ($request->hasFile('image')) {
            if ($program->image) {
                Storage::disk('public')->delete($program->image);
            }
            $validated['image'] = $request->file('image')->store('programs', 'public');
        }

        // Remove image from validated if not updated
        if (!isset($validated['image'])) {
            unset($validated['image']);
        }

        Log::info('About to update with validated data: ', $validated);
        
        $result = $program->update($validated);
        Log::info('Update result: ' . $result);
        
        // Refresh the model to get updated data
        $program->refresh();
        Log::info('Program after refresh: ' . $program->name);

        return response()->json([
            'id' => $program->id,
            'name' => $program->name,
            'description_id' => $program->description_id,
            'description_en' => $program->description_en,
            'description_ar' => $program->description_ar,
            'icon' => $program->icon,
            'image' => $program->image ? asset('storage/' . $program->image) : null,
            'type' => $program->type,
            'order' => $program->order,
            'is_active' => $program->is_active,
        ]);
    }

    public function destroy($id)
    {
        $program = Program::findOrFail($id);
        if ($program->image) {
            Storage::disk('public')->delete($program->image);
        }
        $program->delete();

        return response()->json(['message' => 'Program deleted successfully']);
    }
}

