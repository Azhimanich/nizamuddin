<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SystemSetting;
use Illuminate\Http\JsonResponse;

class PsbHeaderController extends Controller
{
    public function show(): JsonResponse
    {
        try {
            $academicYear = SystemSetting::where('key', 'psb_academic_year')->value('value');

            return response()->json([
                'success' => true,
                'data' => [
                    'academic_year' => $academicYear ?: '2024/2025'
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch PSB header setting: ' . $e->getMessage()
            ], 500);
        }
    }
}
