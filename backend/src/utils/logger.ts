import winston from 'winston'
import path from 'path'
import { config } from '@/config/environment'

// Formatos personalizados
const customFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
    let log = `${timestamp} [${level.toUpperCase()}]: ${message}`
    
    if (stack) {
      log += `\n${stack}`
    }
    
    if (Object.keys(meta).length > 0) {
      log += `\nMeta: ${JSON.stringify(meta, null, 2)}`
    }
    
    return log
  })
)

// Console format para desenvolvimento
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({
    format: 'HH:mm:ss'
  }),
  winston.format.printf(({ timestamp, level, message, stack }) => {
    let log = `${timestamp} ${level}: ${message}`
    if (stack && config.nodeEnv === 'development') {
      log += `\n${stack}`
    }
    return log
  })
)

// Transports
const transports: winston.transport[] = [
  // Console transport
  new winston.transports.Console({
    format: config.nodeEnv === 'production' ? customFormat : consoleFormat,
    level: config.log.level
  })
]

// File transport para produção
if (config.log.toFile || config.nodeEnv === 'production') {
  const logsDir = path.join(process.cwd(), 'logs')
  
  // Log de erro
  transports.push(
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      format: customFormat,
      maxsize: 5 * 1024 * 1024, // 5MB
      maxFiles: 5,
      tailable: true
    })
  )
  
  // Log combinado
  transports.push(
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'),
      format: customFormat,
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 10,
      tailable: true
    })
  )
}

// Criar logger
export const logger = winston.createLogger({
  level: config.log.level,
  format: customFormat,
  transports,
  exitOnError: false,
  silent: process.env.NODE_ENV === 'test'
})

// Stream para integrações (ex: Morgan)
export const loggerStream = {
  write: (message: string) => {
    logger.info(message.trim())
  }
}

// Utilitários de logging
export class Logger {
  private context: string

  constructor(context: string) {
    this.context = context
  }

  private formatMessage(message: string): string {
    return `[${this.context}] ${message}`
  }

  debug(message: string, meta?: any) {
    logger.debug(this.formatMessage(message), meta)
  }

  info(message: string, meta?: any) {
    logger.info(this.formatMessage(message), meta)
  }

  warn(message: string, meta?: any) {
    logger.warn(this.formatMessage(message), meta)
  }

  error(message: string, error?: any) {
    if (error instanceof Error) {
      logger.error(this.formatMessage(message), { error: error.message, stack: error.stack })
    } else if (error) {
      logger.error(this.formatMessage(message), { error })
    } else {
      logger.error(this.formatMessage(message))
    }
  }

  // Métodos específicos
  apiRequest(req: any) {
    this.info(`${req.method} ${req.url}`, {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      userId: req.user?.id
    })
  }

  apiResponse(req: any, res: any, duration: number) {
    const level = res.statusCode >= 400 ? 'error' : 'info'
    this[level](`${req.method} ${req.url} - ${res.statusCode}`, {
      duration: `${duration}ms`,
      statusCode: res.statusCode,
      userId: req.user?.id
    })
  }

  sqlQuery(query: string, duration: number) {
    if (duration > 1000) {
      this.warn('Query lenta detectada', { query, duration: `${duration}ms` })
    } else if (config.nodeEnv === 'development') {
      this.debug('SQL Query', { query, duration: `${duration}ms` })
    }
  }

  webhookReceived(source: string, payload: any) {
    this.info(`Webhook recebido de ${source}`, {
      payloadSize: JSON.stringify(payload).length,
      timestamp: new Date().toISOString()
    })
  }

  jobProcessed(jobType: string, jobId: string, result: 'success' | 'failure', duration?: number) {
    const message = `Job ${jobType} ${result === 'success' ? 'processado' : 'falhou'}`
    const meta = { jobId, duration: duration ? `${duration}ms` : undefined }
    
    if (result === 'success') {
      this.info(message, meta)
    } else {
      this.error(message, meta)
    }
  }

  paymentEvent(event: string, paymentId: string, amount?: number) {
    this.info(`Evento de pagamento: ${event}`, {
      paymentId,
      amount: amount ? `R$ ${amount.toFixed(2)}` : undefined
    })
  }

  botEvent(botId: string, event: string, userId?: string) {
    this.info(`Bot event: ${event}`, {
      botId,
      userId,
      timestamp: new Date().toISOString()
    })
  }

  securityEvent(event: string, details: any) {
    this.warn(`Evento de segurança: ${event}`, details)
  }

  performanceMetric(metric: string, value: number, unit: string = 'ms') {
    this.info(`Performance: ${metric}`, {
      value,
      unit,
      timestamp: new Date().toISOString()
    })
  }
}

// Factory function para criar loggers com contexto
export function createLogger(context: string): Logger {
  return new Logger(context)
}

// Loggers pré-configurados para contextos comuns
export const apiLogger = new Logger('API')
export const dbLogger = new Logger('DATABASE')
export const redisLogger = new Logger('REDIS')
export const botLogger = new Logger('BOT')
export const paymentLogger = new Logger('PAYMENT')
export const webhookLogger = new Logger('WEBHOOK')
export const jobLogger = new Logger('JOB')
export const securityLogger = new Logger('SECURITY')

// Handle de exceções não capturadas
if (config.nodeEnv === 'production') {
  logger.exceptions.handle(
    new winston.transports.File({
      filename: path.join(process.cwd(), 'logs', 'exceptions.log'),
      maxsize: 5 * 1024 * 1024,
      maxFiles: 5
    })
  )
  
  logger.rejections.handle(
    new winston.transports.File({
      filename: path.join(process.cwd(), 'logs', 'rejections.log'),
      maxsize: 5 * 1024 * 1024,
      maxFiles: 5
    })
  )
}