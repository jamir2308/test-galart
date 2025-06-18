"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/lib/AuthContext';
import dynamic from 'next/dynamic';

const LoginForm = dynamic(() => import('@/components/layout/Login'), {
  loading: () => <p className="text-center">Cargando formulario...</p>,
  ssr: false
});

export default function LoginPage() {
  const { login, isAuthenticated, isLoading, error } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/home');
    }
  }, [isAuthenticated, router]);

  const handleLoginSubmit = async (data: { email: string; password: string }) => {
    await login(data.email, data.password);
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