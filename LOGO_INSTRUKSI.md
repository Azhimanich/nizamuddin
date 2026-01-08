# Instruksi Logo

## Cara Menambahkan Logo

File logo Anda: `Kop pesantren Nizhamuddin.png`

### Langkah-langkah:

1. **Copy file logo ke folder public:**
   ```bash
   Copy-Item "Kop pesantren Nizhamuddin.png" -Destination "frontend\public\logo.png"
   ```

   Atau secara manual:
   - Buka folder `frontend`
   - Buat folder `public` jika belum ada
   - Copy file `Kop pesantren Nizhamuddin.png` ke dalam folder `public`
   - Rename menjadi `logo.png`

2. **Restart frontend server:**
   - Hentikan server dengan `Ctrl + C`
   - Jalankan lagi: `npm run dev`

Logo akan otomatis muncul di header website.

---

## Jika Logo Tidak Muncul

Jika logo tidak muncul, sistem akan menampilkan placeholder dengan inisial "PN" (Pesantren Nizamuddin).

---

## Format Logo yang Disarankan

- Format: PNG atau JPG
- Ukuran: Minimal 200x200px (disarankan 400x400px)
- Background: Transparent (PNG) atau putih
- Nama file: `logo.png`

