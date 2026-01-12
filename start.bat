@echo off
REM Admin Analytics Platform - Startup Script for Windows
REM This script installs dependencies and starts the development server

echo ================================================
echo   Admin Analytics Platform - Setup ^& Launch
echo ================================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Error: Node.js is not installed
    echo Please install Node.js from https://nodejs.org/
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i

echo Node.js version: %NODE_VERSION%
echo npm version: %NPM_VERSION%
echo.

REM Install dependencies
echo Installing dependencies...
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo Failed to install dependencies
    exit /b 1
)

echo.
echo Dependencies installed successfully
echo.

REM Start the development server
echo Starting development server...
echo The application will open in your default browser
echo at http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.

call npm run dev
