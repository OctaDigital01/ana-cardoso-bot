'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, authAPI } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing auth on mount
    const savedToken = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      
      // Verify token is still valid
      authAPI.me()
        .then((userData) => {
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        })
        .catch(() => {
          // Token is invalid, clear auth
          logout();
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { user: userData, token: authToken } = await authAPI.login(email, password);
      
      setUser(userData);
      setToken(authToken);
      
      localStorage.setItem('auth_token', authToken);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao fazer login');
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const { user: userData, token: authToken } = await authAPI.register(name, email, password);
      
      setUser(userData);
      setToken(authToken);
      
      localStorage.setItem('auth_token', authToken);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao criar conta');
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated: !!user && !!token,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}