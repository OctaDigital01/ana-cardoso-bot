'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // Validação básica
      if (!email || !password) {
        throw new Error('Email e senha são obrigatórios');
      }

      if (!/\S+@\S+\.\S+/.test(email)) {
        throw new Error('Email inválido');
      }

      // Real API call
      await login(email, password);
      
      setSuccess(true);
      
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
      
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-6">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
            <Bot className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Ana Cardoso Bot Manager</h1>
          <p className="text-gray-300 mt-2">Entre na sua conta</p>
        </div>

        {/* Login Form */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
          {success && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 flex items-center text-green-400 mb-6">
              <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="text-sm">Login realizado com sucesso! Redirecionando...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-center text-red-400 mb-6">
              <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 bg-white/5 border-white/20 rounded focus:ring-blue-500 focus:ring-2"
                />
                <span className="ml-2 text-sm text-gray-300">Lembrar de mim</span>
              </label>
              <Link href="/forgot-password" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                Esqueceu a senha?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Entrar</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-white/20"></div>
            <span className="px-4 text-sm text-gray-400">ou</span>
            <div className="flex-1 border-t border-white/20"></div>
          </div>

          {/* Social Login */}
          <button className="w-full bg-white/5 hover:bg-white/10 border border-white/20 text-white font-medium py-3 px-4 rounded-lg transition-colors">
            Continuar com Google
          </button>

          {/* Sign Up Link */}
          <p className="mt-6 text-center text-gray-300">
            Não tem uma conta?{' '}
            <Link href="/register" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
              Criar conta grátis
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-400 text-sm mt-8">
          Ao entrar, você concorda com nossos{' '}
          <Link href="/terms" className="text-blue-400 hover:text-blue-300 transition-colors">
            Termos de Serviço
          </Link>
        </p>
      </motion.div>
    </div>
  );
}