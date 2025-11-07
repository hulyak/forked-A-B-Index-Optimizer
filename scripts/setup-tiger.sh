#!/bin/bash

# Setup script for Tiger Data service and sample data
# Run this after installing Tiger CLI and authenticating

set -e

echo "🐅 Setting up Tiger Data service for A/B Index Optimizer..."

# Configuration
SERVICE_NAME=${TIGER_SERVICE_NAME:-"my-agentic-db"}
SAMPLE_DATA_FILE="data/sample-schema.sql"

# Check if Tiger CLI is installed
if ! command -v tiger &> /dev/null; then
    echo "❌ Tiger CLI not found. Please install it first:"
    echo "curl -fsSL https://cli.tigerdata.com | sh"
    exit 1
fi

# Check if user is authenticated
if ! tiger auth status &> /dev/null; then
    echo "❌ Not authenticated with Tiger. Please run:"
    echo "tiger auth login"
    exit 1
fi

echo "✅ Tiger CLI found and authenticated"

# Create service if it doesn't exist
echo "📦 Creating Tiger service: $SERVICE_NAME"
if tiger service create --name "$SERVICE_NAME" 2>/dev/null; then
    echo "✅ Service '$SERVICE_NAME' created successfully"
else
    echo "ℹ️  Service '$SERVICE_NAME' already exists or creation failed"
fi

# Get service connection details
echo "🔗 Getting service connection details..."
tiger service list --name "$SERVICE_NAME"

# Load sample data if file exists
if [ -f "$SAMPLE_DATA_FILE" ]; then
    echo "📊 Loading sample data from $SAMPLE_DATA_FILE"
    
    # Get connection string (this would need to be adapted based on Tiger CLI output)
    # For now, we'll just show the command that would be used
    echo "ℹ️  To load sample data, run:"
    echo "psql \$TIGER_DATABASE_URL -f $SAMPLE_DATA_FILE"
else
    echo "⚠️  Sample data file not found at $SAMPLE_DATA_FILE"
fi

echo ""
echo "🎉 Setup complete! Next steps:"
echo "1. Copy your Tiger database connection string to .env file"
echo "2. Run 'npm run install-all' to install dependencies"
echo "3. Run 'npm run dev' to start the application"
echo ""
echo "📝 Don't forget to update your .env file with:"
echo "TIGER_SERVICE_NAME=$SERVICE_NAME"
echo "TIGER_DATABASE_URL=your_connection_string_here"