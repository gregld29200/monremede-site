'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ClientForm, type ClientFormData } from '@/components/admin/client-form'

export default function NewClientPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (data: ClientFormData) => {
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/gestion-mon-remede-oum/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone || undefined,
          birthDate: data.birthDate || undefined,
          address: (data.address.street || data.address.city || data.address.postalCode)
            ? data.address
            : undefined,
          status: data.status,
          source: data.source,
          consultationType: data.consultationType || undefined,
          internalNotes: data.internalNotes || undefined,
          healthProfile: (data.healthProfile.concerns.length > 0 || data.healthProfile.allergies || data.healthProfile.medications)
            ? data.healthProfile
            : undefined,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la création')
      }

      const newClient = await response.json()
      router.push(`/gestion-mon-remede-oum/clients/${newClient._id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/gestion-mon-remede-oum/clients"
            className="group w-10 h-10 rounded-xl bg-forest/5 hover:bg-forest/10 flex items-center justify-center transition-all"
          >
            <svg className="w-5 h-5 text-forest group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/20 flex items-center justify-center">
            <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <div>
            <p className="font-accent text-xs text-ink-soft/60 uppercase tracking-[0.15em]">
              Gestion clientèle
            </p>
            <h1 className="font-display text-2xl text-forest">Nouvelle cliente</h1>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-cream-warm/50 border border-forest/5">
          <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
          <span className="font-accent text-xs text-ink-soft/60 uppercase tracking-wider">
            Création en cours
          </span>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="admin-card border-blush-deep/30 bg-gradient-to-r from-blush/20 to-blush/5 p-5">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blush-deep/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-blush-deep" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-display text-sm text-forest">Une erreur est survenue</p>
              <p className="font-body text-sm text-blush-deep mt-1">{error}</p>
            </div>
            <button
              onClick={() => setError('')}
              className="text-ink-soft/40 hover:text-forest transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Form */}
      <ClientForm
        onSubmit={handleSubmit}
        onCancel={() => router.push('/gestion-mon-remede-oum/clients')}
        isLoading={isLoading}
      />
    </div>
  )
}
