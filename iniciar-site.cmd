@echo off
cd /d "%~dp0"
if not exist node_modules call npm.cmd install
echo.
echo BRASA - Abra http://127.0.0.1:3000 no navegador.
echo Mantenha esta janela aberta enquanto usa o site.
echo.
call npm.cmd run dev
