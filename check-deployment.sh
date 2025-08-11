#\!/bin/bash

echo "🔍 Verificando deployment Railway..."
echo "📊 Dashboard: https://railway.com/project/2e7a4879-f9a3-40d7-89b6-4339e3c5e6ac"
echo ""

# Backend status
echo "⚡ Backend:"
railway service backend > /dev/null 2>&1
echo "Build Logs: https://railway.com/project/2e7a4879-f9a3-40d7-89b6-4339e3c5e6ac/service/aab90630-3e84-44f8-9255-4dbdc0f0174b"

echo ""

# Frontend status  
echo "🎨 Frontend:"
railway service frontend > /dev/null 2>&1
echo "Build Logs: https://railway.com/project/2e7a4879-f9a3-40d7-89b6-4339e3c5e6ac/service/b46606da-98f5-42ef-b2a9-acd15ab0001e"

