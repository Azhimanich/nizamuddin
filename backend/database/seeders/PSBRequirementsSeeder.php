<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PsbRequirement;
use App\Models\PsbCost;
use App\Models\PsbAdditionalRequirement;

class PSBRequirementsSeeder extends Seeder
{
    public function run(): void
    {
        // Document Requirements - Indonesian
        $this->createDocumentRequirements('id', [
            'Dokumen Identitas' => [
                'Akta Kelahiran (fotokopi)',
                'Kartu Keluarga (fotokopi)',
                'KTP Orang Tua/Wali (fotokopi)',
                'Pas foto 3x4 (4 lembar)',
                'Pas foto 2x3 (4 lembar)'
            ],
            'Dokumen Akademik' => [
                'Rapor semester terakhir',
                'Surat Keterangan Berkelakuan Baik',
                'Ijazah/SKL (jika ada)',
                'Sertifikat penghargaan (jika ada)',
                'Surat rekomendasi dari sekolah (opsional)'
            ],
            'Dokumen Kesehatan' => [
                'Surat keterangan sehat dari dokter',
                'Kartu imunisasi',
                'Surat keterangan bebas narkoba',
                'Data riwayat penyakit (jika ada)',
                'Informasi alergi (jika ada)'
            ]
        ]);

        // Document Requirements - English
        $this->createDocumentRequirements('en', [
            'Identity Documents' => [
                'Birth certificate (photocopy)',
                'Family card (photocopy)',
                'Parent/Guardian ID (photocopy)',
                '3x4 photos (4 pieces)',
                '2x3 photos (4 pieces)'
            ],
            'Academic Documents' => [
                'Latest semester report card',
                'Good conduct certificate',
                'Diploma/SKL (if available)',
                'Award certificates (if available)',
                'School recommendation letter (optional)'
            ],
            'Health Documents' => [
                'Health certificate from doctor',
                'Immunization card',
                'Drug-free certificate',
                'Medical history (if any)',
                'Allergy information (if any)'
            ]
        ]);

        // Additional Requirements - Indonesian
        $this->createAdditionalRequirements('id', [
            'Usia minimal 6 tahun untuk tingkat SD/MI',
            'Usia maksimal 19 tahun untuk tingkat SMA/MA',
            'Mampu membaca Al-Quran (dasar)',
            'Bersedia tinggal di asrama',
            'Menyetujui peraturan pesantren',
            'Orang tua/wali menyetujui syarat dan ketentuan'
        ]);

        // Additional Requirements - English
        $this->createAdditionalRequirements('en', [
            'Minimum age 6 years for elementary level',
            'Maximum age 19 years for high school level',
            'Able to read Quran (basic)',
            'Willing to live in dormitory',
            'Agree to pesantren regulations',
            'Parent/guardian agrees to terms and conditions'
        ]);

        // Costs - Indonesian
        $this->createCosts('id', [
            [
                'item_name' => 'Biaya Pendaftaran',
                'amount' => 'Rp 500.000',
                'note' => 'Tidak dapat dikembalikan'
            ],
            [
                'item_name' => 'Biaya Tes Masuk',
                'amount' => 'Rp 300.000',
                'note' => 'Termasuk tes akademik dan psikotes'
            ],
            [
                'item_name' => 'Uang Pangkal',
                'amount' => 'Rp 5.000.000',
                'note' => 'Dapat dicicil 3x'
            ],
            [
                'item_name' => 'SPP Bulanan',
                'amount' => 'Rp 800.000',
                'note' => 'Belum termasuk biaya makan'
            ]
        ]);

        // Costs - English
        $this->createCosts('en', [
            [
                'item_name' => 'Registration Fee',
                'amount' => 'Rp 500.000',
                'note' => 'Non-refundable'
            ],
            [
                'item_name' => 'Entrance Test Fee',
                'amount' => 'Rp 300.000',
                'note' => 'Includes academic and psychological tests'
            ],
            [
                'item_name' => 'Initial Fee',
                'amount' => 'Rp 5.000.000',
                'note' => 'Can be paid in 3 installments'
            ],
            [
                'item_name' => 'Monthly Tuition',
                'amount' => 'Rp 800.000',
                'note' => 'Excluding meal costs'
            ]
        ]);
    }

    private function createDocumentRequirements(string $locale, array $categories): void
    {
        $order = 1;
        foreach ($categories as $category => $items) {
            foreach ($items as $item) {
                PsbRequirement::create([
                    'category' => $category,
                    'item' => $item,
                    'locale' => $locale,
                    'order' => $order++,
                    'is_active' => true
                ]);
            }
        }
    }

    private function createAdditionalRequirements(string $locale, array $requirements): void
    {
        foreach ($requirements as $index => $requirement) {
            PsbAdditionalRequirement::create([
                'requirement' => $requirement,
                'locale' => $locale,
                'order' => $index + 1,
                'is_active' => true
            ]);
        }
    }

    private function createCosts(string $locale, array $costs): void
    {
        foreach ($costs as $index => $cost) {
            PsbCost::create([
                'item_name' => $cost['item_name'],
                'amount' => $cost['amount'],
                'note' => $cost['note'],
                'locale' => $locale,
                'order' => $index + 1,
                'is_active' => true
            ]);
        }
    }
}
