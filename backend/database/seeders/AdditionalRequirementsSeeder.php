<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PsbAdditionalRequirement;

class AdditionalRequirementsSeeder extends Seeder
{
    public function run(): void
    {
        $additionalRequirements = [
            'id' => [
                'Surat Keterangan Berkelakuan Baik dari Pondok Pesantren (jika pernah mondok)',
                'Sertifikat Tahsin Al-Qur\'an (jika ada)',
                'Sertifikat Hafalan Al-Qur\'an (jika ada)',
                'Surat Keterangan Tidak Mampu Membaca dan Menulis Al-Qur\'an (jika ada)',
                'Pas Foto Ukuran 4x6 (latar biru, baju putih)',
                'Surat Rekomendasi dari Ustadz/Pengasuh Pondok'
            ],
            'en' => [
                'Good Conduct Certificate from Islamic Boarding School (if previously attended)',
                'Quran Memorization Certificate (if any)',
                'Quran Reading Certificate (if any)',
                'Letter of Illiteracy in Quran (if applicable)',
                '4x6 Photo (blue background, white shirt)',
                'Recommendation Letter from Islamic School Teacher/Imam'
            ]
        ];

        foreach ($additionalRequirements as $locale => $requirements) {
            foreach ($requirements as $requirement) {
                PsbAdditionalRequirement::create([
                    'requirement' => $requirement,
                    'locale' => $locale,
                    'is_active' => true,
                    'order' => 0
                ]);
            }
        }
    }
}
