const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Ana Cardoso Bot Manager</title>
        <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
            .status { color: green; font-weight: bold; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🤖 Ana Cardoso Bot Manager</h1>
            <p class="status">✅ Frontend is working!</p>
            <p>Sistema SaaS para gerenciamento de bots do Telegram</p>
            <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
            <hr>
            <p><strong>Backend API:</strong> <a href="https://backend-production-7173.up.railway.app/health" target="_blank">Test Backend</a></p>
        </div>
    </body>
    </html>
  `);
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    service: 'frontend',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.listen(PORT, () => {
  console.log(`Frontend running on port ${PORT}`);
});