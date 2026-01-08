<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Photo;
use App\Models\Video;
use App\Models\Album;

class GallerySeeder extends Seeder
{
    public function run(): void
    {
        // Create albums first
        $albums = [
            [
                'name' => 'Kegiatan Pesantren',
                'description' => 'Dokumentasi kegiatan rutin dan acara pesantren',
                'cover_image' => 'albums/kegiatan-cover.jpg',
                'date' => '2024-01-01',
                'order' => 1,
                'is_active' => true,
            ],
            [
                'name' => 'Fasilitas',
                'description' => 'Foto fasilitas dan infrastruktur pesantren',
                'cover_image' => 'albums/fasilitas-cover.jpg',
                'date' => '2024-01-01',
                'order' => 2,
                'is_active' => true,
            ],
        ];

        foreach ($albums as $album) {
            Album::create($album);
        }

        // Create photos
        $photos = [
            [
                'album_id' => 1,
                'title' => 'Upacara Bendera Hari Senin',
                'description' => 'Kegiatan upacara bendera rutin setiap hari Senin yang diikuti oleh seluruh santri dan guru.',
                'image' => 'gallery/upacara-bendera.jpg',
                'order' => 1,
                'is_active' => true,
            ],
            [
                'album_id' => 1,
                'title' => 'Kelas Tahfidz',
                'description' => 'Santri sedang mengikuti kelas tahfidz Al-Quran dengan ustadz pengajar.',
                'image' => 'gallery/kelas-tahfidz.jpg',
                'order' => 2,
                'is_active' => true,
            ],
            [
                'album_id' => 2,
                'title' => 'Laboratorium Komputer',
                'description' => 'Santri sedang belajar di laboratorium komputer untuk mendukung pembelajaran teknologi.',
                'image' => 'gallery/lab-komputer.jpg',
                'order' => 1,
                'is_active' => true,
            ],
            [
                'album_id' => 2,
                'title' => 'Perpustakaan Pesantren',
                'description' => 'Suasana perpustakaan yang nyaman untuk mendukung kegiatan belajar santri.',
                'image' => 'gallery/perpustakaan.jpg',
                'order' => 2,
                'is_active' => true,
            ],
            [
                'album_id' => 2,
                'title' => 'Lapangan Olahraga',
                'description' => 'Fasilitas lapangan olahraga untuk kegiatan ekstrakurikuler futsal dan basket.',
                'image' => 'gallery/lapangan-olahraga.jpg',
                'order' => 3,
                'is_active' => true,
            ],
            [
                'album_id' => 2,
                'title' => 'Asrama Santri Putra',
                'description' => 'Kondisi asrama santri putra yang bersih dan nyaman untuk tempat istirahat.',
                'image' => 'gallery/asrama-putra.jpg',
                'order' => 4,
                'is_active' => true,
            ],
            [
                'album_id' => 2,
                'title' => 'Masjid Jami',
                'description' => 'Masjid Jami Pondok Pesantren Nizamuddin yang menjadi pusat kegiatan spiritual.',
                'image' => 'gallery/masjid.jpg',
                'order' => 5,
                'is_active' => true,
            ],
        ];

        foreach ($photos as $photo) {
            Photo::create($photo);
        }

        // Create videos
        $videos = [
            [
                'title' => 'Profil Pondok Pesantren Nizamuddin',
                'description' => 'Video profil singkat Pondok Pesantren Nizamuddin dan fasilitas yang dimiliki.',
                'youtube_id' => 'example1',
                'thumbnail' => 'gallery/thumbnails/profil-pesantren.jpg',
                'duration' => 330, // 5:30 in seconds
                'order' => 1,
                'is_active' => true,
            ],
            [
                'title' => 'Wisuda Santri Angkatan ke-15',
                'description' => 'Dokumentasi acara wisuda santri angkatan ke-15 tahun ajaran 2023/2024.',
                'youtube_id' => 'example2',
                'thumbnail' => 'gallery/thumbnails/wisuda-15.jpg',
                'duration' => 765, // 12:45 in seconds
                'order' => 2,
                'is_active' => true,
            ],
            [
                'title' => 'Haflah Akhirussanah 2024',
                'description' => 'Penampilan santri dalam acara Haflah Akhirussanah tahun 2024.',
                'youtube_id' => 'example3',
                'thumbnail' => 'gallery/thumbnails/haflah-2024.jpg',
                'duration' => 500, // 8:20 in seconds
                'order' => 3,
                'is_active' => true,
            ],
            [
                'title' => 'Tutorial Wudhu dan Shalat',
                'description' => 'Video tutorial wudhu dan shalat yang benar untuk santri pemula.',
                'youtube_id' => 'example4',
                'thumbnail' => 'gallery/thumbnails/tutorial-wudhu.jpg',
                'duration' => 615, // 10:15 in seconds
                'order' => 4,
                'is_active' => true,
            ],
        ];

        foreach ($videos as $video) {
            Video::create($video);
        }

        $this->command->info('Gallery data seeded successfully!');
    }
}
