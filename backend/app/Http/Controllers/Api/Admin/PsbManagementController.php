<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\PsbRegistration;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;

class PsbManagementController extends Controller
{
    public function index(Request $request)
    {
        $query = PsbRegistration::orderBy('created_at', 'desc');
        
        // Filter by status
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }
        
        // Filter by education level
        if ($request->has('education') && $request->education !== 'all') {
            $education = $request->education;
            if ($education === 'SD') {
                $query->where('tingkat_pendidikan', 'like', 'SD/MI Kelas%');
            } elseif ($education === 'SMP') {
                $query->where('tingkat_pendidikan', 'like', 'SMP/MTs Kelas%');
            } else {
                // For Kepondokan and TK, use exact match
                $query->where('tingkat_pendidikan', $education);
            }
        }
        
        // Filter by date range
        if ($request->has('date_start') && $request->date_start) {
            $query->whereDate('created_at', '>=', $request->date_start);
        }
        if ($request->has('date_end') && $request->date_end) {
            $query->whereDate('created_at', '<=', $request->date_end . ' 23:59:59');
        }
        
        // Search functionality
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('nama_lengkap', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('nomor_telepon', 'like', "%{$search}%")
                  ->orWhere('nik', 'like', "%{$search}%");
            });
        }
        
        // Pagination
        $perPage = $request->get('per_page', 50);
        $registrations = $query->paginate($perPage);
        
        return response()->json([
            'success' => true,
            'data' => $registrations->items(),
            'pagination' => [
                'current_page' => $registrations->currentPage(),
                'last_page' => $registrations->lastPage(),
                'per_page' => $registrations->perPage(),
                'total' => $registrations->total()
            ]
        ]);
    }
    
    public function statistics()
    {
        $stats = [
            'total' => PsbRegistration::count(),
            'pending' => PsbRegistration::where('status', 'pending')->count(),
            'diproses' => PsbRegistration::where('status', 'diproses')->count(),
            'diterima' => PsbRegistration::where('status', 'diterima')->count(),
            'ditolak' => PsbRegistration::where('status', 'ditolak')->count(),
        ];
        
        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }
    
    public function show($id)
    {
        $registration = PsbRegistration::find($id);
        
        if (!$registration) {
            return response()->json([
                'success' => false,
                'message' => 'Pendaftaran tidak ditemukan'
            ], 404);
        }
        
        return response()->json([
            'success' => true,
            'data' => $registration
        ]);
    }
    
    public function updateStatus(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:pending,diproses,diterima,ditolak',
            'catatan' => 'nullable|string'
        ]);
        
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 422);
        }
        
        $registration = PsbRegistration::find($id);
        
        if (!$registration) {
            return response()->json([
                'success' => false,
                'message' => 'Pendaftaran tidak ditemukan'
            ], 404);
        }
        
        $registration->status = $request->status;
        $registration->catatan = $request->catatan;
        $registration->save();
        
        return response()->json([
            'success' => true,
            'message' => 'Status berhasil diperbarui',
            'data' => $registration
        ]);
    }
    
    public function bulkUpdateStatus(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'ids' => 'required|array',
            'ids.*' => 'integer',
            'status' => 'required|in:pending,diproses,diterima,ditolak'
        ]);
        
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 422);
        }
        
        $updated = PsbRegistration::whereIn('id', $request->ids)
            ->update(['status' => $request->status]);
        
        return response()->json([
            'success' => true,
            'message' => "{$updated} pendaftaran berhasil diperbarui"
        ]);
    }
    
    public function destroy($id)
    {
        $registration = PsbRegistration::find($id);
        
        if (!$registration) {
            return response()->json([
                'success' => false,
                'message' => 'Pendaftaran tidak ditemukan'
            ], 404);
        }
        
        $registration->delete();
        
        return response()->json([
            'success' => true,
            'message' => 'Pendaftaran berhasil dihapus'
        ]);
    }
    
    public function bulkDelete(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'ids' => 'required|array',
            'ids.*' => 'integer'
        ]);
        
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 422);
        }
        
        $deleted = PsbRegistration::whereIn('id', $request->ids)->delete();
        
        return response()->json([
            'success' => true,
            'message' => "{$deleted} pendaftaran berhasil dihapus"
        ]);
    }
    
    public function export(Request $request)
    {
        try {
            // Apply same filters as index method
            $query = PsbRegistration::orderBy('created_at', 'desc');
            
            // Filter by status
            if ($request->has('status') && $request->status !== 'all') {
                $query->where('status', $request->status);
            }
            
            // Filter by education level
            if ($request->has('education') && $request->education !== 'all') {
                $education = $request->education;
                if ($education === 'SD') {
                    $query->where('tingkat_pendidikan', 'like', 'SD/MI Kelas%');
                } elseif ($education === 'SMP') {
                    $query->where('tingkat_pendidikan', 'like', 'SMP/MTs Kelas%');
                } else {
                    $query->where('tingkat_pendidikan', $education);
                }
            }
            
            // Filter by date range
            if ($request->has('date_start') && $request->date_start) {
                $query->whereDate('created_at', '>=', $request->date_start);
            }
            if ($request->has('date_end') && $request->date_end) {
                $query->whereDate('created_at', '<=', $request->date_end . ' 23:59:59');
            }
            
            // Search functionality
            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('nama_lengkap', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%")
                      ->orWhere('nomor_telepon', 'like', "%{$search}%")
                      ->orWhere('nik', 'like', "%{$search}%");
                });
            }
            
            $registrations = $query->get();
            
            if ($registrations->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Tidak ada data untuk diexport'
                ], 404);
            }
            
            // Try Excel first, fallback to CSV
            try {
                return $this->exportExcel($registrations);
            } catch (\Exception $e) {
                \Log::warning('Excel export failed, falling back to CSV: ' . $e->getMessage());
                return $this->exportCSV($registrations);
            }
            
        } catch (\Exception $e) {
            \Log::error('Export error: ' . $e->getMessage());
            \Log::error('Export trace: ' . $e->getTraceAsString());
            
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat export data: ' . $e->getMessage()
            ], 500);
        }
    }
    
    private function exportExcel($registrations)
    {
        // Create spreadsheet
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        
        // Set headers
        $headers = [
            'No', 'NIK', 'Nama Lengkap', 'Tempat Lahir', 'Tanggal Lahir', 'Jenis Kelamin',
            'Alamat Lengkap', 'Nomor Telepon', 'Email', 'Nama Orang Tua', 'Telepon Orang Tua',
            'Email Orang Tua', 'Tingkat Pendidikan', 'Sekolah Asal', 'Tahun Lulus',
            'Kemampuan Quran', 'Kebutuhan Khusus', 'Motivasi', 'Status', 'Catatan',
            'Tanggal Daftar'
        ];
        
        // Style header
        $sheet->fromArray($headers, null, 'A1');
        $headerStyle = [
            'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF']],
            'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => '4472C4']],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
            'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN]]
        ];
        
        $sheet->getStyle('A1:U1')->applyFromArray($headerStyle);
        
        // Add data
        $row = 2;
        foreach ($registrations as $index => $registration) {
            $sheet->fromArray([
                $index + 1,
                $registration->nik ?? '',
                $registration->nama_lengkap ?? '',
                $registration->tempat_lahir ?? '',
                $registration->tanggal_lahir ? date('d/m/Y', strtotime($registration->tanggal_lahir)) : '',
                $registration->jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan',
                $registration->alamat_lengkap ?? '',
                $registration->nomor_telepon ?? '',
                $registration->email ?? '',
                $registration->nama_orang_tua ?? '',
                $registration->telepon_orang_tua ?? '',
                $registration->email_orang_tua ?? '',
                $registration->tingkat_pendidikan ?? '',
                $registration->sekolah_asal ?? '',
                $registration->tahun_lulus ?? '',
                $registration->kemampuan_quran ?? '',
                $registration->kebutuhan_khusus ?? '',
                $registration->motivasi ?? '',
                $registration->status ?? '',
                $registration->catatan ?? '',
                $registration->created_at ? $registration->created_at->format('d/m/Y H:i') : ''
            ], null, 'A' . $row);
            
            // Style data rows
            $dataStyle = [
                'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN]],
                'alignment' => ['vertical' => Alignment::VERTICAL_TOP]
            ];
            $sheet->getStyle('A' . $row . ':U' . $row)->applyFromArray($dataStyle);
            
            $row++;
        }
        
        // Auto-size columns
        foreach (range('A', 'U') as $column) {
            $sheet->getColumnDimension($column)->setAutoSize(true);
        }
        
        // Create file
        $writer = new Xlsx($spreadsheet);
        $filename = 'psb_registrations_' . date('Y-m-d') . '.xlsx';
        
        // Save to temporary file
        $tempFile = tempnam(sys_get_temp_dir(), 'excel_');
        $writer->save($tempFile);
        
        // Return file download response
        return response()->download($tempFile, $filename, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition' => 'attachment;filename="' . $filename . '"',
            'Access-Control-Allow-Origin' => '*',
            'Access-Control-Allow-Methods' => 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers' => 'Content-Type, Authorization, X-Requested-With'
        ])->deleteFileAfterSend(true);
    }
    
    private function exportCSV($registrations)
    {
        $filename = 'psb_registrations_' . date('Y-m-d') . '.csv';
        
        // Create CSV content
        $csvContent = '';
        
        // Add BOM for UTF-8
        $csvContent .= "\xEF\xBB\xBF";
        
        // Headers
        $headers = [
            'No', 'NIK', 'Nama Lengkap', 'Tempat Lahir', 'Tanggal Lahir', 'Jenis Kelamin',
            'Alamat Lengkap', 'Nomor Telepon', 'Email', 'Nama Orang Tua', 'Telepon Orang Tua',
            'Email Orang Tua', 'Tingkat Pendidikan', 'Sekolah Asal', 'Tahun Lulus',
            'Kemampuan Quran', 'Kebutuhan Khusus', 'Motivasi', 'Status', 'Catatan',
            'Tanggal Daftar'
        ];
        $csvContent .= implode(',', $headers) . "\n";
        
        // Data
        foreach ($registrations as $index => $registration) {
            $data = [
                $index + 1,
                $registration->nik ?? '',
                $registration->nama_lengkap ?? '',
                $registration->tempat_lahir ?? '',
                $registration->tanggal_lahir ? date('d/m/Y', strtotime($registration->tanggal_lahir)) : '',
                $registration->jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan',
                $registration->alamat_lengkap ?? '',
                $registration->nomor_telepon ?? '',
                $registration->email ?? '',
                $registration->nama_orang_tua ?? '',
                $registration->telepon_orang_tua ?? '',
                $registration->email_orang_tua ?? '',
                $registration->tingkat_pendidikan ?? '',
                $registration->sekolah_asal ?? '',
                $registration->tahun_lulus ?? '',
                $registration->kemampuan_quran ?? '',
                $registration->kebutuhan_khusus ?? '',
                $registration->motivasi ?? '',
                $registration->status ?? '',
                $registration->catatan ?? '',
                $registration->created_at ? $registration->created_at->format('d/m/Y H:i') : ''
            ];
            
            // Escape CSV values
            $escapedData = array_map(function($value) {
                $value = str_replace('"', '""', $value);
                if (strpos($value, ',') !== false || strpos($value, '"') !== false || strpos($value, "\n") !== false) {
                    $value = '"' . $value . '"';
                }
                return $value;
            }, $data);
            
            $csvContent .= implode(',', $escapedData) . "\n";
        }
        
        // Return CSV response
        return response($csvContent)
            ->header('Content-Type', 'text/csv')
            ->header('Content-Disposition', 'attachment;filename="' . $filename . '"')
            ->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
            ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    }
}
