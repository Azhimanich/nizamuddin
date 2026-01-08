@echo off
chcp 65001 >nul
echo ================================================
echo   Setup Otomatis Website Pondok Pesantren
echo ================================================
echo.

:: Check if MySQL is running
echo [1/8] Memeriksa MySQL...
mysql --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: MySQL tidak ditemukan atau tidak berjalan!
    echo Pastikan XAMPP MySQL service sudah berjalan.
    pause
    exit /b 1
)
echo ✓ MySQL terdeteksi
echo.

:: Create database
echo [2/8] Membuat database pesantren_db...
mysql -u root -e "CREATE DATABASE IF NOT EXISTS pesantren_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>nul
if errorlevel 1 (
    echo ⚠ Database mungkin sudah ada atau ada error. Melanjutkan...
) else (
    echo ✓ Database berhasil dibuat
)
echo.

:: Setup Backend
echo [3/8] Setup Backend (Laravel)...
cd backend
if not exist vendor (
    echo   - Menginstall Composer dependencies...
    call composer install --no-interaction
    if errorlevel 1 (
        echo ERROR: Gagal install Composer dependencies!
        cd ..
        pause
        exit /b 1
    )
    echo   ✓ Dependencies terinstall
) else (
    echo   ✓ Dependencies sudah ada
)

if not exist .env (
    echo   - Membuat file .env...
    copy .env.example .env >nul
    echo   ✓ File .env dibuat
    echo   ⚠ PENTING: Edit file backend\.env dan update database credentials jika perlu
) else (
    echo   ✓ File .env sudah ada
)

echo   - Generate application key...
php artisan key:generate --no-interaction >nul 2>&1
echo   ✓ Application key generated
echo.

echo [4/8] Menjalankan database migrations...
php artisan migrate --force --no-interaction
if errorlevel 1 (
    echo ⚠ Ada error pada migration. Cek database connection di .env
) else (
    echo ✓ Migrations berhasil
)

echo [5/8] Menjalankan database seeders...
php artisan db:seed --force --no-interaction
if errorlevel 1 (
    echo ⚠ Ada error pada seeder
) else (
    echo ✓ Seeders berhasil
)

echo   - Membuat storage link...
if not exist "..\backend\public\storage" (
    php artisan storage:link >nul 2>&1
    echo   ✓ Storage link dibuat
) else (
    echo   ✓ Storage link sudah ada
)

cd ..
echo ✓ Backend setup selesai
echo.

:: Setup Frontend
echo [6/8] Setup Frontend (Next.js)...
cd frontend

if not exist node_modules (
    echo   - Menginstall npm dependencies...
    call npm install
    if errorlevel 1 (
        echo ERROR: Gagal install npm dependencies!
        cd ..
        pause
        exit /b 1
    )
    echo   ✓ Dependencies terinstall
) else (
    echo   ✓ Dependencies sudah ada
)

if not exist .env.local (
    echo   - Membuat file .env.local...
    copy .env.example .env.local >nul
    echo   ✓ File .env.local dibuat
) else (
    echo   ✓ File .env.local sudah ada
)

cd ..
echo ✓ Frontend setup selesai
echo.

:: Summary
echo ================================================
echo   Setup Selesai!
echo ================================================
echo.
echo Default Login:
echo   - Super Admin: admin@pesantren.com / password
echo   - Admin Akademik: akademik@pesantren.com / password
echo   - Admin Humas: humas@pesantren.com / password
echo.
echo PENTING: 
echo   1. Edit backend\.env dan pastikan database credentials benar
echo   2. Edit frontend\.env.local jika perlu mengubah API URL
echo.
echo Untuk menjalankan server:
echo   1. Backend: cd backend ^&^& php artisan serve
echo   2. Frontend: cd frontend ^&^& npm run dev
echo.
echo Atau jalankan: start-servers.bat
echo.
pause

