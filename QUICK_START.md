# Quick Start Guide

## Instalasi Cepat (Windows dengan XAMPP)

### 1. Setup Database

Buka phpMyAdmin (http://localhost/phpmyadmin) dan buat database:

```sql
CREATE DATABASE pesantren_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Setup Backend

Buka Command Prompt atau PowerShell di folder project:

```bash
cd backend

# Install Composer dependencies (jika belum)
composer install

# Copy .env
copy .env.example .env

# Edit .env dan update database credentials:
# DB_DATABASE=pesantren_db
# DB_USERNAME=root
# DB_PASSWORD=

# Generate key
php artisan key:generate

# Run migrations dan seed
php artisan migrate --seed

# Create storage link
php artisan storage:link

# Start server
php artisan serve
```

Backend akan berjalan di: **http://localhost:8000**

### 3. Setup Frontend

Buka terminal baru:

```bash
cd frontend

# Install dependencies
npm install

# Copy .env
copy .env.example .env.local

# Start dev server
npm run dev
```

Frontend akan berjalan di: **http://localhost:3000**

## Login Admin

Setelah setup selesai, akses admin dashboard di:
- URL: `http://localhost:3000/admin` (akan dibuat nanti)
- Email: `admin@pesantren.com`
- Password: `password`

## Struktur API

Backend API tersedia di: `http://localhost:8000/api`

Contoh endpoint:
- `GET /api/profile` - Data profil pesantren
- `GET /api/news` - Daftar berita
- `GET /api/staff` - Daftar ustadz/staff
- `GET /api/academic` - Data akademik

## Fitur yang Tersedia

✅ Multi-language (ID, EN, AR) dengan RTL  
✅ Responsive design  
✅ SEO optimized  
✅ Admin dashboard dengan RBAC  
✅ Manajemen konten lengkap  
✅ Galeri foto & video  
✅ Download center  
✅ Integrasi WhatsApp  

## Troubleshooting

**Error: Composer not found**
- Install Composer dari https://getcomposer.org/

**Error: Node not found**
- Install Node.js dari https://nodejs.org/

**Error: Database connection**
- Pastikan MySQL service berjalan di XAMPP
- Cek kredensial di `backend/.env`

**Error: Port already in use**
- Backend: Ubah port dengan `php artisan serve --port=8001`
- Frontend: Ubah port dengan `npm run dev -- -p 3001`

## Next Steps

1. Update informasi pesantren di admin dashboard
2. Upload logo dan gambar
3. Tambah konten berita dan artikel
4. Setup Google Maps API key (opsional)
5. Setup WhatsApp API (opsional)

