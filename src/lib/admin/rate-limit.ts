// Simple in-memory rate limiter for login attempts
// In production with multiple instances, consider using Redis

interface RateLimitEntry {
  attempts: number
  lastAttempt: number
  blockedUntil: number | null
}

const store = new Map<string, RateLimitEntry>()

const MAX_ATTEMPTS = 5
const BLOCK_DURATION_MS = 15 * 60 * 1000 // 15 minutes
const WINDOW_MS = 60 * 60 * 1000 // 1 hour window for counting attempts

export function checkRateLimit(ip: string): { allowed: boolean; remainingAttempts: number; blockedForMinutes?: number } {
  const now = Date.now()
  const entry = store.get(ip)

  // No previous attempts
  if (!entry) {
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS }
  }

  // Check if currently blocked
  if (entry.blockedUntil && now < entry.blockedUntil) {
    const remainingMinutes = Math.ceil((entry.blockedUntil - now) / 60000)
    return { allowed: false, remainingAttempts: 0, blockedForMinutes: remainingMinutes }
  }

  // Reset if block expired or window expired
  if (entry.blockedUntil && now >= entry.blockedUntil) {
    store.delete(ip)
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS }
  }

  // Reset if outside window
  if (now - entry.lastAttempt > WINDOW_MS) {
    store.delete(ip)
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS }
  }

  const remainingAttempts = MAX_ATTEMPTS - entry.attempts
  return { allowed: remainingAttempts > 0, remainingAttempts: Math.max(0, remainingAttempts) }
}

export function recordFailedAttempt(ip: string): { blocked: boolean; blockedForMinutes?: number } {
  const now = Date.now()
  const entry = store.get(ip)

  if (!entry) {
    store.set(ip, {
      attempts: 1,
      lastAttempt: now,
      blockedUntil: null,
    })
    return { blocked: false }
  }

  entry.attempts += 1
  entry.lastAttempt = now

  // Block if max attempts reached
  if (entry.attempts >= MAX_ATTEMPTS) {
    entry.blockedUntil = now + BLOCK_DURATION_MS
    store.set(ip, entry)
    return { blocked: true, blockedForMinutes: 15 }
  }

  store.set(ip, entry)
  return { blocked: false }
}

export function recordSuccessfulLogin(ip: string): void {
  store.delete(ip)
}

// Clean up old entries periodically (call this occasionally)
export function cleanupExpiredEntries(): void {
  const now = Date.now()
  for (const [ip, entry] of store.entries()) {
    // Remove if block expired and outside window
    if (entry.blockedUntil && now >= entry.blockedUntil) {
      store.delete(ip)
    } else if (now - entry.lastAttempt > WINDOW_MS) {
      store.delete(ip)
    }
  }
}
