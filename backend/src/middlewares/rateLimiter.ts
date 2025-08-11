import rateLimit from 'express-rate-limit'
import { Request, Response } from 'express'
import { config } from '@/config/environment'
import { redis } from '@/config/redis'
import { logger } from '@/utils/logger'

// Rate limiter padrão
export const rateLimiter = rateLimit({
  windowMs: config.rateLimit.window,
  max: config.rateLimit.max,
  message: {
    error: {
      message: 'Muitas requisições realizadas. Tente novamente mais tarde.',
      code: 'RATE_LIMIT_EXCEEDED'
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Pular rate limit para health check
    return req.path === '/health'
  },
  handler: (req: Request, res: Response) => {
    logger.warn('Rate limit excedido', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      path: req.path,
      method: req.method
    })

    res.status(429).json({
      error: {
        message: 'Muitas requisições realizadas. Tente novamente mais tarde.',
        code: 'RATE_LIMIT_EXCEEDED',
        retryAfter: Math.ceil(config.rateLimit.window / 1000)
      }
    })
  }
})

// Rate limiter para autenticação (mais restritivo)
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // 10 tentativas por IP
  message: {
    error: {
      message: 'Muitas tentativas de login. Tente novamente em 15 minutos.',
      code: 'AUTH_RATE_LIMIT_EXCEEDED'
    }
  },
  skipSuccessfulRequests: true,
  handler: (req: Request, res: Response) => {
    logger.warn('Rate limit de autenticação excedido', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      path: req.path
    })

    res.status(429).json({
      error: {
        message: 'Muitas tentativas de login. Tente novamente em 15 minutos.',
        code: 'AUTH_RATE_LIMIT_EXCEEDED',
        retryAfter: 15 * 60
      }
    })
  }
})

// Rate limiter para APIs públicas (webhooks)
export const webhookRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 300, // 300 requisições por minuto
  message: {
    error: {
      message: 'Rate limit excedido para webhook',
      code: 'WEBHOOK_RATE_LIMIT_EXCEEDED'
    }
  }
})

// Rate limiter para upload de arquivos
export const uploadRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 20, // 20 uploads por minuto
  message: {
    error: {
      message: 'Muitos uploads realizados. Tente novamente em 1 minuto.',
      code: 'UPLOAD_RATE_LIMIT_EXCEEDED'
    }
  }
})

// Rate limiter customizado baseado em usuário
export function createUserRateLimiter(
  windowMs: number,
  maxRequests: number,
  keyGenerator?: (req: Request) => string
) {
  return rateLimit({
    windowMs,
    max: maxRequests,
    keyGenerator: keyGenerator || ((req: Request) => {
      const user = (req as any).user
      return user ? `user:${user.id}` : req.ip
    }),
    message: {
      error: {
        message: 'Limite de requisições por usuário excedido',
        code: 'USER_RATE_LIMIT_EXCEEDED'
      }
    }
  })
}

// Rate limiter baseado em Redis (para aplicações distribuídas)
export class RedisRateLimiter {
  private window: number
  private maxRequests: number
  private keyPrefix: string

  constructor(window: number, maxRequests: number, keyPrefix: string = 'rl') {
    this.window = window
    this.maxRequests = maxRequests
    this.keyPrefix = keyPrefix
  }

  async isAllowed(identifier: string): Promise<{
    allowed: boolean
    totalHits: number
    timeToReset: number
    remaining: number
  }> {
    const key = `${this.keyPrefix}:${identifier}`
    const now = Date.now()
    const windowStart = now - this.window

    try {
      // Usar transação Redis para operações atômicas
      const multi = redis.multi()
      
      // Remove entradas antigas
      multi.zremrangebyscore(key, '-inf', windowStart)
      
      // Conta requests atuais
      multi.zcard(key)
      
      // Adiciona request atual
      multi.zadd(key, now, `${now}:${Math.random()}`)
      
      // Define expiração
      multi.expire(key, Math.ceil(this.window / 1000))
      
      const results = await multi.exec()
      
      if (!results) {
        throw new Error('Falha na transação Redis')
      }

      const totalHits = (results[1][1] as number) + 1
      const allowed = totalHits <= this.maxRequests
      const remaining = Math.max(0, this.maxRequests - totalHits)
      const timeToReset = this.window

      return {
        allowed,
        totalHits,
        timeToReset,
        remaining
      }
    } catch (error) {
      logger.error('Erro no Redis rate limiter:', error)
      
      // Em caso de erro no Redis, permitir a requisição
      return {
        allowed: true,
        totalHits: 1,
        timeToReset: this.window,
        remaining: this.maxRequests - 1
      }
    }
  }

  middleware(keyGenerator: (req: Request) => string) {
    return async (req: Request, res: Response, next: Function) => {
      try {
        const identifier = keyGenerator(req)
        const result = await this.isAllowed(identifier)

        // Adicionar headers de rate limit
        res.set({
          'X-RateLimit-Limit': this.maxRequests.toString(),
          'X-RateLimit-Remaining': result.remaining.toString(),
          'X-RateLimit-Reset': new Date(Date.now() + result.timeToReset).toISOString()
        })

        if (!result.allowed) {
          logger.warn('Rate limit Redis excedido', {
            identifier,
            totalHits: result.totalHits,
            maxRequests: this.maxRequests
          })

          return res.status(429).json({
            error: {
              message: 'Rate limit excedido',
              code: 'RATE_LIMIT_EXCEEDED',
              retryAfter: Math.ceil(result.timeToReset / 1000)
            }
          })
        }

        next()
      } catch (error) {
        logger.error('Erro no middleware de rate limit:', error)
        next() // Em caso de erro, permitir a requisição
      }
    }
  }
}

// Instâncias pré-configuradas
export const apiRateLimiter = new RedisRateLimiter(
  60 * 1000, // 1 minuto
  100,       // 100 requisições
  'api'
)

export const heavyOperationRateLimiter = new RedisRateLimiter(
  5 * 60 * 1000, // 5 minutos
  10,            // 10 operações
  'heavy'
)

// Middleware para APIs que consomem muito recurso
export const heavyOperationMiddleware = heavyOperationRateLimiter.middleware(
  (req: Request) => {
    const user = (req as any).user
    return user ? `user:${user.id}` : req.ip
  }
)

// Rate limiter específico para planos
export function createPlanBasedRateLimiter() {
  return async (req: Request, res: Response, next: Function) => {
    const user = (req as any).user
    
    if (!user) {
      return next()
    }

    // Definir limites baseados no plano
    let maxRequests = 100 // FREE
    
    if (user.plan === 'PRO') {
      maxRequests = 500
    } else if (user.plan === 'ENTERPRISE') {
      maxRequests = 2000
    }

    const rateLimiter = new RedisRateLimiter(
      60 * 1000, // 1 minuto
      maxRequests,
      'plan'
    )

    const identifier = `user:${user.id}`
    const result = await rateLimiter.isAllowed(identifier)

    // Headers informativos
    res.set({
      'X-RateLimit-Limit': maxRequests.toString(),
      'X-RateLimit-Remaining': result.remaining.toString(),
      'X-RateLimit-Reset': new Date(Date.now() + result.timeToReset).toISOString(),
      'X-RateLimit-Plan': user.plan
    })

    if (!result.allowed) {
      logger.warn('Rate limit do plano excedido', {
        userId: user.id,
        plan: user.plan,
        maxRequests,
        totalHits: result.totalHits
      })

      return res.status(429).json({
        error: {
          message: `Limite do plano ${user.plan} excedido. Considere fazer upgrade.`,
          code: 'PLAN_RATE_LIMIT_EXCEEDED',
          plan: user.plan,
          maxRequests,
          retryAfter: Math.ceil(result.timeToReset / 1000)
        }
      })
    }

    next()
  }
}

// Middleware para ignorar rate limit em desenvolvimento
export function skipRateLimitInDev(middleware: any) {
  return (req: Request, res: Response, next: Function) => {
    if (config.nodeEnv === 'development') {
      return next()
    }
    return middleware(req, res, next)
  }
}