import { Router } from 'express'

const router = Router()

router.get('/status', (req, res) => {
  res.json({ 
    message: 'Webhook routes funcionando',
    timestamp: new Date().toISOString()
  })
})

export { router as webhookRoutes }