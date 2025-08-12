const express = require('express');

const app = express();
const PORT = process.env.PORT || 3333;

app.get('/', (req, res) => {
  res.json({ message: 'Backend is working!', timestamp: new Date().toISOString() });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    service: 'backend',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});