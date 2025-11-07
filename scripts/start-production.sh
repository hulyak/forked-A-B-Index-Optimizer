#!/bin/bash

# Production startup script for Forked A/B Index Optimizer

set -e

echo "🚀 Starting Forked A/B Index Optimizer in production mode..."

# Check if required environment variables are set
if [ -z "$TIGER_DATABASE_URL" ]; then
    echo "❌ Error: TIGER_DATABASE_URL environment variable is required"
    exit 1
fi

# Create logs directory if it doesn't exist
mkdir -p logs

# Set production environment
export NODE_ENV=production

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm ci --only=production
fi

# Build client if dist doesn't exist
if [ ! -d "client/dist" ]; then
    echo "🏗️  Building client..."
    cd client && npm ci --only=production && npm run build && cd ..
fi

# Check Tiger CLI connection (optional)
if command -v tiger &> /dev/null; then
    echo "🐅 Testing Tiger CLI connection..."
    if tiger auth status &> /dev/null; then
        echo "✅ Tiger CLI authenticated"
    else
        echo "⚠️  Warning: Tiger CLI not authenticated"
    fi
else
    echo "⚠️  Warning: Tiger CLI not found"
fi

# Start the application
echo "🎯 Starting application..."
exec npm start