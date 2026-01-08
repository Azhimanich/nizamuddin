@echo off
echo ====================================
echo Setup Website Pondok Pesantren
echo ====================================
echo.

echo [1/4] Setting up Backend (Laravel)...
cd backend
if not exist vendor (
    echo Installing Composer dependencies...
    composer install
)
if not exist .env (
    echo Creating .env file...
    copy .env.example .env
    echo Please update .env file with your database credentials
)
cd ..

echo.
echo [2/4] Setting up Frontend (Next.js)...
cd frontend
if not exist node_modules (
    echo Installing npm dependencies...
    call npm install
)
if not exist .env.local (
    echo Creating .env.local file...
    copy .env.example .env.local
)
cd ..

echo.
echo [3/4] Creating database...
echo Please create a MySQL database named 'pesantren_db'
echo Then run: cd backend && php artisan migrate --seed
echo.

echo [4/4] Setup complete!
echo.
echo Next steps:
echo 1. Update backend/.env with your database credentials
echo 2. Run: cd backend && php artisan migrate --seed
echo 3. Run backend: cd backend && php artisan serve
echo 4. Run frontend: cd frontend && npm run dev
echo.
pause

