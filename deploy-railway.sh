#!/bin/bash

echo "🚀 Deploy Automatizado Railway - Ana Cardoso Bot"
echo ""

cd "/Users/andremartins/Desktop/Projetos Cursor/Ana Cardoso BOT/telegram-bot-saas"

# Deploy Backend
echo "⚡ Fazendo deploy do Backend..."
cd backend
railway link 2e7a4879-f9a3-40d7-89b6-4339e3c5e6ac --environment production
railway service backend
railway up --detach

# Deploy Frontend  
echo "🎨 Fazendo deploy do Frontend..."
cd ../frontend
railway link 2e7a4879-f9a3-40d7-89b6-4339e3c5e6ac --environment production
railway service frontend
railway up --detach

echo ""
echo "✅ Deploy iniciado!"
echo ""
echo "📊 URLs:"
echo "Backend: https://backend-production-7173.up.railway.app"
echo "Frontend: https://frontend-production-86d2.up.railway.app"
echo ""
echo "🔍 Dashboard: https://railway.com/project/2e7a4879-f9a3-40d7-89b6-4339e3c5e6ac"