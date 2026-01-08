<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Language;

class LanguageSeeder extends Seeder
{
    public function run(): void
    {
        Language::create([
            'code' => 'id',
            'name' => 'Indonesian',
            'native_name' => 'Bahasa Indonesia',
            'rtl' => false,
            'is_active' => true,
        ]);

        Language::create([
            'code' => 'en',
            'name' => 'English',
            'native_name' => 'English',
            'rtl' => false,
            'is_active' => true,
        ]);

        Language::create([
            'code' => 'ar',
            'name' => 'Arabic',
            'native_name' => 'العربية',
            'rtl' => true,
            'is_active' => true,
        ]);
    }
}

