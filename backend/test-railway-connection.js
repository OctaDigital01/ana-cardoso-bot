const { PrismaClient } = require('@prisma/client');
const Redis = require('ioredis');
require('dotenv').config();

console.log('🔍 Testando conexões com Railway...\n');

// Teste PostgreSQL
async function testPostgreSQL() {
  console.log('📊 Testando PostgreSQL...');
  const prisma = new PrismaClient();
  
  try {
    // Tenta conectar e fazer uma query simples
    await prisma.$connect();
    const result = await prisma.$queryRaw`SELECT NOW() as current_time, version() as version`;
    console.log('✅ PostgreSQL conectado com sucesso!');
    console.log('   Versão:', result[0].version);
    console.log('   Hora do servidor:', result[0].current_time);
    
    // Verifica se existem tabelas
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    console.log('   Tabelas encontradas:', tables.length);
    
    await prisma.$disconnect();
    return true;
  } catch (error) {
    console.error('❌ Erro ao conectar PostgreSQL:');
    console.error('   ', error.message);
    await prisma.$disconnect();
    return false;
  }
}

// Teste Redis
async function testRedis() {
  console.log('\n🔄 Testando Redis...');
  
  // Tenta com URL do Railway interno primeiro
  const redisUrls = [
    process.env.REDIS_URL,
    'redis://default:@redis.railway.internal:6379',
    // Se tiver uma URL pública, adicione aqui
  ];
  
  for (const url of redisUrls) {
    if (!url) continue;
    
    console.log(`   Tentando: ${url.replace(/:[^:@]*@/, ':****@')}`);
    const redis = new Redis(url, {
      retryStrategy: () => null, // Não retry para teste rápido
      connectTimeout: 5000,
      lazyConnect: true
    });
    
    try {
      await redis.connect();
      const pong = await redis.ping();
      console.log('✅ Redis conectado com sucesso!');
      console.log('   Resposta:', pong);
      
      // Testa set/get
      await redis.set('test_key', 'test_value');
      const value = await redis.get('test_key');
      console.log('   Set/Get funcionando:', value === 'test_value' ? '✅' : '❌');
      await redis.del('test_key');
      
      redis.disconnect();
      return true;
    } catch (error) {
      console.log('   ❌ Falhou:', error.message);
      redis.disconnect();
    }
  }
  
  console.error('❌ Não foi possível conectar ao Redis');
  return false;
}

// Teste de conectividade de rede
async function testNetworkConnectivity() {
  console.log('\n🌐 Testando conectividade de rede...');
  
  const hosts = [
    { name: 'Railway PostgreSQL', host: 'autorack.proxy-production.railway.app', port: 23346 },
    { name: 'Railway Redis (interno)', host: 'redis.railway.internal', port: 6379 },
  ];
  
  const net = require('net');
  
  for (const target of hosts) {
    await new Promise(resolve => {
      const socket = new net.Socket();
      let connected = false;
      
      socket.setTimeout(3000);
      
      socket.on('connect', () => {
        console.log(`✅ ${target.name}: Alcançável em ${target.host}:${target.port}`);
        connected = true;
        socket.destroy();
        resolve();
      });
      
      socket.on('timeout', () => {
        if (!connected) {
          console.log(`⏱️  ${target.name}: Timeout ao conectar`);
          socket.destroy();
          resolve();
        }
      });
      
      socket.on('error', (err) => {
        if (!connected) {
          console.log(`❌ ${target.name}: ${err.message}`);
          resolve();
        }
      });
      
      socket.connect(target.port, target.host);
    });
  }
}

// Verificar variáveis de ambiente
function checkEnvVars() {
  console.log('\n🔐 Variáveis de ambiente:');
  const vars = {
    'DATABASE_URL': process.env.DATABASE_URL ? '✅ Configurada' : '❌ Não configurada',
    'REDIS_URL': process.env.REDIS_URL ? '✅ Configurada' : '❌ Não configurada',
    'NODE_ENV': process.env.NODE_ENV || 'development',
    'PORT': process.env.PORT || '3333'
  };
  
  for (const [key, value] of Object.entries(vars)) {
    console.log(`   ${key}: ${value}`);
  }
}

// Executar todos os testes
async function runAllTests() {
  console.log('=====================================');
  console.log('   TESTE DE CONEXÃO RAILWAY');
  console.log('=====================================\n');
  
  checkEnvVars();
  await testNetworkConnectivity();
  
  const pgOk = await testPostgreSQL();
  const redisOk = await testRedis();
  
  console.log('\n=====================================');
  console.log('   RESUMO');
  console.log('=====================================');
  console.log('PostgreSQL:', pgOk ? '✅ Funcionando' : '❌ Com problemas');
  console.log('Redis:', redisOk ? '✅ Funcionando' : '❌ Com problemas');
  console.log('\n💡 Dica: Se o Redis falhar, é normal - ele pode estar configurado apenas para acesso interno no Railway');
  
  process.exit(0);
}

runAllTests().catch(console.error);