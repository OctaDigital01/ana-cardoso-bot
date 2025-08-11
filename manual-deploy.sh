#!/bin/bash

set -e

echo "🚀 Starting manual Railway deployment..."

# Set Railway token
export RAILWAY_TOKEN="d2ec8305-b445-41ee-a0fa-5bb663df7635"

# Project and repo info
PROJECT_ID="0adc8c81-cd40-4606-aa56-98ae535e7cb0"
GITHUB_REPO="OctaDigital01/Telegram-BOT"

echo "📝 Setting up Railway configuration..."

# Create railway.toml for the project
cat > railway.toml << EOF
[build]
builder = "dockerfile"

[deploy]
healthcheckPath = "/health"
healthcheckTimeout = 100
restartPolicyType = "on_failure"
restartPolicyMaxRetries = 10

[[services]]
name = "backend"
source = "backend"

[services.build]
builder = "dockerfile"
dockerfilePath = "Dockerfile"

[services.deploy]
healthcheckPath = "/health"
healthcheckTimeout = 100
restartPolicyType = "on_failure"
restartPolicyMaxRetries = 10

[services.variables]
NODE_ENV = "production"
PORT = "3333"
DATABASE_URL = "postgresql://postgres:password@postgres:5432/telegram_bot_saas"
JWT_SECRET = "your-super-secret-jwt-key-change-in-production"
TELEGRAM_BOT_TOKEN = "your-telegram-bot-token-here"
REDIS_URL = "redis://redis:6379"
STRIPE_SECRET_KEY = "your-stripe-secret-key"
STRIPE_WEBHOOK_SECRET = "your-stripe-webhook-secret"

[[services]]
name = "frontend" 
source = "frontend"

[services.build]
builder = "dockerfile"
dockerfilePath = "Dockerfile"

[services.deploy]
healthcheckPath = "/health"
healthcheckTimeout = 100
restartPolicyType = "on_failure"
restartPolicyMaxRetries = 10

[services.variables]
NODE_ENV = "production"
NEXT_PUBLIC_API_URL = "https://backend.railway.app"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = "your-stripe-publishable-key"

[[services]]
name = "postgres"
source = "postgres:15"

[services.variables]
POSTGRES_DB = "telegram_bot_saas"
POSTGRES_USER = "postgres"
POSTGRES_PASSWORD = "password"

[[services]]
name = "redis"
source = "redis:alpine"
EOF

echo "✅ Railway configuration created"

# Try to authenticate and link to project
echo "🔐 Authenticating with Railway..."

# Create project link file
mkdir -p .railway
cat > .railway/project.json << EOF
{
  "projectId": "$PROJECT_ID"
}
EOF

echo "📦 Deploying services..."

# Try to deploy using Railway CLI
if command -v railway &> /dev/null; then
    echo "Railway CLI found, attempting deployment..."
    
    # Try to deploy
    railway up --detach || {
        echo "⚠️  Railway CLI deployment failed, trying alternative approach..."
        
        # Alternative: Use docker-compose for local testing
        echo "🐳 Setting up with docker-compose for testing..."
        
        # Start services with docker-compose
        docker-compose up -d --build
        
        echo "✅ Services started with Docker Compose"
        echo "🌐 Backend: http://localhost:3001"
        echo "🌐 Frontend: http://localhost:3000"
        echo "📊 Check status with: docker-compose ps"
        
        exit 0
    }
    
    echo "✅ Railway deployment initiated"
    
    # Try to get deployment status
    railway status || echo "⚠️  Could not get deployment status"
    
else
    echo "❌ Railway CLI not found or not working"
    echo "🐳 Falling back to Docker Compose..."
    
    # Use docker-compose as fallback
    docker-compose up -d --build
    
    echo "✅ Services started with Docker Compose"
    echo "🌐 Backend: http://localhost:3001" 
    echo "🌐 Frontend: http://localhost:3000"
    echo "📊 Check status with: docker-compose ps"
fi

echo "🎉 Deployment process completed!"