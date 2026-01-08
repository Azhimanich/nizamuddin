<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\AcademicCalendar;
use Illuminate\Http\Request;

class CalendarController extends Controller
{
    public function index()
    {
        $calendars = AcademicCalendar::orderBy('start_date')->get();
        return response()->json($calendars);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date',
            'type' => 'required|string|in:exam,holiday,activity',
            'description' => 'nullable|string',
            'is_active' => 'sometimes|boolean',
        ]);

        // Ensure is_active is set to true by default
        if (!isset($validated['is_active'])) {
            $validated['is_active'] = true;
        }

        $calendar = AcademicCalendar::create($validated);
        return response()->json($calendar, 201);
    }

    public function update(Request $request, $id)
    {
        $calendar = AcademicCalendar::findOrFail($id);
        
        $validated = $request->validate([
            'title' => 'sometimes|string',
            'start_date' => 'sometimes|date',
            'end_date' => 'nullable|date',
            'type' => 'sometimes|string|in:exam,holiday,activity',
            'description' => 'nullable|string',
            'is_active' => 'sometimes|boolean',
        ]);

        $calendar->update($validated);
        return response()->json($calendar);
    }

    public function destroy($id)
    {
        AcademicCalendar::findOrFail($id)->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}

