@echo off
echo 🚀 Iniciando Atlas Academico...
echo.

echo 📦 Instalando dependencias...
call npm install
cd backend
call npm install
cd ..

echo.
echo 🎯 Iniciando aplicacao...
call npm run start:all

pause