'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

const ADMIN_PATH = '/gestion-mon-remede-oum'
const API_ADMIN_PATH = '/api/gestion-mon-remede-oum'

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

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
    <div className="min-h-screen bg-forest-deep flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-cream rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl text-forest mb-2">
              Administration
            </h1>
            <p className="font-accent text-ink-soft">
              Mon Remede - Espace Admin
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-forest mb-2"
              >
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-forest/20 rounded-lg bg-white text-forest focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
                placeholder="Entrez votre mot de passe"
                required
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="bg-blush/30 border border-blush-deep/50 text-forest px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </Button>
          </form>
        </div>

        <p className="text-center mt-6 text-cream/60 text-sm">
          Acces reserve a l&apos;administrateur
        </p>
      </div>
    </div>
  )
}
