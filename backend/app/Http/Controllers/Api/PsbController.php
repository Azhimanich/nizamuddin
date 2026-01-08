<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\PsbRegistration;

class PsbController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nik' => 'required|string|size:16|unique:psb_registrations,nik',
            'nama_lengkap' => 'required|string|max:255',
            'tempat_lahir' => 'required|string|max:255',
            'tanggal_lahir' => 'required|date',
            'jenis_kelamin' => 'required|in:L,P',
            'alamat_lengkap' => 'required|string',
            'nomor_telepon' => 'required|string|max:20',
            'email' => 'required|email|max:255',
            // All fields now required
            'nama_orang_tua' => 'required|string|max:255',
            'telepon_orang_tua' => 'required|string|max:20',
            'email_orang_tua' => 'required|email|max:255',
            'tingkat_pendidikan' => 'required|string|max:255',
            'sekolah_asal' => 'required|string|max:255',
            'tahun_lulus' => 'required|integer|min:2020|max:2030',
            'kemampuan_quran' => 'required|string|max:255',
            'kebutuhan_khusus' => 'required|string',
            'motivasi' => 'required|string',
        ]);

        if ($validator->fails()) {
            $errors = $validator->errors();
            $errorMessages = [];
            
            // Check for specific NIK duplicate error
            if ($errors->has('nik')) {
                $nikErrors = $errors->get('nik');
                foreach ($nikErrors as $error) {
                    if (strpos($error, 'unique') !== false) {
                        return response()->json([
                            'success' => false,
                            'message' => 'NIK sudah terdaftar. Silakan cek status pendaftaran Anda.',
                            'error_type' => 'nik_exists',
                            'errors' => $errors
                        ], 422);
                    }
                }
            }
            
            // For other validation errors
            foreach ($errors->all() as $error) {
                $errorMessages[] = $error;
            }
            
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal: ' . implode(', ', $errorMessages),
                'error_type' => 'validation',
                'errors' => $errors
            ], 422);
        }

        try {
            $registration = PsbRegistration::create($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Pendaftaran berhasil dikirim',
                'data' => $registration
            ], 201);
        } catch (\Exception $e) {
            \Log::error('PSB Registration Error: ' . $e->getMessage());
            \Log::error('Request data: ' . json_encode($request->all()));
            
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat menyimpan pendaftaran: ' . $e->getMessage(),
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function checkStatus(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nik' => 'required|string|size:16'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'NIK tidak valid',
                'errors' => $validator->errors()
            ], 422);
        }

        $registration = PsbRegistration::where('nik', $request->nik)->first();

        if (!$registration) {
            return response()->json([
                'success' => false,
                'message' => 'NIK tidak ditemukan dalam sistem pendaftaran'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Data pendaftaran ditemukan',
            'data' => $registration
        ]);
    }

    public function index()
    {
        $registrations = PsbRegistration::orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $registrations
        ]);
    }
}
