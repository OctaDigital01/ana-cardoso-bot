'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!searchParams) return;
    
    const token = searchParams.get('token');
    const refreshToken = searchParams.get('refresh');
    const error = searchParams.get('error');

    if (error) {
      setStatus('error');
      setMessage('Erro na autenticação com Google. Tente novamente.');
      return;
    }

    if (!token || !refreshToken) {
      setStatus('error');
      setMessage('Tokens de autenticação não recebidos.');
      return;
    }

    // Set tokens in localStorage and redirect
    try {
      localStorage.setItem('auth_token', token);
      localStorage.setItem('refresh_token', refreshToken);
      
      setStatus('success');
      setMessage('Login realizado com sucesso!');
      
      // Redirect to dashboard
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 2000);
    } catch (error) {
      setStatus('error');
      setMessage('Erro ao processar autenticação.');
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          {status === 'processing' && (
            <>
              <Loader2 className="h-16 w-16 text-blue-600 mx-auto animate-spin mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Processando Login</h1>
              <p className="text-gray-600">Finalizando sua autenticação...</p>
            </>
          )}
          
          {status === 'success' && (
            <>
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Login Realizado!</h1>
              <p className="text-gray-600 mb-4">{message}</p>
              <p className="text-sm text-gray-500">Redirecionando...</p>
            </>
          )}
          
          {status === 'error' && (
            <>
              <XCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Erro no Login</h1>
              <p className="text-gray-600 mb-6">{message}</p>
              <button
                onClick={() => router.push('/login')}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Tentar Novamente
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}