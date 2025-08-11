'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Bot, Sparkles, Zap, Shield, BarChart3, Rocket } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <main className="min-h-screen bg-background-primary relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/5 to-accent-secondary/5" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-secondary/10 rounded-full blur-3xl" />

      {/* Navigation */}
      <nav className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div 
            className="flex items-center space-x-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">TelegramBot Manager</span>
          </motion.div>

          <motion.div 
            className="flex items-center space-x-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Link href="/login" className="btn btn-glass btn-md">
              Entrar
            </Link>
            <Link href="/register" className="btn btn-primary btn-md">
              Começar Grátis
            </Link>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Crie Bots do Telegram
            <br />
            <span className="gradient-text">Sem Código</span>
          </motion.h1>

          <motion.p 
            className="text-xl md:text-2xl text-text-secondary mb-12 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            Plataforma visual para criar, configurar e gerenciar bots do Telegram
            <br />
            com fluxos inteligentes, pagamentos PIX e analytics em tempo real.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
          >
            <Link href="/register" className="btn btn-primary btn-lg group">
              <Rocket className="w-5 h-5 mr-2 group-hover:translate-x-0.5 transition-transform" />
              Criar Meu Bot Agora
            </Link>
            <Link href="/demo" className="btn btn-glass btn-lg">
              Ver Demo ao Vivo
            </Link>
          </motion.div>

          <motion.div 
            className="mt-16 text-sm text-text-tertiary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.8 }}
          >
            ✨ Grátis para começar • 🚀 Deploy em minutos • 💳 Pagamentos integrados
          </motion.div>
        </div>
      </section>

      {/* Features Cards */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <h2 className="text-4xl font-bold mb-4">Tudo que você precisa</h2>
            <p className="text-xl text-text-secondary">
              Recursos profissionais para criar bots incríveis
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="glass-card group cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-6`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-text-secondary leading-relaxed">{feature.description}</p>
                
                <div className="mt-6 flex items-center text-accent-primary text-sm font-medium group-hover:text-accent-primary-hover transition-colors">
                  Saiba mais
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="glass-card text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
          >
            <h3 className="text-2xl font-semibold mb-8">Números que impressionam</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + 0.1 * index }}
                >
                  <div className="text-4xl font-bold gradient-text mb-2">{stat.value}</div>
                  <div className="text-text-secondary">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-4xl font-bold mb-6">
              Pronto para começar?
            </h2>
            <p className="text-xl text-text-secondary mb-10">
              Crie seu primeiro bot em menos de 5 minutos
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/register" className="btn btn-primary btn-lg">
                Começar Gratuitamente
              </Link>
              <div className="text-sm text-text-tertiary">
                Não é necessário cartão de crédito
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-glass-border">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold">TelegramBot Manager</span>
            </div>
            
            <div className="text-text-tertiary text-sm">
              © 2024 TelegramBot Manager. Todos os direitos reservados.
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}

const features = [
  {
    icon: Sparkles,
    title: 'Editor Visual',
    description: 'Crie fluxos de conversação complexos com interface drag & drop intuitiva.',
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    icon: Zap,
    title: 'Deploy Instantâneo',
    description: 'Publique seu bot em segundos com nossa infraestrutura otimizada.',
    gradient: 'from-yellow-500 to-orange-500'
  },
  {
    icon: Shield,
    title: 'Pagamentos Seguros',
    description: 'Integração nativa com PIX, cartão e boleto para monetizar seu bot.',
    gradient: 'from-green-500 to-emerald-500'
  },
  {
    icon: BarChart3,
    title: 'Analytics Avançado',
    description: 'Métricas detalhadas e insights para otimizar a performance.',
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Bot,
    title: 'IA Integrada',
    description: 'Respostas inteligentes e automação avançada com IA.',
    gradient: 'from-indigo-500 to-purple-500'
  },
  {
    icon: Rocket,
    title: 'Escalabilidade',
    description: 'Suporte a milhares de usuários simultâneos sem limitações.',
    gradient: 'from-red-500 to-pink-500'
  }
]

const stats = [
  { value: '10K+', label: 'Bots Criados' },
  { value: '1M+', label: 'Mensagens Processadas' },
  { value: '99.9%', label: 'Uptime Garantido' }
]