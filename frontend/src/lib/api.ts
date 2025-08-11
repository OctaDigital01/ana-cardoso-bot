import axios from 'axios';

// Configure base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors and fallback to mock data
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    // If backend is not available, throw error to allow fallback to mock data
    if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
      console.warn('Backend not available, falling back to mock data');
    }
    
    return Promise.reject(error);
  }
);

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface Bot {
  id: string;
  name: string;
  username?: string;
  description?: string;
  token: string; // encrypted
  isActive: boolean;
  webhookUrl?: string;
  userId?: string;
  createdAt: string;
  updatedAt?: string;
  messageCount?: number; // For compatibility with mock data
  userCount?: number; // For compatibility with mock data
  stats?: {
    messagesCount: number;
    usersCount: number;
    lastActivity?: string;
  };
}

export interface Message {
  id: string;
  botId: string;
  type: 'welcome' | 'auto_response' | 'follow_up' | 'custom';
  content: string;
  delay: number; // in minutes
  isActive: boolean;
  order: number;
  createdAt: string;
}

export interface Analytics {
  totalBots: number;
  activeUsers: number;
  messagesThisMonth: number;
  revenue: number;
  growth: {
    bots: number;
    users: number;
    messages: number;
    revenue: number;
  };
  chartData: Array<{
    month: string;
    messages: number;
    users: number;
    revenue: number;
  }>;
  recentActivity: Array<{
    id: string;
    type: 'message' | 'user' | 'bot' | 'revenue';
    description: string;
    time: string;
  }>;
}

// Auth API
export const authAPI = {
  login: async (email: string, password: string): Promise<{ user: User; accessToken: string; refreshToken: string }> => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (name: string, email: string, password: string): Promise<{ message: string; user: any }> => {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
  },

  verifyEmail: async (token: string): Promise<{ user: User; accessToken: string; refreshToken: string }> => {
    const response = await api.post('/auth/verify-email', { token });
    return response.data;
  },

  refreshToken: async (refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> => {
    const response = await api.post('/auth/refresh', { refreshToken });
    return response.data;
  },

  me: async (): Promise<User> => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Bots API
export const botsAPI = {
  getAll: async (): Promise<Bot[]> => {
    const response = await api.get('/api/v1/bots');
    return response.data;
  },

  create: async (botData: {
    name: string;
    username?: string;
    description?: string;
    token: string;
  }): Promise<Bot> => {
    const response = await api.post('/api/v1/bots', botData);
    return response.data;
  },

  update: async (botId: string, botData: Partial<Bot>): Promise<Bot> => {
    const response = await api.put(`/api/v1/bots/${botId}`, botData);
    return response.data;
  },

  delete: async (botId: string): Promise<void> => {
    await api.delete(`/api/v1/bots/${botId}`);
  },

  toggle: async (botId: string): Promise<Bot> => {
    const response = await api.patch(`/api/v1/bots/${botId}/toggle`);
    return response.data;
  },

  getStats: async (botId: string): Promise<any> => {
    const response = await api.get(`/api/v1/bots/${botId}/stats`);
    return response.data;
  },
};

// Messages API
export const messagesAPI = {
  getByBot: async (botId: string): Promise<Message[]> => {
    const response = await api.get(`/api/v1/bots/${botId}/messages`);
    return response.data;
  },

  create: async (botId: string, messageData: {
    type: string;
    content: string;
    delay: number;
    order: number;
  }): Promise<Message> => {
    const response = await api.post(`/api/v1/bots/${botId}/messages`, messageData);
    return response.data;
  },

  update: async (messageId: string, messageData: Partial<Message>): Promise<Message> => {
    const response = await api.put(`/api/v1/messages/${messageId}`, messageData);
    return response.data;
  },

  delete: async (messageId: string): Promise<void> => {
    await api.delete(`/api/v1/messages/${messageId}`);
  },

  toggle: async (messageId: string): Promise<Message> => {
    const response = await api.patch(`/api/v1/messages/${messageId}/toggle`);
    return response.data;
  },
};

// Analytics API
export const analyticsAPI = {
  getDashboard: async (): Promise<Analytics> => {
    const response = await api.get('/api/v1/analytics/dashboard');
    return response.data;
  },

  getBotAnalytics: async (botId: string, period: string = '30d'): Promise<any> => {
    const response = await api.get(`/api/v1/analytics/bots/${botId}?period=${period}`);
    return response.data;
  },
};

// Health check
export const healthAPI = {
  check: async (): Promise<{ status: string; timestamp: string }> => {
    const response = await api.get('/health');
    return response.data;
  },
};

// Mock data for fallback when backend is not available
const mockUser: User = {
  id: '1',
  name: 'Usuário Demo',
  email: 'demo@example.com',
  createdAt: new Date().toISOString(),
};

const mockBots: Bot[] = [
  {
    id: '1',
    name: 'Bot de Atendimento',
    username: 'atendimento_bot',
    description: 'Bot para atendimento automatizado',
    token: 'encrypted_token_123',
    isActive: true,
    webhookUrl: 'https://example.com/webhook',
    messageCount: 847,
    userCount: 234,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Bot de Vendas',
    username: 'vendas_bot',
    description: 'Bot para suporte de vendas',
    token: 'encrypted_token_456',
    isActive: false,
    webhookUrl: 'https://example.com/webhook2',
    messageCount: 423,
    userCount: 156,
    createdAt: new Date().toISOString(),
  },
];

const mockAnalytics: Analytics = {
  totalBots: 2,
  activeUsers: 1247,
  messagesThisMonth: 8945,
  revenue: 2340.50,
  growth: {
    bots: 12,
    users: 23,
    messages: 18,
    revenue: 15,
  },
  chartData: [
    { month: 'Jan', messages: 2400, users: 400, revenue: 800 },
    { month: 'Fev', messages: 1398, users: 600, revenue: 1200 },
    { month: 'Mar', messages: 9800, users: 800, revenue: 1600 },
    { month: 'Abr', messages: 3908, users: 1000, revenue: 2000 },
    { month: 'Mai', messages: 4800, users: 1200, revenue: 2340 },
  ],
  recentActivity: [
    {
      id: '1',
      type: 'message',
      description: 'Mensagem automática enviada para 23 usuários',
      time: 'há 5 minutos',
    },
    {
      id: '2',
      type: 'user',
      description: 'Novo usuário iniciou conversa',
      time: 'há 12 minutos',
    },
    {
      id: '3',
      type: 'bot',
      description: 'Bot "Atendimento" foi ativado',
      time: 'há 1 hora',
    },
    {
      id: '4',
      type: 'revenue',
      description: 'Novo pagamento de R$ 49,90 recebido',
      time: 'há 2 horas',
    },
  ],
};

// Enhanced API functions with fallback to mock data
export const authAPIWithFallback = {
  login: async (email: string, password: string): Promise<{ user: User; token: string }> => {
    try {
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    } catch (error: any) {
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        // Mock successful login
        console.log('🎭 Using mock login data');
        return {
          user: mockUser,
          token: 'mock_jwt_token_123456789',
        };
      }
      throw error;
    }
  },

  register: async (name: string, email: string, password: string): Promise<{ user: User; token: string }> => {
    try {
      const response = await api.post('/auth/register', { name, email, password });
      return response.data;
    } catch (error: any) {
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        // Mock successful registration
        console.log('🎭 Using mock register data');
        return {
          user: { ...mockUser, name, email },
          token: 'mock_jwt_token_123456789',
        };
      }
      throw error;
    }
  },

  me: async (): Promise<User> => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error: any) {
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        console.log('🎭 Using mock user data');
        return mockUser;
      }
      throw error;
    }
  },
};

export const botsAPIWithFallback = {
  getAll: async (): Promise<Bot[]> => {
    try {
      const response = await api.get('/api/v1/bots');
      return response.data;
    } catch (error: any) {
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        console.log('🎭 Using mock bots data');
        return mockBots;
      }
      throw error;
    }
  },

  create: async (botData: {
    name: string;
    username?: string;
    description?: string;
    token: string;
  }): Promise<Bot> => {
    try {
      const response = await api.post('/api/v1/bots', botData);
      return response.data;
    } catch (error: any) {
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        console.log('🎭 Using mock bot creation');
        const newBot: Bot = {
          id: Date.now().toString(),
          name: botData.name,
          username: botData.username || 'new_bot',
          description: botData.description || '',
          token: 'encrypted_token_new',
          isActive: false,
          webhookUrl: '',
          messageCount: 0,
          userCount: 0,
          createdAt: new Date().toISOString(),
        };
        mockBots.push(newBot);
        return newBot;
      }
      throw error;
    }
  },

  update: async (botId: string, botData: Partial<Bot>): Promise<Bot> => {
    try {
      const response = await api.put(`/api/v1/bots/${botId}`, botData);
      return response.data;
    } catch (error: any) {
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        console.log('🎭 Using mock bot update');
        const botIndex = mockBots.findIndex(bot => bot.id === botId);
        if (botIndex !== -1) {
          // Filter out undefined values from botData
          const cleanBotData = Object.fromEntries(
            Object.entries(botData).filter(([_, v]) => v !== undefined)
          );
          mockBots[botIndex] = { ...mockBots[botIndex], ...cleanBotData } as Bot;
          return mockBots[botIndex];
        }
        throw new Error('Bot not found');
      }
      throw error;
    }
  },

  delete: async (botId: string): Promise<void> => {
    try {
      await api.delete(`/api/v1/bots/${botId}`);
    } catch (error: any) {
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        console.log('🎭 Using mock bot deletion');
        const botIndex = mockBots.findIndex(bot => bot.id === botId);
        if (botIndex !== -1) {
          mockBots.splice(botIndex, 1);
        }
        return;
      }
      throw error;
    }
  },

  toggle: async (botId: string): Promise<Bot> => {
    try {
      const response = await api.patch(`/api/v1/bots/${botId}/toggle`);
      return response.data;
    } catch (error: any) {
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        console.log('🎭 Using mock bot toggle');
        const botIndex = mockBots.findIndex(bot => bot.id === botId);
        if (botIndex !== -1) {
          const bot = mockBots[botIndex]!;
          bot.isActive = !Boolean(bot.isActive);
          return bot;
        }
        throw new Error('Bot not found');
      }
      throw error;
    }
  },

  getStats: async (botId: string): Promise<any> => {
    try {
      const response = await api.get(`/api/v1/bots/${botId}/stats`);
      return response.data;
    } catch (error: any) {
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        console.log('🎭 Using mock bot stats');
        return { messages: 123, users: 45, revenue: 678.90 };
      }
      throw error;
    }
  },
};

export const analyticsAPIWithFallback = {
  getDashboard: async (): Promise<Analytics> => {
    try {
      const response = await api.get('/api/v1/analytics/dashboard');
      return response.data;
    } catch (error: any) {
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        console.log('🎭 Using mock analytics data');
        return mockAnalytics;
      }
      throw error;
    }
  },

  getBotAnalytics: async (botId: string, period: string = '30d'): Promise<any> => {
    try {
      const response = await api.get(`/api/v1/analytics/bots/${botId}?period=${period}`);
      return response.data;
    } catch (error: any) {
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        console.log('🎭 Using mock bot analytics');
        return { messages: 456, users: 78, conversions: 12 };
      }
      throw error;
    }
  },
};

export default api;