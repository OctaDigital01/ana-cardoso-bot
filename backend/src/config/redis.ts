import Redis from 'ioredis'
import { logger } from '@/utils/logger'
import { config } from './environment'

export let redis: Redis

export async function initializeRedis() {
  try {
    redis = new Redis(config.redisUrl, {
      retryDelayOnFailover: 100,
      enableReadyCheck: false,
      maxRetriesPerRequest: 3,
      lazyConnect: true,
      connectTimeout: 10000,
      commandTimeout: 5000,
      family: 4,
    })

    // Event listeners
    redis.on('connect', () => {
      logger.info('🔗 Conectando ao Redis...')
    })

    redis.on('ready', () => {
      logger.info('✅ Redis conectado e pronto')
    })

    redis.on('error', (error) => {
      logger.error('❌ Erro no Redis:', error)
    })

    redis.on('close', () => {
      logger.warn('📴 Conexão Redis fechada')
    })

    redis.on('reconnecting', (time) => {
      logger.info(`🔄 Reconectando ao Redis em ${time}ms...`)
    })

    // Conectar
    await redis.connect()
    
    // Testar conexão
    await redis.ping()
    logger.info('✅ Teste de conexão Redis bem-sucedido')

  } catch (error) {
    logger.error('❌ Erro ao conectar com Redis:', error)
    throw error
  }
}

export async function closeRedis() {
  if (redis) {
    await redis.disconnect()
    logger.info('📴 Conexão Redis fechada')
  }
}

// Utilitários Redis
export class RedisCache {
  static async get<T = any>(key: string): Promise<T | null> {
    try {
      const value = await redis.get(key)
      return value ? JSON.parse(value) : null
    } catch (error) {
      logger.error(`Erro ao buscar cache ${key}:`, error)
      return null
    }
  }

  static async set(key: string, value: any, ttlSeconds?: number): Promise<boolean> {
    try {
      const serialized = JSON.stringify(value)
      
      if (ttlSeconds) {
        await redis.setex(key, ttlSeconds, serialized)
      } else {
        await redis.set(key, serialized)
      }
      
      return true
    } catch (error) {
      logger.error(`Erro ao definir cache ${key}:`, error)
      return false
    }
  }

  static async del(key: string): Promise<boolean> {
    try {
      const result = await redis.del(key)
      return result > 0
    } catch (error) {
      logger.error(`Erro ao deletar cache ${key}:`, error)
      return false
    }
  }

  static async exists(key: string): Promise<boolean> {
    try {
      const result = await redis.exists(key)
      return result === 1
    } catch (error) {
      logger.error(`Erro ao verificar existência ${key}:`, error)
      return false
    }
  }

  static async expire(key: string, ttlSeconds: number): Promise<boolean> {
    try {
      const result = await redis.expire(key, ttlSeconds)
      return result === 1
    } catch (error) {
      logger.error(`Erro ao definir expiração ${key}:`, error)
      return false
    }
  }

  static async keys(pattern: string): Promise<string[]> {
    try {
      return await redis.keys(pattern)
    } catch (error) {
      logger.error(`Erro ao buscar chaves ${pattern}:`, error)
      return []
    }
  }

  static async flushPattern(pattern: string): Promise<number> {
    try {
      const keys = await redis.keys(pattern)
      if (keys.length === 0) return 0
      
      const result = await redis.del(...keys)
      return result
    } catch (error) {
      logger.error(`Erro ao limpar padrão ${pattern}:`, error)
      return 0
    }
  }

  // Hash operations
  static async hget(key: string, field: string): Promise<string | null> {
    try {
      return await redis.hget(key, field)
    } catch (error) {
      logger.error(`Erro ao buscar hash ${key}.${field}:`, error)
      return null
    }
  }

  static async hset(key: string, field: string, value: string): Promise<boolean> {
    try {
      const result = await redis.hset(key, field, value)
      return result === 1
    } catch (error) {
      logger.error(`Erro ao definir hash ${key}.${field}:`, error)
      return false
    }
  }

  static async hgetall(key: string): Promise<Record<string, string>> {
    try {
      return await redis.hgetall(key)
    } catch (error) {
      logger.error(`Erro ao buscar todos hash ${key}:`, error)
      return {}
    }
  }

  // List operations
  static async lpush(key: string, ...values: string[]): Promise<number> {
    try {
      return await redis.lpush(key, ...values)
    } catch (error) {
      logger.error(`Erro ao adicionar à lista ${key}:`, error)
      return 0
    }
  }

  static async rpop(key: string): Promise<string | null> {
    try {
      return await redis.rpop(key)
    } catch (error) {
      logger.error(`Erro ao remover da lista ${key}:`, error)
      return null
    }
  }

  static async llen(key: string): Promise<number> {
    try {
      return await redis.llen(key)
    } catch (error) {
      logger.error(`Erro ao contar lista ${key}:`, error)
      return 0
    }
  }

  // Set operations
  static async sadd(key: string, ...members: string[]): Promise<number> {
    try {
      return await redis.sadd(key, ...members)
    } catch (error) {
      logger.error(`Erro ao adicionar ao set ${key}:`, error)
      return 0
    }
  }

  static async smembers(key: string): Promise<string[]> {
    try {
      return await redis.smembers(key)
    } catch (error) {
      logger.error(`Erro ao buscar membros do set ${key}:`, error)
      return []
    }
  }

  static async sismember(key: string, member: string): Promise<boolean> {
    try {
      const result = await redis.sismember(key, member)
      return result === 1
    } catch (error) {
      logger.error(`Erro ao verificar membro ${key}.${member}:`, error)
      return false
    }
  }
}

// Graceful shutdown
process.on('beforeExit', async () => {
  await closeRedis()
})

process.on('SIGINT', async () => {
  await closeRedis()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  await closeRedis()
  process.exit(0)
})