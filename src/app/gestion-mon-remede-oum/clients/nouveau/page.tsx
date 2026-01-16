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
        throw new Error(errorData.error || 'Erreur lors de la creation')
      }

      const newClient = await response.json()
      router.push(`/gestion-mon-remede-oum/clients/${newClient._id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la creation')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/gestion-mon-remede-oum/clients"
          className="text-sm text-ink-soft hover:text-forest mb-2 inline-flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
          Retour aux clientes
        </Link>
        <h1 className="font-display text-2xl text-forest">Nouvelle cliente</h1>
        <p className="font-accent text-ink-soft mt-1">
          Creer une nouvelle fiche cliente
        </p>
      </div>

      {error && (
        <div className="bg-blush/30 border border-blush-deep/50 text-forest px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <ClientForm
        onSubmit={handleSubmit}
        onCancel={() => router.push('/gestion-mon-remede-oum/clients')}
        isLoading={isLoading}
      />
    </div>
  )
}
