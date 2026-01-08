<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\SystemSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

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

    public function update(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'academic_year' => ['required', 'string', 'max:20', 'regex:/^\d{4}\s*\/\s*\d{4}$/']
            ], [
                'academic_year.regex' => 'Format tahun ajaran harus seperti 2024/2025'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $value = preg_replace('/\s+/', '', $request->academic_year);

            SystemSetting::updateOrCreate(
                ['key' => 'psb_academic_year'],
                [
                    'value' => $value,
                    'type' => 'string',
                    'description' => 'PSB Academic Year (e.g. 2024/2025)'
                ]
            );

            return response()->json([
                'success' => true,
                'message' => 'PSB header setting updated successfully',
                'data' => [
                    'academic_year' => $value
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update PSB header setting: ' . $e->getMessage()
            ], 500);
        }
    }
}
