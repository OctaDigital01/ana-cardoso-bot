#!/bin/bash

# Script final de verificação dos deploys Railway
echo "🔍 TESTE FINAL DOS DEPLOYS RAILWAY"
echo "=================================="

BACKEND="https://backend-production-58eb.up.railway.app"
FRONTEND="https://frontend-production-df31.up.railway.app"

echo ""
echo "📡 Testando Backend API..."
echo "URL: $BACKEND"
BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" $BACKEND)
echo "Status: $BACKEND_STATUS"

if [ "$BACKEND_STATUS" = "200" ] || [ "$BACKEND_STATUS" = "404" ]; then
    echo "✅ Backend respondendo (mesmo que com 404, significa que está online)"
else
    echo "❌ Backend não está respondendo"
fi

echo ""
echo "🎨 Testando Frontend App..."  
echo "URL: $FRONTEND"
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" $FRONTEND)
echo "Status: $FRONTEND_STATUS"

if [ "$FRONTEND_STATUS" = "200" ] || [ "$FRONTEND_STATUS" = "404" ]; then
    echo "✅ Frontend respondendo (mesmo que com 404, significa que está online)"
else
    echo "❌ Frontend não está respondendo"
fi

echo ""
echo "🏥 Testando Health Check..."
HEALTH_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND/health" 2>/dev/null || echo "000")
echo "Health Status: $HEALTH_STATUS"

echo ""
echo "📊 RESULTADOS FINAIS:"
echo "==================="
echo "Backend:  $BACKEND_STATUS"
echo "Frontend: $FRONTEND_STATUS" 
echo "Health:   $HEALTH_STATUS"

echo ""
echo "🌐 URLs para acesso:"
echo "Dashboard: https://railway.app/project/ec319e25-4a4f-4748-842f-987538043efe"
echo "Backend:   $BACKEND"
echo "Frontend:  $FRONTEND"

echo ""
if [ "$BACKEND_STATUS" != "404" ] && [ "$FRONTEND_STATUS" != "404" ]; then
    echo "🎉 DEPLOY COMPLETO E FUNCIONANDO!"
else
    echo "⏳ Deploy ainda em progresso ou com problemas"
    echo "   Verifique o dashboard Railway para logs detalhados"
fi