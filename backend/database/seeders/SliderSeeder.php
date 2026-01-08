<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Slider;

class SliderSeeder extends Seeder
{
    public function run(): void
    {
        // Clear existing sliders
        Slider::truncate();

        // Create dummy sliders
        $sliders = [
            [
                'title_id' => 'Selamat Datang di Pondok Pesantren Nizamuddin',
                'title_en' => 'Welcome to Pondok Pesantren Nizamuddin',
                'title_ar' => 'مرحباً بكم في مدرسة نظام الدين',
                'subtitle_id' => 'Mendidik Generasi Berakhlak Mulia dan Berilmu',
                'subtitle_en' => 'Educating Noble and Knowledgeable Generations',
                'subtitle_ar' => 'تعليم الأجيال النبيلة والعالمة',
                'cta_text_id' => 'Pelajari Lebih Lanjut',
                'cta_text_en' => 'Learn More',
                'cta_text_ar' => 'تعرف على المزيد',
                'cta_link' => '/profil',
                'order' => 1,
                'is_active' => true,
            ],
            [
                'title_id' => 'Pendidikan Berbasis Al-Quran dan Sunnah',
                'title_en' => 'Education Based on Al-Quran and Sunnah',
                'title_ar' => 'التعليم القائم على القرآن والسنة',
                'subtitle_id' => 'Menggabungkan Ilmu Agama dan Ilmu Umum untuk Masa Depan yang Cerah',
                'subtitle_en' => 'Combining Religious and General Sciences for a Bright Future',
                'subtitle_ar' => 'الجمع بين العلوم الدينية والعلمية لمستقبل مشرق',
                'cta_text_id' => 'Lihat Program',
                'cta_text_en' => 'View Programs',
                'cta_text_ar' => 'عرض البرامج',
                'cta_link' => '/program',
                'order' => 2,
                'is_active' => true,
            ],
            [
                'title_id' => 'Bergabunglah dengan Keluarga Besar Pesantren Nizamuddin',
                'title_en' => 'Join the Nizamuddin Pesantren Family',
                'title_ar' => 'انضم إلى عائلة مدرسة نظام الدين',
                'subtitle_id' => 'Daftarkan Putra Putri Anda untuk Pendidikan Terbaik',
                'subtitle_en' => 'Register Your Children for the Best Education',
                'subtitle_ar' => 'سجل أطفالك للحصول على أفضل تعليم',
                'cta_text_id' => 'Daftar Sekarang',
                'cta_text_en' => 'Register Now',
                'cta_text_ar' => 'سجل الآن',
                'cta_link' => '/pendaftaran',
                'order' => 3,
                'is_active' => true,
            ],
        ];

        foreach ($sliders as $slider) {
            Slider::create($slider);
        }

        $this->command->info('Dummy sliders created successfully!');
    }
}

