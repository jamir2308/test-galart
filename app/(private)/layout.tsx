"use client";

import { useAuth } from '@/lib/AuthContext';
import Navbar from '@/components/layout/Header';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LOGIN_ROUTE } from '@/lib/constants';

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(LOGIN_ROUTE);
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <p className="text-xl text-slate-600">Verificando sesión...</p>
        </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto p-4">{children}</main>
    </div>
  );
}