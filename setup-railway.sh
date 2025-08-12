#!/bin/bash

echo "🚂 Configurando Railway para Produção"
echo "======================================"
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar se está no diretório correto
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Execute este script na raiz do projeto telegram-bot-saas${NC}"
    exit 1
fi

# Verificar Railway CLI
if ! command -v railway &> /dev/null; then
    echo -e "${RED}❌ Railway CLI não instalada${NC}"
    echo "Instale com: brew install railway"
    exit 1
fi

echo "📋 Passo 1: Login no Railway"
echo "----------------------------"
railway login

echo ""
echo "📋 Passo 2: Selecionar Projeto"
echo "----------------------------"
echo "Projetos disponíveis:"
railway list

echo ""
echo -e "${YELLOW}Digite o nome do projeto (ex: ana-cardoso-bot-v2):${NC}"
read PROJECT_NAME

railway link $PROJECT_NAME

echo ""
echo "📋 Passo 3: Criar/Verificar Serviços"
echo "-----------------------------------"

# Criar serviço PostgreSQL
echo "🗄️ Configurando PostgreSQL..."
railway add -p postgresql

# Criar serviço Redis  
echo "🔄 Configurando Redis..."
railway add -p redis

echo ""
echo "📋 Passo 4: Obter Variáveis de Ambiente"
echo "--------------------------------------"

# Pegar DATABASE_URL
echo "Obtendo DATABASE_URL..."
DATABASE_URL=$(railway variables get DATABASE_URL 2>/dev/null)
if [ -z "$DATABASE_URL" ]; then
    echo -e "${YELLOW}⚠️ DATABASE_URL não encontrada. Criando PostgreSQL...${NC}"
    railway postgresql create
    sleep 5
    DATABASE_URL=$(railway variables get DATABASE_URL)
fi

# Pegar REDIS_URL
echo "Obtendo REDIS_URL..."
REDIS_URL=$(railway variables get REDIS_URL 2>/dev/null)
if [ -z "$REDIS_URL" ]; then
    echo -e "${YELLOW}⚠️ REDIS_URL não encontrada. Criando Redis...${NC}"
    railway redis create
    sleep 5
    REDIS_URL=$(railway variables get REDIS_URL)
fi

echo ""
echo "📋 Passo 5: Criar arquivo .env.production"
echo "----------------------------------------"

cat > backend/.env.production << EOF
# Railway Production Environment
# Gerado em: $(date)

# Database
DATABASE_URL="${DATABASE_URL}"

# Redis
REDIS_URL="${REDIS_URL}"

# App Config
NODE_ENV=production
PORT=\${PORT}

# Security
JWT_SECRET=$(openssl rand -hex 32)
JWT_REFRESH_SECRET=$(openssl rand -hex 32)
ENCRYPTION_KEY=$(openssl rand -hex 16)

# Features
ENABLE_REGISTRATION=true
ENABLE_EMAIL_VERIFICATION=false
LOG_LEVEL=info
EOF

echo -e "${GREEN}✅ Arquivo backend/.env.production criado${NC}"

echo ""
echo "📋 Passo 6: Executar Migrations"
echo "-------------------------------"
cd backend
npm run db:push
npm run db:generate
cd ..

echo ""
echo "📋 Passo 7: Deploy"
echo "-----------------"
echo "Deploy Backend..."
cd backend
railway up -d
cd ..

echo "Deploy Frontend..."
cd frontend
railway up -d
cd ..

echo ""
echo "======================================"
echo -e "${GREEN}✅ CONFIGURAÇÃO COMPLETA!${NC}"
echo "======================================"
echo ""
echo "📊 URLs dos Serviços:"
railway open
echo ""
echo "🔐 Credenciais salvas em:"
echo "   - backend/.env.production"
echo ""
echo "🚀 Próximos passos:"
echo "   1. Verifique o Railway Dashboard"
echo "   2. Teste as conexões com: node backend/test-railway-connection.js"
echo "   3. Acesse sua aplicação online"
echo ""
echo "💡 Dicas:"
echo "   - Use 'railway logs' para ver logs"
echo "   - Use 'railway run [comando]' para executar comandos no ambiente Railway"
echo "   - O Redis interno só funciona DENTRO do Railway, não localmente"