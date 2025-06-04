"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Image from 'next/image';
import LoginForm from '@/components/layout/Login';
import axios from 'axios';

interface User {
  userId: string;
  email: string;
  name: string;
}

export default function LoginPage() {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const loginAction = useAuthStore((state) => state.login);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (typeof window !== 'undefined' && isAuthenticated) {
      router.replace('/dashboard/home');
    }
  }, [isAuthenticated, router]);

  const handleLoginSubmit = async (data: { email: string; password: string }) => {
    setError('');
    setIsLoading(true);

    try {
      const response = await axios.post('/api/auth/login', data);

      const result = response.data;

      if (response.status === 200 && result.token && result.user) {
        loginAction(result.token, result.user as User);
        router.replace('/dashboard/home');
      } else {
        setError(result.message || 'Credenciales inválidas o error en la respuesta.');
      }
    } catch (err) {
      setError('Ocurrió un error durante el login. Intenta de nuevo.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="min-h-screen grid md:grid-cols-2 bg-gray-100">
      <div className="flex flex-col items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
        <LoginForm onSubmit={handleLoginSubmit} isLoading={isLoading} error={error} />
        </div>
      </div>
      <div className="relative hidden md:flex items-center justify-center bg-[#E0F2F1]">
        <Image
          src="/login-rafiki.svg"
          alt="Ilustración inicio de sesión"
          width={460}
          height={460}
          priority
        />
      </div>
    </section>

  );
}