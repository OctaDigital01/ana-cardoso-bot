import { Router } from 'express'

const router = Router()

router.get('/status', (req, res) => {
  res.json({ 
    message: 'Bot routes funcionando',
    timestamp: new Date().toISOString()
  })
})

export { router as botRoutes }