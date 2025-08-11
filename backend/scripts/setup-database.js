#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

async function setupDatabase() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔄 Conectando ao banco de dados...');
    
    // Test connection
    await prisma.$connect();
    console.log('✅ Conectado ao banco de dados com sucesso!');
    
    // Clear existing data
    console.log('🧹 Limpando dados existentes...');
    await prisma.session.deleteMany();
    await prisma.analytics.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.interaction.deleteMany();
    await prisma.conversation.deleteMany();
    await prisma.message.deleteMany();
    await prisma.command.deleteMany();
    await prisma.flow.deleteMany();
    await prisma.bot.deleteMany();
    await prisma.refund.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.user.deleteMany();
    await prisma.job.deleteMany();
    await prisma.webhook.deleteMany();
    
    console.log('✅ Dados limpos com sucesso!');
    
    // Create default admin user
    console.log('👤 Criando usuário administrador...');
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@anacardoso.com',
        password: hashedPassword,
        name: 'Administrador',
        plan: 'ENTERPRISE',
        active: true,
      }
    });
    
    console.log(`✅ Usuário administrador criado: ${adminUser.email}`);
    
    // Create test user
    console.log('👤 Criando usuário de teste...');
    const testPassword = await bcrypt.hash('teste123', 12);
    
    const testUser = await prisma.user.create({
      data: {
        email: 'teste@example.com',
        password: testPassword,
        name: 'Usuário Teste',
        plan: 'FREE',
        active: true,
      }
    });
    
    console.log(`✅ Usuário de teste criado: ${testUser.email}`);
    
    // Create sample bot for test user
    console.log('🤖 Criando bot de exemplo...');
    const sampleBot = await prisma.bot.create({
      data: {
        userId: testUser.id,
        token: 'encrypted_sample_token_12345',
        username: 'exemplo_bot',
        firstName: 'Bot de Exemplo',
        name: 'Bot de Atendimento',
        description: 'Bot de exemplo para demonstração',
        active: true,
        settings: {},
      }
    });
    
    console.log(`✅ Bot de exemplo criado: @${sampleBot.username}`);
    
    // Create sample analytics
    console.log('📊 Criando dados de analytics...');
    await prisma.analytics.createMany({
      data: [
        {
          userId: testUser.id,
          botId: sampleBot.id,
          event: 'message_sent',
          data: { count: 150, type: 'welcome' },
        },
        {
          userId: testUser.id,
          botId: sampleBot.id,
          event: 'user_interaction',
          data: { count: 75, type: 'button_click' },
        },
        {
          userId: testUser.id,
          event: 'user_registered',
          data: { plan: 'FREE' },
        },
      ]
    });
    
    console.log('✅ Dados de analytics criados!');
    
    // Create sample notifications
    console.log('🔔 Criando notificações...');
    await prisma.notification.createMany({
      data: [
        {
          userId: adminUser.id,
          type: 'SYSTEM',
          title: 'Sistema Inicializado',
          content: 'O sistema foi configurado com sucesso!',
        },
        {
          userId: testUser.id,
          type: 'INFO',
          title: 'Bem-vindo!',
          content: 'Sua conta foi criada com sucesso. Comece criando seu primeiro bot!',
        },
      ]
    });
    
    console.log('✅ Notificações criadas!');
    
    console.log('\n🎉 Configuração do banco de dados concluída com sucesso!');
    console.log('\n📋 Credenciais criadas:');
    console.log(`   Admin: admin@anacardoso.com / admin123`);
    console.log(`   Teste: teste@example.com / teste123`);
    console.log('\n🚀 Sistema pronto para uso!');
    
  } catch (error) {
    console.error('❌ Erro ao configurar banco de dados:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  setupDatabase();
}

module.exports = { setupDatabase };