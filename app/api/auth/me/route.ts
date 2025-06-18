import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const HARDCODED_TOKEN = 'secret-hardcoded-token-for-simulation'; 
const MOCK_USER_EMAIL = 'john@example.com';

export async function GET() {
  const token = (await cookies()).get('authToken');

  if (token?.value !== HARDCODED_TOKEN) {
    return NextResponse.json({ message: 'No autenticado o token inválido' }, { status: 401 });
  }

  const user = {
    userId: 'john123',
    email: MOCK_USER_EMAIL,
    name: 'John Doe',
  };

  return NextResponse.json({ user });
}
