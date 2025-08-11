#!/bin/bash

# Script para configurar todas as variáveis do Railway automaticamente
set -e

TOKEN="d2ec8305-b445-41ee-a0fa-5bb663df7635"
PROJECT_ID="ec319e25-4a4f-4748-842f-987538043efe"
ENV_ID="96c7b5a8-650d-4255-8f5c-120345d9b52e"
BACKEND_ID="ce1125a5-4d5f-48ad-b2d6-4b757664b5e7"
FRONTEND_ID="822419b4-6470-4bca-b5e4-3d8043a00016"
POSTGRES_ID="1ac0d3a6-8919-4489-bbf9-d59fcff2314d"
REDIS_ID="35866238-ec1c-49e1-a59f-27904b8db284"

API_URL="https://backboard.railway.com/graphql/v2"

echo "🚀 Configurando Railway com todas as variáveis..."

# Função para configurar variável
set_var() {
    local service_id=$1
    local var_name=$2
    local var_value=$3
    
    echo "Setting $var_name for service $service_id..."
    curl -s --request POST \
        --url $API_URL \
        --header "Authorization: Bearer $TOKEN" \
        --header 'Content-Type: application/json' \
        --data "{\"query\":\"mutation { variableUpsert(input: { projectId: \\\"$PROJECT_ID\\\", environmentId: \\\"$ENV_ID\\\", serviceId: \\\"$service_id\\\", name: \\\"$var_name\\\", value: \\\"$var_value\\\" }) { id } }\"}" > /dev/null
}

# Configurar variáveis do PostgreSQL
echo "📊 Configurando PostgreSQL..."
set_var $POSTGRES_ID "POSTGRES_DB" "telegram_bot_saas"
set_var $POSTGRES_ID "POSTGRES_USER" "postgres"
set_var $POSTGRES_ID "POSTGRES_PASSWORD" "TelegramBotSaas2024_"
set_var $POSTGRES_ID "PGDATA" "/var/lib/postgresql/data/pgdata"

# Configurar variáveis do Redis
echo "🗄️ Configurando Redis..."
set_var $REDIS_ID "REDIS_PASSWORD" "TelegramBotRedis2024_"

# Configurar variáveis do Backend
echo "⚡ Configurando Backend..."
set_var $BACKEND_ID "NODE_ENV" "production"
set_var $BACKEND_ID "PORT" "3333"
set_var $BACKEND_ID "DATABASE_URL" "postgresql://postgres:TelegramBotSaas2024_@postgres.railway.internal:5432/telegram_bot_saas"
set_var $BACKEND_ID "REDIS_URL" "redis://default:TelegramBotRedis2024_@redis.railway.internal:6379"
set_var $BACKEND_ID "JWT_SECRET" "telegram-bot-manager-super-secret-jwt-key-production-32-chars"
set_var $BACKEND_ID "JWT_REFRESH_SECRET" "telegram-bot-manager-super-secret-refresh-key-production-32-chars"
set_var $BACKEND_ID "ENCRYPTION_KEY" "telegrambotmanager32charkey12345"
set_var $BACKEND_ID "API_URL" "https://backend-production-58eb.up.railway.app"
set_var $BACKEND_ID "FRONTEND_URL" "https://frontend-production-df31.up.railway.app"
set_var $BACKEND_ID "TELEGRAM_WEBHOOK_DOMAIN" "https://backend-production-58eb.up.railway.app"
set_var $BACKEND_ID "RATE_LIMIT_WINDOW" "60000"
set_var $BACKEND_ID "RATE_LIMIT_MAX" "1000"
set_var $BACKEND_ID "LOG_LEVEL" "info"
set_var $BACKEND_ID "ENABLE_REGISTRATION" "true"
set_var $BACKEND_ID "ENABLE_SWAGGER" "false"

# Configurar variáveis do Frontend
echo "🎨 Configurando Frontend..."
set_var $FRONTEND_ID "NODE_ENV" "production"
set_var $FRONTEND_ID "PORT" "3000"
set_var $FRONTEND_ID "NEXT_PUBLIC_API_URL" "https://backend-production-58eb.up.railway.app/api/v1"
set_var $FRONTEND_ID "NEXT_PUBLIC_WS_URL" "wss://backend-production-58eb.up.railway.app"
set_var $FRONTEND_ID "NEXT_PUBLIC_APP_URL" "https://frontend-production-df31.up.railway.app"
set_var $FRONTEND_ID "NEXT_PUBLIC_APP_NAME" "TelegramBot Manager"
set_var $FRONTEND_ID "NEXT_PUBLIC_ENABLE_PWA" "true"
set_var $FRONTEND_ID "NEXT_PUBLIC_ENABLE_ANALYTICS" "true"
set_var $FRONTEND_ID "NEXT_TELEMETRY_DISABLED" "1"

echo "✅ Todas as variáveis configuradas!"

# Redeploy todos os serviços
echo "🔄 Redeployando todos os serviços..."

curl -s --request POST \
    --url $API_URL \
    --header "Authorization: Bearer $TOKEN" \
    --header 'Content-Type: application/json' \
    --data "{\"query\":\"mutation { serviceInstanceRedeploy(environmentId: \\\"$ENV_ID\\\", serviceId: \\\"$POSTGRES_ID\\\") }\"}" > /dev/null

curl -s --request POST \
    --url $API_URL \
    --header "Authorization: Bearer $TOKEN" \
    --header 'Content-Type: application/json' \
    --data "{\"query\":\"mutation { serviceInstanceRedeploy(environmentId: \\\"$ENV_ID\\\", serviceId: \\\"$REDIS_ID\\\") }\"}" > /dev/null

curl -s --request POST \
    --url $API_URL \
    --header "Authorization: Bearer $TOKEN" \
    --header 'Content-Type: application/json' \
    --data "{\"query\":\"mutation { serviceInstanceRedeploy(environmentId: \\\"$ENV_ID\\\", serviceId: \\\"$BACKEND_ID\\\") }\"}" > /dev/null

curl -s --request POST \
    --url $API_URL \
    --header "Authorization: Bearer $TOKEN" \
    --header 'Content-Type: application/json' \
    --data "{\"query\":\"mutation { serviceInstanceRedeploy(environmentId: \\\"$ENV_ID\\\", serviceId: \\\"$FRONTEND_ID\\\") }\"}" > /dev/null

echo "🎉 Configuração completa! Deploy em andamento..."
echo ""
echo "🌐 URLs dos serviços:"
echo "  Backend:  https://backend-production-58eb.up.railway.app"
echo "  Frontend: https://frontend-production-df31.up.railway.app"
echo ""
echo "📊 Dashboard: https://railway.app/project/$PROJECT_ID"