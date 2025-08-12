'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Server, 
  Database, 
  Wifi, 
  Activity,
  RefreshCw,
  Clock,
  Cpu,
  HardDrive
} from 'lucide-react'

interface ServiceStatus {
  status: 'up' | 'down'
  responseTime?: number
  error?: string
}

interface HealthData {
  status: 'healthy' | 'degraded' | 'unhealthy'
  timestamp: string
  uptime: number
  services: {
    database: ServiceStatus
    redis: ServiceStatus
    telegram: ServiceStatus
  }
  system: {
    memory: {
      used: string
      total: string
      percentage: number
    }
    cpu: {
      usage: number
      cores: number
    }
  }
}

export default function StatusPage() {
  const [health, setHealth] = useState<HealthData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [autoRefresh, setAutoRefresh] = useState(true)

  const fetchHealth = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333'}/api/health`)
      const data = await response.json()
      
      if (data.success || data.data) {
        setHealth(data.data)
        setError(null)
      } else {
        setError('Não foi possível obter o status')
      }
      setLastUpdate(new Date())
    } catch (err) {
      setError('Erro ao conectar com o servidor')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHealth()
    
    if (autoRefresh) {
      const interval = setInterval(fetchHealth, 30000) // Atualiza a cada 30 segundos
      return () => clearInterval(interval)
    }
    
    return undefined
  }, [autoRefresh])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'up':
        return <CheckCircle className="w-6 h-6 text-green-500" />
      case 'degraded':
        return <AlertCircle className="w-6 h-6 text-yellow-500" />
      case 'unhealthy':
      case 'down':
        return <XCircle className="w-6 h-6 text-red-500" />
      default:
        return <AlertCircle className="w-6 h-6 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'up':
        return 'bg-green-500/10 border-green-500/20 text-green-400'
      case 'degraded':
        return 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
      case 'unhealthy':
      case 'down':
        return 'bg-red-500/10 border-red-500/20 text-red-400'
      default:
        return 'bg-gray-500/10 border-gray-500/20 text-gray-400'
    }
  }

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    
    const parts = []
    if (days > 0) parts.push(`${days}d`)
    if (hours > 0) parts.push(`${hours}h`)
    if (minutes > 0) parts.push(`${minutes}m`)
    
    return parts.join(' ') || '< 1m'
  }

  if (loading && !health) {
    return (
      <div className="min-h-screen bg-background-primary flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <RefreshCw className="w-8 h-8 text-accent-primary" />
        </motion.div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background-primary p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-4xl font-bold gradient-text">Status do Sistema</h1>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`btn btn-glass btn-sm ${autoRefresh ? 'bg-accent-primary/10' : ''}`}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
                {autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
              </button>
              <button
                onClick={fetchHealth}
                className="btn btn-primary btn-sm"
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Atualizar
              </button>
            </div>
          </div>
          <p className="text-text-secondary flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Última atualização: {lastUpdate.toLocaleTimeString('pt-BR')}
          </p>
        </motion.div>

        {error && (
          <motion.div 
            className="glass-card bg-red-500/10 border-red-500/20 mb-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="flex items-center gap-3">
              <XCircle className="w-6 h-6 text-red-500" />
              <p className="text-red-400">{error}</p>
            </div>
          </motion.div>
        )}

        {health && (
          <>
            {/* Status Geral */}
            <motion.div 
              className={`glass-card mb-6 border ${getStatusColor(health.status)}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(health.status)}
                  <div>
                    <h2 className="text-2xl font-semibold">
                      Sistema {health.status === 'healthy' ? 'Operacional' : 
                              health.status === 'degraded' ? 'Parcialmente Operacional' : 
                              'Com Problemas'}
                    </h2>
                    <p className="text-text-secondary">
                      Uptime: {formatUptime(health.uptime)}
                    </p>
                  </div>
                </div>
                <Activity className="w-8 h-8 text-accent-primary opacity-50" />
              </div>
            </motion.div>

            {/* Grid de Serviços */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Database */}
              <motion.div 
                className="glass-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Database className="w-5 h-5 text-blue-400" />
                    <h3 className="font-semibold">Database</h3>
                  </div>
                  {getStatusIcon(health.services.database.status)}
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-text-secondary">PostgreSQL</p>
                  {health.services.database.responseTime && (
                    <p className="text-sm text-text-tertiary">
                      Resposta: {health.services.database.responseTime}ms
                    </p>
                  )}
                  {health.services.database.error && (
                    <p className="text-sm text-red-400 truncate">
                      {health.services.database.error}
                    </p>
                  )}
                </div>
              </motion.div>

              {/* Redis */}
              <motion.div 
                className="glass-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Server className="w-5 h-5 text-orange-400" />
                    <h3 className="font-semibold">Cache</h3>
                  </div>
                  {getStatusIcon(health.services.redis.status)}
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-text-secondary">Redis</p>
                  {health.services.redis.responseTime && (
                    <p className="text-sm text-text-tertiary">
                      Resposta: {health.services.redis.responseTime}ms
                    </p>
                  )}
                  {health.services.redis.error && (
                    <p className="text-sm text-red-400 truncate">
                      {health.services.redis.error}
                    </p>
                  )}
                </div>
              </motion.div>

              {/* Telegram */}
              <motion.div 
                className="glass-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Wifi className="w-5 h-5 text-cyan-400" />
                    <h3 className="font-semibold">Telegram API</h3>
                  </div>
                  {getStatusIcon(health.services.telegram.status)}
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-text-secondary">Bot API</p>
                  {health.services.telegram.responseTime && (
                    <p className="text-sm text-text-tertiary">
                      Resposta: {health.services.telegram.responseTime}ms
                    </p>
                  )}
                  {health.services.telegram.error && (
                    <p className="text-sm text-red-400 truncate">
                      {health.services.telegram.error}
                    </p>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Informações do Sistema */}
            <motion.div 
              className="glass-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-lg font-semibold mb-4">Recursos do Sistema</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Memória */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <HardDrive className="w-4 h-4 text-purple-400" />
                      <span className="text-sm font-medium">Memória</span>
                    </div>
                    <span className="text-sm text-text-secondary">
                      {health.system.memory.used} / {health.system.memory.total}
                    </span>
                  </div>
                  <div className="w-full bg-background-secondary rounded-full h-2">
                    <motion.div 
                      className="bg-gradient-primary h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${health.system.memory.percentage}%` }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                    />
                  </div>
                  <p className="text-xs text-text-tertiary mt-1">
                    {health.system.memory.percentage}% em uso
                  </p>
                </div>

                {/* CPU */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-blue-400" />
                      <span className="text-sm font-medium">CPU</span>
                    </div>
                    <span className="text-sm text-text-secondary">
                      {health.system.cpu.cores} cores
                    </span>
                  </div>
                  <div className="w-full bg-background-secondary rounded-full h-2">
                    <motion.div 
                      className="bg-gradient-primary h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${health.system.cpu.usage}%` }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                    />
                  </div>
                  <p className="text-xs text-text-tertiary mt-1">
                    {health.system.cpu.usage}% em uso
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </main>
  )
}