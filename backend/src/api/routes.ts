import { Router } from 'express'
import { authRoutes } from './auth/auth.routes'
import { botRoutes } from './bots/bot.routes'
import { flowRoutes } from './flows/flow.routes'
import { messageRoutes } from './messages/message.routes'
import { paymentRoutes } from './payments/payment.routes'
import { analyticsRoutes } from './analytics/analytics.routes'
import { webhookRoutes } from './webhooks/webhook.routes'
import { userRoutes } from './users/user.routes'

const router = Router()

// Rotas públicas (sem autenticação)
router.use('/auth', authRoutes)
router.use('/webhooks', webhookRoutes)

// Rotas protegidas (com autenticação) - será implementado no próximo passo
router.use('/users', userRoutes)
router.use('/bots', botRoutes)
router.use('/flows', flowRoutes)
router.use('/messages', messageRoutes)
router.use('/payments', paymentRoutes)
router.use('/analytics', analyticsRoutes)

export { router as routes }