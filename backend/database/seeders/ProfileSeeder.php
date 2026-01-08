<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Profile;

class ProfileSeeder extends Seeder
{
    public function run(): void
    {
        // Clear existing profiles (handle foreign key constraint)
        \DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        Profile::query()->delete();
        \DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // 1. Sekapur Sirih / Welcome
        Profile::create([
            'type' => 'welcome',
            'key' => 'sekapur_sirih',
            'content' => [
                'id' => [
                    'text' => 'Assalamu\'alaikum Warahmatullahi Wabarakatuh. Dengan penuh rasa syukur kepada Allah SWT, kami mengucapkan selamat datang di website resmi Pondok Pesantren Nizamuddin. Pondok Pesantren Nizamuddin adalah lembaga pendidikan Islam yang berkomitmen untuk mencetak generasi yang berakhlak mulia, berilmu, dan bermanfaat bagi umat.',
                    'title' => 'Sekapur Sirih',
                    'value' => '',
                    'name' => '',
                    'description' => '',
                ],
                'en' => [
                    'text' => 'Assalamu\'alaikum Warahmatullahi Wabarakatuh. With full gratitude to Allah SWT, we welcome you to the official website of Pondok Pesantren Nizamuddin. Pondok Pesantren Nizamuddin is an Islamic educational institution committed to producing a generation with noble character, knowledge, and beneficial to the ummah.',
                    'title' => 'Welcome Message',
                    'value' => '',
                    'name' => '',
                    'description' => '',
                ],
                'ar' => [
                    'text' => 'السلام عليكم ورحمة الله وبركاته. بكل امتنان لله تعالى، نرحب بكم في الموقع الرسمي لمدرسة نظام الدين. مدرسة نظام الدين هي مؤسسة تعليمية إسلامية ملتزمة بإنتاج جيل ذو أخلاق نبيلة وعلم ومفيد للأمة.',
                    'title' => 'رسالة الترحيب',
                    'value' => '',
                    'name' => '',
                    'description' => '',
                ],
            ],
            'order' => 1,
            'is_active' => true,
        ]);

        // 2. Visi
        Profile::create([
            'type' => 'vision',
            'key' => 'visi',
            'content' => [
                'id' => [
                    'text' => 'Menjadi pondok pesantren terdepan dalam mencetak generasi yang berakhlak mulia, berilmu, dan bermanfaat bagi umat, dengan mengintegrasikan nilai-nilai Islam dalam setiap aspek kehidupan.',
                    'title' => 'Visi',
                    'value' => '',
                    'name' => '',
                    'description' => '',
                ],
                'en' => [
                    'text' => 'To become a leading Islamic boarding school in producing a generation with noble character, knowledge, and beneficial to the ummah, by integrating Islamic values in every aspect of life.',
                    'title' => 'Vision',
                    'value' => '',
                    'name' => '',
                    'description' => '',
                ],
                'ar' => [
                    'text' => 'أن تصبح مدرسة إسلامية رائدة في إنتاج جيل ذو أخلاق نبيلة وعلم ومفيد للأمة، من خلال دمج القيم الإسلامية في كل جانب من جوانب الحياة.',
                    'title' => 'الرؤية',
                    'value' => '',
                    'name' => '',
                    'description' => '',
                ],
            ],
            'order' => 2,
            'is_active' => true,
        ]);

        // 3. Misi
        Profile::create([
            'type' => 'mission',
            'key' => 'misi',
            'content' => [
                'id' => [
                    'text' => '1. Menyelenggarakan pendidikan Islam yang berkualitas dengan mengintegrasikan ilmu agama dan ilmu umum.
2. Membentuk karakter santri yang berakhlak mulia berdasarkan Al-Quran dan Sunnah.
3. Mengembangkan potensi santri secara holistik melalui kegiatan akademik dan non-akademik.
4. Menjalin kerjasama dengan berbagai pihak untuk meningkatkan kualitas pendidikan.
5. Menyiapkan santri yang siap berkontribusi positif bagi masyarakat dan bangsa.',
                    'title' => 'Misi',
                    'value' => '',
                    'name' => '',
                    'description' => '',
                ],
                'en' => [
                    'text' => '1. Organize quality Islamic education by integrating religious and general sciences.
2. Form students\' character with noble morals based on the Quran and Sunnah.
3. Develop students\' potential holistically through academic and non-academic activities.
4. Establish cooperation with various parties to improve education quality.
5. Prepare students who are ready to contribute positively to society and the nation.',
                    'title' => 'Mission',
                    'value' => '',
                    'name' => '',
                    'description' => '',
                ],
                'ar' => [
                    'text' => '1. تنظيم التعليم الإسلامي الجيد من خلال دمج العلوم الدينية والعلمية.
2. تشكيل شخصية الطلاب بأخلاق نبيلة على أساس القرآن والسنة.
3. تطوير إمكانات الطلاب بشكل شامل من خلال الأنشطة الأكاديمية وغير الأكاديمية.
4. إقامة التعاون مع مختلف الأطراف لتحسين جودة التعليم.
5. إعداد الطلاب المستعدين للمساهمة بشكل إيجابي في المجتمع والأمة.',
                    'title' => 'المهمة',
                    'value' => '',
                    'name' => '',
                    'description' => '',
                ],
            ],
            'order' => 3,
            'is_active' => true,
        ]);

        // 4. Identitas Sekolah - Nama
        Profile::create([
            'type' => 'identity',
            'key' => 'nama_pesantren',
            'content' => [
                'id' => ['value' => 'Pondok Pesantren Nizamuddin', 'text' => '', 'title' => '', 'name' => '', 'description' => ''],
                'en' => ['value' => 'Nizamuddin Islamic Boarding School', 'text' => '', 'title' => '', 'name' => '', 'description' => ''],
                'ar' => ['value' => 'مدرسة نظام الدين الإسلامية', 'text' => '', 'title' => '', 'name' => '', 'description' => ''],
            ],
            'order' => 4,
            'is_active' => true,
        ]);

        Profile::create([
            'type' => 'identity',
            'key' => 'npsn',
            'content' => [
                'id' => ['value' => '12012912', 'text' => '', 'title' => '', 'name' => '', 'description' => ''],
                'en' => ['value' => '12012912', 'text' => '', 'title' => '', 'name' => '', 'description' => ''],
                'ar' => ['value' => '12012912', 'text' => '', 'title' => '', 'name' => '', 'description' => ''],
            ],
            'order' => 5,
            'is_active' => true,
        ]);

        Profile::create([
            'type' => 'identity',
            'key' => 'akreditasi',
            'content' => [
                'id' => ['value' => 'A (Unggul)', 'text' => '', 'title' => '', 'name' => '', 'description' => ''],
                'en' => ['value' => 'A (Excellent)', 'text' => '', 'title' => '', 'name' => '', 'description' => ''],
                'ar' => ['value' => 'أ (ممتاز)', 'text' => '', 'title' => '', 'name' => '', 'description' => ''],
            ],
            'order' => 6,
            'is_active' => true,
        ]);

        Profile::create([
            'type' => 'identity',
            'key' => 'no_sk_pendirian',
            'content' => [
                'id' => ['value' => 'SK/001/NIZ/2005', 'text' => '', 'title' => '', 'name' => '', 'description' => ''],
                'en' => ['value' => 'SK/001/NIZ/2005', 'text' => '', 'title' => '', 'name' => '', 'description' => ''],
                'ar' => ['value' => 'SK/001/NIZ/2005', 'text' => '', 'title' => '', 'name' => '', 'description' => ''],
            ],
            'order' => 7,
            'is_active' => true,
        ]);

        Profile::create([
            'type' => 'identity',
            'key' => 'alamat',
            'content' => [
                'id' => ['value' => 'Jl. Raya Pesantren No. 123, Kecamatan Pesantren, Kabupaten Pesantren, Provinsi Jawa Timur 12345', 'text' => '', 'title' => '', 'name' => '', 'description' => ''],
                'en' => ['value' => 'Pesantren Street No. 123, Pesantren District, Pesantren Regency, East Java Province 12345', 'text' => '', 'title' => '', 'name' => '', 'description' => ''],
                'ar' => ['value' => 'شارع المدرسة رقم 123، منطقة المدرسة، مقاطعة المدرسة، مقاطعة جاوة الشرقية 12345', 'text' => '', 'title' => '', 'name' => '', 'description' => ''],
            ],
            'order' => 5,
            'is_active' => true,
        ]);

        Profile::create([
            'type' => 'identity',
            'key' => 'telepon',
            'content' => [
                'id' => ['value' => '+62 123 456 7890', 'text' => '', 'title' => '', 'name' => '', 'description' => ''],
                'en' => ['value' => '+62 123 456 7890', 'text' => '', 'title' => '', 'name' => '', 'description' => ''],
                'ar' => ['value' => '+62 123 456 7890', 'text' => '', 'title' => '', 'name' => '', 'description' => ''],
            ],
            'order' => 6,
            'is_active' => true,
        ]);

        Profile::create([
            'type' => 'identity',
            'key' => 'email',
            'content' => [
                'id' => ['value' => 'info@pesantrennizamuddin.ac.id', 'text' => '', 'title' => '', 'name' => '', 'description' => ''],
                'en' => ['value' => 'info@pesantrennizamuddin.ac.id', 'text' => '', 'title' => '', 'name' => '', 'description' => ''],
                'ar' => ['value' => 'info@pesantrennizamuddin.ac.id', 'text' => '', 'title' => '', 'name' => '', 'description' => ''],
            ],
            'order' => 7,
            'is_active' => true,
        ]);

        Profile::create([
            'type' => 'identity',
            'key' => 'tahun_berdiri',
            'content' => [
                'id' => ['value' => '1985', 'text' => '', 'title' => '', 'name' => '', 'description' => ''],
                'en' => ['value' => '1985', 'text' => '', 'title' => '', 'name' => '', 'description' => ''],
                'ar' => ['value' => '1985', 'text' => '', 'title' => '', 'name' => '', 'description' => ''],
            ],
            'order' => 8,
            'is_active' => true,
        ]);

        // 5. Fasilitas
        Profile::create([
            'type' => 'facility',
            'key' => 'masjid',
            'content' => [
                'id' => [
                    'name' => 'Masjid Al-Nizam',
                    'description' => 'Masjid utama dengan kapasitas 500 jamaah, dilengkapi dengan sound system modern dan pendingin ruangan.',
                    'text' => '',
                    'title' => '',
                    'value' => '',
                ],
                'en' => [
                    'name' => 'Al-Nizam Mosque',
                    'description' => 'Main mosque with a capacity of 500 worshippers, equipped with modern sound system and air conditioning.',
                    'text' => '',
                    'title' => '',
                    'value' => '',
                ],
                'ar' => [
                    'name' => 'مسجد النظام',
                    'description' => 'المسجد الرئيسي بسعة 500 مصلي، مجهز بنظام صوتي حديث وتكييف.',
                    'text' => '',
                    'title' => '',
                    'value' => '',
                ],
            ],
            'order' => 9,
            'is_active' => true,
        ]);

        Profile::create([
            'type' => 'facility',
            'key' => 'perpustakaan',
            'content' => [
                'id' => [
                    'name' => 'Perpustakaan Digital',
                    'description' => 'Perpustakaan modern dengan koleksi lebih dari 10.000 buku, dilengkapi dengan akses internet dan ruang baca yang nyaman.',
                    'text' => '',
                    'title' => '',
                    'value' => '',
                ],
                'en' => [
                    'name' => 'Digital Library',
                    'description' => 'Modern library with a collection of more than 10,000 books, equipped with internet access and comfortable reading room.',
                    'text' => '',
                    'title' => '',
                    'value' => '',
                ],
                'ar' => [
                    'name' => 'المكتبة الرقمية',
                    'description' => 'مكتبة حديثة تضم أكثر من 10000 كتاب، مجهزة بإمكانية الوصول إلى الإنترنت وغرفة قراءة مريحة.',
                    'text' => '',
                    'title' => '',
                    'value' => '',
                ],
            ],
            'order' => 10,
            'is_active' => true,
        ]);

        Profile::create([
            'type' => 'facility',
            'key' => 'laboratorium',
            'content' => [
                'id' => [
                    'name' => 'Laboratorium Komputer',
                    'description' => 'Laboratorium komputer dengan 50 unit komputer terbaru, dilengkapi dengan software pembelajaran dan akses internet berkecepatan tinggi.',
                    'text' => '',
                    'title' => '',
                    'value' => '',
                ],
                'en' => [
                    'name' => 'Computer Laboratory',
                    'description' => 'Computer laboratory with 50 latest computer units, equipped with learning software and high-speed internet access.',
                    'text' => '',
                    'title' => '',
                    'value' => '',
                ],
                'ar' => [
                    'name' => 'مختبر الحاسوب',
                    'description' => 'مختبر حاسوب يحتوي على 50 وحدة حاسوب حديثة، مجهز ببرامج تعليمية وإمكانية الوصول إلى الإنترنت عالية السرعة.',
                    'text' => '',
                    'title' => '',
                    'value' => '',
                ],
            ],
            'order' => 11,
            'is_active' => true,
        ]);

        Profile::create([
            'type' => 'facility',
            'key' => 'asrama',
            'content' => [
                'id' => [
                    'name' => 'Asrama Santri',
                    'description' => 'Asrama yang nyaman dengan kapasitas 200 santri, dilengkapi dengan kamar mandi dalam, wifi, dan pengawasan 24 jam.',
                    'text' => '',
                    'title' => '',
                    'value' => '',
                ],
                'en' => [
                    'name' => 'Student Dormitory',
                    'description' => 'Comfortable dormitory with a capacity of 200 students, equipped with en-suite bathrooms, wifi, and 24-hour supervision.',
                    'text' => '',
                    'title' => '',
                    'value' => '',
                ],
                'ar' => [
                    'name' => 'سكن الطلاب',
                    'description' => 'سكن مريح بسعة 200 طالب، مجهز بحمامات داخلية وواي فاي وإشراف على مدار الساعة.',
                    'text' => '',
                    'title' => '',
                    'value' => '',
                ],
            ],
            'order' => 12,
            'is_active' => true,
        ]);

        Profile::create([
            'type' => 'facility',
            'key' => 'kantin',
            'content' => [
                'id' => [
                    'name' => 'Kantin Sehat',
                    'description' => 'Kantin yang menyediakan makanan halal dan bergizi dengan harga terjangkau, dilengkapi dengan tempat duduk yang nyaman.',
                    'text' => '',
                    'title' => '',
                    'value' => '',
                ],
                'en' => [
                    'name' => 'Healthy Canteen',
                    'description' => 'Canteen that provides halal and nutritious food at affordable prices, equipped with comfortable seating.',
                    'text' => '',
                    'title' => '',
                    'value' => '',
                ],
                'ar' => [
                    'name' => 'مطعم صحي',
                    'description' => 'مطعم يوفر طعامًا حلالًا ومغذيًا بأسعار معقولة، مجهز بمقاعد مريحة.',
                    'text' => '',
                    'title' => '',
                    'value' => '',
                ],
            ],
            'order' => 13,
            'is_active' => true,
        ]);

        Profile::create([
            'type' => 'facility',
            'key' => 'lapangan_olahraga',
            'content' => [
                'id' => [
                    'name' => 'Lapangan Olahraga',
                    'description' => 'Lapangan olahraga multifungsi untuk sepak bola, basket, dan voli, dilengkapi dengan tribun penonton.',
                    'text' => '',
                    'title' => '',
                    'value' => '',
                ],
                'en' => [
                    'name' => 'Sports Field',
                    'description' => 'Multifunctional sports field for football, basketball, and volleyball, equipped with spectator stands.',
                    'text' => '',
                    'title' => '',
                    'value' => '',
                ],
                'ar' => [
                    'name' => 'ملعب رياضي',
                    'description' => 'ملعب رياضي متعدد الوظائف لكرة القدم وكرة السلة والكرة الطائرة، مجهز بمدرجات للمتفرجين.',
                    'text' => '',
                    'title' => '',
                    'value' => '',
                ],
            ],
            'order' => 14,
            'is_active' => true,
        ]);

        // 6. Video Profil
        Profile::create([
            'type' => 'video',
            'key' => 'video_profil',
            'content' => [
                'id' => [
                    'title' => 'Video Profil Pondok Pesantren Nizamuddin',
                    'description' => 'Video pengenalan singkat tentang Pondok Pesantren Nizamuddin, fasilitas, dan kegiatan belajar mengajar.',
                    'youtube_url' => 'https://www.youtube.com/watch?v=ScMzIvxBSi4', // Contoh video pendidikan
                    'text' => '',
                    'value' => '',
                    'name' => '',
                ],
                'en' => [
                    'title' => 'Nizamuddin Islamic Boarding School Profile Video',
                    'description' => 'Introduction video about Nizamuddin Islamic Boarding School, facilities, and teaching activities.',
                    'youtube_url' => 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
                    'text' => '',
                    'value' => '',
                    'name' => '',
                ],
                'ar' => [
                    'title' => 'فيديو تعريفي بمدرسة نظام الدين الإسلامية',
                    'description' => 'فيديو تعريفي قصير عن مدرسة نظام الدين الإسلامية، المرافق، والأنشطة التعليمية.',
                    'youtube_url' => 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
                    'text' => '',
                    'value' => '',
                    'name' => '',
                ],
            ],
            'order' => 15,
            'is_active' => true,
        ]);

        $this->command->info('Dummy profile data created successfully!');
    }
}

