const express = require('express')
const app = express()
const port = process.env.PORT || 3333

app.get('/', (req, res) => {
  res.json({ message: 'Hello from Railway!', timestamp: new Date().toISOString() })
})

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  })
})

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`)
})