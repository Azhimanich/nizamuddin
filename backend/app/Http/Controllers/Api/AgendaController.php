<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AcademicCalendar;
use Illuminate\Http\Request;

class AgendaController extends Controller
{
    public function index(Request $request)
    {
        $limit = $request->get('limit');
        
        // Get active academic calendars (all types: activity, exam, holiday)
        // Show both upcoming and recent past events (last 30 days)
        $query = AcademicCalendar::where('is_active', true)
            ->where('start_date', '>=', now()->subDays(30)->toDateString())
            ->orderBy('start_date', 'asc');

        if ($limit) {
            $query->limit((int)$limit);
        }

        $agendas = $query->get()->map(function ($item) {
            return [
                'id' => $item->id,
                'title' => $item->title,
                'description' => $item->description,
                'date' => $item->start_date ? $item->start_date->format('Y-m-d') : null,
                'start_date' => $item->start_date ? $item->start_date->format('Y-m-d') : null,
                'end_date' => $item->end_date ? $item->end_date->format('Y-m-d') : null,
                'time' => $item->start_date ? $item->start_date->format('H:i') : null,
                'start_time' => $item->start_date ? $item->start_date->format('H:i') : null,
                'location' => null,
                'type' => $item->type,
            ];
        });

        return response()->json($agendas);
    }

    public function show($id)
    {
        $agenda = AcademicCalendar::where('is_active', true)
            ->where('type', 'activity')
            ->findOrFail($id);

        return response()->json([
            'id' => $agenda->id,
            'title' => $agenda->title,
            'description' => $agenda->description,
            'date' => $agenda->start_date ? $agenda->start_date->format('Y-m-d') : null,
            'start_date' => $agenda->start_date ? $agenda->start_date->format('Y-m-d') : null,
            'end_date' => $agenda->end_date ? $agenda->end_date->format('Y-m-d') : null,
            'time' => $agenda->start_date ? $agenda->start_date->format('H:i') : null,
            'location' => null,
            'type' => $agenda->type,
        ]);
    }
}
