@echo off
echo Starting PSB System Test...
echo.

echo 1. Starting Backend Server...
cd backend
start "Backend Server" cmd /k "php artisan serve --port=8000"

echo 2. Waiting for server to start...
timeout /t 3 /nobreak >nul

echo 3. Testing API Endpoints...
curl -s -X GET "http://127.0.0.1:8000/api/admin/psb-registrations/statistics" | findstr success
if %errorlevel%==0 (
    echo ✅ Statistics API working!
) else (
    echo ❌ Statistics API failed
)

curl -s -X GET "http://127.0.0.1:8000/api/admin/psb-registrations" | findstr success
if %errorlevel%==0 (
    echo ✅ Registrations API working!
) else (
    echo ❌ Registrations API failed
)

echo.
echo 4. Opening test pages...
start "" "http://127.0.0.1:8000/api/admin/psb-registrations/statistics"
start "" "file:///c:/xampp/htdocs/nizamuddin/test_admin_api.html"

echo.
echo Test completed! Check the opened pages for results.
echo Backend server is running in separate window.
pause
