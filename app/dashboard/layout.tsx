"use client";

import { useAuthStore } from '@/store/authStore';
import Navbar from '@/components/layout/Header';

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <p>Redirigiendo al login...</p>
        </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto p-4">{children}</main>
    </div>
  );
}