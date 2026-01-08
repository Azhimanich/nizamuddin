# Panduan Instalasi Website Pondok Pesantren

## Persyaratan Sistem

- PHP 8.2 atau lebih tinggi
- Composer
- Node.js 18 atau lebih tinggi
- MySQL 8.0 atau lebih tinggi
- XAMPP (sudah terinstall)

## Langkah Instalasi

### 1. Setup Database

Buat database MySQL dengan nama `pesantren_db`:

```sql
CREATE DATABASE pesantren_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Setup Backend (Laravel)

```bash
cd backend

# Install dependencies
composer install

# Copy file environment
copy .env.example .env

# Generate application key
php artisan key:generate

# Update file .env dengan kredensial database Anda:
# DB_DATABASE=pesantren_db
# DB_USERNAME=root
# DB_PASSWORD=(kosongkan jika tidak ada password)

# Jalankan migrasi dan seeder
php artisan migrate --seed

# Buat symbolic link untuk storage
php artisan storage:link

# Jalankan server
php artisan serve
```

Backend akan berjalan di `http://localhost:8000`

### 3. Setup Frontend (Next.js)

Buka terminal baru:

```bash
cd frontend

# Install dependencies
npm install

# Copy file environment
copy .env.example .env.local

# Update .env.local jika perlu:
# NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Jalankan development server
npm run dev
```

Frontend akan berjalan di `http://localhost:3000`

## Default Login

Setelah menjalankan seeder, Anda dapat login dengan:

- **Super Admin:**
  - Email: `admin@pesantren.com`
  - Password: `password`

- **Admin Akademik:**
  - Email: `akademik@pesantren.com`
  - Password: `password`

- **Admin Humas:**
  - Email: `humas@pesantren.com`
  - Password: `password`

## Struktur Folder

```
nizamuddin/
├── backend/          # Laravel API
│   ├── app/
│   ├── database/
│   ├── routes/
│   └── ...
├── frontend/         # Next.js Application
│   ├── app/
│   ├── components/
│   └── ...
└── README.md
```

## Fitur yang Tersedia

### Frontend
- ✅ Multi-language (ID, EN, AR) dengan RTL support
- ✅ Halaman Profil
- ✅ Halaman Akademik
- ✅ Direktori Ketenagaan
- ✅ Berita & Artikel
- ✅ Galeri Foto & Video
- ✅ Download Center
- ✅ Kontak & Lokasi

### Backend (Admin Dashboard)
- ✅ Super Admin Dashboard
- ✅ Admin Akademik Dashboard
- ✅ Admin Humas Dashboard
- ✅ Manajemen User
- ✅ Manajemen Berita
- ✅ Manajemen Galeri
- ✅ Manajemen Download
- ✅ Log Aktivitas

## Troubleshooting

### Error: Class not found
Jalankan `composer dump-autoload` di folder backend

### Error: Storage link tidak ada
Jalankan `php artisan storage:link` di folder backend

### Error: CORS
Pastikan `NEXT_PUBLIC_API_URL` di frontend mengarah ke backend yang benar

### Error: Database connection
Pastikan MySQL service berjalan dan kredensial di `.env` benar

## Production Deployment

Untuk production, pastikan:

1. Set `APP_ENV=production` di backend/.env
2. Set `APP_DEBUG=false` di backend/.env
3. Jalankan `php artisan config:cache`
4. Jalankan `php artisan route:cache`
5. Build frontend dengan `npm run build`
6. Setup web server (Apache/Nginx) untuk serve aplikasi

## Support

Jika ada pertanyaan atau masalah, silakan buat issue di repository ini.

