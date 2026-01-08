<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Contact;

class ContactSeeder extends Seeder
{
    public function run(): void
    {
        $contacts = [
            [
                'name' => 'Ahmad Fauzi',
                'email' => 'ahmad.fauzi@email.com',
                'phone' => '08123456789',
                'subject' => 'Informasi PSB',
                'message' => 'Saya ingin bertanya mengenai pendaftaran santri baru untuk tahun ajaran 2024/2025. Apakah masih ada kuota?',
                'is_read' => false,
            ],
            [
                'name' => 'Siti Nurhaliza',
                'email' => 'siti.nurhaliza@email.com',
                'phone' => '08234567890',
                'subject' => 'Kunjungan Pesantren',
                'message' => 'Kami ingin mengajak anak kami untuk berkunjung ke pesantren sebelum mendaftar. Bagaimana prosedurnya?',
                'is_read' => false,
            ],
            [
                'name' => 'Budi Santoso',
                'email' => 'budi.santoso@email.com',
                'phone' => '08345678901',
                'subject' => 'Program Beasiswa',
                'message' => 'Apakah pesantren menyediakan program beasiswa untuk santri yang kurang mampu?',
                'is_read' => true,
            ],
            [
                'name' => 'Dewi Lestari',
                'email' => 'dewi.lestari@email.com',
                'phone' => '08456789012',
                'subject' => 'Fasilitas Asrama',
                'message' => 'Bagaimana kondisi fasilitas asrama untuk santri putri? Apakah sudah lengkap?',
                'is_read' => false,
            ],
            [
                'name' => 'Eko Prasetyo',
                'email' => 'eko.prasetyo@email.com',
                'phone' => '08567890123',
                'subject' => 'Kurikulum',
                'message' => 'Saya ingin menanyakan mengenai kurikulum yang digunakan di pesantren. Apakah sudah sesuai dengan kurikulum nasional?',
                'is_read' => true,
            ],
        ];

        foreach ($contacts as $contact) {
            Contact::create($contact);
        }

        $this->command->info('Contact data seeded successfully!');
    }
}
