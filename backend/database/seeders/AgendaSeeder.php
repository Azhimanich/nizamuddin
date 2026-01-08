<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Agenda;
use App\Models\Category;

class AgendaSeeder extends Seeder
{
    public function run(): void
    {
        $agendas = [
            [
                'title' => 'Penerimaan Santri Baru Tahun Ajaran 2024/2025',
                'description' => 'Pondok Pesantren Nizamuddin membuka pendaftaran santri baru untuk tahun ajaran 2024/2025. Pendaftaran dibuka mulai 1 Januari hingga 31 Maret 2024. Persyaratan lengkap dapat diunduh di website resmi pesantren.',
                'date' => '2024-01-15',
                'time' => '08:00:00',
                'location' => 'Aula Pondok Pesantren Nizamuddin',
                'image' => 'agenda/psb-2024.jpg',
                'google_calendar_link' => 'https://calendar.google.com/event?action=TEMPLATE&dates=20240115T010000Z/20240115T030000Z',
                'is_active' => true,
            ],
            [
                'title' => 'Wisuda Santri Angkatan ke-15',
                'description' => 'Acara wisuda santri angkatan ke-15 akan dilaksanakan pada tanggal 20 Juni 2024. Acara akan dihadiri oleh orang tua/wali santri, tamu undangan, dan seluruh warga pesantren.',
                'date' => '2024-06-20',
                'time' => '09:00:00',
                'location' => 'Lapangan Olahraga Pondok Pesantren Nizamuddin',
                'image' => 'agenda/wisuda-15.jpg',
                'google_calendar_link' => 'https://calendar.google.com/event?action=TEMPLATE&dates=20240620T020000Z/20240620T040000Z',
                'is_active' => true,
            ],
            [
                'title' => 'Haflah Akhirussanah',
                'description' => 'Haflah Akhirussanah sebagai penutupan tahun ajaran 2023/2024. Acara akan menampilkan performa santri dalam bidang tahfidz, pidato bahasa Arab, dan seni islam.',
                'date' => '2024-06-15',
                'time' => '19:00:00',
                'location' => 'Aula Pondok Pesantren Nizamuddin',
                'image' => 'agenda/haflah-2024.jpg',
                'google_calendar_link' => 'https://calendar.google.com/event?action=TEMPLATE&dates=20240615T120000Z/20240615T140000Z',
                'is_active' => true,
            ],
            [
                'title' => 'Lomba Tahfidz Antar Pondok',
                'description' => 'Pondok Pesantren Nizamuddin akan menyelenggarakan lomba tahfidz antar pondok pesantren se-Jawa Barat. Lomba terbuka untuk kategori 1 juz, 5 juz, 10 juz, dan 30 juz.',
                'date' => '2024-03-10',
                'time' => '08:00:00',
                'location' => 'Masjid Jami Pondok Pesantren Nizamuddin',
                'image' => 'agenda/lomba-tahfidz.jpg',
                'google_calendar_link' => 'https://calendar.google.com/event?action=TEMPLATE&dates=20240310T010000Z/20240310T030000Z',
                'is_active' => true,
            ],
            [
                'title' => 'Parenting Day',
                'description' => 'Acara Parenting Day untuk orang tua/wali santri dengan tema "Membangun Generasi Qurani di Era Digital". Akan hadir pembicara dari psikolog anak dan pakar pendidikan Islam.',
                'date' => '2024-02-25',
                'time' => '08:30:00',
                'location' => 'Aula Pondok Pesantren Nizamuddin',
                'image' => 'agenda/parenting-day.jpg',
                'google_calendar_link' => 'https://calendar.google.com/event?action=TEMPLATE&dates=20240225T013000Z/20240225T033000Z',
                'is_active' => true,
            ],
        ];

        foreach ($agendas as $agenda) {
            Agenda::create($agenda);
        }

        $this->command->info('Agenda data seeded successfully!');
    }
}
