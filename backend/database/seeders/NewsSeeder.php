<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\News;
use App\Models\Category;
use App\Models\User;
use Illuminate\Support\Str;

class NewsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get or create a default category
        $category = Category::first();
        if (!$category) {
            $category = Category::create([
                'name' => 'Berita',
                'slug' => 'berita',
                'is_active' => true,
                'order' => 0
            ]);
        }

        // Get first user or create one
        $user = User::first();
        if (!$user) {
            $user = User::create([
                'name' => 'Admin',
                'email' => 'admin@pesantren.com',
                'password' => bcrypt('password')
            ]);
        }

        $newsData = [
            [
                'title' => 'Pondok Pesantren Nizamuddin Gelar Acara Tahunan Santri',
                'excerpt' => 'Acara tahunan yang diadakan setiap tahun ini menjadi momen penting bagi seluruh santri untuk menunjukkan bakat dan prestasi mereka.',
                'content' => 'Pondok Pesantren Nizamuddin baru saja menggelar acara tahunan yang meriah dengan partisipasi seluruh santri. Acara ini diadakan sebagai bentuk apresiasi terhadap dedikasi dan prestasi para santri selama satu tahun terakhir.

Acara dimulai dengan pembukaan yang dihadiri oleh seluruh pengasuh pesantren dan tamu kehormatan. Berbagai penampilan menarik ditampilkan oleh para santri, mulai dari tilawah Al-Quran, hafalan hadits, hingga penampilan seni dan budaya.

Selain itu, acara ini juga menjadi ajang pemberian penghargaan kepada santri-santri berprestasi di berbagai bidang, baik akademik maupun non-akademik. Hal ini diharapkan dapat memotivasi santri lainnya untuk terus berprestasi.',
                'author' => 'Tim Humas Pesantren',
                'image_caption' => 'Momen pembukaan acara tahunan Pondok Pesantren Nizamuddin'
            ],
            [
                'title' => 'Prestasi Membanggakan: Santri Raih Juara Olimpiade Nasional',
                'excerpt' => 'Salah satu santri Pondok Pesantren Nizamuddin berhasil meraih juara pertama dalam Olimpiade Sains Nasional tingkat SMA.',
                'content' => 'Kabar membanggakan datang dari Pondok Pesantren Nizamuddin. Salah satu santri kelas 3 SMA berhasil meraih juara pertama dalam Olimpiade Sains Nasional (OSN) tingkat SMA yang diadakan di Jakarta.

Prestasi ini tidak diraih dengan mudah. Butuh persiapan yang matang dan latihan yang intensif selama berbulan-bulan. Dengan bimbingan para ustadz dan ustadzah, santri tersebut berhasil mengalahkan ratusan peserta dari seluruh Indonesia.

Prestasi ini membuktikan bahwa pendidikan di pesantren tidak hanya fokus pada ilmu agama, tetapi juga mengembangkan kemampuan akademik santri secara menyeluruh. Pondok Pesantren Nizamuddin berkomitmen untuk terus mendukung dan memfasilitasi pengembangan potensi setiap santri.',
                'author' => 'Tim Akademik',
                'image_caption' => 'Santri penerima penghargaan Olimpiade Sains Nasional'
            ],
            [
                'title' => 'Kegiatan Outbound: Membangun Karakter dan Kerjasama Tim',
                'excerpt' => 'Para santri mengikuti kegiatan outbound yang bertujuan untuk membangun karakter, leadership, dan kerjasama tim.',
                'content' => 'Sebagai bagian dari program pengembangan karakter, Pondok Pesantren Nizamuddin mengadakan kegiatan outbound untuk seluruh santri. Kegiatan ini diadakan di area pegunungan yang sejuk dan asri.

Selama tiga hari dua malam, para santri mengikuti berbagai aktivitas yang menantang, seperti hiking, team building games, dan kegiatan alam lainnya. Kegiatan ini tidak hanya menyenangkan, tetapi juga sarat dengan nilai-nilai pendidikan karakter.

Melalui kegiatan outbound ini, para santri belajar tentang pentingnya kerjasama tim, kepemimpinan, dan tanggung jawab. Mereka juga belajar untuk lebih menghargai alam dan lingkungan sekitar.',
                'author' => 'Tim Kesiswaan',
                'image_caption' => 'Momen kegiatan outbound para santri di pegunungan'
            ],
            [
                'title' => 'Workshop Menulis: Mengembangkan Kreativitas Santri',
                'excerpt' => 'Pesantren mengadakan workshop menulis untuk mengembangkan minat dan bakat santri dalam bidang kepenulisan.',
                'content' => 'Pondok Pesantren Nizamuddin mengadakan workshop menulis yang diikuti oleh puluhan santri yang memiliki minat dalam bidang kepenulisan. Workshop ini menghadirkan penulis profesional sebagai narasumber.

Selama workshop, para santri belajar berbagai teknik menulis, mulai dari menulis artikel, cerpen, hingga puisi. Mereka juga diajarkan cara mengembangkan ide dan menuangkannya dalam tulisan yang menarik.

Workshop ini diharapkan dapat mengembangkan kreativitas santri dan memberikan wadah untuk mengekspresikan pemikiran mereka melalui tulisan. Beberapa karya terbaik dari workshop ini akan diterbitkan di majalah pesantren.',
                'author' => 'Tim Literasi',
                'image_caption' => 'Sesi workshop menulis yang diikuti para santri'
            ],
            [
                'title' => 'Kunjungan Studi: Belajar Langsung dari Praktisi',
                'excerpt' => 'Para santri melakukan kunjungan studi ke berbagai instansi untuk memperluas wawasan dan pengetahuan.',
                'content' => 'Sebagai bagian dari program pembelajaran yang komprehensif, Pondok Pesantren Nizamuddin mengadakan kunjungan studi untuk para santri. Kunjungan ini dilakukan ke berbagai instansi, mulai dari universitas, perusahaan, hingga lembaga pemerintahan.

Melalui kunjungan studi ini, para santri dapat belajar langsung dari praktisi di berbagai bidang. Mereka dapat melihat bagaimana ilmu yang dipelajari di pesantren diterapkan dalam kehidupan nyata.

Kunjungan studi ini sangat bermanfaat untuk memperluas wawasan santri dan memberikan gambaran tentang berbagai peluang karir yang dapat mereka pilih di masa depan.',
                'author' => 'Tim Kurikulum',
                'image_caption' => 'Santri saat kunjungan studi ke universitas'
            ],
            [
                'title' => 'Program Tahfidz: Menghafal Al-Quran dengan Metode Terbaik',
                'excerpt' => 'Pesantren memiliki program tahfidz yang telah terbukti efektif dalam membantu santri menghafal Al-Quran.',
                'content' => 'Pondok Pesantren Nizamuddin memiliki program tahfidz yang telah terbukti efektif dalam membantu santri menghafal Al-Quran. Program ini menggunakan metode yang telah disesuaikan dengan karakteristik dan kemampuan setiap santri.

Setiap santri yang mengikuti program tahfidz akan dibimbing oleh ustadz atau ustadzah yang berpengalaman. Mereka akan mendapatkan jadwal khusus untuk setoran hafalan dan evaluasi secara berkala.

Program ini tidak hanya fokus pada kuantitas hafalan, tetapi juga kualitas. Santri diajarkan untuk memahami makna ayat-ayat yang dihafal dan mengamalkannya dalam kehidupan sehari-hari.',
                'author' => 'Tim Tahfidz',
                'image_caption' => 'Sesi setoran hafalan Al-Quran para santri'
            ],
            [
                'title' => 'Festival Seni dan Budaya: Menampilkan Kreativitas Santri',
                'excerpt' => 'Festival seni dan budaya menjadi ajang bagi santri untuk menampilkan berbagai kreativitas mereka.',
                'content' => 'Pondok Pesantren Nizamuddin mengadakan Festival Seni dan Budaya yang diikuti oleh seluruh santri. Festival ini menjadi ajang untuk menampilkan berbagai kreativitas santri dalam bidang seni dan budaya.

Berbagai penampilan menarik ditampilkan dalam festival ini, mulai dari seni musik, tari, drama, hingga pameran karya seni. Setiap penampilan mencerminkan nilai-nilai Islam dan budaya Indonesia yang luhur.

Festival ini tidak hanya menjadi hiburan, tetapi juga sarana pendidikan karakter. Melalui seni dan budaya, para santri belajar untuk menghargai keindahan dan mengembangkan kreativitas mereka.',
                'author' => 'Tim Seni dan Budaya',
                'image_caption' => 'Penampilan seni tari dalam Festival Seni dan Budaya'
            ],
            [
                'title' => 'Program Beasiswa: Memberikan Kesempatan untuk Semua',
                'excerpt' => 'Pesantren membuka program beasiswa untuk memberikan kesempatan pendidikan kepada santri yang kurang mampu.',
                'content' => 'Pondok Pesantren Nizamuddin membuka program beasiswa untuk memberikan kesempatan pendidikan kepada santri yang kurang mampu secara ekonomi. Program ini diharapkan dapat membantu mengurangi beban finansial keluarga dan memberikan akses pendidikan yang lebih luas.

Beasiswa ini mencakup berbagai kebutuhan, mulai dari biaya pendidikan, asrama, hingga kebutuhan sehari-hari. Seleksi beasiswa dilakukan secara transparan dan objektif berdasarkan kriteria yang telah ditetapkan.

Program beasiswa ini merupakan bentuk komitmen pesantren untuk memberikan pendidikan yang berkualitas kepada semua lapisan masyarakat, tanpa memandang latar belakang ekonomi.',
                'author' => 'Tim Beasiswa',
                'image_caption' => 'Sosialisasi program beasiswa kepada calon santri'
            ],
            [
                'title' => 'Kerjasama dengan Universitas: Membuka Peluang Karir',
                'excerpt' => 'Pesantren menjalin kerjasama dengan berbagai universitas untuk membuka peluang karir yang lebih luas bagi santri.',
                'content' => 'Pondok Pesantren Nizamuddin menjalin kerjasama dengan berbagai universitas terkemuka di Indonesia. Kerjasama ini bertujuan untuk membuka peluang karir yang lebih luas bagi para santri setelah lulus dari pesantren.

Melalui kerjasama ini, para santri dapat mengakses berbagai program, mulai dari jalur khusus penerimaan mahasiswa baru, beasiswa, hingga program magang. Hal ini memberikan keuntungan tersendiri bagi santri yang ingin melanjutkan pendidikan ke jenjang yang lebih tinggi.

Kerjasama ini juga menjadi bukti bahwa pendidikan pesantren diakui dan dihargai oleh lembaga pendidikan tinggi. Ini menunjukkan bahwa santri memiliki kompetensi yang setara dengan lulusan sekolah umum.',
                'author' => 'Tim Kerjasama',
                'image_caption' => 'Penandatanganan MoU dengan universitas mitra'
            ],
            [
                'title' => 'Program Kesehatan: Menjaga Kesehatan Santri',
                'excerpt' => 'Pesantren memiliki program kesehatan yang komprehensif untuk menjaga kesehatan fisik dan mental santri.',
                'content' => 'Pondok Pesantren Nizamuddin memiliki program kesehatan yang komprehensif untuk menjaga kesehatan fisik dan mental seluruh santri. Program ini mencakup berbagai aspek, mulai dari pemeriksaan kesehatan rutin, vaksinasi, hingga program olahraga teratur.

Selain itu, pesantren juga memiliki klinik kesehatan yang dilengkapi dengan tenaga medis profesional. Klinik ini siap melayani kebutuhan kesehatan santri 24 jam sehari.

Program kesehatan ini menunjukkan komitmen pesantren untuk tidak hanya fokus pada pendidikan akademik dan agama, tetapi juga pada kesejahteraan fisik dan mental setiap santri. Kesehatan yang baik akan mendukung proses pembelajaran yang optimal.',
                'author' => 'Tim Kesehatan',
                'image_caption' => 'Pemeriksaan kesehatan rutin para santri'
            ]
        ];

        foreach ($newsData as $index => $data) {
            $news = News::create([
                'category_id' => $category->id,
                'user_id' => $user->id,
                'author' => $data['author'],
                'title' => $data['title'],
                'slug' => Str::slug($data['title']) . '-' . ($index + 1),
                'excerpt' => $data['excerpt'],
                'content' => $data['content'],
                'image_caption' => $data['image_caption'],
                'is_published' => true,
                'is_pinned' => $index < 2, // Pin 2 berita pertama
                'allow_comments' => true,
                'published_at' => now()->subDays(10 - $index), // Berita terbaru sampai 10 hari lalu
                'views' => rand(50, 500),
            ]);

            $this->command->info("Created news: {$news->title}");
        }

        $this->command->info('Successfully created 10 news articles!');
    }
}
