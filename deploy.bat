@echo off
echo ==========================================
echo   FACEBOOK CLONE GITHUB DEPLOYMENT
echo ==========================================
echo.
powershell -ExecutionPolicy Bypass -File .\push_to_github.ps1
echo.
echo ==========================================
echo   PROCESS COMPLETE!
echo ==========================================
pause
