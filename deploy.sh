#!/bin/bash

# Deploy script para Railway - TelegramBot Manager SaaS
# Este script vai configurar e fazer deploy de toda a aplicação

echo "🚀 Iniciando deploy do TelegramBot Manager..."

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m' 
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Função para log colorido
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[WARN] $1${NC}"
}

info() {
    echo -e "${BLUE}[INFO] $1${NC}"
}

# Verificar se Railway CLI está instalado
if ! command -v railway &> /dev/null; then
    error "Railway CLI não encontrado. Instalando..."
    npm install -g @railway/cli
fi

# Fazer login se necessário
if ! railway whoami &> /dev/null; then
    error "Não logado no Railway. Execute 'railway login' primeiro."
    exit 1
fi

log "✅ Railway CLI configurado"

# Configurar variáveis de ambiente
setup_env() {
    log "🔧 Configurando variáveis de ambiente..."
    
    # Backend environment variables
    railway variables set NODE_ENV=production
    railway variables set JWT_SECRET="telegram-bot-manager-super-secret-jwt-key-production-32-chars"
    railway variables set JWT_REFRESH_SECRET="telegram-bot-manager-super-secret-refresh-key-production-32-chars"
    railway variables set ENCRYPTION_KEY="telegrambotmanager32charkey12345"
    railway variables set RATE_LIMIT_WINDOW=60000
    railway variables set RATE_LIMIT_MAX=1000
    railway variables set LOG_LEVEL=info
    railway variables set ENABLE_REGISTRATION=true
    
    log "✅ Variáveis de ambiente configuradas"
}

# Deploy dos serviços
deploy_services() {
    log "🚀 Fazendo deploy dos serviços..."
    
    # Deploy do projeto completo
    railway up --detach
    
    log "✅ Deploy iniciado"
}

# Configurar domínios
setup_domains() {
    log "🌐 Configurando domínios..."
    
    # Gerar domínios Railway
    railway domain
    
    log "✅ Domínios configurados"
}

# Verificar deploy
check_deployment() {
    log "🔍 Verificando deployment..."
    
    # Ver status dos serviços
    railway status
    
    # Ver logs
    railway logs
    
    log "✅ Verificação concluída"
}

# Executar pipeline de deploy
main() {
    log "🎯 Iniciando pipeline de deploy completo..."
    
    setup_env
    deploy_services
    setup_domains
    check_deployment
    
    log "🎉 Deploy concluído com sucesso!"
    info "🌐 Acesse sua aplicação nos domínios gerados pelo Railway"
    info "📊 Use 'railway logs' para monitorar os logs"
    info "🔧 Use 'railway status' para verificar o status"
}

# Executar se chamado diretamente
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi