#!/bin/bash

# Railway deployment automation script
# This will configure and deploy all services properly

RAILWAY_TOKEN="d2ec8305-b445-41ee-a0fa-5bb663df7635"
PROJECT_ID="ec319e25-4a4f-4748-842f-987538043efe"
ENVIRONMENT_ID="96c7b5a8-650d-4255-8f5c-120345d9b52e"
BACKEND_SERVICE_ID="ce1125a5-4d5f-48ad-b2d6-4b757664b5e7"
FRONTEND_SERVICE_ID="822419b4-6470-4bca-b5e4-3d8043a00016"
POSTGRES_SERVICE_ID="1ac0d3a6-8919-4489-bbf9-d59fcff2314d"
REDIS_SERVICE_ID="35866238-ec1c-49e1-a59f-27904b8db284"

API_URL="https://backboard.railway.app/graphql/v2"

echo "🚀 Starting Railway deployment automation..."

# Function to set environment variable
set_env_var() {
    local service_id=$1
    local name=$2
    local value=$3
    
    echo "Setting $name for service $service_id..."
    
    curl -s -X POST \
        -H "Authorization: Bearer $RAILWAY_TOKEN" \
        -H "Content-Type: application/json" \
        -d "{\"query\": \"mutation { variableUpsert(input: { projectId: \\\"$PROJECT_ID\\\", environmentId: \\\"$ENVIRONMENT_ID\\\", serviceId: \\\"$service_id\\\", name: \\\"$name\\\", value: \\\"$value\\\" }) { name } }\"}" \
        $API_URL >/dev/null
}

# Set backend environment variables
echo "📦 Configuring backend environment variables..."
set_env_var $BACKEND_SERVICE_ID "NODE_ENV" "production"
set_env_var $BACKEND_SERVICE_ID "PORT" "3333"
set_env_var $BACKEND_SERVICE_ID "DATABASE_URL" "postgresql://postgres:TelegramBotSaas2024_@postgres.railway.internal:5432/telegram_bot_saas"
set_env_var $BACKEND_SERVICE_ID "REDIS_URL" "redis://default:@redis.railway.internal:6379"
set_env_var $BACKEND_SERVICE_ID "JWT_SECRET" "telegram-bot-manager-super-secret-jwt-production-key-32-chars-min-2024"
set_env_var $BACKEND_SERVICE_ID "JWT_REFRESH_SECRET" "telegram-bot-manager-super-secret-refresh-production-key-32-chars-min-2024"
set_env_var $BACKEND_SERVICE_ID "JWT_EXPIRES_IN" "15m"
set_env_var $BACKEND_SERVICE_ID "JWT_REFRESH_EXPIRES_IN" "7d"
set_env_var $BACKEND_SERVICE_ID "ENCRYPTION_KEY" "ProductionEncryptionKey123456789012"
set_env_var $BACKEND_SERVICE_ID "API_URL" "https://backend-production-58eb.up.railway.app"
set_env_var $BACKEND_SERVICE_ID "TELEGRAM_WEBHOOK_DOMAIN" "https://backend-production-58eb.up.railway.app"
set_env_var $BACKEND_SERVICE_ID "RATE_LIMIT_WINDOW" "60000"
set_env_var $BACKEND_SERVICE_ID "RATE_LIMIT_MAX" "100"
set_env_var $BACKEND_SERVICE_ID "LOG_LEVEL" "info"
set_env_var $BACKEND_SERVICE_ID "LOG_TO_FILE" "true"
set_env_var $BACKEND_SERVICE_ID "ENABLE_REGISTRATION" "true"
set_env_var $BACKEND_SERVICE_ID "ENABLE_EMAIL_VERIFICATION" "false"
set_env_var $BACKEND_SERVICE_ID "ENABLE_PASSWORD_RESET" "true"
set_env_var $BACKEND_SERVICE_ID "ENABLE_TWO_FACTOR" "false"
set_env_var $BACKEND_SERVICE_ID "ENABLE_SWAGGER" "false"

# Set frontend environment variables
echo "🎨 Configuring frontend environment variables..."
set_env_var $FRONTEND_SERVICE_ID "NODE_ENV" "production"
set_env_var $FRONTEND_SERVICE_ID "NEXT_PUBLIC_API_URL" "https://backend-production-58eb.up.railway.app/api/v1"
set_env_var $FRONTEND_SERVICE_ID "NEXT_PUBLIC_WS_URL" "wss://backend-production-58eb.up.railway.app"
set_env_var $FRONTEND_SERVICE_ID "NEXT_PUBLIC_APP_URL" "https://frontend-production-df31.up.railway.app"
set_env_var $FRONTEND_SERVICE_ID "NEXT_PUBLIC_APP_NAME" "TelegramBot Manager"
set_env_var $FRONTEND_SERVICE_ID "NEXT_PUBLIC_ENABLE_PWA" "true"
set_env_var $FRONTEND_SERVICE_ID "NEXT_PUBLIC_ENABLE_ANALYTICS" "false"
set_env_var $FRONTEND_SERVICE_ID "NEXT_PUBLIC_ENABLE_SENTRY" "false"
set_env_var $FRONTEND_SERVICE_ID "NEXT_PUBLIC_DEBUG" "false"

# Set PostgreSQL environment variables
echo "🗄️ Configuring PostgreSQL environment variables..."
set_env_var $POSTGRES_SERVICE_ID "POSTGRES_DB" "telegram_bot_saas"
set_env_var $POSTGRES_SERVICE_ID "POSTGRES_USER" "postgres"
set_env_var $POSTGRES_SERVICE_ID "POSTGRES_PASSWORD" "TelegramBotSaas2024_"

# Deploy all services
echo "🚀 Deploying all services..."

deploy_service() {
    local service_id=$1
    local service_name=$2
    
    echo "Deploying $service_name..."
    curl -s -X POST \
        -H "Authorization: Bearer $RAILWAY_TOKEN" \
        -H "Content-Type: application/json" \
        -d "{\"query\": \"mutation { serviceInstanceRedeploy(environmentId: \\\"$ENVIRONMENT_ID\\\", serviceId: \\\"$service_id\\\") }\", \"variables\": {}}" \
        $API_URL >/dev/null
    
    echo "$service_name deployment triggered ✅"
}

deploy_service $POSTGRES_SERVICE_ID "PostgreSQL"
deploy_service $REDIS_SERVICE_ID "Redis"
deploy_service $BACKEND_SERVICE_ID "Backend"
deploy_service $FRONTEND_SERVICE_ID "Frontend"

echo "🎉 All deployments triggered! Services should be available in 2-3 minutes."
echo ""
echo "📍 Service URLs:"
echo "   Backend: https://backend-production-58eb.up.railway.app"
echo "   Frontend: https://frontend-production-df31.up.railway.app"
echo ""
echo "🔍 Monitor deployment status at: https://railway.app/project/$PROJECT_ID"