<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Staff;
use App\Models\SpecializationCategory;

class StaffSeeder extends Seeder
{
    public function run(): void
    {
        $staff = [
            [
                'name' => 'Ustadz Ahmad Hidayat, S.Pd.I',
                'email' => 'ahmad.hidayat@pesantren.com',
                'phone' => '08123456789',
                'position' => 'Kepala Sekolah SMP',
                'specialization' => 'Pengajar Al-Quran',
                'bio_id' => 'Pengalaman 15 tahun dalam bidang pendidikan Islam dan manajemen sekolah.',
                'bio_en' => '15 years of experience in Islamic education and school management.',
                'bio_ar' => '15 عامًا من الخبرة في التعليم الإسلامي وإدارة المدارس.',
                'photo' => 'staff/ahmad-hidayat.jpg',
                'is_active' => true,
                'order' => 1,
            ],
            [
                'name' => 'Ustadzah Fatimah Azzahra, S.Pd',
                'email' => 'fatimah.azzahra@pesantren.com',
                'phone' => '08234567890',
                'position' => 'Wakil Kepala Sekolah Bidang Kurikulum',
                'specialization' => 'Kepala Sekolah',
                'bio_id' => 'Spesialis dalam pengembangan kurikulum dan evaluasi pembelajaran.',
                'bio_en' => 'Specialist in curriculum development and learning evaluation.',
                'bio_ar' => 'أخصائي في تطوير المناهج وتقييم التعلم.',
                'photo' => 'staff/fatimah-azzahra.jpg',
                'is_active' => true,
                'order' => 2,
            ],
            [
                'name' => 'Ustadz Muhammad Yusuf, Lc',
                'email' => 'muhammad.yusuf@pesantren.com',
                'phone' => '08345678901',
                'position' => 'Guru Tahfidz',
                'specialization' => 'Pengajar Al-Quran',
                'bio_id' => 'Hafiz Al-Quran 30 juz dengan pengalaman mengajar 10 tahun.',
                'bio_en' => 'Hafiz Al-Quran 30 juz with 10 years teaching experience.',
                'bio_ar' => 'حافظ القرآن 30 جزء مع 10 سنوات من الخبرة في التدريس.',
                'photo' => 'staff/muhammad-yusuf.jpg',
                'is_active' => true,
                'order' => 3,
            ],
            [
                'name' => 'Ustadzah Khadijah, S.Pd.I',
                'email' => 'khadijah@pesantren.com',
                'phone' => '08456789012',
                'position' => 'Guru Bahasa Arab',
                'specialization' => 'Guru Umum',
                'bio_id' => 'Alumni Universitas Al-Azhar Kairo, ahli dalam bahasa Arab dan sastra.',
                'bio_en' => 'Alumni of Al-Azhar University Cairo, expert in Arabic language and literature.',
                'bio_ar' => 'خريجة جامعة الأزهر بالقاهرة ، خبيرة في اللغة العربية والأدب.',
                'photo' => 'staff/khadijah.jpg',
                'is_active' => true,
                'order' => 4,
            ],
            [
                'name' => 'Ustadz Abdul Rahman, S.Pd',
                'email' => 'abdul.rahman@pesantren.com',
                'phone' => '08567890123',
                'position' => 'Guru Matematika',
                'specialization' => 'Guru Umum',
                'bio_id' => 'Spesialis dalam pembelajaran matematika dengan metode kontekstual.',
                'bio_en' => 'Specialist in mathematics learning with contextual methods.',
                'bio_ar' => 'أخصائي في تعلم الرياضيات بالطرق السياقية.',
                'photo' => 'staff/abdul-rahman.jpg',
                'is_active' => true,
                'order' => 5,
            ],
            [
                'name' => 'Ustadzah Aisyah, S.Pd',
                'email' => 'aisyah@pesantren.com',
                'phone' => '08678901234',
                'position' => 'Guru Bahasa Indonesia',
                'specialization' => 'Guru Umum',
                'bio_id' => 'Pengalaman 8 tahun mengajar Bahasa Indonesia di tingkat SMP.',
                'bio_en' => '8 years experience teaching Indonesian at junior high level.',
                'bio_ar' => '8 سنوات من الخبرة في تدريس اللغة الإندونيسية في مستوى المدرسة الإعدادية.',
                'photo' => 'staff/aisyah.jpg',
                'is_active' => true,
                'order' => 6,
            ],
            [
                'name' => 'Budi Santoso, S.Kom',
                'email' => 'budi.santoso@pesantren.com',
                'phone' => '08789012345',
                'position' => 'Kepala Laboratorium Komputer',
                'specialization' => 'Administrasi',
                'bio_id' => 'Ahli dalam teknologi informasi dan pengembangan e-learning.',
                'bio_en' => 'Expert in information technology and e-learning development.',
                'bio_ar' => 'خبير في تكنولوجيا المعلومات وتطوير التعلم الإلكتروني.',
                'photo' => 'staff/budi-santoso.jpg',
                'is_active' => true,
                'order' => 7,
            ],
            [
                'name' => 'Siti Rahayu, A.Md',
                'email' => 'siti.rahayu@pesantren.com',
                'phone' => '08890123456',
                'position' => 'Staff Administrasi',
                'specialization' => 'Administrasi',
                'bio_id' => 'Menangani administrasi keuangan dan akademik sekolah.',
                'bio_en' => 'Handles school financial and academic administration.',
                'bio_ar' => 'تتعامل مع الإدارة المالية والأكاديمية للمدرسة.',
                'photo' => 'staff/siti-rahayu.jpg',
                'is_active' => true,
                'order' => 8,
            ],
        ];

        foreach ($staff as $person) {
            Staff::create($person);
        }

        $this->command->info('Staff data seeded successfully!');
    }
}
