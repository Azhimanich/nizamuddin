<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\DailySchedule;

class DailyScheduleSeeder extends Seeder
{
    public function run(): void
    {
        // TK Daily Schedules
        $tkSchedules = [
            ['start_time' => '07:00:00', 'end_time' => '07:30:00', 'activity_id' => 'Kedatangan & Salat Dhuha', 'activity_en' => 'Arrival & Dhuha Prayer', 'activity_ar' => 'الوصول وصلاة الضحى', 'order' => 1],
            ['start_time' => '07:30:00', 'end_time' => '08:00:00', 'activity_id' => 'Sarapan Pagi', 'activity_en' => 'Breakfast', 'activity_ar' => 'الفطار الصباحي', 'order' => 2],
            ['start_time' => '08:00:00', 'end_time' => '09:00:00', 'activity_id' => 'Circle Time & Bahasa', 'activity_en' => 'Circle Time & Language', 'activity_ar' => 'وقت الحلقة واللغة', 'order' => 3],
            ['start_time' => '09:00:00', 'end_time' => '10:00:00', 'activity_id' => 'Matematika & Logika', 'activity_en' => 'Mathematics & Logic', 'activity_ar' => 'الرياضيات والمنطق', 'order' => 4],
            ['start_time' => '10:00:00', 'end_time' => '10:30:00', 'activity_id' => 'Snack & Istirahat', 'activity_en' => 'Snack & Break', 'activity_ar' => 'وجبة خفيفة واستراحة', 'order' => 5],
            ['start_time' => '10:30:00', 'end_time' => '11:30:00', 'activity_id' => 'Seni & Kreativitas', 'activity_en' => 'Arts & Creativity', 'activity_ar' => 'الفن والإبداع', 'order' => 6],
            ['start_time' => '11:30:00', 'end_time' => '12:00:00', 'activity_id' => 'Motorik Halus', 'activity_en' => 'Fine Motor Skills', 'activity_ar' => ' المهارات الحركية الدقيقة', 'order' => 7],
            ['start_time' => '12:00:00', 'end_time' => '13:00:00', 'activity_id' => 'Makan Siang & Salat Zuhur', 'activity_en' => 'Lunch & Zuhur Prayer', 'activity_ar' => 'الغداء وصلاة الظهر', 'order' => 8],
            ['start_time' => '13:00:00', 'end_time' => '14:00:00', 'activity_id' => 'Tidur Siang', 'activity_en' => 'Nap Time', 'activity_ar' => 'قيلولة', 'order' => 9],
            ['start_time' => '14:00:00', 'end_time' => '15:00:00', 'activity_id' => 'Outdoor Play', 'activity_en' => 'Outdoor Play', 'activity_ar' => 'اللعب في الهواء الطلق', 'order' => 10],
            ['start_time' => '15:00:00', 'end_time' => '15:30:00', 'activity_id' => 'Story Time', 'activity_en' => 'Story Time', 'activity_ar' => 'وقت القصة', 'order' => 11],
            ['start_time' => '15:30:00', 'end_time' => '16:00:00', 'activity_id' => 'Persiapan Pulang', 'activity_en' => 'Preparation for Home', 'activity_ar' => 'الاستعداد للعودة', 'order' => 12],
        ];

        // SD Daily Schedules
        $sdSchedules = [
            ['start_time' => '06:30:00', 'end_time' => '07:00:00', 'activity_id' => 'Kedatangan & Salat Dhuha', 'activity_en' => 'Arrival & Dhuha Prayer', 'activity_ar' => 'الوصول وصلاة الضحى', 'order' => 1],
            ['start_time' => '07:00:00', 'end_time' => '07:30:00', 'activity_id' => 'Tadarus Al-Quran', 'activity_en' => 'Quran Recitation', 'activity_ar' => 'تجويد القرآن', 'order' => 2],
            ['start_time' => '07:30:00', 'end_time' => '08:00:00', 'activity_id' => 'Sarapan Pagi', 'activity_en' => 'Breakfast', 'activity_ar' => 'الفطار الصباحي', 'order' => 3],
            ['start_time' => '08:00:00', 'end_time' => '09:30:00', 'activity_id' => 'Matematika', 'activity_en' => 'Mathematics', 'activity_ar' => 'الرياضيات', 'order' => 4],
            ['start_time' => '09:30:00', 'end_time' => '10:00:00', 'activity_id' => 'Istirahat', 'activity_en' => 'Break', 'activity_ar' => 'استراحة', 'order' => 5],
            ['start_time' => '10:00:00', 'end_time' => '11:30:00', 'activity_id' => 'Bahasa Indonesia', 'activity_en' => 'Indonesian Language', 'activity_ar' => 'لغة إندونيسيا', 'order' => 6],
            ['start_time' => '11:30:00', 'end_time' => '12:00:00', 'activity_id' => 'Bahasa Arab', 'activity_en' => 'Arabic Language', 'activity_ar' => 'اللغة العربية', 'order' => 7],
            ['start_time' => '12:00:00', 'end_time' => '13:00:00', 'activity_id' => 'Makan Siang & Salat Zuhur', 'activity_en' => 'Lunch & Zuhur Prayer', 'activity_ar' => 'الغداء وصلاة الظهر', 'order' => 8],
            ['start_time' => '13:00:00', 'end_time' => '14:30:00', 'activity_id' => 'IPA', 'activity_en' => 'Science', 'activity_ar' => 'العلوم', 'order' => 9],
            ['start_time' => '14:30:00', 'end_time' => '16:00:00', 'activity_id' => 'IPS & Sejarah', 'activity_en' => 'Social Studies & History', 'activity_ar' => 'الدراسات الاجتماعية والتاريخ', 'order' => 10],
            ['start_time' => '16:00:00', 'end_time' => '16:30:00', 'activity_id' => 'Ekstrakurikuler', 'activity_en' => 'Extracurricular', 'activity_ar' => 'الأنشطة اللامنهجية', 'order' => 11],
            ['start_time' => '16:30:00', 'end_time' => '17:00:00', 'activity_id' => 'Persiapan Pulang', 'activity_en' => 'Preparation for Home', 'activity_ar' => 'الاستعداد للعودة', 'order' => 12],
        ];

        // SMP Daily Schedules
        $smpSchedules = [
            ['start_time' => '06:00:00', 'end_time' => '06:30:00', 'activity_id' => 'Kedatangan & Salat Subuh', 'activity_en' => 'Arrival & Subuh Prayer', 'activity_ar' => 'الوصول وصلاة الفجر', 'order' => 1],
            ['start_time' => '06:30:00', 'end_time' => '07:00:00', 'activity_id' => 'Tadarus Al-Quran', 'activity_en' => 'Quran Recitation', 'activity_ar' => 'تجويد القرآن', 'order' => 2],
            ['start_time' => '07:00:00', 'end_time' => '07:30:00', 'activity_id' => 'Sarapan Pagi', 'activity_en' => 'Breakfast', 'activity_ar' => 'الفطار الصباحي', 'order' => 3],
            ['start_time' => '07:30:00', 'end_time' => '09:00:00', 'activity_id' => 'Matematika', 'activity_en' => 'Mathematics', 'activity_ar' => 'الرياضيات', 'order' => 4],
            ['start_time' => '09:00:00', 'end_time' => '09:30:00', 'activity_id' => 'Istirahat', 'activity_en' => 'Break', 'activity_ar' => 'استراحة', 'order' => 5],
            ['start_time' => '09:30:00', 'end_time' => '11:00:00', 'activity_id' => 'Fisika', 'activity_en' => 'Physics', 'activity_ar' => 'الفيزياء', 'order' => 6],
            ['start_time' => '11:00:00', 'end_time' => '12:30:00', 'activity_id' => 'Bahasa Inggris', 'activity_en' => 'English Language', 'activity_ar' => 'اللغة الإنجليزية', 'order' => 7],
            ['start_time' => '12:30:00', 'end_time' => '13:30:00', 'activity_id' => 'Makan Siang & Salat Zuhur', 'activity_en' => 'Lunch & Zuhur Prayer', 'activity_ar' => 'الغداء وصلاة الظهر', 'order' => 8],
            ['start_time' => '13:30:00', 'end_time' => '15:00:00', 'activity_id' => 'Kimia', 'activity_en' => 'Chemistry', 'activity_ar' => 'الكيمياء', 'order' => 9],
            ['start_time' => '15:00:00', 'end_time' => '16:30:00', 'activity_id' => 'Biologi', 'activity_en' => 'Biology', 'activity_ar' => 'علم الأحياء', 'order' => 10],
            ['start_time' => '16:30:00', 'end_time' => '17:30:00', 'activity_id' => 'Ekstrakurikuler', 'activity_en' => 'Extracurricular', 'activity_ar' => 'الأنشطة اللامنهجية', 'order' => 11],
            ['start_time' => '17:30:00', 'end_time' => '18:00:00', 'activity_id' => 'Persiapan Pulang', 'activity_en' => 'Preparation for Home', 'activity_ar' => 'الاستعداد للعودة', 'order' => 12],
        ];

        // Kepondokan Daily Schedules
        $kepondokanSchedules = [
            ['start_time' => '04:30:00', 'end_time' => '05:00:00', 'activity_id' => 'Bangun Tahajud', 'activity_en' => 'Wake up for Tahajud', 'activity_ar' => 'الاستيقاظ لصلاة التهجد', 'order' => 1],
            ['start_time' => '05:00:00', 'end_time' => '06:00:00', 'activity_id' => 'Salat Subuh & Quran', 'activity_en' => 'Subuh Prayer & Quran', 'activity_ar' => 'صلاة الفجر والقرآن', 'order' => 2],
            ['start_time' => '06:00:00', 'end_time' => '07:00:00', 'activity_id' => 'Olahraga Pagi', 'activity_en' => 'Morning Exercise', 'activity_ar' => 'تمرين الصباح', 'order' => 3],
            ['start_time' => '07:00:00', 'end_time' => '07:30:00', 'activity_id' => 'Bersih-bersih', 'activity_en' => 'Cleaning', 'activity_ar' => 'التنظيف', 'order' => 4],
            ['start_time' => '07:30:00', 'end_time' => '08:00:00', 'activity_id' => 'Sarapan Pagi', 'activity_en' => 'Breakfast', 'activity_ar' => 'الفطار الصباحي', 'order' => 5],
            ['start_time' => '08:00:00', 'end_time' => '10:00:00', 'activity_id' => 'Kitab Kuning (Fikih)', 'activity_en' => 'Islamic Studies (Fiqh)', 'activity_ar' => 'دراسة الكتب الأصفر (الفقه)', 'order' => 6],
            ['start_time' => '10:00:00', 'end_time' => '10:30:00', 'activity_id' => 'Istirahat', 'activity_en' => 'Break', 'activity_ar' => 'استراحة', 'order' => 7],
            ['start_time' => '10:30:00', 'end_time' => '12:00:00', 'activity_id' => 'Kitab Kuning (Tauhid)', 'activity_en' => 'Islamic Studies (Tauhid)', 'activity_ar' => 'دراسة الكتب الأصفر (التوحيد)', 'order' => 8],
            ['start_time' => '12:00:00', 'end_time' => '13:00:00', 'activity_id' => 'Makan Siang & Salat Zuhur', 'activity_en' => 'Lunch & Zuhur Prayer', 'activity_ar' => 'الغداء وصلاة الظهر', 'order' => 9],
            ['start_time' => '13:00:00', 'end_time' => '15:00:00', 'activity_id' => 'Kitab Kuning (Hadits)', 'activity_en' => 'Islamic Studies (Hadith)', 'activity_ar' => 'دراسة الكتب الأصفر (الحديث)', 'order' => 10],
            ['start_time' => '15:00:00', 'end_time' => '16:00:00', 'activity_id' => 'Bahasa Arab', 'activity_en' => 'Arabic Language', 'activity_ar' => 'اللغة العربية', 'order' => 11],
            ['start_time' => '16:00:00', 'end_time' => '17:00:00', 'activity_id' => 'Salat Ashar & Istirahat', 'activity_en' => 'Ashar Prayer & Rest', 'activity_ar' => 'صلاة العصر واستراحة', 'order' => 12],
            ['start_time' => '17:00:00', 'end_time' => '18:30:00', 'activity_id' => 'Kitab Kuning (Nahwu)', 'activity_en' => 'Islamic Studies (Grammar)', 'activity_ar' => 'دراسة الكتب الأصفر (النحو)', 'order' => 13],
            ['start_time' => '18:30:00', 'end_time' => '19:00:00', 'activity_id' => 'Makan Malam', 'activity_en' => 'Dinner', 'activity_ar' => 'العشاء', 'order' => 14],
            ['start_time' => '19:00:00', 'end_time' => '20:00:00', 'activity_id' => 'Salat Magrib & Quran', 'activity_en' => 'Magrib Prayer & Quran', 'activity_ar' => 'صلاة المغرب والقرآن', 'order' => 15],
            ['start_time' => '20:00:00', 'end_time' => '21:00:00', 'activity_id' => 'Salat Isya & Muhasabah', 'activity_en' => 'Isya Prayer & Reflection', 'activity_ar' => 'صلاة العشاء والمحاسبة', 'order' => 16],
            ['start_time' => '21:00:00', 'end_time' => '22:00:00', 'activity_id' => 'Waktu Istirahat', 'activity_en' => 'Rest Time', 'activity_ar' => 'وقت الراحة', 'order' => 17],
            ['start_time' => '22:00:00', 'end_time' => '04:30:00', 'activity_id' => 'Tidur Malam', 'activity_en' => 'Night Sleep', 'activity_ar' => 'النوم الليلي', 'order' => 18],
        ];

        // Insert TK schedules
        foreach ($tkSchedules as $schedule) {
            DailySchedule::create(array_merge($schedule, [
                'school_type' => 'tk',
                'is_active' => true
            ]));
        }

        // Insert SD schedules
        foreach ($sdSchedules as $schedule) {
            DailySchedule::create(array_merge($schedule, [
                'school_type' => 'sd',
                'is_active' => true
            ]));
        }

        // Insert SMP schedules
        foreach ($smpSchedules as $schedule) {
            DailySchedule::create(array_merge($schedule, [
                'school_type' => 'smp',
                'is_active' => true
            ]));
        }

        // Insert Kepondokan schedules
        foreach ($kepondokanSchedules as $schedule) {
            DailySchedule::create(array_merge($schedule, [
                'school_type' => 'kepondokan',
                'is_active' => true
            ]));
        }

        $this->command->info('Daily schedules seeded successfully!');
    }
}
