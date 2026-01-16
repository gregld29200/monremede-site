'use client'

import { useState, useSyncExternalStore } from 'react'
import { useRouter } from 'next/navigation'

const ADMIN_PATH = '/gestion-mon-remede-oum'
const API_ADMIN_PATH = '/api/gestion-mon-remede-oum'

// Hook to detect client-side mounting without useEffect
function useIsMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )
}

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const mounted = useIsMounted()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch(`${API_ADMIN_PATH}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Erreur de connexion')
        return
      }

      router.push(ADMIN_PATH)
      router.refresh()
    } catch {
      setError('Erreur de connexion')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-forest-deep via-[#1a2e23] to-[#152119]" />

      {/* Botanical pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 10c0 12-8 22-20 28 12 6 20 16 20 28 0-12 8-22 20-28-12-6-20-16-20-28z' fill='%23ffffff' fill-opacity='1'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gold/5 blur-3xl" />

      {/* Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/20" />

      {/* Content */}
      <div
        className={`relative flex items-center justify-center min-h-screen px-4 py-12 transition-all duration-1000 ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <div className="w-full max-w-md">
          {/* Logo section */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/20 mb-6">
              <svg className="w-8 h-8 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
            <h1 className="font-display text-3xl text-cream tracking-wide mb-2">
              Mon Remède
            </h1>
            <p className="font-accent text-sm text-sage-light/60 uppercase tracking-[0.2em]">
              Espace Administration
            </p>
          </div>

          {/* Login card */}
          <div className="relative">
            {/* Card glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-gold/20 via-cream/10 to-gold/20 rounded-3xl blur-xl opacity-50" />

            <div className="relative bg-gradient-to-br from-cream to-cream-warm rounded-2xl shadow-2xl shadow-black/20 overflow-hidden">
              {/* Card accent line */}
              <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

              <div className="p-8 pt-10">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="password"
                      className="block font-accent text-xs text-ink-soft/70 uppercase tracking-[0.15em] mb-3"
                    >
                      Mot de passe
                    </label>
                    <div className="relative group">
                      <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-5 py-4 bg-white/80 border border-forest/10 rounded-xl text-forest placeholder:text-ink-soft/40 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/30 focus:bg-white transition-all font-body"
                        placeholder="••••••••••••"
                        required
                        disabled={isLoading}
                      />
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-gold/5 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
                    </div>
                  </div>

                  {error && (
                    <div className="flex items-center gap-3 bg-blush/20 border border-blush-deep/20 text-forest px-4 py-3 rounded-xl">
                      <div className="w-8 h-8 rounded-lg bg-blush-deep/10 flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-blush-deep" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                      <p className="font-body text-sm">{error}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="group relative w-full py-4 rounded-xl font-display text-sm tracking-wide overflow-hidden transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {/* Button background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-forest-deep via-forest to-forest-deep bg-[length:200%_100%] group-hover:bg-[position:100%_0] transition-all duration-500" />

                    {/* Button glow on hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-gold/10 to-transparent" />

                    {/* Button content */}
                    <span className="relative flex items-center justify-center gap-2 text-cream">
                      {isLoading ? (
                        <>
                          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Connexion...
                        </>
                      ) : (
                        <>
                          Se connecter
                          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </>
                      )}
                    </span>
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Footer text */}
          <p className="text-center mt-8 font-accent text-xs text-cream/30 uppercase tracking-[0.2em]">
            Accès réservé
          </p>
        </div>
      </div>
    </div>
  )
}
