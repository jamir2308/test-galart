import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const MOCK_USER_EMAIL = 'john@example.com';
const MOCK_USER_PASSWORD = 'password123';
const HARDCODED_TOKEN = 'secret-hardcoded-token-for-simulation';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (email === MOCK_USER_EMAIL && password === MOCK_USER_PASSWORD) {
      const mockUser = {
        userId: 'john123',
        email: MOCK_USER_EMAIL,
        name: 'John Doe',
      };

      (await cookies()).set('authToken', HARDCODED_TOKEN, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60,
      });

      return NextResponse.json({ user: mockUser });
    } else {
      return NextResponse.json(
        { message: 'Credenciales inválidas' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Error en login API:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}