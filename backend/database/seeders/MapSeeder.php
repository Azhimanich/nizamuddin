<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Map;

class MapSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Google Maps short URL: https://maps.app.goo.gl/7nnUT6gDu319riVSA
        // Convert to embed URL format
        // Untuk short URL, kita perlu mendapatkan embed URL atau menggunakan koordinat
        // Saya akan menggunakan format embed URL yang umum untuk lokasi di Jakarta
        
        // Embed URL dari Google Maps
        // Link: https://maps.app.goo.gl/7nnUT6gDu319riVSA
        $map = Map::updateOrCreate(
            ['name' => 'Pondok Pesantren Nizamuddin'],
            [
                'name' => 'Pondok Pesantren Nizamuddin',
                'address' => 'Jl. Pesantren Nizamuddin No. 123, Indonesia',
                'latitude' => 1.0623320624335886, // Koordinat dari embed URL
                'longitude' => 100.50886577447267, // Koordinat dari embed URL
                'embed_url' => 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.132538478054!2d100.50886577447267!3d1.0623320624335886!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x302b519460cb8bf3%3A0x41b18d9029df65af!2sPondok%20Pesantren%20Nizhamuddin!5e0!3m2!1sen!2sid!4v1767072614449!5m2!1sen!2sid',
                'api_key' => null,
                'zoom_level' => 17,
                'map_type' => 'roadmap',
                'order' => 0,
                'is_active' => true,
            ]
        );

        $this->command->info('Map seeded successfully!');
        $this->command->info('Note: Untuk mendapatkan embed URL yang tepat, buka link https://maps.app.goo.gl/7nnUT6gDu319riVSA di browser, lalu:');
        $this->command->info('1. Klik tombol "Bagikan" (Share)');
        $this->command->info('2. Pilih "Sematkan peta" (Embed map)');
        $this->command->info('3. Salin URL embed yang diberikan');
        $this->command->info('4. Update di admin panel: Manajemen Kontak > Tab Peta');
    }
}

