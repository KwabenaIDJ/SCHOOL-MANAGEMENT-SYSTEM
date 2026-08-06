@echo off
title Kidshine Montessori School Management System Launcher
color 0A
echo =======================================================================
echo          KIDSHINE MONTESSORI SCHOOL MANAGEMENT SYSTEM
echo =======================================================================
echo.
echo  Starting local web application server...
echo  Opening in your web browser (Google Chrome)...
echo.
cd /d "%~dp0"
start "" "http://localhost:5173/"
cmd /c npm run dev
pause
