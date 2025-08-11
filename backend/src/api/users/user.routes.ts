import { Router } from 'express'

const router = Router()

router.get('/status', (req, res) => {
  res.json({ 
    message: 'User routes funcionando',
    timestamp: new Date().toISOString()
  })
})

export { router as userRoutes }