'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bot, 
  ArrowLeft, 
  Save, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle,
  Settings,
  MessageCircle,
  Zap,
  Shield
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CreateBotPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    token: '',
    description: '',
    welcomeMessage: 'Olá! Bem-vindo ao nosso bot. Como posso ajudá-lo?',
    commands: [
      { command: '/start', description: 'Iniciar conversa' },
      { command: '/help', description: 'Mostrar ajuda' }
    ]
  });
  const [showToken, setShowToken] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // Validação
      if (!formData.name.trim()) {
        throw new Error('Nome do bot é obrigatório');
      }
      if (!formData.token.trim()) {
        throw new Error('Token do bot é obrigatório');
      }
      if (!formData.token.includes(':') || formData.token.length < 45) {
        throw new Error('Token do bot inválido');
      }

      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSuccess(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
      
    } catch (err: any) {
      setError(err.message || 'Erro ao criar bot. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const addCommand = () => {
    setFormData(prev => ({
      ...prev,
      commands: [...prev.commands, { command: '', description: '' }]
    }));
  };

  const updateCommand = (index: number, field: 'command' | 'description', value: string) => {
    setFormData(prev => ({
      ...prev,
      commands: prev.commands.map((cmd, i) => 
        i === index ? { ...cmd, [field]: value } : cmd
      )
    }));
  };

  const removeCommand = (index: number) => {
    setFormData(prev => ({
      ...prev,
      commands: prev.commands.filter((_, i) => i !== index)
    }));
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 text-center max-w-md w-full"
        >
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">Bot criado com sucesso!</h1>
          <p className="text-gray-300 mb-6">
            Seu bot foi configurado e está pronto para uso. Você será redirecionado para o dashboard.
          </p>
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/dashboard" 
                className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Criar Novo Bot</h1>
                  <p className="text-gray-400 text-sm">Configure seu bot do Telegram</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center text-red-400 mb-6"
          >
            <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 sticky top-8">
              <h3 className="text-lg font-semibold text-white mb-4">Configurações</h3>
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('basic')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                    activeTab === 'basic' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  <span>Básico</span>
                </button>
                <button
                  onClick={() => setActiveTab('messages')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                    activeTab === 'messages' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Mensagens</span>
                </button>
                <button
                  onClick={() => setActiveTab('commands')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                    activeTab === 'commands' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Zap className="w-4 h-4" />
                  <span>Comandos</span>
                </button>
                <button
                  onClick={() => setActiveTab('security')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                    activeTab === 'security' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  <span>Segurança</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
                {/* Basic Tab */}
                {activeTab === 'basic' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-xl font-bold text-white mb-6">Informações Básicas</h2>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Nome do Bot *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Meu Bot de Atendimento"
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Username (opcional)
                      </label>
                      <input
                        type="text"
                        value={formData.username}
                        onChange={(e) => handleInputChange('username', e.target.value)}
                        placeholder="meu_bot"
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <p className="text-gray-400 text-sm mt-1">
                        Username público do seu bot (sem @)
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Token do Bot *
                      </label>
                      <div className="relative">
                        <input
                          type={showToken ? 'text' : 'password'}
                          value={formData.token}
                          onChange={(e) => handleInputChange('token', e.target.value)}
                          placeholder="1234567890:ABCdefGhijKlmnopQRSTuvwXYZ"
                          className="w-full px-4 py-3 pr-12 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowToken(!showToken)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                        >
                          {showToken ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      <p className="text-gray-400 text-sm mt-1">
                        Obtido através do @BotFather no Telegram
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Descrição
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        placeholder="Descreva o propósito do seu bot..."
                        rows={3}
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Messages Tab */}
                {activeTab === 'messages' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-xl font-bold text-white mb-6">Mensagens</h2>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Mensagem de Boas-vindas
                      </label>
                      <textarea
                        value={formData.welcomeMessage}
                        onChange={(e) => handleInputChange('welcomeMessage', e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      />
                      <p className="text-gray-400 text-sm mt-1">
                        Mensagem enviada quando o usuário inicia uma conversa
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Commands Tab */}
                {activeTab === 'commands' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-white">Comandos</h2>
                      <button
                        type="button"
                        onClick={addCommand}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        Adicionar Comando
                      </button>
                    </div>

                    <div className="space-y-4">
                      {formData.commands.map((cmd, index) => (
                        <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-white mb-2">
                                Comando
                              </label>
                              <input
                                type="text"
                                value={cmd.command}
                                onChange={(e) => updateCommand(index, 'command', e.target.value)}
                                placeholder="/comando"
                                className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-white mb-2">
                                Descrição
                              </label>
                              <div className="flex space-x-2">
                                <input
                                  type="text"
                                  value={cmd.description}
                                  onChange={(e) => updateCommand(index, 'description', e.target.value)}
                                  placeholder="Descrição do comando"
                                  className="flex-1 px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {formData.commands.length > 2 && (
                                  <button
                                    type="button"
                                    onClick={() => removeCommand(index)}
                                    className="px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                                  >
                                    ×
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Security Tab */}
                {activeTab === 'security' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-xl font-bold text-white mb-6">Segurança</h2>
                    </div>

                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <Shield className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <h3 className="text-blue-400 font-medium mb-1">Token Seguro</h3>
                          <p className="text-blue-300/80 text-sm">
                            Seu token será criptografado e armazenado de forma segura. 
                            Nunca compartilhe seu token com terceiros.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                        <div>
                          <h4 className="text-white font-medium">Webhook Seguro</h4>
                          <p className="text-gray-400 text-sm">Usar HTTPS para comunicação</p>
                        </div>
                        <input
                          type="checkbox"
                          defaultChecked
                          className="w-4 h-4 text-blue-600 bg-white/5 border-white/20 rounded focus:ring-blue-500"
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                        <div>
                          <h4 className="text-white font-medium">Log de Atividades</h4>
                          <p className="text-gray-400 text-sm">Registrar todas as mensagens e comandos</p>
                        </div>
                        <input
                          type="checkbox"
                          defaultChecked
                          className="w-4 h-4 text-blue-600 bg-white/5 border-white/20 rounded focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Submit Button */}
                <div className="flex justify-end mt-8 pt-6 border-t border-white/10">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Criando...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Criar Bot</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}