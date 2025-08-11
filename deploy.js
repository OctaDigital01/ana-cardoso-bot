#!/usr/bin/env node

const https = require('https');
const { exec } = require('child_process');
const fs = require('fs');

const RAILWAY_TOKEN = 'd2ec8305-b445-41ee-a0fa-5bb663df7635';
const PROJECT_ID = '0adc8c81-cd40-4606-aa56-98ae535e7cb0';
const GITHUB_REPO = 'https://github.com/OctaDigital01/Telegram-BOT';

console.log('🚀 Starting Railway deployment...');

// GraphQL query to create services
const createServiceMutation = `
mutation ServiceCreate($input: ServiceCreateInput!) {
  serviceCreate(input: $input) {
    id
    name
  }
}
`;

// GraphQL query to deploy from GitHub
const deployFromGitHubMutation = `
mutation ServiceConnectRepo($serviceId: String!, $repo: String!, $branch: String!) {
  serviceConnect(serviceId: $serviceId) {
    connectRepo(repo: $repo, branch: $branch) {
      id
    }
  }
}
`;

function makeGraphQLRequest(query, variables) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      query,
      variables
    });

    const options = {
      hostname: 'backboard.railway.app',
      port: 443,
      path: '/graphql/v2',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RAILWAY_TOKEN}`,
        'Content-Length': data.length
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const result = JSON.parse(body);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

async function createBackendService() {
  console.log('📦 Creating backend service...');
  
  const variables = {
    input: {
      projectId: PROJECT_ID,
      name: 'telegram-bot-backend',
      source: {
        repo: GITHUB_REPO.replace('https://github.com/', ''),
        rootDirectory: 'backend'
      }
    }
  };

  try {
    const result = await makeGraphQLRequest(createServiceMutation, variables);
    console.log('✅ Backend service created:', result);
    return result.data?.serviceCreate?.id;
  } catch (error) {
    console.error('❌ Error creating backend service:', error);
    throw error;
  }
}

async function createFrontendService() {
  console.log('📦 Creating frontend service...');
  
  const variables = {
    input: {
      projectId: PROJECT_ID,
      name: 'telegram-bot-frontend',
      source: {
        repo: GITHUB_REPO.replace('https://github.com/', ''),
        rootDirectory: 'frontend'
      }
    }
  };

  try {
    const result = await makeGraphQLRequest(createServiceMutation, variables);
    console.log('✅ Frontend service created:', result);
    return result.data?.serviceCreate?.id;
  } catch (error) {
    console.error('❌ Error creating frontend service:', error);
    throw error;
  }
}

async function setEnvironmentVariables(serviceId, envVars) {
  console.log(`🔧 Setting environment variables for service ${serviceId}...`);
  
  const setVariableMutation = `
    mutation VariableCollectionUpsert($input: VariableCollectionUpsertInput!) {
      variableCollectionUpsert(input: $input)
    }
  `;

  for (const [key, value] of Object.entries(envVars)) {
    const variables = {
      input: {
        projectId: PROJECT_ID,
        serviceId: serviceId,
        replace: false,
        variables: {
          [key]: value
        }
      }
    };

    try {
      await makeGraphQLRequest(setVariableMutation, variables);
      console.log(`✅ Set ${key} environment variable`);
    } catch (error) {
      console.error(`❌ Error setting ${key}:`, error);
    }
  }
}

async function generateDomain(serviceId) {
  console.log(`🌐 Generating domain for service ${serviceId}...`);
  
  const generateDomainMutation = `
    mutation DomainCreate($input: DomainCreateInput!) {
      domainCreate(input: $input) {
        id
        domain
      }
    }
  `;

  const variables = {
    input: {
      serviceId: serviceId
    }
  };

  try {
    const result = await makeGraphQLRequest(generateDomainMutation, variables);
    console.log('✅ Domain generated:', result);
    return result.data?.domainCreate?.domain;
  } catch (error) {
    console.error('❌ Error generating domain:', error);
    throw error;
  }
}

async function deployServices() {
  try {
    console.log('🎯 Starting service deployment...');

    // Create backend service
    const backendServiceId = await createBackendService();
    if (!backendServiceId) {
      throw new Error('Failed to create backend service');
    }

    // Create frontend service
    const frontendServiceId = await createFrontendService();
    if (!frontendServiceId) {
      throw new Error('Failed to create frontend service');
    }

    // Set backend environment variables
    const backendEnvVars = {
      NODE_ENV: 'production',
      PORT: '3001',
      DATABASE_URL: 'postgresql://postgres:password@localhost:5432/telegram_bot_saas',
      JWT_SECRET: 'your-super-secret-jwt-key-here',
      TELEGRAM_BOT_TOKEN: 'your-telegram-bot-token-here',
      WEBHOOK_URL: 'https://your-backend-domain.railway.app',
      REDIS_URL: 'redis://localhost:6379',
      STRIPE_SECRET_KEY: 'your-stripe-secret-key',
      STRIPE_WEBHOOK_SECRET: 'your-stripe-webhook-secret'
    };

    await setEnvironmentVariables(backendServiceId, backendEnvVars);

    // Set frontend environment variables
    const frontendEnvVars = {
      NODE_ENV: 'production',
      NEXT_PUBLIC_API_URL: 'https://your-backend-domain.railway.app',
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: 'your-stripe-publishable-key'
    };

    await setEnvironmentVariables(frontendServiceId, frontendEnvVars);

    // Generate domains
    const backendDomain = await generateDomain(backendServiceId);
    const frontendDomain = await generateDomain(frontendServiceId);

    console.log('🎉 Deployment completed successfully!');
    console.log('📱 Backend URL:', backendDomain ? `https://${backendDomain}` : 'Domain generation pending...');
    console.log('🌐 Frontend URL:', frontendDomain ? `https://${frontendDomain}` : 'Domain generation pending...');
    
    // Save deployment info
    const deploymentInfo = {
      backendServiceId,
      frontendServiceId,
      backendDomain,
      frontendDomain,
      deployedAt: new Date().toISOString()
    };
    
    fs.writeFileSync('deployment-info.json', JSON.stringify(deploymentInfo, null, 2));
    console.log('💾 Deployment info saved to deployment-info.json');

  } catch (error) {
    console.error('💥 Deployment failed:', error);
    process.exit(1);
  }
}

// Run deployment
deployServices();