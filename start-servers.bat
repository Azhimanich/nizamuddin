@echo off
chcp 65001 >nul
echo ================================================
echo   Menjalankan Server Backend dan Frontend
echo ================================================
echo.

:: Start Backend
echo [1/2] Menjalankan Backend Server (Laravel)...
start "Laravel Backend" cmd /k "cd backend && php artisan serve"
timeout /t 3 /nobreak >nul
echo ✓ Backend server berjalan di http://localhost:8000
echo.

:: Start Frontend
echo [2/2] Menjalankan Frontend Server (Next.js)...
start "Next.js Frontend" cmd /k "cd frontend && npm run dev"
timeout /t 3 /nobreak >nul
echo ✓ Frontend server berjalan di http://localhost:3000
echo.

echo ================================================
echo   Server Berjalan!
echo ================================================
echo.
echo Backend API:  http://localhost:8000/api
echo Frontend:     http://localhost:3000
echo.
echo Tekan Ctrl+C di masing-masing window untuk stop server
echo.
pause

