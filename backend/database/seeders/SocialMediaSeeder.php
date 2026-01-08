<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SocialMedia;

class SocialMediaSeeder extends Seeder
{
    public function run(): void
    {
        // Clear existing social media
        SocialMedia::truncate();

        // Create dummy social media
        $socialMedia = [
            [
                'name' => 'Instagram',
                'icon' => 'fa-instagram',
                'url' => 'https://instagram.com/pesantrennizamuddin',
                'order' => 1,
                'is_active' => true,
            ],
            [
                'name' => 'YouTube',
                'icon' => 'fa-youtube',
                'url' => 'https://youtube.com/@pesantrennizamuddin',
                'order' => 2,
                'is_active' => true,
            ],
            [
                'name' => 'Facebook',
                'icon' => 'fa-facebook',
                'url' => 'https://facebook.com/pesantrennizamuddin',
                'order' => 3,
                'is_active' => true,
            ],
            [
                'name' => 'WhatsApp',
                'icon' => 'fa-whatsapp',
                'url' => 'https://wa.me/6281234567890',
                'order' => 4,
                'is_active' => true,
            ],
        ];

        foreach ($socialMedia as $media) {
            SocialMedia::create($media);
        }

        $this->command->info('Dummy social media created successfully!');
    }
}
