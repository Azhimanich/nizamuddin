<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Download;
use App\Models\DownloadCategory;

class DownloadSeeder extends Seeder
{
    public function run(): void
    {
        // Create downloads
        $downloads = [
            [
                'title' => 'Formulir Pendaftaran Santri Baru 2024/2025',
                'description' => 'Formulir pendaftaran santri baru tahun ajaran 2024/2025',
                'file_path' => 'downloads/formulir-psb-2024-2025.pdf',
                'file_type' => 'pdf',
                'file_size' => 1024000,
                'download_count' => 150,
                'category_id' => 1,
                'category' => 'Formulir',
                'is_active' => true,
                'order' => 1,
            ],
            [
                'title' => 'Buku Panduan Santri',
                'description' => 'Panduan lengkap untuk santri baru mengenai kehidupan di pesantren',
                'file_path' => 'downloads/buku-panduan-santri.pdf',
                'file_type' => 'pdf',
                'file_size' => 2048000,
                'download_count' => 89,
                'category_id' => 2,
                'category' => 'Buku',
                'is_active' => true,
                'order' => 2,
            ],
            [
                'title' => 'Kalender Akademik 2024/2025',
                'description' => 'Kalender akademik lengkap tahun ajaran 2024/2025',
                'file_path' => 'downloads/kalender-akademik-2024-2025.pdf',
                'file_type' => 'pdf',
                'file_size' => 512000,
                'download_count' => 234,
                'category_id' => 3,
                'category' => 'Kalender',
                'is_active' => true,
                'order' => 3,
            ],
            [
                'title' => 'Formulir Beasiswa',
                'description' => 'Formulir pengajuan beasiswa untuk santri berprestasi',
                'file_path' => 'downloads/formulir-beasiswa.pdf',
                'file_type' => 'pdf',
                'file_size' => 768000,
                'download_count' => 67,
                'category_id' => 1,
                'category' => 'Formulir',
                'is_active' => true,
                'order' => 4,
            ],
        ];

        foreach ($downloads as $download) {
            Download::create($download);
        }

        $this->command->info('Download data seeded successfully!');
    }
}
