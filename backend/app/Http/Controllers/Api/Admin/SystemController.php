<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\SystemSetting;
use App\Models\ActivityLog;
use App\Models\Facility;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SystemController extends Controller
{
    public function updateSettings(Request $request)
    {
        $validated = $request->validate([
            'app_name' => 'sometimes|string',
            'logo' => 'nullable|image|max:2048',
            'default_language' => 'sometimes|string|in:id,en,ar',
            'google_maps_api_key' => 'nullable|string',
            'whatsapp_api_key' => 'nullable|string',
            'whatsapp_phone_number' => 'nullable|string',
        ]);

        foreach ($validated as $key => $value) {
            if ($key === 'logo' && $request->hasFile('logo')) {
                $path = $request->file('logo')->store('settings', 'public');
                SystemSetting::updateOrCreate(
                    ['key' => 'logo'],
                    ['value' => $path, 'type' => 'string']
                );
            } else {
                SystemSetting::updateOrCreate(
                    ['key' => $key],
                    ['value' => $value, 'type' => 'string']
                );
            }
        }

        // Log activity
        ActivityLog::create([
            'user_id' => $request->user()->id,
            'action' => 'update',
            'model_type' => 'SystemSetting',
            'description' => 'System settings updated',
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return response()->json(['message' => 'Settings updated successfully']);
    }

    public function updateFacilities(Request $request)
    {
        $validated = $request->validate([
            'facilities' => 'required|array',
            'facilities.*.name' => 'required|string',
            'facilities.*.description_id' => 'required|string',
            'facilities.*.description_en' => 'nullable|string',
            'facilities.*.description_ar' => 'nullable|string',
            'facilities.*.image' => 'nullable|image|max:2048',
            'facilities.*.icon' => 'nullable|string',
        ]);

        foreach ($validated['facilities'] as $facilityData) {
            if (isset($facilityData['id'])) {
                $facility = Facility::findOrFail($facilityData['id']);
                if (isset($facilityData['image']) && is_file($facilityData['image'])) {
                    if ($facility->image) {
                        Storage::disk('public')->delete($facility->image);
                    }
                    $facilityData['image'] = $facilityData['image']->store('facilities', 'public');
                }
                $facility->update($facilityData);
            } else {
                if (isset($facilityData['image']) && is_file($facilityData['image'])) {
                    $facilityData['image'] = $facilityData['image']->store('facilities', 'public');
                }
                Facility::create($facilityData);
            }
        }

        return response()->json(['message' => 'Facilities updated successfully']);
    }

    public function logs(Request $request)
    {
        $logs = ActivityLog::with('user')
            ->latest()
            ->paginate(50);

        return response()->json($logs);
    }
}

