<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\AcademicCalendar;

class AcademicCalendarSeeder extends Seeder
{
    public function run(): void
    {
        $events = [
            // TK Events
            [
                'title' => 'Apel Tahunan',
                'start_date' => '2025-12-27',
                'end_date' => '2026-01-02',
                'type' => 'activity',
                'school_type' => 'tk',
                'description' => 'Apel tahunan untuk semua siswa TK',
                'order' => 1,
            ],
            [
                'title' => 'Libur Semester',
                'start_date' => '2026-01-01',
                'end_date' => '2026-01-10',
                'type' => 'holiday',
                'school_type' => 'tk',
                'description' => 'Libur semester ganjil',
                'order' => 2,
            ],
            [
                'title' => 'Ujian Tengah Semester',
                'start_date' => '2026-02-15',
                'end_date' => '2026-02-20',
                'type' => 'exam',
                'school_type' => 'tk',
                'description' => 'Ujian tengah semester genap',
                'order' => 3,
            ],

            // SD Events
            [
                'title' => 'Apel Tahunan',
                'start_date' => '2025-12-27',
                'end_date' => '2026-01-02',
                'type' => 'activity',
                'school_type' => 'sd',
                'description' => 'Apel tahunan untuk semua siswa SD',
                'order' => 1,
            ],
            [
                'title' => 'Libur Semester',
                'start_date' => '2026-01-01',
                'end_date' => '2026-01-10',
                'type' => 'holiday',
                'school_type' => 'sd',
                'description' => 'Libur semester ganjil',
                'order' => 2,
            ],
            [
                'title' => 'Ujian Tengah Semester',
                'start_date' => '2026-02-15',
                'end_date' => '2026-02-20',
                'type' => 'exam',
                'school_type' => 'sd',
                'description' => 'Ujian tengah semester genap',
                'order' => 3,
            ],

            // SMP Events
            [
                'title' => 'Apel Tahunan',
                'start_date' => '2025-12-27',
                'end_date' => '2026-01-02',
                'type' => 'activity',
                'school_type' => 'smp',
                'description' => 'Apel tahunan untuk semua siswa SMP',
                'order' => 1,
            ],
            [
                'title' => 'Libur Semester',
                'start_date' => '2026-01-01',
                'end_date' => '2026-01-10',
                'type' => 'holiday',
                'school_type' => 'smp',
                'description' => 'Libur semester ganjil',
                'order' => 2,
            ],
            [
                'title' => 'Ujian Tengah Semester',
                'start_date' => '2026-02-15',
                'end_date' => '2026-02-20',
                'type' => 'exam',
                'school_type' => 'smp',
                'description' => 'Ujian tengah semester genap',
                'order' => 3,
            ],

            // Kepondokan Events
            [
                'title' => 'Apel Tahunan',
                'start_date' => '2025-12-27',
                'end_date' => '2026-01-02',
                'type' => 'activity',
                'school_type' => 'kepondokan',
                'description' => 'Apel tahunan untuk semua santri',
                'order' => 1,
            ],
            [
                'title' => 'Libur Semester',
                'start_date' => '2026-01-01',
                'end_date' => '2026-01-10',
                'type' => 'holiday',
                'school_type' => 'kepondokan',
                'description' => 'Libur semester ganjil',
                'order' => 2,
            ],
            [
                'title' => 'Ujian Tahfidz',
                'start_date' => '2026-02-10',
                'end_date' => '2026-02-15',
                'type' => 'exam',
                'school_type' => 'kepondokan',
                'description' => 'Ujian hafalan Al-Quran',
                'order' => 3,
            ],
        ];

        foreach ($events as $event) {
            AcademicCalendar::create($event);
        }
    }
}
