#!/bin/bash

# HRMS Lite Quick Start Script

echo "============================================"
echo "HRMS Lite - Quick Start"
echo "============================================"
echo ""

# Check if Docker is installed
if command -v docker &> /dev/null; then
    echo "✓ Docker found"
    echo ""
    echo "Starting application with Docker Compose..."
    echo "This will:"
    echo "  - Start MongoDB on port 27017"
    echo "  - Start Backend (FastAPI) on port 8000"
    echo "  - Start Frontend (Angular) on port 4200"
    echo ""
    docker-compose up --build
else
    echo "Docker not found. Using manual setup..."
    echo ""
    
    # Backend setup
    echo "Setting up Backend..."
    cd backend
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    echo "Backend ready. Run: cd backend && python main.py"
    echo ""
    
    cd ..
    
    # Frontend setup
    echo "Setting up Frontend..."
    cd frontend
    npm install
    echo "Frontend ready. Run: cd frontend && npm start"
fi
