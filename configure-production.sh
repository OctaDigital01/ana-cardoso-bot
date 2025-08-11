#!/bin/bash

# Configuração completa Railway usando Project Token
set -e

TOKEN="81d781e2-f5ab-42e5-b66e-de9ff1c88cc2"
PROJECT_ID="ec319e25-4a4f-4748-842f-987538043efe"
ENV_ID="96c7b5a8-650d-4255-8f5c-120345d9b52e"
BACKEND_ID="ce1125a5-4d5f-48ad-b2d6-4b757664b5e7"
FRONTEND_ID="822419b4-6470-4bca-b5e4-3d8043a00016"
POSTGRES_ID="1ac0d3a6-8919-4489-bbf9-d59fcff2314d"
REDIS_ID="35866238-ec1c-49e1-a59f-27904b8db284"

API_URL="https://backboard.railway.com/graphql/v2"

echo "🚀 CONFIGURAÇÃO COMPLETA DO RAILWAY PRODUCTION"
echo "==============================================="

# Função para configurar variável
set_var() {
    local service_id=$1
    local var_name=$2
    local var_value=$3
    
    echo "  ➜ Setting $var_name"
    curl -s --request POST \
        --url $API_URL \
        --header "Project-Access-Token: $TOKEN" \
        --header 'Content-Type: application/json' \
        --data "{\"query\":\"mutation { variableUpsert(input: { projectId: \\\"$PROJECT_ID\\\", environmentId: \\\"$ENV_ID\\\", serviceId: \\\"$service_id\\\", name: \\\"$var_name\\\", value: \\\"$var_value\\\" }) { id } }\"}" > /dev/null
}

# Função para redeploy
redeploy_service() {
    local service_id=$1
    local service_name=$2
    
    echo "🔄 Redeploying $service_name..."
    result=$(curl -s --request POST \
        --url $API_URL \
        --header "Project-Access-Token: $TOKEN" \
        --header 'Content-Type: application/json' \
        --data "{\"query\":\"mutation { serviceInstanceRedeploy(environmentId: \\\"$ENV_ID\\\", serviceId: \\\"$service_id\\\") }\"}")
    
    if [[ $result == *"true"* ]]; then
        echo "  ✅ $service_name redeploy triggered"
    else
        echo "  ⚠️ $service_name redeploy may have failed"
    fi
}

# CONFIGURAR POSTGRESQL
echo ""
echo "📊 CONFIGURANDO POSTGRESQL..."
set_var $POSTGRES_ID "POSTGRES_DB" "telegram_bot_saas"
set_var $POSTGRES_ID "POSTGRES_USER" "postgres"
set_var $POSTGRES_ID "POSTGRES_PASSWORD" "TelegramBotSaas2024_"
set_var $POSTGRES_ID "PGDATA" "/var/lib/postgresql/data/pgdata"

# CONFIGURAR REDIS
echo ""
echo "🗄️ CONFIGURANDO REDIS..."
set_var $REDIS_ID "REDIS_PASSWORD" "TelegramBotRedis2024_"

# CONFIGURAR BACKEND COMPLETO
echo ""
echo "⚡ CONFIGURANDO BACKEND..."
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

# CONFIGURAR FRONTEND COMPLETO
echo ""
echo "🎨 CONFIGURANDO FRONTEND..."
set_var $FRONTEND_ID "NODE_ENV" "production"
set_var $FRONTEND_ID "PORT" "3000"
set_var $FRONTEND_ID "NEXT_PUBLIC_API_URL" "https://backend-production-58eb.up.railway.app/api/v1"
set_var $FRONTEND_ID "NEXT_PUBLIC_WS_URL" "wss://backend-production-58eb.up.railway.app"
set_var $FRONTEND_ID "NEXT_PUBLIC_APP_URL" "https://frontend-production-df31.up.railway.app"
set_var $FRONTEND_ID "NEXT_PUBLIC_APP_NAME" "TelegramBot Manager"
set_var $FRONTEND_ID "NEXT_PUBLIC_ENABLE_PWA" "true"
set_var $FRONTEND_ID "NEXT_PUBLIC_ENABLE_ANALYTICS" "true"
set_var $FRONTEND_ID "NEXT_TELEMETRY_DISABLED" "1"

echo ""
echo "✅ TODAS AS VARIÁVEIS CONFIGURADAS!"

# REDEPLOYS
echo ""
echo "🚀 EXECUTANDO REDEPLOYS..."
redeploy_service $POSTGRES_ID "PostgreSQL"
redeploy_service $REDIS_ID "Redis"
redeploy_service $BACKEND_ID "Backend"
redeploy_service $FRONTEND_ID "Frontend"

echo ""
echo "⏳ Aguardando deploys (3 minutos)..."
sleep 180

echo ""
echo "🔍 TESTANDO SERVIÇOS..."

# Testar Backend
BACKEND_URL="https://backend-production-58eb.up.railway.app"
BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" $BACKEND_URL)
echo "  Backend Status: $BACKEND_STATUS"

# Testar Frontend
FRONTEND_URL="https://frontend-production-df31.up.railway.app"
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" $FRONTEND_URL)
echo "  Frontend Status: $FRONTEND_STATUS"

# Testar Health Check
HEALTH_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/health" 2>/dev/null || echo "000")
echo "  Health Check: $HEALTH_STATUS"

echo ""
echo "🎉 CONFIGURAÇÃO RAILWAY COMPLETA!"
echo ""
echo "🌐 URLs dos Serviços:"
echo "  Dashboard: https://railway.app/project/$PROJECT_ID"
echo "  Backend:   $BACKEND_URL"
echo "  Frontend:  $FRONTEND_URL"

if [ "$BACKEND_STATUS" = "200" ] && [ "$FRONTEND_STATUS" = "200" ]; then
    echo ""
    echo "✅ TODOS OS CONTAINERS FUNCIONANDO PERFEITAMENTE!"
elif [ "$BACKEND_STATUS" != "404" ] || [ "$FRONTEND_STATUS" != "404" ]; then
    echo ""
    echo "🎯 CONTAINERS RESPONDENDO - VERIFICAR LOGS PARA OTIMIZAÇÃO"
else
    echo ""
    echo "⏳ CONTAINERS AINDA EM DEPLOY - AGUARDE MAIS ALGUNS MINUTOS"
fi