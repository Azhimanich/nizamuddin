<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\OrganizationStructure;

class OrganizationStructureSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Clear existing structures
        OrganizationStructure::truncate();

        // Level 1: Pimpinan Tertinggi
        $pimpinan = OrganizationStructure::create([
            'name' => 'KH. Ahmad Nizamuddin',
            'position' => 'Pimpinan Pondok Pesantren',
            'level' => 1,
            'order' => 1,
            'parent_id' => null,
            'bio_id' => 'Pimpinan Pondok Pesantren Nizamuddin yang telah memimpin pesantren selama puluhan tahun dengan dedikasi tinggi dalam pendidikan Islam.',
            'bio_en' => 'Leader of Nizamuddin Islamic Boarding School who has led the pesantren for decades with high dedication to Islamic education.',
            'bio_ar' => 'قائد معهد نظام الدين الإسلامي الذي قاد المعهد لعقود من الزمن بتفانٍ عالٍ في التعليم الإسلامي.',
            'email' => 'pimpinan@nizamuddin.sch.id',
            'phone' => '081234567890',
            'is_active' => true,
        ]);

        // Level 2: Wakil Pimpinan
        $wakil1 = OrganizationStructure::create([
            'name' => 'KH. Muhammad Fauzan',
            'position' => 'Wakil Pimpinan Bidang Pendidikan',
            'level' => 2,
            'order' => 1,
            'parent_id' => $pimpinan->id,
            'bio_id' => 'Wakil Pimpinan yang mengelola bidang pendidikan dan kurikulum pesantren.',
            'bio_en' => 'Deputy Leader managing education and curriculum of the pesantren.',
            'bio_ar' => 'نائب القائد الذي يدير التعليم والمناهج الدراسية للمعهد.',
            'email' => 'wakil.pendidikan@nizamuddin.sch.id',
            'phone' => '081234567891',
            'is_active' => true,
        ]);

        $wakil2 = OrganizationStructure::create([
            'name' => 'KH. Abdul Rahman',
            'position' => 'Wakil Pimpinan Bidang Administrasi',
            'level' => 2,
            'order' => 2,
            'parent_id' => $pimpinan->id,
            'bio_id' => 'Wakil Pimpinan yang mengelola bidang administrasi dan keuangan pesantren.',
            'bio_en' => 'Deputy Leader managing administration and finance of the pesantren.',
            'bio_ar' => 'نائب القائد الذي يدير الإدارة والمالية للمعهد.',
            'email' => 'wakil.admin@nizamuddin.sch.id',
            'phone' => '081234567892',
            'is_active' => true,
        ]);

        // Level 3: Kepala Divisi
        OrganizationStructure::create([
            'name' => 'Ust. Ahmad Hidayat',
            'position' => 'Kepala Divisi Tahfidz',
            'level' => 3,
            'order' => 1,
            'parent_id' => $wakil1->id,
            'bio_id' => 'Kepala Divisi Tahfidz yang mengelola program hafalan Al-Quran.',
            'bio_en' => 'Head of Tahfidz Division managing Quran memorization programs.',
            'bio_ar' => 'رئيس قسم التحفيظ الذي يدير برامج حفظ القرآن.',
            'email' => 'tahfidz@nizamuddin.sch.id',
            'phone' => '081234567893',
            'is_active' => true,
        ]);

        OrganizationStructure::create([
            'name' => 'Ust. Muhammad Zain',
            'position' => 'Kepala Divisi Bahasa Arab',
            'level' => 3,
            'order' => 2,
            'parent_id' => $wakil1->id,
            'bio_id' => 'Kepala Divisi Bahasa Arab yang mengelola program pembelajaran bahasa Arab.',
            'bio_en' => 'Head of Arabic Language Division managing Arabic language learning programs.',
            'bio_ar' => 'رئيس قسم اللغة العربية الذي يدير برامج تعلم اللغة العربية.',
            'email' => 'bahasa@nizamuddin.sch.id',
            'phone' => '081234567894',
            'is_active' => true,
        ]);

        OrganizationStructure::create([
            'name' => 'Ust. Abdullah',
            'position' => 'Kepala Divisi Keuangan',
            'level' => 3,
            'order' => 1,
            'parent_id' => $wakil2->id,
            'bio_id' => 'Kepala Divisi Keuangan yang mengelola keuangan pesantren.',
            'bio_en' => 'Head of Finance Division managing pesantren finances.',
            'bio_ar' => 'رئيس قسم المالية الذي يدير أموال المعهد.',
            'email' => 'keuangan@nizamuddin.sch.id',
            'phone' => '081234567895',
            'is_active' => true,
        ]);

        OrganizationStructure::create([
            'name' => 'Ust. Hasan',
            'position' => 'Kepala Divisi SDM',
            'level' => 3,
            'order' => 2,
            'parent_id' => $wakil2->id,
            'bio_id' => 'Kepala Divisi SDM yang mengelola sumber daya manusia pesantren.',
            'bio_en' => 'Head of Human Resources Division managing pesantren human resources.',
            'bio_ar' => 'رئيس قسم الموارد البشرية الذي يدير الموارد البشرية للمعهد.',
            'email' => 'sdm@nizamuddin.sch.id',
            'phone' => '081234567896',
            'is_active' => true,
        ]);

        $this->command->info('Organization structure dummy data created successfully!');
    }
}
