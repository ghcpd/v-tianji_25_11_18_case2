#!/bin/bash

# Admin Analytics Platform - Startup Script
# This script installs dependencies, builds the project, and starts the development server

set -e

echo "================================================"
echo "  Admin Analytics Platform - Setup & Launch"
echo "================================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "✓ Node.js version: $(node --version)"
echo "✓ npm version: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""
echo "✓ Dependencies installed successfully"
echo ""

# Start the development server
echo "🚀 Starting development server..."
echo "   The application will open in your default browser"
echo "   at http://localhost:3000"
echo ""
echo "   Press Ctrl+C to stop the server"
echo ""

npm run dev
