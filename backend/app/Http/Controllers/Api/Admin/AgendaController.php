<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Agenda;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AgendaController extends Controller
{
    public function index()
    {
        $agendas = Agenda::orderBy('date', 'desc')->get();
        return response()->json($agendas);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'description' => 'required|string',
            'date' => 'required|date',
            'time' => 'nullable',
            'location' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
            'google_calendar_link' => 'nullable|url',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('agenda', 'public');
        }

        $agenda = Agenda::create($validated);
        return response()->json($agenda, 201);
    }

    public function update(Request $request, $id)
    {
        $agenda = Agenda::findOrFail($id);
        
        $validated = $request->validate([
            'title' => 'sometimes|string',
            'description' => 'sometimes|string',
            'date' => 'sometimes|date',
            'time' => 'nullable',
            'location' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
            'google_calendar_link' => 'nullable|url',
        ]);

        if ($request->hasFile('image')) {
            if ($agenda->image) {
                Storage::disk('public')->delete($agenda->image);
            }
            $validated['image'] = $request->file('image')->store('agenda', 'public');
        }

        $agenda->update($validated);
        return response()->json($agenda);
    }

    public function destroy($id)
    {
        $agenda = Agenda::findOrFail($id);
        if ($agenda->image) {
            Storage::disk('public')->delete($agenda->image);
        }
        $agenda->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}
