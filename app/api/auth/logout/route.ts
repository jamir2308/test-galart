import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  (await cookies()).set('authToken', '', {
    httpOnly: true,
    secure: true,
    path: '/',
    expires: new Date(0),
  });
  return NextResponse.json({ message: 'Cierre de sesión exitoso' });
}
