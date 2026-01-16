'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import type { Client, ClientStatus, ConsultationType, ClientSource } from '@/types/admin'

interface ClientFormProps {
  client?: Partial<Client>
  onSubmit: (data: ClientFormData) => Promise<void>
  onCancel?: () => void
  isLoading?: boolean
}

export interface ClientFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  birthDate: string
  address: {
    street: string
    city: string
    postalCode: string
    country: string
  }
  status: ClientStatus
  source: ClientSource
  consultationType: ConsultationType | ''
  internalNotes: string
  healthProfile: {
    concerns: string[]
    allergies: string
    medications: string
  }
}

const statusOptions = [
  { value: 'actif', label: 'Actif' },
  { value: 'pause', label: 'En pause' },
  { value: 'archive', label: 'Archive' },
]

const sourceOptions = [
  { value: 'questionnaire', label: 'Questionnaire' },
  { value: 'import', label: 'Import CSV' },
  { value: 'manuel', label: 'Saisie manuelle' },
  { value: 'recommandation', label: 'Recommandation' },
]

const consultationOptions = [
  { value: '', label: 'Non defini' },
  { value: 'sante-generale', label: 'Sante Generale' },
  { value: 'troubles-digestifs', label: 'Troubles Digestifs' },
  { value: 'equilibre-hormonal', label: 'Equilibre Hormonal' },
  { value: 'suivi-complet', label: 'Suivi Complet' },
]

const concernOptions = [
  { value: 'digestion', label: 'Digestion' },
  { value: 'fatigue', label: 'Fatigue' },
  { value: 'sommeil', label: 'Sommeil' },
  { value: 'stress', label: 'Stress' },
  { value: 'poids', label: 'Poids' },
  { value: 'peau', label: 'Peau' },
  { value: 'hormones', label: 'Hormones' },
  { value: 'douleurs', label: 'Douleurs' },
  { value: 'immunite', label: 'Immunite' },
  { value: 'autre', label: 'Autre' },
]

export function ClientForm({ client, onSubmit, onCancel, isLoading }: ClientFormProps) {
  const [formData, setFormData] = useState<ClientFormData>({
    firstName: client?.firstName || '',
    lastName: client?.lastName || '',
    email: client?.email || '',
    phone: client?.phone || '',
    birthDate: client?.birthDate || '',
    address: {
      street: client?.address?.street || '',
      city: client?.address?.city || '',
      postalCode: client?.address?.postalCode || '',
      country: client?.address?.country || 'France',
    },
    status: client?.status || 'actif',
    source: client?.source || 'manuel',
    consultationType: client?.consultationType || '',
    internalNotes: client?.internalNotes || '',
    healthProfile: {
      concerns: client?.healthProfile?.concerns || [],
      allergies: client?.healthProfile?.allergies || '',
      medications: client?.healthProfile?.medications || '',
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
  }

  const toggleConcern = (concern: string) => {
    const concerns = formData.healthProfile.concerns
    const newConcerns = concerns.includes(concern)
      ? concerns.filter((c) => c !== concern)
      : [...concerns, concern]
    setFormData({
      ...formData,
      healthProfile: { ...formData.healthProfile, concerns: newConcerns },
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal info */}
      <div className="bg-white rounded-lg border border-forest/10 p-6">
        <h3 className="font-display text-lg text-forest mb-4">Informations personnelles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-forest mb-2">
              Prenom *
            </label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className="w-full px-4 py-2.5 border border-forest/20 rounded-lg bg-white text-forest focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-forest mb-2">
              Nom *
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className="w-full px-4 py-2.5 border border-forest/20 rounded-lg bg-white text-forest focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-forest mb-2">
              Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2.5 border border-forest/20 rounded-lg bg-white text-forest focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-forest mb-2">
              Telephone
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2.5 border border-forest/20 rounded-lg bg-white text-forest focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-forest mb-2">
              Date de naissance
            </label>
            <input
              type="date"
              value={formData.birthDate}
              onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
              className="w-full px-4 py-2.5 border border-forest/20 rounded-lg bg-white text-forest focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="bg-white rounded-lg border border-forest/10 p-6">
        <h3 className="font-display text-lg text-forest mb-4">Adresse</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-forest mb-2">
              Rue
            </label>
            <input
              type="text"
              value={formData.address.street}
              onChange={(e) => setFormData({
                ...formData,
                address: { ...formData.address, street: e.target.value },
              })}
              className="w-full px-4 py-2.5 border border-forest/20 rounded-lg bg-white text-forest focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-forest mb-2">
              Ville
            </label>
            <input
              type="text"
              value={formData.address.city}
              onChange={(e) => setFormData({
                ...formData,
                address: { ...formData.address, city: e.target.value },
              })}
              className="w-full px-4 py-2.5 border border-forest/20 rounded-lg bg-white text-forest focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-forest mb-2">
              Code postal
            </label>
            <input
              type="text"
              value={formData.address.postalCode}
              onChange={(e) => setFormData({
                ...formData,
                address: { ...formData.address, postalCode: e.target.value },
              })}
              className="w-full px-4 py-2.5 border border-forest/20 rounded-lg bg-white text-forest focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Status and consultation */}
      <div className="bg-white rounded-lg border border-forest/10 p-6">
        <h3 className="font-display text-lg text-forest mb-4">Statut et consultation</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-forest mb-2">
              Statut
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as ClientStatus })}
              className="w-full px-4 py-2.5 border border-forest/20 rounded-lg bg-white text-forest focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-forest mb-2">
              Source
            </label>
            <select
              value={formData.source}
              onChange={(e) => setFormData({ ...formData, source: e.target.value as ClientSource })}
              className="w-full px-4 py-2.5 border border-forest/20 rounded-lg bg-white text-forest focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
            >
              {sourceOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-forest mb-2">
              Type de consultation
            </label>
            <select
              value={formData.consultationType}
              onChange={(e) => setFormData({ ...formData, consultationType: e.target.value as ConsultationType | '' })}
              className="w-full px-4 py-2.5 border border-forest/20 rounded-lg bg-white text-forest focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
            >
              {consultationOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Health profile */}
      <div className="bg-white rounded-lg border border-forest/10 p-6">
        <h3 className="font-display text-lg text-forest mb-4">Profil sante</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-forest mb-2">
              Preoccupations
            </label>
            <div className="flex flex-wrap gap-2">
              {concernOptions.map((concern) => (
                <button
                  key={concern.value}
                  type="button"
                  onClick={() => toggleConcern(concern.value)}
                  className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                    formData.healthProfile.concerns.includes(concern.value)
                      ? 'bg-gold text-forest-deep'
                      : 'bg-cream-warm text-forest hover:bg-gold/20'
                  }`}
                >
                  {concern.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-forest mb-2">
              Allergies connues
            </label>
            <textarea
              value={formData.healthProfile.allergies}
              onChange={(e) => setFormData({
                ...formData,
                healthProfile: { ...formData.healthProfile, allergies: e.target.value },
              })}
              rows={2}
              className="w-full px-4 py-2.5 border border-forest/20 rounded-lg bg-white text-forest focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-forest mb-2">
              Medicaments en cours
            </label>
            <textarea
              value={formData.healthProfile.medications}
              onChange={(e) => setFormData({
                ...formData,
                healthProfile: { ...formData.healthProfile, medications: e.target.value },
              })}
              rows={2}
              className="w-full px-4 py-2.5 border border-forest/20 rounded-lg bg-white text-forest focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent resize-none"
            />
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="bg-white rounded-lg border border-forest/10 p-6">
        <h3 className="font-display text-lg text-forest mb-4">Notes internes</h3>
        <textarea
          value={formData.internalNotes}
          onChange={(e) => setFormData({ ...formData, internalNotes: e.target.value })}
          rows={4}
          className="w-full px-4 py-2.5 border border-forest/20 rounded-lg bg-white text-forest focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent resize-none"
          placeholder="Notes privees sur cette cliente..."
        />
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel} className="flex-1">
            Annuler
          </Button>
        )}
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? 'Enregistrement...' : client?._id ? 'Mettre a jour' : 'Creer la cliente'}
        </Button>
      </div>
    </form>
  )
}
