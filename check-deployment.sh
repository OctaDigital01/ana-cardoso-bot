#!/bin/bash

# Script para verificar status dos deployments
set -e

echo "🔍 Verificando status dos deployments Railway..."

# URLs para testar
BACKEND_URL="https://backend-production-58eb.up.railway.app"
FRONTEND_URL="https://frontend-production-df31.up.railway.app"

echo "📡 Testando Backend ($BACKEND_URL)..."
echo "Response:"
curl -s -w "\nStatus: %{http_code}\nTime: %{time_total}s\n" $BACKEND_URL || echo "❌ Backend não respondeu"

echo ""
echo "🎨 Testando Frontend ($FRONTEND_URL)..."  
echo "Response:"
curl -s -w "\nStatus: %{http_code}\nTime: %{time_total}s\n" $FRONTEND_URL || echo "❌ Frontend não respondeu"

echo ""
echo "🏥 Testando Health Check do Backend..."
curl -s -w "\nStatus: %{http_code}\n" "$BACKEND_URL/health" || echo "❌ Health check falhou"

echo ""
echo "📊 Dashboard: https://railway.app/project/ec319e25-4a4f-4748-842f-987538043efe"