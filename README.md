# Website Pondok Pesantren - Sistem Informasi Modern

Website profesional untuk yayasan pondok pesantren dengan fitur lengkap termasuk PMB (Penerimaan Murid Baru), multi-language support, dan dashboard admin.

## Tech Stack

- **Frontend:** Next.js 14 (React) dengan SSR untuk SEO
- **Backend:** Laravel 11 (PHP)
- **Database:** MySQL
- **Storage:** Local (dapat dikonfigurasi ke AWS S3/Cloudinary)

## Fitur Utama

### Frontend
- Multi-language (Indonesia, English, Arabic) dengan RTL support
- Profil & Identitas Pesantren
- Modul Akademik
- Direktori Ketenagaan
- Publikasi & Berita
- Galeri Foto & Video
- Download Center
- Kontak & Lokasi dengan Google Maps

### Backend (Admin Dashboard)
- **Super Admin:** Manajemen user, log aktivitas, pengaturan sistem
- **Admin Akademik:** Manajemen SDM, kurikulum, kalender akademik
- **Admin Humas:** CMS berita, agenda, dokumentasi, blast WA

## Instalasi

### Prerequisites
- PHP 8.2+
- Composer
- Node.js 18+
- MySQL 8.0+
- XAMPP (sudah terinstall)

### Setup Backend (Laravel)

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

### Setup Frontend (Next.js)

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

### Database Setup

1. Buat database MySQL:
```sql
CREATE DATABASE pesantren_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. Update file `.env` di folder `backend` dengan kredensial database Anda.

## Default Login

- **Super Admin:** admin@pesantren.com / password
- **Admin Akademik:** akademik@pesantren.com / password
- **Admin Humas:** humas@pesantren.com / password

## Struktur Project

```
nizamuddin/
├── backend/          # Laravel API
├── frontend/         # Next.js Application
└── README.md
```

## Fitur Keamanan

- Bcrypt password encryption
- Rate limiting untuk login
- RBAC (Role-Based Access Control)
- Auto backup database
- Image optimization

## SEO Features

- Meta tags otomatis (OpenGraph)
- Sitemap XML otomatis
- Server-side rendering (SSR)

## Dokumentasi Lengkap

- 📖 [INSTALLATION.md](INSTALLATION.md) - Panduan instalasi detail
- 🚀 [QUICK_START.md](QUICK_START.md) - Quick start guide
- 📋 [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - Ringkasan lengkap project

## Fitur yang Telah Diimplementasikan

✅ **Backend (Laravel):**
- API RESTful lengkap
- Authentication dengan Sanctum
- RBAC (3 role: Super Admin, Admin Akademik, Admin Humas)
- Multi-language database support
- Image & file upload
- Activity logging
- Search functionality

✅ **Frontend (Next.js):**
- Modern UI dengan Tailwind CSS
- Multi-language (ID, EN, AR) dengan RTL
- Responsive design
- SEO optimized
- Server-side rendering

✅ **Fitur Tambahan:**
- Global search
- WhatsApp integration ready
- Google Maps integration ready
- Download tracking
- Comment moderation
- Announcement system

## Status Project

✅ **Complete** - Semua fitur utama telah diimplementasikan dan siap digunakan!

Untuk memulai, ikuti panduan di [QUICK_START.md](QUICK_START.md)

