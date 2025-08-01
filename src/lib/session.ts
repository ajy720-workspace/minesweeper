// src/lib/session.ts
import 'server-only';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const secretKey = process.env.SESSION_SECRET;
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: Record<string, unknown>) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d')
    .sign(key);
}

export async function decrypt(input: string): Promise<Record<string, unknown> | null> {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch {
    return null;
  }
}

export async function login(user: { id: number; username: string }) {
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const session = await encrypt({ user, expires });
  (await cookies()).set('session', session, { expires, httpOnly: true });
}

export async function getSession(): Promise<{ id: number; username: string } | null> {
  const sessionCookie = (await cookies()).get('session');
  if (!sessionCookie) return null;

  const session = await decrypt(sessionCookie.value);
  if (!session) return null;

  return session.user as { id: number; username: string } | null;
}
