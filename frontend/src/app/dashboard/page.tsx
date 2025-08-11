'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  MessageCircle, 
  DollarSign,
  Bot as BotIcon,
  Settings,
  MessageSquare,
  Eye,
  Calendar,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  LogOut
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { botsAPI, analyticsAPI, messagesAPI, type Bot, type Analytics } from '@/lib/api';

function DashboardContent() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Real data state
  const [bots, setBots] = useState<Bot[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [selectedBot, setSelectedBot] = useState<Bot | null>(null);

  // Load data on mount
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      setError('');

      const [botsData, analyticsData] = await Promise.all([
        botsAPI.getAll(),
        analyticsAPI.getDashboard()
      ]);

      setBots(botsData);
      setAnalytics(analyticsData);

      if (botsData.length > 0 && !selectedBot) {
        setSelectedBot(botsData[0] || null);
      }
    } catch (err: any) {
      console.error('Error loading dashboard data:', err);
      setError(err.message || 'Erro ao carregar dados');
      // Fallback to mock data if API fails
      setAnalytics({
        totalBots: 0,
        activeUsers: 0,
        messagesThisMonth: 0,
        revenue: 0,
        growth: { bots: 0, users: 0, messages: 0, revenue: 0 },
        chartData: [],
        recentActivity: []
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBotToggle = async (botId: string) => {
    try {
      const updatedBot = await botsAPI.toggle(botId);
      setBots(prev => prev.map(bot => bot.id === botId ? updatedBot : bot));
    } catch (err: any) {
      setError('Erro ao alterar status do bot');
    }
  };

  const handleBotDelete = async (botId: string) => {
    try {
      await botsAPI.delete(botId);
      setBots(prev => prev.filter(bot => bot.id !== botId));
      if (selectedBot?.id === botId) {
        setSelectedBot(bots.find(bot => bot.id !== botId) || null);
      }
    } catch (err: any) {
      setError('Erro ao excluir bot');
    }
  };


  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-white/20 border-t-white/60 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/70 text-sm">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-white/[0.08] bg-black/40 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <BotIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-white">Dashboard</h1>
                <p className="text-white/60 text-sm">Bem-vindo, {user?.name}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button 
                onClick={logout}
                className="w-8 h-8 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] transition-colors flex items-center justify-center"
                title="Sair"
              >
                <LogOut className="w-4 h-4 text-white/70" />
              </button>
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl shadow-sm flex items-center justify-center">
                <span className="text-white text-xs font-semibold">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Error Display */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 mb-6 flex items-center text-red-400">
            <div className="w-5 h-5 bg-red-500/20 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
              <span className="text-red-400 text-xs">!</span>
            </div>
            <div>
              <p className="text-sm font-medium">Erro ao carregar dados</p>
              <p className="text-xs text-red-400/80 mt-1">{error}</p>
            </div>
            <button
              onClick={() => {
                setError('');
                loadDashboardData();
              }}
              className="ml-auto bg-red-500/20 hover:bg-red-500/30 px-3 py-1 rounded-lg text-sm transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-white/[0.04] backdrop-blur-xl rounded-2xl p-1 border border-white/[0.08] w-fit">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'overview'
                  ? 'bg-white/[0.12] text-white shadow-sm'
                  : 'text-white/60 hover:text-white/80 hover:bg-white/[0.06]'
              }`}
            >
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-4 h-4" />
                <span>Visão Geral</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`px-6 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'messages'
                  ? 'bg-white/[0.12] text-white shadow-sm'
                  : 'text-white/60 hover:text-white/80 hover:bg-white/[0.06]'
              }`}
            >
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-4 h-4" />
                <span>Configurar Mensagens</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-6 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'settings'
                  ? 'bg-white/[0.12] text-white shadow-sm'
                  : 'text-white/60 hover:text-white/80 hover:bg-white/[0.06]'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Settings className="w-4 h-4" />
                <span>Configurações do Bot</span>
              </div>
            </button>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white/[0.04] backdrop-blur-xl rounded-2xl p-6 border border-white/[0.08]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-sm font-medium">Total de Bots</p>
                    <p className="text-3xl font-semibold text-white mt-2">{analytics?.totalBots || bots.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center">
                    <BotIcon className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm">
                  <ArrowUpRight className="w-4 h-4 text-green-400 mr-1" />
                  <span className="text-green-400 font-medium">+{analytics?.growth?.bots || 0}%</span>
                  <span className="text-white/50 ml-2">vs mês anterior</span>
                </div>
              </div>

              <div className="bg-white/[0.04] backdrop-blur-xl rounded-2xl p-6 border border-white/[0.08]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-sm font-medium">Usuários Ativos</p>
                    <p className="text-3xl font-semibold text-white mt-2">{analytics?.activeUsers?.toLocaleString() || '0'}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-400" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm">
                  <ArrowUpRight className="w-4 h-4 text-green-400 mr-1" />
                  <span className="text-green-400 font-medium">+{analytics?.growth?.users || 0}%</span>
                  <span className="text-white/50 ml-2">vs mês anterior</span>
                </div>
              </div>

              <div className="bg-white/[0.04] backdrop-blur-xl rounded-2xl p-6 border border-white/[0.08]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-sm font-medium">Mensagens</p>
                    <p className="text-3xl font-semibold text-white mt-2">{analytics?.messagesThisMonth?.toLocaleString() || '0'}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-500/20 rounded-2xl flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-green-400" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm">
                  <ArrowUpRight className="w-4 h-4 text-green-400 mr-1" />
                  <span className="text-green-400 font-medium">+{analytics?.growth?.messages || 0}%</span>
                  <span className="text-white/50 ml-2">este mês</span>
                </div>
              </div>

              <div className="bg-white/[0.04] backdrop-blur-xl rounded-2xl p-6 border border-white/[0.08]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-sm font-medium">Faturamento</p>
                    <p className="text-3xl font-semibold text-white mt-2">R$ {analytics?.revenue?.toLocaleString('pt-BR', {minimumFractionDigits: 2}) || '0,00'}</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-500/20 rounded-2xl flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-orange-400" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm">
                  <ArrowUpRight className="w-4 h-4 text-green-400 mr-1" />
                  <span className="text-green-400 font-medium">+{analytics?.growth?.revenue || 0}%</span>
                  <span className="text-white/50 ml-2">vs mês anterior</span>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Main Chart */}
              <div className="lg:col-span-2 bg-white/[0.04] backdrop-blur-xl rounded-2xl p-6 border border-white/[0.08]">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white">Crescimento Mensal</h3>
                    <p className="text-white/60 text-sm">Mensagens, usuários e faturamento</p>
                  </div>
                  <button className="px-4 py-2 bg-white/[0.08] hover:bg-white/[0.12] rounded-xl text-sm text-white/80 transition-colors">
                    Ver Detalhes
                  </button>
                </div>
                
                {/* Simple Chart Visualization */}
                <div className="h-64 flex items-end justify-between space-x-2">
                  {(analytics?.chartData || []).map((data, index) => (
                    <div key={data.month} className="flex-1 flex flex-col items-center space-y-2">
                      <div className="w-full flex flex-col items-center space-y-1">
                        {/* Messages Bar */}
                        <div 
                          className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg opacity-80"
                          style={{ height: `${(data.messages / 9000) * 100}px` }}
                        />
                        {/* Users Bar */}
                        <div 
                          className="w-full bg-gradient-to-t from-purple-500 to-purple-400 rounded-lg opacity-60"
                          style={{ height: `${(data.users / 1500) * 80}px` }}
                        />
                      </div>
                      <span className="text-white/50 text-xs font-medium">{data.month}</span>
                    </div>
                  ))}
                </div>
                
                {/* Legend */}
                <div className="flex items-center space-x-6 mt-6 pt-6 border-t border-white/[0.08]">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-white/60 text-sm">Mensagens</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span className="text-white/60 text-sm">Usuários</span>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white/[0.04] backdrop-blur-xl rounded-2xl p-6 border border-white/[0.08]">
                <h3 className="text-lg font-semibold text-white mb-6">Atividade Recente</h3>
                
                <div className="space-y-4">
                  {(analytics?.recentActivity || []).map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        activity.type === 'message' ? 'bg-blue-500/20' :
                        activity.type === 'user' ? 'bg-purple-500/20' :
                        activity.type === 'bot' ? 'bg-green-500/20' : 'bg-orange-500/20'
                      }`}>
                        {activity.type === 'message' && <MessageCircle className="w-4 h-4 text-blue-400" />}
                        {activity.type === 'user' && <Users className="w-4 h-4 text-purple-400" />}
                        {activity.type === 'bot' && <BotIcon className="w-4 h-4 text-green-400" />}
                        {activity.type === 'revenue' && <DollarSign className="w-4 h-4 text-orange-400" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-white/90 text-sm">{activity.description}</p>
                        <p className="text-white/50 text-xs mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="w-full mt-6 py-3 bg-white/[0.06] hover:bg-white/[0.10] rounded-xl text-white/70 text-sm font-medium transition-colors">
                  Ver Todas Atividades
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/[0.04] backdrop-blur-xl rounded-2xl p-6 border border-white/[0.08]">
              <h3 className="text-lg font-semibold text-white mb-6">Ações Rápidas</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/dashboard/create-bot" className="group flex items-center space-x-4 p-4 bg-white/[0.04] hover:bg-white/[0.08] rounded-2xl transition-colors">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                    <BotIcon className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Criar Novo Bot</h4>
                    <p className="text-white/60 text-sm">Configure um bot personalizado</p>
                  </div>
                </Link>

                <button className="group flex items-center space-x-4 p-4 bg-white/[0.04] hover:bg-white/[0.08] rounded-2xl transition-colors">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                    <MessageSquare className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Configurar Fluxo</h4>
                    <p className="text-white/60 text-sm">Personalize mensagens automáticas</p>
                  </div>
                </button>

                <button className="group flex items-center space-x-4 p-4 bg-white/[0.04] hover:bg-white/[0.08] rounded-2xl transition-colors">
                  <div className="w-12 h-12 bg-green-500/20 rounded-2xl flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                    <BarChart3 className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Ver Analytics</h4>
                    <p className="text-white/60 text-sm">Relatórios detalhados</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div className="space-y-8">
            {/* Message Flow Builder */}
            <div className="bg-white/[0.04] backdrop-blur-xl rounded-2xl p-6 border border-white/[0.08]">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-white">Configurador de Fluxo de Mensagens</h3>
                  <p className="text-white/60 text-sm">Configure mensagens automáticas, intervalos e sequências</p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">
                  + Nova Mensagem
                </button>
              </div>

              {/* Message Flow Steps */}
              <div className="space-y-4">
                {/* Welcome Message */}
                <div className="bg-white/[0.06] rounded-2xl p-6 border border-white/[0.08]">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-500/20 rounded-xl flex items-center justify-center">
                        <span className="text-green-400 text-sm font-semibold">1</span>
                      </div>
                      <div>
                        <h4 className="text-white font-medium">Mensagem de Boas-vindas</h4>
                        <p className="text-white/60 text-sm">Enviada quando o usuário inicia conversa</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-white/50 text-sm">Ativo</span>
                      <div className="w-10 h-6 bg-green-500/20 rounded-full relative">
                        <div className="w-4 h-4 bg-green-400 rounded-full absolute top-1 right-1"></div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/[0.04] rounded-xl p-4 mb-4">
                    <p className="text-white/90 text-sm">
                      👋 Olá! Bem-vindo ao nosso atendimento automatizado. Como posso ajudá-lo hoje?
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-white/50" />
                        <span className="text-white/60">Delay: Imediato</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Eye className="w-4 h-4 text-white/50" />
                        <span className="text-white/60">Enviadas: 847</span>
                      </div>
                    </div>
                    <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                      Editar
                    </button>
                  </div>
                </div>

                {/* Auto Response */}
                <div className="bg-white/[0.06] rounded-2xl p-6 border border-white/[0.08]">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-500/20 rounded-xl flex items-center justify-center">
                        <span className="text-blue-400 text-sm font-semibold">2</span>
                      </div>
                      <div>
                        <h4 className="text-white font-medium">Resposta Automática</h4>
                        <p className="text-white/60 text-sm">Quando não há atendentes disponíveis</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-white/50 text-sm">Ativo</span>
                      <div className="w-10 h-6 bg-blue-500/20 rounded-full relative">
                        <div className="w-4 h-4 bg-blue-400 rounded-full absolute top-1 right-1"></div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/[0.04] rounded-xl p-4 mb-4">
                    <p className="text-white/90 text-sm">
                      🤖 No momento não temos atendentes disponíveis. Sua mensagem é importante! Responderemos em breve.
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-white/50" />
                        <span className="text-white/60">Delay: 5 minutos</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Eye className="w-4 h-4 text-white/50" />
                        <span className="text-white/60">Enviadas: 234</span>
                      </div>
                    </div>
                    <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                      Editar
                    </button>
                  </div>
                </div>

                {/* Follow-up Message */}
                <div className="bg-white/[0.06] rounded-2xl p-6 border border-white/[0.08]">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-500/20 rounded-xl flex items-center justify-center">
                        <span className="text-purple-400 text-sm font-semibold">3</span>
                      </div>
                      <div>
                        <h4 className="text-white font-medium">Follow-up</h4>
                        <p className="text-white/60 text-sm">Mensagem de acompanhamento</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-white/50 text-sm">Inativo</span>
                      <div className="w-10 h-6 bg-white/[0.08] rounded-full relative">
                        <div className="w-4 h-4 bg-white/30 rounded-full absolute top-1 left-1"></div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/[0.04] rounded-xl p-4 mb-4">
                    <p className="text-white/90 text-sm">
                      📋 Como foi sua experiência conosco? Sua opinião é muito importante!
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-white/50" />
                        <span className="text-white/60">Delay: 24 horas</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Eye className="w-4 h-4 text-white/50" />
                        <span className="text-white/60">Enviadas: 0</span>
                      </div>
                    </div>
                    <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                      Editar
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Message Templates */}
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-white/[0.04] backdrop-blur-xl rounded-2xl p-6 border border-white/[0.08]">
                <h3 className="text-lg font-semibold text-white mb-6">Templates Prontos</h3>
                
                <div className="space-y-4">
                  <div className="bg-white/[0.06] rounded-xl p-4 border border-white/[0.08]">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-white font-medium">Horário de Funcionamento</h4>
                      <button className="text-blue-400 text-sm hover:text-blue-300">Usar</button>
                    </div>
                    <p className="text-white/70 text-sm">
                      🕒 Nosso horário de atendimento é de segunda a sexta, das 9h às 18h.
                    </p>
                  </div>

                  <div className="bg-white/[0.06] rounded-xl p-4 border border-white/[0.08]">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-white font-medium">Informações de Contato</h4>
                      <button className="text-blue-400 text-sm hover:text-blue-300">Usar</button>
                    </div>
                    <p className="text-white/70 text-sm">
                      📞 Entre em contato: (11) 9999-9999 | email@empresa.com
                    </p>
                  </div>

                  <div className="bg-white/[0.06] rounded-xl p-4 border border-white/[0.08]">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-white font-medium">Agradecimento</h4>
                      <button className="text-blue-400 text-sm hover:text-blue-300">Usar</button>
                    </div>
                    <p className="text-white/70 text-sm">
                      🙏 Obrigado por entrar em contato! Retornaremos em breve.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/[0.04] backdrop-blur-xl rounded-2xl p-6 border border-white/[0.08]">
                <h3 className="text-lg font-semibold text-white mb-6">Configurações Avançadas</h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-3">
                      Intervalo entre mensagens automáticas
                    </label>
                    <select className="w-full bg-white/[0.08] border border-white/[0.12] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500">
                      <option>5 minutos</option>
                      <option>15 minutos</option>
                      <option>30 minutos</option>
                      <option>1 hora</option>
                      <option>2 horas</option>
                      <option>6 horas</option>
                      <option>24 horas</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-3">
                      Máximo de mensagens por conversa
                    </label>
                    <select className="w-full bg-white/[0.08] border border-white/[0.12] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500">
                      <option>1 mensagem</option>
                      <option>3 mensagens</option>
                      <option>5 mensagens</option>
                      <option>10 mensagens</option>
                      <option>Ilimitado</option>
                    </select>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-white/80 text-sm font-medium">
                        Ativar modo noturno
                      </label>
                      <div className="w-10 h-6 bg-white/[0.08] rounded-full relative cursor-pointer">
                        <div className="w-4 h-4 bg-white/30 rounded-full absolute top-1 left-1"></div>
                      </div>
                    </div>
                    <p className="text-white/50 text-xs">
                      Pausar mensagens automáticas das 22h às 7h
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-white/80 text-sm font-medium">
                        Resposta inteligente com IA
                      </label>
                      <div className="w-10 h-6 bg-blue-500/20 rounded-full relative cursor-pointer">
                        <div className="w-4 h-4 bg-blue-400 rounded-full absolute top-1 right-1"></div>
                      </div>
                    </div>
                    <p className="text-white/50 text-xs">
                      Usar IA para gerar respostas contextuais
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-8">
            {/* BotFather Tutorial */}
            <div className="bg-white/[0.04] backdrop-blur-xl rounded-2xl p-6 border border-white/[0.08]">
              <h3 className="text-lg font-semibold text-white mb-6">🤖 Como criar seu bot no Telegram</h3>
              
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="bg-white/[0.06] rounded-2xl p-6 border border-white/[0.08]">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-8 h-8 bg-blue-500/20 rounded-xl flex items-center justify-center">
                        <span className="text-blue-400 text-sm font-semibold">1</span>
                      </div>
                      <h4 className="text-white font-semibold">Acesse o BotFather</h4>
                    </div>
                    <p className="text-white/70 text-sm mb-4">
                      No Telegram, procure por <code className="bg-white/[0.08] px-2 py-1 rounded text-blue-400">@BotFather</code> e inicie uma conversa.
                    </p>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">
                      Abrir BotFather
                    </button>
                  </div>

                  <div className="bg-white/[0.06] rounded-2xl p-6 border border-white/[0.08]">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-8 h-8 bg-green-500/20 rounded-xl flex items-center justify-center">
                        <span className="text-green-400 text-sm font-semibold">2</span>
                      </div>
                      <h4 className="text-white font-semibold">Crie um novo bot</h4>
                    </div>
                    <p className="text-white/70 text-sm mb-3">
                      Digite o comando <code className="bg-white/[0.08] px-2 py-1 rounded text-green-400">/newbot</code>
                    </p>
                    <p className="text-white/60 text-xs">
                      O BotFather irá pedir o nome do seu bot e o username (deve terminar com "bot").
                    </p>
                  </div>

                  <div className="bg-white/[0.06] rounded-2xl p-6 border border-white/[0.08]">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-8 h-8 bg-purple-500/20 rounded-xl flex items-center justify-center">
                        <span className="text-purple-400 text-sm font-semibold">3</span>
                      </div>
                      <h4 className="text-white font-semibold">Copie o token</h4>
                    </div>
                    <p className="text-white/70 text-sm mb-3">
                      O BotFather fornecerá um token como:
                    </p>
                    <div className="bg-black/30 rounded-lg p-3 border border-white/[0.08]">
                      <code className="text-yellow-400 text-xs">1234567890:ABCdefGhijKlmnopQRSTuvwXYZ</code>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Token Input */}
                  <div className="bg-white/[0.06] rounded-2xl p-6 border border-white/[0.08]">
                    <h4 className="text-white font-semibold mb-4">Configure seu bot aqui</h4>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-white/80 text-sm font-medium mb-3">
                          Nome do Bot
                        </label>
                        <input
                          type="text"
                          placeholder="Meu Bot de Atendimento"
                          className="w-full bg-white/[0.08] border border-white/[0.12] rounded-xl px-4 py-3 text-white placeholder-white/50 text-sm focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-white/80 text-sm font-medium mb-3">
                          Token do Bot
                        </label>
                        <input
                          type="password"
                          placeholder="1234567890:ABCdefGhijKlmnopQRSTuvwXYZ"
                          className="w-full bg-white/[0.08] border border-white/[0.12] rounded-xl px-4 py-3 text-white placeholder-white/50 text-sm focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition-colors">
                        Salvar Configurações
                      </button>
                    </div>
                  </div>

                  {/* Security Tips */}
                  <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-8 h-8 bg-orange-500/20 rounded-xl flex items-center justify-center">
                        <Settings className="w-4 h-4 text-orange-400" />
                      </div>
                      <h4 className="text-orange-400 font-semibold">Dicas de Segurança</h4>
                    </div>
                    <ul className="space-y-2 text-orange-300/80 text-sm">
                      <li className="flex items-start space-x-2">
                        <span className="text-orange-400">•</span>
                        <span>Nunca compartilhe seu token com terceiros</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-orange-400">•</span>
                        <span>O token é criptografado e armazenado com segurança</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-orange-400">•</span>
                        <span>Você pode regenerar o token no BotFather se necessário</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Bot Management */}
            <div className="bg-white/[0.04] backdrop-blur-xl rounded-2xl p-6 border border-white/[0.08]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Meus Bots Configurados</h3>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">
                  + Adicionar Bot
                </button>
              </div>

              <div className="space-y-4">
                {bots.length === 0 ? (
                  <div className="bg-white/[0.06] rounded-2xl p-8 border border-white/[0.08] text-center">
                    <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <BotIcon className="w-8 h-8 text-blue-400" />
                    </div>
                    <h4 className="text-white font-semibold mb-2">Nenhum bot configurado</h4>
                    <p className="text-white/60 text-sm mb-4">Adicione seu primeiro bot para começar</p>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">
                      + Adicionar Primeiro Bot
                    </button>
                  </div>
                ) : (
                  bots.map((bot) => (
                    <div key={bot.id} className="bg-white/[0.06] rounded-2xl p-6 border border-white/[0.08]">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                            bot.isActive ? 'bg-green-500/20' : 'bg-gray-500/20'
                          }`}>
                            <BotIcon className={`w-6 h-6 ${
                              bot.isActive ? 'text-green-400' : 'text-gray-400'
                            }`} />
                          </div>
                          <div>
                            <h4 className="text-white font-semibold">{bot.name}</h4>
                            <p className="text-white/60 text-sm">@{bot.username}</p>
                            <div className="flex items-center space-x-4 mt-2">
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                bot.isActive 
                                  ? 'text-green-400 bg-green-500/20' 
                                  : 'text-gray-400 bg-gray-500/20'
                              }`}>
                                {bot.isActive ? 'Ativo' : 'Inativo'}
                              </span>
                              <span className="text-white/50 text-xs">{bot.messageCount || 0} mensagens enviadas</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleBotDelete(bot.id)}
                            className="p-2 text-red-400/60 hover:text-red-400 hover:bg-red-500/[0.08] rounded-xl transition-colors"
                            title="Excluir bot"
                          >
                            <Settings className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleBotToggle(bot.id)}
                            className={`w-10 h-6 rounded-full relative transition-colors ${
                              bot.isActive ? 'bg-green-500/20' : 'bg-white/[0.08]'
                            }`}
                          >
                            <div className={`w-4 h-4 rounded-full absolute top-1 transition-all ${
                              bot.isActive 
                                ? 'bg-green-400 right-1' 
                                : 'bg-white/30 left-1'
                            }`}></div>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Advanced Settings */}
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-white/[0.04] backdrop-blur-xl rounded-2xl p-6 border border-white/[0.08]">
                <h3 className="text-lg font-semibold text-white mb-6">Configurações Globais</h3>
                
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="text-white/90 font-medium">Webhook HTTPS</h4>
                        <p className="text-white/50 text-xs">Comunicação segura com o Telegram</p>
                      </div>
                      <div className="w-10 h-6 bg-green-500/20 rounded-full relative">
                        <div className="w-4 h-4 bg-green-400 rounded-full absolute top-1 right-1"></div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="text-white/90 font-medium">Log de Atividades</h4>
                        <p className="text-white/50 text-xs">Registrar todas as interações</p>
                      </div>
                      <div className="w-10 h-6 bg-blue-500/20 rounded-full relative">
                        <div className="w-4 h-4 bg-blue-400 rounded-full absolute top-1 right-1"></div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="text-white/90 font-medium">Backup Automático</h4>
                        <p className="text-white/50 text-xs">Backup diário das configurações</p>
                      </div>
                      <div className="w-10 h-6 bg-white/[0.08] rounded-full relative">
                        <div className="w-4 h-4 bg-white/30 rounded-full absolute top-1 left-1"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/[0.04] backdrop-blur-xl rounded-2xl p-6 border border-white/[0.08]">
                <h3 className="text-lg font-semibold text-white mb-6">Comandos Úteis</h3>
                
                <div className="space-y-4">
                  <div className="bg-white/[0.06] rounded-xl p-4 border border-white/[0.08]">
                    <h4 className="text-white font-medium mb-2">Configurar Menu</h4>
                    <code className="text-blue-400 text-sm bg-black/30 px-2 py-1 rounded">/setcommands</code>
                    <p className="text-white/60 text-xs mt-2">Define os comandos do menu do bot</p>
                  </div>

                  <div className="bg-white/[0.06] rounded-xl p-4 border border-white/[0.08]">
                    <h4 className="text-white font-medium mb-2">Definir Descrição</h4>
                    <code className="text-purple-400 text-sm bg-black/30 px-2 py-1 rounded">/setdescription</code>
                    <p className="text-white/60 text-xs mt-2">Adiciona descrição do bot</p>
                  </div>

                  <div className="bg-white/[0.06] rounded-xl p-4 border border-white/[0.08]">
                    <h4 className="text-white font-medium mb-2">Foto do Perfil</h4>
                    <code className="text-green-400 text-sm bg-black/30 px-2 py-1 rounded">/setuserpic</code>
                    <p className="text-white/60 text-xs mt-2">Define a foto do perfil do bot</p>
                  </div>

                  <div className="bg-white/[0.06] rounded-xl p-4 border border-white/[0.08]">
                    <h4 className="text-white font-medium mb-2">Regenerar Token</h4>
                    <code className="text-red-400 text-sm bg-black/30 px-2 py-1 rounded">/revoke</code>
                    <p className="text-white/60 text-xs mt-2">Gera um novo token (cuidado!)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}