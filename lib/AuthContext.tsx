'use client';

import { createContext, useContext, ReactNode, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { AuthContextType, User } from '@/types/auth.types';
import { LOGIN_ROUTE, HOME_ROUTE } from '@/lib/constants';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const checkAuthStatus = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        if (data.user) {
          setUser(data.user);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        await fetch('/api/auth/logout', { method: 'POST' });
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (err) {
        await fetch('/api/auth/logout', { method: 'POST' });
      console.error(err);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const login = async (email: string, pass:string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass }),
      });
      
      const result = await response.json();

      if (response.ok && result.user) {
        setUser(result.user);
        setIsAuthenticated(true);
        router.replace(HOME_ROUTE);
      } else {
        setError(result.message || 'Credenciales inválidas o error en la respuesta.');
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error("Login fetch error:", err);
      setError('An unexpected error occurred during login.');
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      setIsAuthenticated(false);
      router.push(LOGIN_ROUTE);
    } catch (err) {
      console.error("Logout failed", err);
      setError('Failed to log out.');
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para usar el contexto fácilmente
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}