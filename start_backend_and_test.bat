@echo off
echo Starting PSB Backend Server...
cd backend
echo.
echo 1. Starting Laravel server on port 8000...
start "Backend Server" cmd /k "php artisan serve --port=8000"

echo.
echo 2. Waiting for server to start...
timeout /t 5 /nobreak >nul

echo.
echo 3. Testing PSB API connection...
echo Testing registration endpoint...
curl -X GET "http://127.0.0.1:8000/api/admin/psb-registrations/statistics" 2>nul
if %errorlevel%==0 (
    echo ✅ Backend server is running!
    echo.
    echo 4. You can now test the registration form at:
    echo    http://localhost:3000/id/psb/formulir
    echo.
    echo Backend API will be available at:
    echo    http://127.0.0.1:8000/api
    echo.
) else (
    echo ❌ Backend server failed to start
    echo Please check for errors in the backend server window
)

echo.
echo Press any key to exit...
pause
