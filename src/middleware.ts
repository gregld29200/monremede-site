import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const SESSION_COOKIE_NAME = 'admin_session'

// Obscure admin path - change this to something only you know
const ADMIN_PATH = '/gestion-mon-remede-oum'
const API_ADMIN_PATH = '/api/gestion-mon-remede-oum'

async function verifySessionToken(token: string): Promise<boolean> {
  try {
    const secret = process.env.ADMIN_SESSION_SECRET
    if (!secret) return false

    const secretKey = new TextEncoder().encode(secret)
    await jwtVerify(token, secretKey)
    return true
  } catch {
    return false
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Block access to /admin (redirect to 404 behavior)
  if (pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Protect obscure admin routes (except login)
  if (pathname.startsWith(ADMIN_PATH) && pathname !== `${ADMIN_PATH}/login`) {
    const token = request.cookies.get(SESSION_COOKIE_NAME)?.value

    if (!token) {
      return NextResponse.redirect(new URL(`${ADMIN_PATH}/login`, request.url))
    }

    const isValid = await verifySessionToken(token)
    if (!isValid) {
      const response = NextResponse.redirect(new URL(`${ADMIN_PATH}/login`, request.url))
      response.cookies.delete(SESSION_COOKIE_NAME)
      return response
    }
  }

  // Protect API admin routes (except auth)
  if (pathname.startsWith(API_ADMIN_PATH) && !pathname.startsWith(`${API_ADMIN_PATH}/auth`)) {
    const token = request.cookies.get(SESSION_COOKIE_NAME)?.value

    if (!token) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const isValid = await verifySessionToken(token)
    if (!isValid) {
      return NextResponse.json({ error: 'Session expirée' }, { status: 401 })
    }
  }

  // Redirect authenticated users away from login page
  if (pathname === `${ADMIN_PATH}/login`) {
    const token = request.cookies.get(SESSION_COOKIE_NAME)?.value
    if (token) {
      const isValid = await verifySessionToken(token)
      if (isValid) {
        return NextResponse.redirect(new URL(ADMIN_PATH, request.url))
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/gestion-mon-remede-oum/:path*', '/api/gestion-mon-remede-oum/:path*'],
}
