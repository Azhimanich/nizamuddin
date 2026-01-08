@echo off
chcp 65001 >nul
echo ================================================
echo   Setup LENGKAP Website Pondok Pesantren
echo   (Setup + Start Servers)
echo ================================================
echo.

:: Run setup first
call setup-automatic.bat

if errorlevel 1 (
    echo.
    echo Setup gagal! Periksa error di atas.
    pause
    exit /b 1
)

echo.
echo ================================================
echo   Memulai Server...
echo ================================================
echo.

:: Start servers
call start-servers.bat

