@echo off
REM CommunityHub - Startup Script for Windows

echo.
echo ================================
echo  CommunityHub - Development Start
echo ================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo ✓ Node.js found: 
node --version

echo.
echo Starting both servers in separate terminals...
echo.

REM Open backend in new terminal
echo Starting backend on port 5000...
start cmd /k "cd backend && npm run dev"

REM Wait a bit for backend to start
timeout /t 3 /nobreak

REM Open frontend in new terminal  
echo Starting frontend on port 5173...
start cmd /k "cd frontend && npm run dev"

echo.
echo ================================
echo  Both servers starting...
echo ================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Note: Check the terminal windows for any errors.
echo Press Ctrl+C in each terminal to stop the servers.
echo.
