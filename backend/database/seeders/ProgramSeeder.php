<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Program;

class ProgramSeeder extends Seeder
{
    public function run(): void
    {
        $programs = [
            [
                'name' => 'Tahfidz Al-Quran',
                'description_id' => 'Program unggulan untuk menghafal Al-Quran dengan target 30 juz dalam 4 tahun. Dilengkapi dengan metode tahsin dan murojaah yang sistematis.',
                'description_en' => 'Flagship program for memorizing the Quran with a target of 30 juz in 4 years. Equipped with systematic tahsin and murojaah methods.',
                'description_ar' => 'برنامج رئيسي لحفظ القرآن بهدف 30 جزء في 4 سنوات. مجهز بأساليب منهجية للتجويد والمراجعة.',
                'icon' => '📖',
                'image' => 'programs/tahfidz.jpg',
                'type' => 'academic',
                'is_active' => true,
                'order' => 1,
            ],
            [
                'name' => 'Bahasa Arab & Inggris',
                'description_id' => 'Program intensif pembelajaran bahasa Arab dan Inggris untuk persiapan santri menghadapi tantangan global.',
                'description_en' => 'Intensive Arabic and English language learning program to prepare students for global challenges.',
                'description_ar' => 'برنامج مكثف لتعلم اللغة العربية والإنجليزية لإعداد الطلاب للتحديات العالمية.',
                'icon' => '🌍',
                'image' => 'programs/language.jpg',
                'type' => 'academic',
                'is_active' => true,
                'order' => 2,
            ],
            [
                'name' => 'Sains & Teknologi',
                'description_id' => 'Program pengembangan kemampuan sains dan teknologi dengan laboratorium lengkap dan pembelajaran berbasis proyek.',
                'description_en' => 'Science and technology skills development program with complete laboratories and project-based learning.',
                'description_ar' => 'برنامج تطوير مهارات العلوم والتكنولوجيا مع مختبرات كاملة والتعلم القائم على المشاريع.',
                'icon' => '🔬',
                'image' => 'programs/science.jpg',
                'type' => 'academic',
                'is_active' => true,
                'order' => 3,
            ],
            [
                'name' => 'Seni & Budaya Islam',
                'description_id' => 'Program pengembangan bakat seni dan budaya Islam seperti kaligrafi, nasyid, dan seni peran.',
                'description_en' => 'Islamic arts and culture talent development program such as calligraphy, nasyid, and performing arts.',
                'description_ar' => 'برنامج تطوير المواهب في الفنون والثقافة الإسلامية مثل الخطاطية والنشيد والفنون الأدائية.',
                'icon' => '🎨',
                'image' => 'programs/arts.jpg',
                'type' => 'extracurricular',
                'is_active' => true,
                'order' => 4,
            ],
            [
                'name' => 'Olahraga & Kesehatan',
                'description_id' => 'Program pembinaan fisik dan mental melalui kegiatan olahraga dan kesehatan yang terstruktur.',
                'description_en' => 'Physical and mental development program through structured sports and health activities.',
                'description_ar' => 'برنامج تطوير بدني وعقلي من خلال الأنشطة الرياضية والصحية المنظمة.',
                'icon' => '⚽',
                'image' => 'programs/sports.jpg',
                'type' => 'extracurricular',
                'is_active' => true,
                'order' => 5,
            ],
            [
                'name' => 'Leadership & Dakwah',
                'description_id' => 'Program pembentukan karakter pemimpin dan dai muda melalui pelatihan public speaking dan organisasi.',
                'description_en' => 'Character formation program for leaders and young preachers through public speaking and organization training.',
                'description_ar' => 'برنامج تكوين الشخصية للقادة والدعاة الشباب من خلال التدريب على الخطابة العامة والمنظمات.',
                'icon' => '🎤',
                'image' => 'programs/leadership.jpg',
                'type' => 'character',
                'is_active' => true,
                'order' => 6,
            ],
        ];

        foreach ($programs as $program) {
            Program::create($program);
        }

        $this->command->info('Program data seeded successfully!');
    }
}
