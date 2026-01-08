# Cara Menjalankan Website Pondok Pesantren

## 🚀 Quick Start (Paling Mudah)

### Opsi 1: Menggunakan Script Otomatis (Windows)

Jalankan file `START_SERVERS.bat` dengan double-click, atau:

```bash
START_SERVERS.bat
```

Script ini akan membuka 2 window terpisah untuk backend dan frontend.

---

## 📋 Cara Manual

### 1. Menjalankan Backend (Laravel API)

Buka **Command Prompt** atau **PowerShell** baru, lalu:

```bash
cd backend
php artisan serve
```

Backend akan berjalan di: **http://localhost:8000**

**Jangan tutup window ini!** Biarkan tetap terbuka.

---

### 2. Menjalankan Frontend (Next.js)

Buka **Command Prompt** atau **PowerShell** baru (window terpisah), lalu:

```bash
cd frontend
npm run dev
```

Frontend akan berjalan di: **http://localhost:3000**

**Jangan tutup window ini juga!** Biarkan tetap terbuka.

---

## 🌐 Akses Aplikasi

Setelah kedua server berjalan:

- **Website (Frontend):** http://localhost:3000
- **API Backend:** http://localhost:8000/api
- **API Health Check:** http://localhost:8000/up

---

## 🔐 Login Admin

Untuk mengakses admin dashboard:

- **Email:** `admin@pesantren.com`
- **Password:** `password`

Atau gunakan:
- **Admin Akademik:** `akademik@pesantren.com` / `password`
- **Admin Humas:** `humas@pesantren.com` / `password`

---

## ⚠️ Troubleshooting

### Port Sudah Digunakan

Jika port 8000 atau 3000 sudah digunakan:

**Backend (ubah port):**
```bash
php artisan serve --port=8001
```

**Frontend (ubah port):**
```bash
npm run dev -- -p 3001
```

### Database Connection Error

Pastikan:
1. MySQL service berjalan di XAMPP
2. Database `pesantren_db` sudah dibuat
3. File `backend/.env` memiliki kredensial database yang benar:
   ```
   DB_DATABASE=pesantren_db
   DB_USERNAME=root
   DB_PASSWORD=
   ```

### Frontend Tidak Bisa Connect ke Backend

Pastikan:
1. Backend server sudah berjalan
2. File `frontend/.env.local` memiliki:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   ```

### Error "Module not found"

**Backend:**
```bash
cd backend
composer install
```

**Frontend:**
```bash
cd frontend
npm install
```

---

## 🛑 Menghentikan Server

Untuk menghentikan server:

1. Klik pada window Command Prompt/PowerShell yang menjalankan server
2. Tekan `Ctrl + C`
3. Tekan `Y` untuk konfirmasi (jika diminta)

---

## 📝 Catatan Penting

1. **Jangan tutup window terminal** saat server berjalan
2. **Backend harus berjalan terlebih dahulu** sebelum frontend
3. Jika ada perubahan di backend, restart backend server
4. Jika ada perubahan di frontend, Next.js akan auto-reload

---

## 🔄 Restart Server

Jika perlu restart:

1. Hentikan server dengan `Ctrl + C`
2. Jalankan lagi sesuai langkah di atas

---

## ✅ Checklist Sebelum Menjalankan

- [ ] MySQL service berjalan (XAMPP)
- [ ] Database `pesantren_db` sudah dibuat
- [ ] File `backend/.env` sudah dikonfigurasi
- [ ] File `frontend/.env.local` sudah dikonfigurasi
- [ ] Dependencies sudah diinstall (`composer install` dan `npm install`)

---

## 🎯 Next Steps

Setelah server berjalan:

1. Buka browser dan akses http://localhost:3000
2. Explore website
3. Login ke admin dashboard untuk mengelola konten
4. Mulai tambahkan data (berita, foto, dll)

---

**Selamat menggunakan Website Pondok Pesantren! 🎉**

