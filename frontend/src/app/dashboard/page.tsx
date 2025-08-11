'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Bot, 
  Plus, 
  Settings, 
  BarChart3, 
  Users, 
  MessageCircle, 
  Power,
  Edit3,
  Trash2,
  ExternalLink,
  Copy,
  CheckCircle
} from 'lucide-react';

interface TelegramBot {
  id: string;
  name: string;
  username: string;
  status: 'active' | 'inactive';
  messagesCount: number;
  usersCount: number;
  createdAt: string;
  webhookUrl: string;
}

export default function DashboardPage() {
  const [bots, setBots] = useState<TelegramBot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  useEffect(() => {
    // Simular carregamento dos bots
    setTimeout(() => {
      setBots([
        {
          id: '1',
          name: 'Atendimento Bot',
          username: 'atendimento_bot',
          status: 'active',
          messagesCount: 1250,
          usersCount: 89,
          createdAt: '2024-01-15',
          webhookUrl: 'https://api.exemplo.com/webhook/telegram/1'
        },
        {
          id: '2',
          name: 'Vendas Bot',
          username: 'vendas_bot',
          status: 'inactive',
          messagesCount: 856,
          usersCount: 45,
          createdAt: '2024-02-01',
          webhookUrl: 'https://api.exemplo.com/webhook/telegram/2'
        }
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const copyWebhookUrl = (url: string, botId: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(botId);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const toggleBotStatus = (botId: string) => {
    setBots(prev => prev.map(bot => 
      bot.id === botId 
        ? { ...bot, status: bot.status === 'active' ? 'inactive' : 'active' }
        : bot
    ));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Dashboard</h1>
                <p className="text-gray-400 text-sm">Gerencie seus bots do Telegram</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total de Bots</p>
                <p className="text-2xl font-bold text-white">{bots.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Bot className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Mensagens</p>
                <p className="text-2xl font-bold text-white">
                  {bots.reduce((sum, bot) => sum + bot.messagesCount, 0).toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Usuários Ativos</p>
                <p className="text-2xl font-bold text-white">
                  {bots.reduce((sum, bot) => sum + bot.usersCount, 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Bots Ativos</p>
                <p className="text-2xl font-bold text-white">
                  {bots.filter(bot => bot.status === 'active').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-orange-400" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bots Section */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Meus Bots</h2>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
            <Plus className="w-4 h-4" />
            <span>Criar Bot</span>
          </button>
        </div>

        {/* Bots Grid */}
        <div className="grid gap-6">
          {bots.map((bot, index) => (
            <motion.div
              key={bot.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    bot.status === 'active' ? 'bg-green-500/20' : 'bg-gray-500/20'
                  }`}>
                    <Bot className={`w-6 h-6 ${
                      bot.status === 'active' ? 'text-green-400' : 'text-gray-400'
                    }`} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">{bot.name}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        bot.status === 'active' 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {bot.status === 'active' ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mb-4">@{bot.username}</p>
                    
                    <div className="grid grid-cols-3 gap-6">
                      <div>
                        <p className="text-gray-400 text-xs">Mensagens</p>
                        <p className="text-white font-semibold">{bot.messagesCount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">Usuários</p>
                        <p className="text-white font-semibold">{bot.usersCount}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">Criado em</p>
                        <p className="text-white font-semibold">{new Date(bot.createdAt).toLocaleDateString('pt-BR')}</p>
                      </div>
                    </div>

                    {/* Webhook URL */}
                    <div className="mt-4 p-3 bg-black/20 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-400 text-xs mb-1">Webhook URL</p>
                          <p className="text-white text-sm font-mono truncate max-w-md">{bot.webhookUrl}</p>
                        </div>
                        <button
                          onClick={() => copyWebhookUrl(bot.webhookUrl, bot.id)}
                          className="p-2 text-gray-400 hover:text-white transition-colors"
                          title="Copiar URL"
                        >
                          {copiedUrl === bot.id ? (
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleBotStatus(bot.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      bot.status === 'active'
                        ? 'text-green-400 hover:bg-green-500/20'
                        : 'text-gray-400 hover:bg-gray-500/20'
                    }`}
                    title={bot.status === 'active' ? 'Desativar Bot' : 'Ativar Bot'}
                  >
                    <Power className="w-4 h-4" />
                  </button>
                  
                  <button className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors" title="Editar">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  
                  <button className="p-2 text-gray-400 hover:bg-gray-500/20 rounded-lg transition-colors" title="Analytics">
                    <BarChart3 className="w-4 h-4" />
                  </button>
                  
                  <button className="p-2 text-gray-400 hover:bg-gray-500/20 rounded-lg transition-colors" title="Abrir no Telegram">
                    <ExternalLink className="w-4 h-4" />
                  </button>
                  
                  <button className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors" title="Excluir">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {bots.length === 0 && (
          <div className="text-center py-12">
            <Bot className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Nenhum bot criado ainda</h3>
            <p className="text-gray-400 mb-6">Crie seu primeiro bot para começar a automatizar conversas</p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 mx-auto transition-colors">
              <Plus className="w-5 h-5" />
              <span>Criar Primeiro Bot</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}