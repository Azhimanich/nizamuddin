<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PsbRegistration;
use Illuminate\Support\Facades\DB;

class PsbRegistrationSeeder extends Seeder
{
    public function run(): void
    {
        // Clear existing data
        DB::table('psb_registrations')->truncate();
        
        // Sample test data
        $registrations = [
            [
                'nik' => '1234567890123456',
                'nama_lengkap' => 'Ahmad Rizki Pratama',
                'tempat_lahir' => 'Jakarta',
                'tanggal_lahir' => '2008-06-15',
                'jenis_kelamin' => 'L',
                'alamat_lengkap' => 'Jl. Merdeka No. 123, Jakarta Pusat',
                'nomor_telepon' => '08123456789',
                'email' => 'ahmad.rizki@email.com',
                'status' => 'pending',
                'catatan' => null,
                'nama_orang_tua' => 'Bapak Susilo Pratama',
                'telepon_orang_tua' => '081234567890',
                'email_orang_tua' => 'susilo.pratama@email.com',
                'tingkat_pendidikan' => 'SMP/MTs Kelas 7',
                'sekolah_asal' => 'SDN Merdeka 01 Jakarta',
                'tahun_lulus' => 2024,
                'kemampuan_quran' => 'Sedang (surat pendek)',
                'kebutuhan_khusus' => null,
                'motivasi' => 'Ingin belajar agama lebih dalam dan menghafal Al-Quran',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nik' => '2345678901234567',
                'nama_lengkap' => 'Siti Nurhaliza',
                'tempat_lahir' => 'Bandung',
                'tanggal_lahir' => '2009-03-22',
                'jenis_kelamin' => 'P',
                'alamat_lengkap' => 'Jl. Sudirman No. 456, Bandung',
                'nomor_telepon' => '08234567890',
                'email' => 'siti.nurhaliza@email.com',
                'status' => 'diproses',
                'catatan' => 'Orang tua sudah menghubungi untuk wawancara',
                'nama_orang_tua' => 'Ibu Dewi Lestari',
                'telepon_orang_tua' => '082345678901',
                'email_orang_tua' => 'dewi.lestari@email.com',
                'tingkat_pendidikan' => 'SMP/MTs Kelas 8',
                'sekolah_asal' => 'SDN Cipta Cinta Bandung',
                'tahun_lulus' => 2023,
                'kemampuan_quran' => 'Baik (surat panjang)',
                'kebutuhan_khusus' => null,
                'motivasi' => 'Ingin menjadi penghafal Al-Quran dan belajar kitab kuning',
                'created_at' => now()->subDays(2),
                'updated_at' => now()->subDays(1),
            ],
            [
                'nik' => '3456789012345678',
                'nama_lengkap' => 'Muhammad Fauzi',
                'tempat_lahir' => 'Surabaya',
                'tanggal_lahir' => '2007-11-08',
                'jenis_kelamin' => 'L',
                'alamat_lengkap' => 'Jl. Gubernur Suryo No. 789, Surabaya',
                'nomor_telepon' => '08345678901',
                'email' => 'muhammad.fauzi@email.com',
                'status' => 'diterima',
                'catatan' => 'Lulus tes wawancara, siap masuk asrama',
                'nama_orang_tua' => 'Bapak Abdul Rahman',
                'telepon_orang_tua' => '083456789012',
                'email_orang_tua' => 'abdul.rahman@email.com',
                'tingkat_pendidikan' => 'SMA/MA Kelas 10',
                'sekolah_asal' => 'SMPN 1 Surabaya',
                'tahun_lulus' => 2022,
                'kemampuan_quran' => 'Sangat Baik (juz 30)',
                'kebutuhan_khusus' => null,
                'motivasi' => 'Ingin mendalami ilmu agama dan bahasa Arab',
                'created_at' => now()->subDays(5),
                'updated_at' => now()->subDays(3),
            ],
            [
                'nik' => '4567890123456789',
                'nama_lengkap' => 'Aisyah Putri',
                'tempat_lahir' => 'Yogyakarta',
                'tanggal_lahir' => '2009-07-30',
                'jenis_kelamin' => 'P',
                'alamat_lengkap' => 'Jl. Malioboro No. 321, Yogyakarta',
                'nomor_telepon' => '08456789012',
                'email' => 'aisyah.putri@email.com',
                'status' => 'ditolak',
                'catatan' => 'Usia belum memenuhi syarat minimum',
                'nama_orang_tua' => 'Bapak Budi Santoso',
                'telepon_orang_tua' => '084567890123',
                'email_orang_tua' => 'budi.santoso@email.com',
                'tingkat_pendidikan' => 'SMP/MTs Kelas 7',
                'sekolah_asal' => 'SDN Nusantara Yogyakarta',
                'tahun_lulus' => 2024,
                'kemampuan_quran' => 'Dasar (hijaiyah)',
                'kebutuhan_khusus' => null,
                'motivasi' => 'Ingin belajar di pesantren unggulan',
                'created_at' => now()->subDays(7),
                'updated_at' => now()->subDays(6),
            ],
            [
                'nik' => '5678901234567890',
                'nama_lengkap' => 'Rizki Aditya',
                'tempat_lahir' => 'Medan',
                'tanggal_lahir' => '2008-09-12',
                'jenis_kelamin' => 'L',
                'alamat_lengkap' => 'Jl. Imam Bonjol No. 654, Medan',
                'nomor_telepon' => '08567890123',
                'email' => 'rizki.aditya@email.com',
                'status' => 'pending',
                'catatan' => null,
                'nama_orang_tua' => 'Ibu Siti Aminah',
                'telepon_orang_tua' => '085678901234',
                'email_orang_tua' => 'siti.aminah@email.com',
                'tingkat_pendidikan' => 'SMP/MTs Kelas 9',
                'sekolah_asal' => 'SDN Pertiwi Medan',
                'tahun_lulus' => 2022,
                'kemampuan_quran' => 'Sedang (surat pendek)',
                'kebutuhan_khusus' => 'Alergi makanan tertentu',
                'motivasi' => 'Ingin menguasai ilmu syariah dan bahasa asing',
                'created_at' => now()->subDay(),
                'updated_at' => now()->subDay(),
            ]
        ];

        // Insert data
        foreach ($registrations as $registration) {
            PsbRegistration::create($registration);
        }

        $this->command->info('PSB Registration test data seeded successfully!');
    }
}
