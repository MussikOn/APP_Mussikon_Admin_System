@echo off
echo 🚀 Iniciando MussikOn Admin System...
echo.

echo 📦 Iniciando Backend...
cd ../app_mussikon_express
start "Backend - MussikOn Express" cmd /k "npm start"

echo.
echo ⏳ Esperando 5 segundos para que el backend inicie...
timeout /t 5 /nobreak >nul

echo.
echo 🎨 Iniciando Frontend...
cd ../APP_Mussikon_Admin_System
start "Frontend - MussikOn Admin" cmd /k "npm run dev"

echo.
echo ✅ Ambos servidores iniciados:
echo    🌐 Backend: http://localhost:1000
echo    🎨 Frontend: http://localhost:5174
echo.
echo 📚 Documentación: http://localhost:1000/docs
echo.
pause 