import { Router } from 'express'
import { TelegramService } from '@/services/telegram'
import { authenticate } from '@/middlewares/auth'
import { logger } from '@/utils/logger'

const router = Router()

// Todas as rotas precisam de autenticação
router.use(authenticate)

// Listar todos os bots do usuário
router.get('/', async (req, res) => {
  try {
    const userId = req.user?.id
    if (!userId) {
      return res.status(401).json({ error: 'Usuário não autenticado' })
    }

    const bots = await TelegramService.getAllBots(userId)
    res.json({ bots })
  } catch (error) {
    logger.error('Error getting bots:', error)
    res.status(500).json({ error: 'Erro ao buscar bots' })
  }
})

// Obter bot específico
router.get('/:botId', async (req, res) => {
  try {
    const userId = req.user?.id
    if (!userId) {
      return res.status(401).json({ error: 'Usuário não autenticado' })
    }

    const bot = await TelegramService.getBotById(req.params.botId, userId)
    if (!bot) {
      return res.status(404).json({ error: 'Bot não encontrado' })
    }

    // Não retornar o token criptografado
    const { token, ...botData } = bot
    res.json({ bot: botData })
  } catch (error) {
    logger.error('Error getting bot:', error)
    res.status(500).json({ error: 'Erro ao buscar bot' })
  }
})

// Criar novo bot
router.post('/', async (req, res) => {
  try {
    const userId = req.user?.id
    if (!userId) {
      return res.status(401).json({ error: 'Usuário não autenticado' })
    }

    const { token, name } = req.body
    
    if (!token) {
      return res.status(400).json({ error: 'Token do Telegram é obrigatório' })
    }

    const bot = await TelegramService.createBot(userId, token, name)
    
    // Não retornar o token criptografado
    const { token: _, ...botData } = bot
    res.status(201).json({ 
      message: 'Bot criado com sucesso',
      bot: botData 
    })
  } catch (error: any) {
    logger.error('Error creating bot:', error)
    res.status(400).json({ error: error.message || 'Erro ao criar bot' })
  }
})

// Atualizar bot
router.put('/:botId', async (req, res) => {
  try {
    const userId = req.user?.id
    if (!userId) {
      return res.status(401).json({ error: 'Usuário não autenticado' })
    }

    const { token, name } = req.body
    const bot = await TelegramService.updateBot(req.params.botId, token, name)
    
    // Não retornar o token criptografado
    const { token: _, ...botData } = bot
    res.json({ 
      message: 'Bot atualizado com sucesso',
      bot: botData 
    })
  } catch (error: any) {
    logger.error('Error updating bot:', error)
    res.status(400).json({ error: error.message || 'Erro ao atualizar bot' })
  }
})

// Iniciar bot
router.post('/:botId/start', async (req, res) => {
  try {
    const userId = req.user?.id
    if (!userId) {
      return res.status(401).json({ error: 'Usuário não autenticado' })
    }

    await TelegramService.startBot(req.params.botId)
    res.json({ message: 'Bot iniciado com sucesso' })
  } catch (error: any) {
    logger.error('Error starting bot:', error)
    res.status(400).json({ error: error.message || 'Erro ao iniciar bot' })
  }
})

// Parar bot
router.post('/:botId/stop', async (req, res) => {
  try {
    const userId = req.user?.id
    if (!userId) {
      return res.status(401).json({ error: 'Usuário não autenticado' })
    }

    await TelegramService.stopBot(req.params.botId)
    res.json({ message: 'Bot parado com sucesso' })
  } catch (error: any) {
    logger.error('Error stopping bot:', error)
    res.status(400).json({ error: error.message || 'Erro ao parar bot' })
  }
})

// Deletar bot
router.delete('/:botId', async (req, res) => {
  try {
    const userId = req.user?.id
    if (!userId) {
      return res.status(401).json({ error: 'Usuário não autenticado' })
    }

    await TelegramService.deleteBot(req.params.botId)
    res.json({ message: 'Bot deletado com sucesso' })
  } catch (error: any) {
    logger.error('Error deleting bot:', error)
    res.status(400).json({ error: error.message || 'Erro ao deletar bot' })
  }
})

// Testar conexão do bot
router.post('/:botId/test', async (req, res) => {
  try {
    const userId = req.user?.id
    if (!userId) {
      return res.status(401).json({ error: 'Usuário não autenticado' })
    }

    const bot = await TelegramService.getBotById(req.params.botId, userId)
    if (!bot) {
      return res.status(404).json({ error: 'Bot não encontrado' })
    }

    res.json({ 
      message: 'Bot conectado com sucesso',
      bot: {
        username: bot.username,
        firstName: bot.firstName,
        active: bot.active
      }
    })
  } catch (error: any) {
    logger.error('Error testing bot:', error)
    res.status(400).json({ error: error.message || 'Erro ao testar bot' })
  }
})

export { router as botRoutes }