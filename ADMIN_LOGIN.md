# 🔐 Panduan Login Admin

## Status Website

✅ **Website sudah DINAMIS** - Semua data diambil dari database MySQL melalui API Laravel

### Fitur Dinamis yang Sudah Aktif:
- ✅ Berita & Artikel (fetch dari API)
- ✅ Program Akademik (fetch dari API)
- ✅ Ketenagaan/Staff (fetch dari API)
- ✅ Galeri Foto & Video (fetch dari API)
- ✅ Download Center (fetch dari API)
- ✅ Kontak Form (submit ke API)
- ✅ Semua halaman menggunakan data real-time dari database

---

## 🚀 Cara Login ke Admin Dashboard

### 1. Akses Halaman Login
Buka browser dan akses:
```
http://localhost:3000/admin/login
```

### 2. Default Login Credentials

---

## 📋 Fitur Dashboard Berdasarkan Role

### Super Admin (Akses Penuh)
- ✅ Manajemen User (buat/edit/hapus admin)
- ✅ Statistik & Log Aktivitas
- ✅ Pengaturan Sistem
- ✅ Manajemen SDM
- ✅ Kelola Kurikulum
- ✅ Kalender Akademik
- ✅ Manajemen Berita
- ✅ Galeri
- ✅ Download Center

### Admin Akademik
- ✅ Manajemen SDM (Ustadz/Ustadzah/Staff)
- ✅ Kelola Kurikulum
- ✅ Kalender Akademik
- ✅ Update Fasilitas

### Admin Humas
- ✅ Manajemen Berita & Artikel
- ✅ Manajemen Agenda
- ✅ Upload Dokumentasi (Foto/Video)
- ✅ Pengelola Download
- ✅ WhatsApp Blast

---

## ⚠️ Catatan Penting

1. **Pastikan Backend Laravel Berjalan**
   - Backend harus berjalan di `http://localhost:8000`
   - Jika belum, jalankan: `cd backend && php artisan serve`

2. **Database Harus Sudah Di-migrate**
   - Pastikan sudah run: `php artisan migrate --seed`
   - User default sudah dibuat oleh seeder

3. **Jika Login Gagal**
   - Cek apakah backend server berjalan
   - Cek koneksi database
   - Pastikan user sudah ada di database

---

## 🔧 Troubleshooting

### Error: "Cannot connect to API"
- Pastikan backend Laravel berjalan di port 8000
- Cek file `.env` di folder `frontend` dan pastikan `NEXT_PUBLIC_API_URL=http://localhost:8000/api`

### Error: "Invalid credentials"
- Pastikan user sudah dibuat di database
- Cek dengan menjalankan seeder: `php artisan db:seed --class=DatabaseSeeder`

### Halaman Admin Blank/Kosong
- Clear cache: Hapus folder `.next` di `frontend`
- Restart server: `npm run dev`

---

## 📝 Mengubah Password Default

Untuk mengubah password, login sebagai Super Admin dan gunakan fitur "Manajemen User" di dashboard, atau ubah langsung di database:

```sql
UPDATE users SET password = bcrypt('password_baru') WHERE email = 'admin@pesantren.com';
```

---

**Selamat menggunakan Admin Dashboard! 🎉**

