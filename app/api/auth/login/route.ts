import { NextRequest, NextResponse } from 'next/server';

const MOCK_USER_EMAIL = 'john@example.com';
const MOCK_USER_PASSWORD = 'password123';
const HARDCODED_TOKEN = 'fake-hardcoded-jwt-token-12345abcde';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (email === MOCK_USER_EMAIL && password === MOCK_USER_PASSWORD) {
      const mockUser = {
        userId: 'john123',
        email: MOCK_USER_EMAIL,
        name: 'John Doe',
      };
      return NextResponse.json({ token: HARDCODED_TOKEN, user: mockUser });
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