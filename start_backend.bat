@echo off
echo ========================================================
echo   Starting FraudGuard AI - FinTech Defense Backend (2026)
echo   FastAPI + Uvicorn + WebSocket Stream Engine
echo ========================================================
cd /d "%~dp0"
python -m uvicorn backend.main:app --host 0.0.0.0 --port 8008 --reload

