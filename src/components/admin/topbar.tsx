'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

const ADMIN_PATH = '/gestion-mon-remede-oum'
const API_ADMIN_PATH = '/api/gestion-mon-remede-oum'

export function Topbar() {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await fetch(`${API_ADMIN_PATH}/auth/logout`, { method: 'POST' })
      router.push(`${ADMIN_PATH}/login`)
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <header className="bg-white border-b border-forest/10 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-accent text-sm text-ink-soft">
            Bienvenue, Oum Soumayya
          </p>
        </div>

        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex items-center gap-2 px-4 py-2 text-sm text-forest/70 hover:text-forest hover:bg-forest/5 rounded-lg transition-colors disabled:opacity-50"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>{isLoggingOut ? 'Deconnexion...' : 'Deconnexion'}</span>
        </button>
      </div>
    </header>
  )
}
