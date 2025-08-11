import { Router } from 'express'

const router = Router()

// Rotas temporárias para testar
router.get('/status', (req, res) => {
  res.json({ 
    message: 'Auth routes funcionando',
    timestamp: new Date().toISOString()
  })
})

export { router as authRoutes }