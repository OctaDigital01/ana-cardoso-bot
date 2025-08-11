#!/bin/bash

# Script para configurar projeto Railway automaticamente
# Executar após criar o projeto manualmente na interface web

echo "🚂 Configurando projeto Railway..."

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m' 
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log() { echo -e "${GREEN}[$(date +'%H:%M:%S')] $1${NC}"; }
info() { echo -e "${BLUE}[INFO] $1${NC}"; }
warn() { echo -e "${YELLOW}[WARN] $1${NC}"; }
error() { echo -e "${RED}[ERROR] $1${NC}"; }

# Verificar se está logado
if ! railway whoami &> /dev/null; then
    error "Faça login primeiro: railway login"
    exit 1
fi

# Verificar se projeto está linkado
if ! railway status &> /dev/null; then
    error "Link o projeto primeiro: railway link [project-id]"
    info "Ou crie um projeto em: https://railway.app"
    exit 1
fi

log "✅ Projeto Railway detectado"

# Função para configurar variáveis do backend
setup_backend_vars() {
    log "🔧 Configurando variáveis do backend..."
    
    # Variáveis essenciais
    railway variables set NODE_ENV=production --service backend
    railway variables set JWT_SECRET="telegram-bot-manager-super-secret-jwt-key-production-32-chars" --service backend
    railway variables set JWT_REFRESH_SECRET="telegram-bot-manager-super-secret-refresh-key-production-32-chars" --service backend
    railway variables set ENCRYPTION_KEY="telegrambotmanager32charkey12345" --service backend
    railway variables set RATE_LIMIT_WINDOW=60000 --service backend
    railway variables set RATE_LIMIT_MAX=1000 --service backend
    railway variables set LOG_LEVEL=info --service backend
    railway variables set ENABLE_REGISTRATION=true --service backend
    railway variables set ENABLE_SWAGGER=false --service backend
    
    log "✅ Variáveis do backend configuradas"
}

# Função para configurar variáveis do frontend
setup_frontend_vars() {
    log "🎨 Configurando variáveis do frontend..."
    
    railway variables set NODE_ENV=production --service frontend
    railway variables set NEXT_PUBLIC_APP_NAME="TelegramBot Manager" --service frontend
    railway variables set NEXT_PUBLIC_ENABLE_PWA=true --service frontend
    railway variables set NEXT_PUBLIC_ENABLE_ANALYTICS=true --service frontend
    railway variables set NEXT_TELEMETRY_DISABLED=1 --service frontend
    
    log "✅ Variáveis do frontend configuradas"
}

# Função para fazer deploy
deploy_services() {
    log "🚀 Fazendo deploy dos serviços..."
    
    # Deploy backend
    info "Deploying backend..."
    railway up --service backend --detach
    
    # Deploy frontend  
    info "Deploying frontend..."
    railway up --service frontend --detach
    
    log "✅ Deploy iniciado"
}

# Função para gerar domínios
setup_domains() {
    log "🌐 Configurando domínios..."
    
    # Gerar domínio para backend
    info "Gerando domínio para backend..."
    railway domain generate --service backend
    
    # Gerar domínio para frontend
    info "Gerando domínio para frontend..."
    railway domain generate --service frontend
    
    log "✅ Domínios gerados"
}

# Função para executar migrations
run_migrations() {
    log "🗄️ Executando migrations do banco..."
    
    # Aguardar backend estar online
    sleep 60
    
    # Executar migrations
    railway run --service backend npx prisma migrate deploy
    railway run --service backend npx prisma db seed
    
    log "✅ Migrations executadas"
}

# Função para verificar status
check_status() {
    log "📊 Verificando status dos serviços..."
    
    railway status
    
    echo ""
    info "🌐 URLs dos serviços:"
    railway domain list
    
    echo ""
    warn "⏳ Os serviços podem levar alguns minutos para ficarem totalmente online"
}

# Menu principal
main() {
    log "🎯 Script de configuração Railway - TelegramBot Manager"
    
    read -p "Executar configuração completa? (y/n): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        setup_backend_vars
        setup_frontend_vars
        deploy_services
        setup_domains
        run_migrations
        check_status
        
        log "🎉 Configuração concluída!"
        info "Acesse os domínios gerados para ver sua aplicação funcionando"
    else
        warn "Configuração cancelada"
    fi
}

# Executar menu
main