#!/bin/bash
# CommunityHub - Startup Script for macOS/Linux

echo ""
echo "================================"
echo "  CommunityHub - Development Start"
echo "================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "✓ Node.js found:"
node --version

echo ""
echo "Starting both servers..."
echo ""

# Start backend
echo "Starting backend on port 5000..."
(cd backend && npm run dev) &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start frontend
echo "Starting frontend on port 5173..."
(cd frontend && npm run dev) &
FRONTEND_PID=$!

echo ""
echo "================================"
echo "  Both servers running..."
echo "================================"
echo ""
echo "Backend:  http://localhost:5000"
echo "Frontend: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
