<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PsbFaq;

class PSBFAQSeeder extends Seeder
{
    public function run(): void
    {
        // Indonesian FAQs
        $this->createFAQs('id', [
            [
                'question' => 'Apa saja persyaratan untuk mendaftar di pesantren ini?',
                'answer' => 'Persyaratan utama meliputi: fotokopi akta kelahiran, kartu keluarga, KTP orang tua, pas foto, rapor terakhir, surat keterangan sehat, dan surat keterangan berkelakuan baik. Detail lengkap dapat dilihat di halaman persyaratan.',
                'category' => 'Pendaftaran',
                'order' => 1,
                'is_active' => true
            ],
            [
                'question' => 'Berapa biaya pendaftaran dan uang pangkal?',
                'answer' => 'Biaya pendaftaran Rp 500.000 dan biaya tes masuk Rp 300.000. Uang pangkal Rp 5.000.000 dapat dicicil 3x. SPP bulanan Rp 800.000 belum termasuk biaya makan.',
                'category' => 'Biaya',
                'order' => 2,
                'is_active' => true
            ],
            [
                'question' => 'Apakah ada batasan usia untuk pendaftar?',
                'answer' => 'Ya, usia minimal 6 tahun untuk tingkat SD/MI dan usia maksimal 19 tahun untuk tingkat SMA/MA.',
                'category' => 'Pendaftaran',
                'order' => 3,
                'is_active' => true
            ],
            [
                'question' => 'Apakah santri wajib tinggal di asrama?',
                'answer' => 'Ya, semua santri diwajibkan tinggal di asrama untuk pembinaan yang maksimal dan pengembangan karakter yang terintegrasi.',
                'category' => 'Asrama',
                'order' => 4,
                'is_active' => true
            ],
            [
                'question' => 'Kapan pendaftaran dibuka dan ditutup?',
                'answer' => 'Pendaftaran biasanya dibuka pada bulan Januari - Mei untuk tahun ajaran baru. Informasi tanggal pasti akan diumumkan melalui website dan media sosial resmi.',
                'category' => 'Pendaftaran',
                'order' => 5,
                'is_active' => true
            ],
            [
                'question' => 'Apa saja tes yang harus diikuti calon santri?',
                'answer' => 'Calon santri akan mengikuti tes akademik (matematika, bahasa Indonesia, dan IPA) serta tes psikologi untuk menilai kepribadian dan minat.',
                'category' => 'Akademik',
                'order' => 6,
                'is_active' => true
            ],
            [
                'question' => 'Bagaimana sistem pembelajaran di pesantren ini?',
                'answer' => 'Kami menerapkan sistem pembelajaran modern yang menggabungkan kurikulum nasional dengan pendidikan Islam dan tahfidz Quran. Waktu belajar dibagi antara pelajaran umum dan keagamaan.',
                'category' => 'Akademik',
                'order' => 7,
                'is_active' => true
            ],
            [
                'question' => 'Apakah ada fasilitas asrama yang disediakan?',
                'answer' => 'Ya, tersedia asrama dengan fasilitas lengkap: kamar tidur, kamar mandi, ruang belajar, musholla, kantin, dan area olahraga. Setiap asrama diawasi oleh pembimbing senior.',
                'category' => 'Asrama',
                'order' => 8,
                'is_active' => true
            ]
        ]);

        // English FAQs
        $this->createFAQs('en', [
            [
                'question' => 'What are the requirements to register at this pesantren?',
                'answer' => 'Main requirements include: photocopy of birth certificate, family card, parent ID, photos, latest report card, health certificate, and good conduct certificate. Complete details can be found on the requirements page.',
                'category' => 'Pendaftaran',
                'order' => 1,
                'is_active' => true
            ],
            [
                'question' => 'How much are the registration and initial fees?',
                'answer' => 'Registration fee is Rp 500,000 and entrance test fee is Rp 300,000. Initial fee is Rp 5,000,000 which can be paid in 3 installments. Monthly tuition is Rp 800,000 excluding meal costs.',
                'category' => 'Biaya',
                'order' => 2,
                'is_active' => true
            ],
            [
                'question' => 'Are there age restrictions for applicants?',
                'answer' => 'Yes, minimum age is 6 years for elementary level and maximum age is 19 years for high school level.',
                'category' => 'Pendaftaran',
                'order' => 3,
                'is_active' => true
            ],
            [
                'question' => 'Are students required to stay in the dormitory?',
                'answer' => 'Yes, all students are required to stay in the dormitory for maximum character development and integrated education.',
                'category' => 'Asrama',
                'order' => 4,
                'is_active' => true
            ],
            [
                'question' => 'When does registration open and close?',
                'answer' => 'Registration usually opens from January to May for the new academic year. Exact dates will be announced through the official website and social media.',
                'category' => 'Pendaftaran',
                'order' => 5,
                'is_active' => true
            ],
            [
                'question' => 'What tests must prospective students take?',
                'answer' => 'Prospective students will take academic tests (mathematics, Indonesian language, and science) as well as psychological tests to assess personality and interests.',
                'category' => 'Akademik',
                'order' => 6,
                'is_active' => true
            ],
            [
                'question' => 'How is the learning system at this pesantren?',
                'answer' => 'We implement a modern learning system that combines the national curriculum with Islamic education and Quran memorization. Learning time is divided between general and religious subjects.',
                'category' => 'Akademik',
                'order' => 7,
                'is_active' => true
            ],
            [
                'question' => 'What dormitory facilities are available?',
                'answer' => 'Yes, there are dormitories with complete facilities: bedrooms, bathrooms, study rooms, prayer rooms, cafeteria, and sports areas. Each dormitory is supervised by senior counselors.',
                'category' => 'Asrama',
                'order' => 8,
                'is_active' => true
            ]
        ]);
    }

    private function createFAQs(string $locale, array $faqs): void
    {
        foreach ($faqs as $faq) {
            PsbFaq::create([
                'question' => $faq['question'],
                'answer' => $faq['answer'],
                'locale' => $locale,
                'category' => $faq['category'],
                'order' => $faq['order'],
                'is_active' => $faq['is_active']
            ]);
        }
    }
}
