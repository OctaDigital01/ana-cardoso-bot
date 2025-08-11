#!/usr/bin/env node

const https = require('https');

console.log('🔍 Verifying live deployment...');

// URLs to check (update these with actual Railway URLs after deployment)
const BACKEND_URL = 'https://telegram-bot-backend.railway.app';
const FRONTEND_URL = 'https://telegram-bot-frontend.railway.app';

function checkUrl(url, name) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    
    https.get(url, (res) => {
      const responseTime = Date.now() - startTime;
      console.log(`✅ ${name}: Status ${res.statusCode} (${responseTime}ms)`);
      console.log(`   URL: ${url}`);
      resolve({ success: true, status: res.statusCode, responseTime });
    }).on('error', (error) => {
      console.log(`❌ ${name}: ${error.message}`);
      console.log(`   URL: ${url}`);
      resolve({ success: false, error: error.message });
    });
  });
}

async function verifyDeployment() {
  console.log('\n📡 Checking service endpoints...\n');
  
  // Check backend health
  await checkUrl(`${BACKEND_URL}/health`, 'Backend Health');
  await checkUrl(`${BACKEND_URL}/api/health`, 'Backend API Health');
  
  // Check frontend
  await checkUrl(FRONTEND_URL, 'Frontend');
  await checkUrl(`${FRONTEND_URL}/health`, 'Frontend Health');
  
  console.log('\n🎯 API Endpoints Test:');
  await checkUrl(`${BACKEND_URL}/api/auth/status`, 'Auth Status');
  await checkUrl(`${BACKEND_URL}/api/users`, 'Users API');
  await checkUrl(`${BACKEND_URL}/api/bots`, 'Bots API');
  
  console.log('\n📊 Deployment Summary:');
  console.log(`🔗 Frontend: ${FRONTEND_URL}`);
  console.log(`🔗 Backend:  ${BACKEND_URL}`);
  console.log(`📖 Admin Dashboard: ${FRONTEND_URL}/admin`);
  console.log(`📋 API Docs: ${BACKEND_URL}/api-docs`);
  
  console.log('\n✅ Verification complete!');
  console.log('💡 Update the URLs in this script with actual Railway domains');
}

// Run verification
verifyDeployment().catch(console.error);