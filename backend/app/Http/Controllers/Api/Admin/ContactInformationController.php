<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactInformation;
use Illuminate\Http\Request;

class ContactInformationController extends Controller
{
    public function index()
    {
        $contactInfo = ContactInformation::orderBy('order')->orderBy('type')->get();
        return response()->json($contactInfo);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|string|max:255|unique:contact_information,type',
            'value_id' => 'nullable|string',
            'value_en' => 'nullable|string',
            'value_ar' => 'nullable|string',
            'order' => 'nullable|integer',
            'is_active' => 'sometimes|boolean',
        ]);

        if (!isset($validated['is_active'])) {
            $validated['is_active'] = true;
        }

        if (!isset($validated['order'])) {
            $validated['order'] = 0;
        }

        $contactInfo = ContactInformation::create($validated);

        return response()->json($contactInfo, 201);
    }

    public function update(Request $request, $id)
    {
        $contactInfo = ContactInformation::findOrFail($id);

        $validated = $request->validate([
            'type' => 'sometimes|string|max:255|unique:contact_information,type,' . $id,
            'value_id' => 'nullable|string',
            'value_en' => 'nullable|string',
            'value_ar' => 'nullable|string',
            'order' => 'nullable|integer',
            'is_active' => 'sometimes|boolean',
        ]);

        $contactInfo->update($validated);

        return response()->json($contactInfo);
    }

    public function destroy($id)
    {
        $contactInfo = ContactInformation::findOrFail($id);
        $contactInfo->delete();

        return response()->json(['message' => 'Contact information deleted successfully']);
    }
}

