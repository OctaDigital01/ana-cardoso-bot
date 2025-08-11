// Servidor simples para testar Railway
const express = require('express');
const app = express();
const port = process.env.PORT || 3333;

app.use(express.json());

// Routes básicas
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'TelegramBot Manager Backend is running!',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    memory: process.memoryUsage()
  });
});

app.get('/api/v1/status', (req, res) => {
  res.json({
    status: 'success',
    api: 'v1',
    message: 'API is working',
    endpoints: [
      'GET /',
      'GET /health',
      'GET /api/v1/status'
    ]
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 TelegramBot Manager Backend running on port ${port}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📊 Health check available at /health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});