<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\ContactInformation;

class ContactInformationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $contactInfo = [
            [
                'type' => 'address',
                'value_id' => "Jl. Pesantren Nizamuddin No. 123\nJakarta, Indonesia",
                'value_en' => "Jl. Pesantren Nizamuddin No. 123\nJakarta, Indonesia",
                'value_ar' => "Jl. Pesantren Nizamuddin No. 123\nJakarta, Indonesia",
                'order' => 1,
                'is_active' => true,
            ],
            [
                'type' => 'phone',
                'value_id' => '+62 123 456 789',
                'value_en' => '+62 123 456 789',
                'value_ar' => '+62 123 456 789',
                'order' => 2,
                'is_active' => true,
            ],
            [
                'type' => 'email',
                'value_id' => 'info@pesantrennizamuddin.com',
                'value_en' => 'info@pesantrennizamuddin.com',
                'value_ar' => 'info@pesantrennizamuddin.com',
                'order' => 3,
                'is_active' => true,
            ],
        ];

        foreach ($contactInfo as $info) {
            ContactInformation::updateOrCreate(
                ['type' => $info['type']],
                $info
            );
        }

        $this->command->info('Contact information seeded successfully!');
    }
}

