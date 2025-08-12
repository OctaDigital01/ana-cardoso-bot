import { logger } from '@/utils/logger'

// Interfaces dos jobs (mantém compatibilidade)
export interface EmailJob {
  to: string
  subject: string
  template: string
  data: any
}

export interface BotJob {
  botId: string
  action: 'create' | 'update' | 'delete' | 'activate' | 'deactivate'
  data?: any
}

export interface WebhookJob {
  url: string
  payload: any
  headers?: Record<string, string>
  retries?: number
}

export interface PaymentJob {
  paymentId: string
  action: 'process' | 'refund' | 'verify'
  data?: any
}

export interface AnalyticsJob {
  userId: string
  botId?: string
  event: string
  data: any
}

export interface NotificationJob {
  userId: string
  type: 'email' | 'push' | 'sms'
  content: {
    title: string
    message: string
    data?: any
  }
}

// Mock das filas que não fazem nada (sem Redis)
export const emailQueue = null
export const botQueue = null
export const webhookQueue = null
export const paymentQueue = null
export const analyticsQueue = null
export const notificationQueue = null

// Queue Manager mock - processa tudo de forma síncrona
export class QueueManager {
  static async addEmailJob(data: EmailJob, options?: any) {
    logger.info(`📧 Processando email síncronamente para ${data.to}`)
    // Processar imediatamente ou retornar mock job
    return { id: Date.now(), data }
  }

  static async addBotJob(data: BotJob, options?: any) {
    logger.info(`🤖 Processando bot ${data.action} síncronamente para ${data.botId}`)
    return { id: Date.now(), data }
  }

  static async addWebhookJob(data: WebhookJob, options?: any) {
    logger.info(`🔗 Processando webhook síncronamente para ${data.url}`)
    return { id: Date.now(), data }
  }

  static async addPaymentJob(data: PaymentJob, options?: any) {
    logger.info(`💳 Processando pagamento ${data.action} síncronamente para ${data.paymentId}`)
    return { id: Date.now(), data }
  }

  static async addAnalyticsJob(data: AnalyticsJob, options?: any) {
    logger.info(`📊 Processando analytics ${data.event} síncronamente`)
    return { id: Date.now(), data }
  }

  static async addNotificationJob(data: NotificationJob, options?: any) {
    logger.info(`🔔 Processando notificação ${data.type} síncronamente para usuário ${data.userId}`)
    return { id: Date.now(), data }
  }

  // Métodos para gerenciar filas (retorna zeros)
  static async getQueueStats() {
    return {
      'email processing': { waiting: 0, active: 0, completed: 0, failed: 0 },
      'bot operations': { waiting: 0, active: 0, completed: 0, failed: 0 },
      'webhook processing': { waiting: 0, active: 0, completed: 0, failed: 0 },
      'payment processing': { waiting: 0, active: 0, completed: 0, failed: 0 },
      'analytics processing': { waiting: 0, active: 0, completed: 0, failed: 0 },
      'notification processing': { waiting: 0, active: 0, completed: 0, failed: 0 }
    }
  }

  static async pauseAllQueues() {
    logger.info('📝 Filas já estão desabilitadas (sem Redis)')
  }

  static async resumeAllQueues() {
    logger.info('📝 Filas já estão desabilitadas (sem Redis)')
  }

  static async cleanAllQueues() {
    logger.info('📝 Nada para limpar (sem Redis)')
  }
}

// Inicializar filas (mock - não faz nada)
export async function initializeQueues() {
  logger.info('📝 Filas desabilitadas - processamento síncrono ativo')
}

// Fechar filas (mock - não faz nada)
export async function closeQueues() {
  logger.info('📝 Nada para fechar (sem filas)')
}