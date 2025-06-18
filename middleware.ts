import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { HOME_ROUTE, LOGIN_ROUTE } from './lib/constants';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('authToken')?.value;
  const { pathname } = request.nextUrl;

  const protectedRoutes = [HOME_ROUTE];
  const publicRoutes = [LOGIN_ROUTE];

  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute && !token) {
    const loginUrl = new URL(LOGIN_ROUTE, request.url);
    loginUrl.searchParams.set('redirectedFrom', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isPublicRoute && token) {
    return NextResponse.redirect(new URL(HOME_ROUTE, request.url));
  }

  return NextResponse.next();
}

// Configuración del Matcher para especificar qué rutas debe ejecutar el middleware
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    '/home/:path*',
    '/login/:path*',
  ],
}; 