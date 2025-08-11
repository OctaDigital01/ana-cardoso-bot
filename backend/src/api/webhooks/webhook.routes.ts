import { Router } from 'express'
import { TelegramService } from '@/services/telegram'
import { logger } from '@/utils/logger'

const router = Router()

// Webhook do Telegram para cada bot
router.post('/telegram/:botId', async (req, res) => {
  try {
    const { botId } = req.params
    const update = req.body

    logger.info(`Webhook received for bot ${botId}:`, update)

    // Processar update do Telegram
    await TelegramService.handleWebhook(botId, update)

    res.status(200).send('OK')
  } catch (error) {
    logger.error('Error processing webhook:', error)
    res.status(200).send('OK') // Sempre retornar 200 para o Telegram
  }
})

// Status do webhook
router.get('/status', (req, res) => {
  res.json({ 
    message: 'Webhook routes funcionando',
    timestamp: new Date().toISOString()
  })
})

// Verificar webhook de um bot específico
router.get('/telegram/:botId/info', async (req, res) => {
  try {
    const { botId } = req.params
    
    res.json({
      botId,
      webhookUrl: `${process.env.API_URL || 'https://backend-production-7173.up.railway.app'}/api/v1/webhooks/telegram/${botId}`,
      status: 'configured'
    })
  } catch (error) {
    logger.error('Error getting webhook info:', error)
    res.status(500).json({ error: 'Erro ao obter informações do webhook' })
  }
})

export { router as webhookRoutes }