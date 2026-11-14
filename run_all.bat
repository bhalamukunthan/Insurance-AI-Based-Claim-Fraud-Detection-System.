@echo off
echo ===================================================================
echo   FRAUDGUARD AI - AI/ML FINANCIAL FRAUD DETECTION SYSTEM (2026)
echo   Unified Production FinTech Application Launcher
echo ===================================================================
start "FraudGuard AI Backend [FastAPI:8000]" cmd /c "%~dp0start_backend.bat"
timeout /t 3 /nobreak >nul
start "FraudGuard AI Frontend [Vite:5173]" cmd /c "%~dp0start_frontend.bat"
echo.
echo Systems initialized:
echo   - Backend & API Documentation: http://localhost:8000/docs
echo   - Frontend Enterprise Dashboard: http://localhost:5173
echo.

