<?php

use Illuminate\Support\Facades\Route;
use App\Models\PsbRegistration;

Route::get('/test-psb', function () {
    try {
        $count = PsbRegistration::count();
        $stats = [
            'total' => $count,
            'pending' => PsbRegistration::where('status', 'pending')->count(),
            'diproses' => PsbRegistration::where('status', 'diproses')->count(),
            'diterima' => PsbRegistration::where('status', 'diterima')->count(),
            'ditolak' => PsbRegistration::where('status', 'ditolak')->count(),
        ];
        
        return response()->json([
            'success' => true,
            'message' => 'Test PSB API working',
            'data' => $stats
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Error: ' . $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ]);
    }
});

Route::get('/test-psb-data', function () {
    try {
        $registrations = PsbRegistration::orderBy('created_at', 'desc')->take(3)->get();
        
        return response()->json([
            'success' => true,
            'message' => 'Test PSB data working',
            'data' => $registrations,
            'count' => $registrations->count()
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Error: ' . $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ]);
    }
});
