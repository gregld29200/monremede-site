import { SignJWT, jwtVerify } from 'jose'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

const SESSION_COOKIE_NAME = 'admin_session'
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000 // 7 days

function getSessionSecret(): Uint8Array {
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret) {
    throw new Error('ADMIN_SESSION_SECRET is not defined')
  }
  return new TextEncoder().encode(secret)
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function createSession(): Promise<string> {
  const secret = getSessionSecret()
  const expiresAt = new Date(Date.now() + SESSION_DURATION)

  const token = await new SignJWT({ admin: true })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresAt)
    .sign(secret)

  return token
}

export async function verifySession(token: string): Promise<boolean> {
  try {
    const secret = getSessionSecret()
    await jwtVerify(token, secret)
    return true
  } catch {
    return false
  }
}

export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION / 1000,
    path: '/',
  })
}

export async function getSessionCookie(): Promise<string | undefined> {
  const cookieStore = await cookies()
  return cookieStore.get(SESSION_COOKIE_NAME)?.value
}

export async function deleteSessionCookie(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}

export function getSessionFromRequest(request: NextRequest): string | undefined {
  return request.cookies.get(SESSION_COOKIE_NAME)?.value
}

export async function isAuthenticated(): Promise<boolean> {
  const token = await getSessionCookie()
  if (!token) return false
  return verifySession(token)
}

export async function checkAdminPassword(password: string): Promise<boolean> {
  const hash = process.env.ADMIN_PASSWORD_HASH
  if (!hash) {
    throw new Error('ADMIN_PASSWORD_HASH is not defined')
  }
  return verifyPassword(password, hash)
}
