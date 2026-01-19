import { NextRequest, NextResponse } from 'next/server'
import { checkAdminPassword, createSession, setSessionCookie } from '@/lib/admin/auth'
import { checkRateLimit, recordFailedAttempt, recordSuccessfulLogin } from '@/lib/admin/rate-limit'

function getClientIP(request: NextRequest): string {
  // Try various headers for the real IP (behind proxies/load balancers)
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }

  const realIP = request.headers.get('x-real-ip')
  if (realIP) {
    return realIP
  }

  // Fallback - in production this should be configured properly
  return 'unknown'
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIP(request)

    // Check rate limit
    const rateLimitResult = checkRateLimit(ip)
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          error: `Trop de tentatives. Reessayez dans ${rateLimitResult.blockedForMinutes} minutes.`,
          blocked: true,
          blockedForMinutes: rateLimitResult.blockedForMinutes,
        },
        { status: 429 }
      )
    }

    const { password } = await request.json()

    if (!password) {
      return NextResponse.json(
        { error: 'Mot de passe requis' },
        { status: 400 }
      )
    }

    // DEBUG: Log hash info (REMOVE IN PRODUCTION)
    const hashFromEnv = process.env.ADMIN_PASSWORD_HASH
    console.log('[DEBUG] Hash from env (first 10 chars):', hashFromEnv?.substring(0, 10))
    console.log('[DEBUG] Hash length:', hashFromEnv?.length)
    console.log('[DEBUG] Hash starts with quote:', hashFromEnv?.startsWith('"'))

    const isValid = await checkAdminPassword(password)
    console.log('[DEBUG] Password validation result:', isValid)

    if (!isValid) {
      // Record failed attempt
      const blockResult = recordFailedAttempt(ip)

      if (blockResult.blocked) {
        return NextResponse.json(
          {
            error: `Trop de tentatives. Compte bloque pour ${blockResult.blockedForMinutes} minutes.`,
            blocked: true,
            blockedForMinutes: blockResult.blockedForMinutes,
          },
          { status: 429 }
        )
      }

      const remaining = checkRateLimit(ip).remainingAttempts
      return NextResponse.json(
        {
          error: `Mot de passe incorrect. ${remaining} tentative${remaining > 1 ? 's' : ''} restante${remaining > 1 ? 's' : ''}.`,
        },
        { status: 401 }
      )
    }

    // Success - clear rate limit for this IP
    recordSuccessfulLogin(ip)

    const token = await createSession()
    await setSessionCookie(token)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Erreur de connexion' },
      { status: 500 }
    )
  }
}
