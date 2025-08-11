import { Telegraf } from 'telegraf'
import { prisma } from '@/config/database'
import { CryptoService } from './crypto'
import { logger } from '@/utils/logger'
import { config } from '@/config/environment'

interface BotInstance {
  bot: Telegraf
  userId: string
  botId: string
}

export class TelegramService {
  private static instances: Map<string, BotInstance> = new Map()

  static async createBot(userId: string, token: string, name: string) {
    try {
      // Validar token com a API do Telegram
      const bot = new Telegraf(token)
      const botInfo = await bot.telegram.getMe()
      
      // Criptografar token antes de salvar
      const encryptedToken = CryptoService.encrypt(token)
      
      // Salvar bot no banco
      const savedBot = await prisma.bot.create({
        data: {
          userId,
          token: encryptedToken,
          username: botInfo.username || '',
          firstName: botInfo.first_name,
          name: name || botInfo.first_name,
          active: false,
          settings: {}
        }
      })

      // Configurar webhook
      const webhookUrl = `${config.apiUrl}/api/v1/webhooks/telegram/${savedBot.id}`
      await bot.telegram.setWebhook(webhookUrl)

      // Armazenar instância
      this.instances.set(savedBot.id, {
        bot,
        userId,
        botId: savedBot.id
      })

      logger.info(`Bot created for user ${userId}: ${botInfo.username}`)
      
      return savedBot
    } catch (error) {
      logger.error('Error creating bot:', error)
      throw new Error('Token inválido ou erro ao criar bot')
    }
  }

  static async updateBot(botId: string, token?: string, name?: string) {
    try {
      const bot = await prisma.bot.findUnique({ where: { id: botId } })
      if (!bot) throw new Error('Bot não encontrado')

      const updateData: any = {}
      
      if (name) updateData.name = name
      
      if (token) {
        // Validar novo token
        const telegraf = new Telegraf(token)
        const botInfo = await telegraf.telegram.getMe()
        
        // Criptografar e atualizar
        updateData.token = CryptoService.encrypt(token)
        updateData.username = botInfo.username || ''
        updateData.firstName = botInfo.first_name
        
        // Atualizar webhook
        const webhookUrl = `${config.apiUrl}/api/v1/webhooks/telegram/${botId}`
        await telegraf.telegram.setWebhook(webhookUrl)
        
        // Atualizar instância
        if (this.instances.has(botId)) {
          this.instances.delete(botId)
        }
        
        this.instances.set(botId, {
          bot: telegraf,
          userId: bot.userId,
          botId
        })
      }

      const updatedBot = await prisma.bot.update({
        where: { id: botId },
        data: updateData
      })

      logger.info(`Bot updated: ${botId}`)
      return updatedBot
    } catch (error) {
      logger.error('Error updating bot:', error)
      throw error
    }
  }

  static async startBot(botId: string) {
    try {
      const bot = await prisma.bot.findUnique({ where: { id: botId } })
      if (!bot) throw new Error('Bot não encontrado')

      // Descriptografar token
      const token = CryptoService.decrypt(bot.token)
      
      // Criar ou recuperar instância
      let instance = this.instances.get(botId)
      if (!instance) {
        const telegraf = new Telegraf(token)
        instance = {
          bot: telegraf,
          userId: bot.userId,
          botId
        }
        this.instances.set(botId, instance)
      }

      // Configurar handlers
      this.setupHandlers(instance.bot, botId)
      
      // Configurar webhook
      const webhookUrl = `${config.apiUrl}/api/v1/webhooks/telegram/${botId}`
      await instance.bot.telegram.setWebhook(webhookUrl)

      // Atualizar status
      await prisma.bot.update({
        where: { id: botId },
        data: { active: true }
      })

      logger.info(`Bot started: ${botId}`)
      return true
    } catch (error) {
      logger.error('Error starting bot:', error)
      throw error
    }
  }

  static async stopBot(botId: string) {
    try {
      const instance = this.instances.get(botId)
      if (instance) {
        await instance.bot.telegram.deleteWebhook()
        this.instances.delete(botId)
      }

      await prisma.bot.update({
        where: { id: botId },
        data: { active: false }
      })

      logger.info(`Bot stopped: ${botId}`)
      return true
    } catch (error) {
      logger.error('Error stopping bot:', error)
      throw error
    }
  }

  static async deleteBot(botId: string) {
    try {
      // Parar bot primeiro
      await this.stopBot(botId)
      
      // Deletar do banco
      await prisma.bot.delete({
        where: { id: botId }
      })

      logger.info(`Bot deleted: ${botId}`)
      return true
    } catch (error) {
      logger.error('Error deleting bot:', error)
      throw error
    }
  }

  static async handleWebhook(botId: string, update: any) {
    try {
      const instance = this.instances.get(botId)
      if (!instance) {
        // Tentar recarregar bot
        await this.startBot(botId)
        const newInstance = this.instances.get(botId)
        if (!newInstance) {
          throw new Error('Bot não está ativo')
        }
        await newInstance.bot.handleUpdate(update)
      } else {
        await instance.bot.handleUpdate(update)
      }
    } catch (error) {
      logger.error(`Error handling webhook for bot ${botId}:`, error)
      throw error
    }
  }

  private static setupHandlers(bot: Telegraf, botId: string) {
    // Handler para comando /start
    bot.start(async (ctx) => {
      const telegramUserId = ctx.from.id.toString()
      const chatId = ctx.chat.id.toString()
      
      // Criar ou atualizar conversa
      await prisma.conversation.upsert({
        where: {
          botId_telegramUserId: {
            botId,
            telegramUserId
          }
        },
        update: {
          telegramChatId: chatId,
          lastInteraction: new Date(),
          active: true
        },
        create: {
          botId,
          telegramUserId,
          telegramChatId: chatId,
          firstName: ctx.from.first_name,
          lastName: ctx.from.last_name,
          username: ctx.from.username,
          languageCode: ctx.from.language_code,
          active: true
        }
      })

      // Registrar interação
      await prisma.interaction.create({
        data: {
          conversationId: `${botId}_${telegramUserId}`,
          type: 'MESSAGE_RECEIVED',
          content: '/start',
          metadata: {}
        }
      })

      await ctx.reply('Bem-vindo! Como posso ajudar você hoje?')
    })

    // Handler para mensagens de texto
    bot.on('text', async (ctx) => {
      const telegramUserId = ctx.from.id.toString()
      const text = ctx.message.text
      
      // Registrar mensagem recebida
      await prisma.interaction.create({
        data: {
          conversationId: `${botId}_${telegramUserId}`,
          type: 'MESSAGE_RECEIVED',
          content: text,
          metadata: {}
        }
      })

      // Aqui você pode adicionar lógica de processamento de mensagens
      // Por exemplo, integração com flows, IA, etc.
      
      await ctx.reply(`Você disse: ${text}`)
    })

    // Handler para callbacks (botões)
    bot.on('callback_query', async (ctx) => {
      const telegramUserId = ctx.from.id.toString()
      const data = ctx.callbackQuery.data
      
      await prisma.interaction.create({
        data: {
          conversationId: `${botId}_${telegramUserId}`,
          type: 'BUTTON_CLICKED',
          content: data,
          metadata: {}
        }
      })

      await ctx.answerCbQuery('Botão clicado!')
    })
  }

  static async getAllBots(userId: string) {
    return prisma.bot.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
        username: true,
        firstName: true,
        active: true,
        createdAt: true,
        updatedAt: true
      }
    })
  }

  static async getBotById(botId: string, userId: string) {
    return prisma.bot.findFirst({
      where: {
        id: botId,
        userId
      }
    })
  }
}