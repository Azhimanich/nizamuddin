<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Program;
use App\Models\AcademicCalendar;
use App\Models\DailySchedule;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AcademicController extends Controller
{
    public function index(Request $request)
    {
        try {
            $locale = $request->get('locale', 'id');
            $schoolType = $request->get('school_type', 'tk');
            

            $programs = Program::where('is_active', true)
                ->orderBy('order')
                ->get()
                ->map(function ($item) use ($locale) {
                    $description = $item->{"description_{$locale}"} ?? $item->description_id ?? '';
                    return [
                        'id' => $item->id,
                        'name' => $item->name ?? '',
                        'description' => $description,
                        'icon' => $item->icon ?? '',
                        'image' => $item->image ? asset('storage/' . $item->image) : null,
                        'type' => $item->type ?? '',
                    ];
                });

            $calendar = AcademicCalendar::where('is_active', true)
                ->where('school_type', $schoolType)
                ->orderBy('order')
                ->orderBy('start_date')
                ->get()
                ->map(function ($item) {
                    $startDate = $item->start_date;
                    $endDate = $item->end_date;
                    
                    // Handle date formatting
                    if ($startDate) {
                        if (is_string($startDate)) {
                            $startDate = $startDate;
                        } elseif (is_object($startDate) && method_exists($startDate, 'format')) {
                            $startDate = $startDate->format('Y-m-d');
                        } else {
                            $startDate = (string)$startDate;
                        }
                    } else {
                        $startDate = null;
                    }
                    
                    if ($endDate) {
                        if (is_string($endDate)) {
                            $endDate = $endDate;
                        } elseif (is_object($endDate) && method_exists($endDate, 'format')) {
                            $endDate = $endDate->format('Y-m-d');
                        } else {
                            $endDate = (string)$endDate;
                        }
                    } else {
                        $endDate = null;
                    }
                    
                    return [
                        'id' => $item->id,
                        'title' => $item->title ?? '',
                        'start_date' => $startDate,
                        'end_date' => $endDate,
                        'type' => $item->type ?? '',
                        'school_type' => $item->school_type ?? '',
                        'description' => $item->description ?? '',
                        'order' => $item->order ?? 0,
                    ];
                });

            $schedule = DailySchedule::where('is_active', true)
                ->orderBy('order')
                ->get()
                ->map(function ($item) use ($locale) {
                    $activity = $item->{"activity_{$locale}"} ?? $item->activity_id ?? '';
                    // Format time to HH:MM
                    $startTime = $item->start_time;
                    $endTime = $item->end_time;
                    
                    // Handle different time formats
                    if ($startTime) {
                        if (is_string($startTime)) {
                            $startTime = substr($startTime, 0, 5); // Get HH:MM from HH:MM:SS
                        } elseif (is_object($startTime) && method_exists($startTime, 'format')) {
                            $startTime = $startTime->format('H:i');
                        } else {
                            $startTime = (string)$startTime;
                            $startTime = substr($startTime, 0, 5);
                        }
                    } else {
                        $startTime = null;
                    }
                    
                    if ($endTime) {
                        if (is_string($endTime)) {
                            $endTime = substr($endTime, 0, 5); // Get HH:MM from HH:MM:SS
                        } elseif (is_object($endTime) && method_exists($endTime, 'format')) {
                            $endTime = $endTime->format('H:i');
                        } else {
                            $endTime = (string)$endTime;
                            $endTime = substr($endTime, 0, 5);
                        }
                    } else {
                        $endTime = null;
                    }
                    
                    return [
                        'id' => $item->id,
                        'start_time' => $startTime,
                        'end_time' => $endTime,
                        'activity' => $activity,
                    ];
                });

            return response()->json([
                'programs' => $programs,
                'calendar' => $calendar,
                'schedule' => $schedule,
            ]);
        } catch (\Exception $e) {
            \Log::error('Academic API Error: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to fetch academic data',
                'message' => $e->getMessage(),
                'programs' => [],
                'calendar' => [],
                'schedule' => [],
            ], 500);
        }
    }

    /**
     * Get academic calendar by school type
     */
    public function calendar(Request $request)
    {
        try {
            $schoolType = $request->get('school_type', 'tk');
            
            $calendar = AcademicCalendar::where('is_active', true)
                ->where('school_type', $schoolType)
                ->orderBy('is_pinned', 'desc')
                ->orderBy('pinned_at', 'asc')
                ->orderBy('order')
                ->orderBy('start_date')
                ->get()
                ->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'title' => $item->title ?? '',
                        'start_date' => $item->start_date ? $item->start_date->format('Y-m-d') : null,
                        'end_date' => $item->end_date ? $item->end_date->format('Y-m-d') : null,
                        'type' => $item->type ?? '',
                        'school_type' => $item->school_type ?? '',
                        'description' => $item->description ?? '',
                        'order' => $item->order ?? 0,
                        'is_pinned' => $item->is_pinned ?? false,
                        'pinned_at' => $item->pinned_at ? $item->pinned_at->format('Y-m-d H:i:s') : null,
                    ];
                });

            return response()->json($calendar);
        } catch (\Exception $e) {
            \Log::error('Calendar API Error: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to fetch calendar data',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Store a new academic calendar event
     */
    public function store(Request $request)
    {
        try {
            \Log::info('Calendar Store Request:', [
                'request_data' => $request->all(),
                'headers' => $request->headers->all()
            ]);
            
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'start_date' => 'required|date',
                'end_date' => 'nullable|date|after_or_equal:start_date',
                'type' => ['required', Rule::in(['exam', 'holiday', 'activity', 'meeting', 'audit', 'workshop', 'evaluation'])],
                'school_type' => ['required', Rule::in(['tk', 'sd', 'smp', 'kepondokan', 'yayasan'])],
                'description' => 'nullable|string',
                'order' => 'sometimes|integer|min:0',
            ]);

            \Log::info('Calendar Store Validated:', ['validated' => $validated]);

            // Set default order if not provided
            if (!isset($validated['order'])) {
                $validated['order'] = 0;
            }

            $calendar = AcademicCalendar::create($validated);

            return response()->json([
                'message' => 'Academic calendar event created successfully',
                'data' => $calendar,
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('Calendar Store Validation Error:', [
                'errors' => $e->errors(),
                'request_data' => $request->all()
            ]);
            return response()->json([
                'error' => 'Validation failed',
                'message' => 'The given data was invalid.',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Calendar Store Error: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to create calendar event',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update an academic calendar event
     */
    public function update(Request $request, $id)
    {
        try {
            \Log::info('Calendar Update Request:', [
                'id' => $id,
                'request_data' => $request->all()
            ]);
            
            $calendar = AcademicCalendar::findOrFail($id);

            $validated = $request->validate([
                'title' => 'sometimes|required|string|max:255',
                'start_date' => 'sometimes|required|date',
                'end_date' => 'nullable|date|after_or_equal:start_date',
                'type' => ['sometimes', 'required', Rule::in(['exam', 'holiday', 'activity', 'meeting', 'audit', 'workshop', 'evaluation'])],
                'school_type' => ['sometimes', 'required', Rule::in(['tk', 'sd', 'smp', 'kepondokan', 'yayasan'])],
                'description' => 'nullable|string',
                'order' => 'sometimes|integer|min:0',
                'is_active' => 'sometimes|boolean',
            ]);

            $calendar->update($validated);

            return response()->json([
                'message' => 'Academic calendar event updated successfully',
                'data' => $calendar,
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('Calendar Update Validation Error:', [
                'errors' => $e->errors(),
                'request_data' => $request->all(),
                'id' => $id
            ]);
            return response()->json([
                'error' => 'Validation failed',
                'message' => 'The given data was invalid.',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Calendar Update Error: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to update calendar event',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete an academic calendar event
     */
    public function destroy($id)
    {
        try {
            \Log::info('Calendar Delete Request:', ['id' => $id]);
            
            $calendar = AcademicCalendar::findOrFail($id);
            $calendar->delete();

            return response()->json([
                'message' => 'Academic calendar event deleted successfully',
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            \Log::error('Calendar Delete Not Found Error:', ['id' => $id]);
            return response()->json([
                'error' => 'Calendar event not found',
                'message' => 'The requested calendar event could not be found.',
            ], 404);
        } catch (\Exception $e) {
            \Log::error('Calendar Delete Error: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to delete calendar event',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get academic calendar event by ID
     */
    public function show($id)
    {
        try {
            $calendar = AcademicCalendar::findOrFail($id);

            return response()->json([
                'data' => $calendar,
            ]);
        } catch (\Exception $e) {
            \Log::error('Calendar Show Error: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to fetch calendar event',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Pin/Unpin an academic calendar event
     */
    public function pinEvent(Request $request, $id)
    {
        try {
            $calendar = AcademicCalendar::findOrFail($id);
            
            // Check if trying to pin (not unpin)
            if (!$calendar->is_pinned) {
                // Count current pinned events globally (across all school types)
                $pinnedCount = AcademicCalendar::where('is_pinned', true)->count();
                
                // Limit to 3 pinned events total
                if ($pinnedCount >= 3) {
                    return response()->json([
                        'error' => 'Maximum limit reached',
                        'message' => 'Maksimal 3 agenda yang bisa dipin secara total',
                        'pinned_count' => $pinnedCount
                    ], 422);
                }
                
                // Pin the event
                $calendar->is_pinned = true;
                $calendar->pinned_at = now();
            } else {
                // Unpin the event
                $calendar->is_pinned = false;
                $calendar->pinned_at = null;
            }
            
            $calendar->save();
            
            return response()->json([
                'message' => $calendar->is_pinned ? 'Event berhasil dipin' : 'Event berhasil diunpin',
                'data' => $calendar,
                'is_pinned' => $calendar->is_pinned
            ]);
        } catch (\Exception $e) {
            \Log::error('Pin Event Error: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to update pin status',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get pinned events for a specific school type
     */
    public function getPinnedEvents($school_type)
    {
        try {
            $events = AcademicCalendar::where('school_type', $school_type)
                ->where('is_pinned', true)
                ->where('is_active', true)
                ->orderBy('pinned_at', 'asc')
                ->get();
                
            return response()->json([
                'data' => $events,
                'count' => $events->count()
            ]);
        } catch (\Exception $e) {
            \Log::error('Get Pinned Events Error: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to get pinned events',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get daily schedules by school type
     */
    public function dailySchedules(Request $request)
    {
        try {
            $schoolType = $request->get('school_type', 'tk');
            
            $schedules = DailySchedule::where('is_active', true)
                ->where('school_type', $schoolType)
                ->orderBy('order')
                ->get()
                ->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'school_type' => $item->school_type,
                        'start_time' => $item->start_time,
                        'end_time' => $item->end_time,
                        'activity_id' => $item->activity_id,
                        'activity_en' => $item->activity_en,
                        'activity_ar' => $item->activity_ar,
                        'order' => $item->order,
                        'is_active' => $item->is_active,
                    ];
                });

            return response()->json($schedules);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to get daily schedules',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}

