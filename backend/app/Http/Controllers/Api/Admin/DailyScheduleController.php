<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\DailySchedule;
use Illuminate\Http\Request;

class DailyScheduleController extends Controller
{
    public function index(Request $request)
    {
        $schoolType = $request->query('school_type', 'tk');
        $schedules = DailySchedule::where('school_type', $school_type)
            ->orderBy('order')
            ->get();
        return response()->json($schedules);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'school_type' => 'required|in:tk,sd,smp,kepondokan',
            'start_time' => 'required|string',
            'end_time' => 'nullable|string',
            'activity_id' => 'required|string',
            'activity_en' => 'nullable|string',
            'activity_ar' => 'nullable|string',
            'order' => 'nullable|integer',
            'is_active' => 'sometimes|boolean',
        ]);

        // Ensure is_active is set to true by default
        if (!isset($validated['is_active'])) {
            $validated['is_active'] = true;
        }

        // Format time to HH:MM:SS if needed
        if (isset($validated['start_time']) && strlen($validated['start_time']) == 5) {
            $validated['start_time'] = $validated['start_time'] . ':00';
        }
        if (isset($validated['end_time']) && $validated['end_time'] && strlen($validated['end_time']) == 5) {
            $validated['end_time'] = $validated['end_time'] . ':00';
        }

        $schedule = DailySchedule::create($validated);
        return response()->json($schedule, 201);
    }

    public function update(Request $request, $id)
    {
        $schedule = DailySchedule::findOrFail($id);
        
        $validated = $request->validate([
            'school_type' => 'sometimes|in:tk,sd,smp,kepondokan',
            'start_time' => 'sometimes|string',
            'end_time' => 'nullable|string',
            'activity_id' => 'sometimes|string',
            'activity_en' => 'nullable|string',
            'activity_ar' => 'nullable|string',
            'order' => 'nullable|integer',
            'is_active' => 'sometimes|boolean',
        ]);

        // Format time to HH:MM:SS if needed
        if (isset($validated['start_time']) && strlen($validated['start_time']) == 5) {
            $validated['start_time'] = $validated['start_time'] . ':00';
        }
        if (isset($validated['end_time']) && $validated['end_time'] && strlen($validated['end_time']) == 5) {
            $validated['end_time'] = $validated['end_time'] . ':00';
        }

        $schedule->update($validated);

        return response()->json($schedule);
    }

    public function destroy($id)
    {
        DailySchedule::findOrFail($id)->delete();
        return response()->json(['message' => 'Schedule deleted successfully']);
    }
}

