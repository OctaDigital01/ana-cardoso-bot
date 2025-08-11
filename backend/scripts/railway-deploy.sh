#!/bin/bash

# Railway Deployment Script
# This script prepares and deploys the backend to Railway

set -e

echo "🚀 Starting Railway deployment process..."

# Check if railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Installing..."
    npm install -g @railway/cli
fi

# Login to Railway (if not already logged in)
echo "🔐 Checking Railway authentication..."
if ! railway whoami &> /dev/null; then
    echo "Please login to Railway..."
    railway login
fi

# Build the application
echo "🔨 Building application..."
npm install
npx prisma generate

# Deploy to Railway
echo "🚀 Deploying to Railway..."
railway up

echo "✅ Deployment completed!"
echo "🌐 Your application should be available at the Railway URL"
echo "📋 Don't forget to set the environment variables in Railway dashboard:"
echo "   - DATABASE_URL (from Railway PostgreSQL service)"
echo "   - REDIS_URL (from Railway Redis service)"
echo "   - JWT_SECRET"
echo "   - JWT_REFRESH_SECRET"
echo "   - GOOGLE_CLIENT_ID"
echo "   - GOOGLE_CLIENT_SECRET"
echo "   - SMTP_HOST"
echo "   - SMTP_PORT"
echo "   - SMTP_USER"
echo "   - SMTP_PASS"
echo "   - FRONTEND_URL"