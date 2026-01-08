<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Staff;
use Illuminate\Http\Request;

class StaffController extends Controller
{
    public function index(Request $request)
    {
        $locale = $request->get('locale', 'id');
        $specialization = $request->get('specialization');
        
        $query = Staff::where('is_active', true);
        
        if ($specialization) {
            $query->where('specialization', $specialization);
        }
        
        $staff = $query->orderBy('order')->get()->map(function ($item) use ($locale) {
            $bio = $item->{"bio_{$locale}"} ?? $item->bio_id ?? '';
            return [
                'id' => $item->id,
                'name' => $item->name,
                'email' => $item->email,
                'phone' => $item->phone,
                'photo' => $item->photo ? url('storage/' . $item->photo) : null,
                'position' => $item->position,
                'specialization' => $item->specialization,
                'bio' => $bio,
            ];
        });

        return response()->json($staff);
    }

    public function show($id, Request $request)
    {
        $locale = $request->get('locale', 'id');
        $staff = Staff::findOrFail($id);
        
        $bio = $staff->{"bio_{$locale}"} ?? $staff->bio_id ?? '';
        
        return response()->json([
            'id' => $staff->id,
            'name' => $staff->name,
            'email' => $staff->email,
            'phone' => $staff->phone,
            'photo' => $staff->photo ? url('storage/' . $staff->photo) : null,
            'position' => $staff->position,
            'specialization' => $staff->specialization,
            'bio' => $bio,
        ]);
    }
}

