<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Staff;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class StaffManagementController extends Controller
{
    public function index()
    {
        $staff = Staff::orderBy('order')->get();
        return response()->json($staff);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'phone' => 'required|string',
            'photo' => 'required|image|max:2048',
            'position' => 'required|string',
            'specialization' => 'required|string',
            'bio_id' => 'nullable|string',
            'bio_en' => 'nullable|string',
            'bio_ar' => 'nullable|string',
            'order' => 'nullable|integer',
        ]);

        if ($request->hasFile('photo')) {
            $validated['photo'] = $request->file('photo')->store('staff', 'public');
        }

        $staff = Staff::create($validated);

        return response()->json($staff, 201);
    }

    public function update(Request $request, $id)
    {
        $staff = Staff::findOrFail($id);
        
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email',
            'phone' => 'sometimes|required|string',
            'photo' => 'nullable|image|max:2048',
            'position' => 'sometimes|required|string',
            'specialization' => 'sometimes|required|string',
            'bio_id' => 'nullable|string',
            'bio_en' => 'nullable|string',
            'bio_ar' => 'nullable|string',
            'order' => 'nullable|integer',
            'is_active' => 'sometimes|boolean',
        ]);

        if ($request->hasFile('photo')) {
            if ($staff->photo) {
                Storage::disk('public')->delete($staff->photo);
            }
            $validated['photo'] = $request->file('photo')->store('staff', 'public');
        } else {
            // Keep existing photo if no new file is provided
            unset($validated['photo']);
        }

        $staff->update($validated);
        
        // Reload to get updated data
        $staff->refresh();

        return response()->json($staff);
    }

    public function destroy($id)
    {
        $staff = Staff::findOrFail($id);
        if ($staff->photo) {
            Storage::disk('public')->delete($staff->photo);
        }
        $staff->delete();

        return response()->json(['message' => 'Staff deleted successfully']);
    }
}

