# Railway Deployment Instructions

## Current Status
✅ Code pushed to GitHub: https://github.com/OctaDigital01/Telegram-BOT
✅ Project files cleaned and organized
✅ Docker configurations ready
✅ Railway token available: `d2ec8305-b445-41ee-a0fa-5bb663df7635`
✅ Railway project: https://railway.app/project/0adc8c81-cd40-4606-aa56-98ae535e7cb0

## IMMEDIATE ACTION REQUIRED

### Step 1: Access Railway Dashboard
1. Go to: https://railway.app/project/0adc8c81-cd40-4606-aa56-98ae535e7cb0
2. Login with your account that has the token `d2ec8305-b445-41ee-a0fa-5bb663df7635`

### Step 2: Create Backend Service
1. Click "New Service" → "GitHub Repo"
2. Connect to repository: `OctaDigital01/Telegram-BOT`
3. Set the following configuration:
   - **Service Name**: `telegram-bot-backend`
   - **Root Directory**: `backend`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Port**: `3333`

### Step 3: Backend Environment Variables
Add these environment variables in Railway:
```
NODE_ENV=production
PORT=3333
DATABASE_URL=postgresql://postgres:password@postgres.railway.internal:5432/telegram_bot_saas
JWT_SECRET=your-super-secret-jwt-key-change-in-production-now
REDIS_URL=redis://redis.railway.internal:6379
TELEGRAM_BOT_TOKEN=your-telegram-bot-token-here
WEBHOOK_URL=https://telegram-bot-backend.railway.app
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
```

### Step 4: Create Frontend Service  
1. Click "New Service" → "GitHub Repo"
2. Connect to same repository: `OctaDigital01/Telegram-BOT`
3. Set the following configuration:
   - **Service Name**: `telegram-bot-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Port**: `3000`

### Step 5: Frontend Environment Variables
Add these environment variables in Railway:
```
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://telegram-bot-backend.railway.app
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
NEXT_TELEMETRY_DISABLED=1
```

### Step 6: Create Database Service
1. Click "New Service" → "Database" → "PostgreSQL"
2. Railway will automatically create the database
3. Copy the connection string and update the `DATABASE_URL` in backend

### Step 7: Create Redis Service
1. Click "New Service" → "Database" → "Redis"
2. Railway will automatically create Redis
3. Copy the connection string and update the `REDIS_URL` in backend

### Step 8: Generate Domains
1. Go to each service settings
2. Click "Generate Domain" for both frontend and backend
3. Update the environment variables with actual domains

### Step 9: Deploy & Monitor
1. Click "Deploy" on each service
2. Monitor the deployment logs
3. Check that all services are running
4. Test the generated URLs

## Expected URLs After Deployment
- **Frontend**: https://telegram-bot-frontend.railway.app
- **Backend**: https://telegram-bot-backend.railway.app  
- **Database**: Internal PostgreSQL connection
- **Redis**: Internal Redis connection

## Important Notes
- Update all placeholder tokens/keys with real values
- Check that ports match in Dockerfiles and environment variables
- Ensure database migrations run correctly
- Test all endpoints after deployment

## Troubleshooting
- If build fails, check logs in Railway dashboard
- Ensure all dependencies are listed in package.json
- Verify Dockerfile paths are correct
- Check that environment variables are set correctly

The project is READY for deployment - just follow these steps in Railway's web interface!