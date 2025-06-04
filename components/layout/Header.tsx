"use client";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { NewLogoutIcon } from "@/lib/icon";

export default function Header() {
  const { isAuthenticated, logout, user } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace("/auth/login");
  };

  return (
    <nav className="bg-primary/75 text-white p-4 shadow-md sticky top-0 z-50 backdrop-blur-sm">
      <div className="container mx-auto flex justify-between items-center">
        <Link href={isAuthenticated ? "/home" : "/login"} className="text-2xl font-bold hover:text-gray-200 transition-colors duration-150">
          GALART
        </Link>
        <div className="flex items-center space-x-4">
          {isAuthenticated && user && (
            <span className="text-lg hidden sm:inline font-medium text-white">Hola, {user.name}!</span>
          )}
          {isAuthenticated && (
            <button
              onClick={handleLogout}
              title="Cerrar Sesión"
              className="p-2 rounded-full hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-150 cursor-pointer"
            >
              <NewLogoutIcon />
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}