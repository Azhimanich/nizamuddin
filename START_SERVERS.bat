@echo off
echo ========================================
echo Starting Pesantren Website Servers
echo ========================================
echo.

echo [1/2] Starting Backend Server (Laravel)...
start "Backend Server" cmd /k "cd backend && php artisan serve"

timeout /t 3 /nobreak >nul

echo [2/2] Starting Frontend Server (Next.js)...
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo Servers Started!
echo ========================================
echo.
echo Backend API: http://localhost:8000/api
echo Frontend: http://localhost:3000
echo.
echo Press any key to exit...
pause >nul

