'use client'

import { useState } from 'react'
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
  { value: 'actif', label: 'Actif', color: 'sage', icon: '●' },
  { value: 'pause', label: 'En pause', color: 'gold', icon: '◐' },
  { value: 'archive', label: 'Archivé', color: 'gray', icon: '○' },
]

const sourceOptions = [
  { value: 'questionnaire', label: 'Questionnaire', icon: '📝' },
  { value: 'import', label: 'Import CSV', icon: '📁' },
  { value: 'manuel', label: 'Saisie manuelle', icon: '✏️' },
  { value: 'recommandation', label: 'Recommandation', icon: '💬' },
]

const consultationOptions = [
  { value: '', label: 'Non défini', price: '' },
  { value: 'sante-generale', label: 'Santé Générale', price: '50€' },
  { value: 'troubles-digestifs', label: 'Troubles Digestifs', price: '60€' },
  { value: 'equilibre-hormonal', label: 'Équilibre Hormonal', price: '70€' },
  { value: 'suivi-complet', label: 'Suivi Complet', price: '110€' },
]

const concernOptions = [
  { value: 'digestion', label: 'Digestion', icon: '🍃' },
  { value: 'fatigue', label: 'Fatigue', icon: '⚡' },
  { value: 'sommeil', label: 'Sommeil', icon: '🌙' },
  { value: 'stress', label: 'Stress', icon: '🧘' },
  { value: 'poids', label: 'Poids', icon: '⚖️' },
  { value: 'peau', label: 'Peau', icon: '✨' },
  { value: 'hormones', label: 'Hormones', icon: '🔄' },
  { value: 'douleurs', label: 'Douleurs', icon: '💪' },
  { value: 'immunite', label: 'Immunité', icon: '🛡️' },
  { value: 'autre', label: 'Autre', icon: '📌' },
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
    <form onSubmit={handleSubmit} className="space-y-6 stagger-fade">
      {/* Personal info */}
      <div className="admin-card p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-forest/15 to-forest/5 border border-forest/10 flex items-center justify-center">
            <svg className="w-4 h-4 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h3 className="font-display text-lg text-forest">Informations personnelles</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="font-accent text-xs text-ink-soft/70 uppercase tracking-wider">
              Prénom <span className="text-blush-deep">*</span>
            </label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className="admin-input"
              placeholder="Marie"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="font-accent text-xs text-ink-soft/70 uppercase tracking-wider">
              Nom <span className="text-blush-deep">*</span>
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className="admin-input"
              placeholder="Dupont"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="font-accent text-xs text-ink-soft/70 uppercase tracking-wider">
              Email <span className="text-blush-deep">*</span>
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft/40">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="admin-input pl-11"
                placeholder="marie@example.com"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="font-accent text-xs text-ink-soft/70 uppercase tracking-wider">
              Téléphone
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft/40">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="admin-input pl-11"
                placeholder="06 12 34 56 78"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="font-accent text-xs text-ink-soft/70 uppercase tracking-wider">
              Date de naissance
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft/40">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <input
                type="date"
                value={formData.birthDate}
                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                className="admin-input pl-11"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="admin-card p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sage/15 to-sage/5 border border-sage/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="font-display text-lg text-forest">Adresse</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2 space-y-2">
            <label className="font-accent text-xs text-ink-soft/70 uppercase tracking-wider">
              Rue
            </label>
            <input
              type="text"
              value={formData.address.street}
              onChange={(e) => setFormData({
                ...formData,
                address: { ...formData.address, street: e.target.value },
              })}
              className="admin-input"
              placeholder="123 rue de la Santé"
            />
          </div>
          <div className="space-y-2">
            <label className="font-accent text-xs text-ink-soft/70 uppercase tracking-wider">
              Ville
            </label>
            <input
              type="text"
              value={formData.address.city}
              onChange={(e) => setFormData({
                ...formData,
                address: { ...formData.address, city: e.target.value },
              })}
              className="admin-input"
              placeholder="Paris"
            />
          </div>
          <div className="space-y-2">
            <label className="font-accent text-xs text-ink-soft/70 uppercase tracking-wider">
              Code postal
            </label>
            <input
              type="text"
              value={formData.address.postalCode}
              onChange={(e) => setFormData({
                ...formData,
                address: { ...formData.address, postalCode: e.target.value },
              })}
              className="admin-input"
              placeholder="75001"
            />
          </div>
        </div>
      </div>

      {/* Status and Source */}
      <div className="admin-card p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold/15 to-gold/5 border border-gold/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h3 className="font-display text-lg text-forest">Statut et source</h3>
        </div>

        {/* Status Selection */}
        <div className="space-y-3 mb-6">
          <label className="font-accent text-xs text-ink-soft/70 uppercase tracking-wider">
            Statut de la cliente
          </label>
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setFormData({ ...formData, status: option.value as ClientStatus })}
                className={`px-4 py-2.5 rounded-xl font-accent text-xs uppercase tracking-wider transition-all ${
                  formData.status === option.value
                    ? option.color === 'sage'
                      ? 'bg-sage text-cream shadow-md'
                      : option.color === 'gold'
                      ? 'bg-gold text-forest-deep shadow-md'
                      : 'bg-forest/60 text-cream shadow-md'
                    : 'bg-forest/5 text-forest/70 hover:bg-forest/10'
                }`}
              >
                <span className="mr-1.5">{option.icon}</span>
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Source Selection */}
        <div className="space-y-3">
          <label className="font-accent text-xs text-ink-soft/70 uppercase tracking-wider">
            Source d&apos;acquisition
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {sourceOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setFormData({ ...formData, source: option.value as ClientSource })}
                className={`px-4 py-3 rounded-xl font-accent text-xs uppercase tracking-wider transition-all text-center ${
                  formData.source === option.value
                    ? 'bg-forest text-cream shadow-md'
                    : 'bg-forest/5 text-forest/70 hover:bg-forest/10'
                }`}
              >
                <span className="block text-base mb-1">{option.icon}</span>
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Consultation Type */}
      <div className="admin-card p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blush/20 to-blush/5 border border-blush/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-blush-deep" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="font-display text-lg text-forest">Type de consultation</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {consultationOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setFormData({ ...formData, consultationType: option.value as ConsultationType | '' })}
              className={`relative p-4 rounded-xl text-left transition-all ${
                formData.consultationType === option.value
                  ? 'bg-blush/20 border-2 border-blush-deep/40 shadow-sm'
                  : 'bg-cream-warm/50 border border-forest/5 hover:border-blush/30 hover:bg-blush/5'
              }`}
            >
              {formData.consultationType === option.value && (
                <div className="absolute top-3 right-3">
                  <div className="w-5 h-5 rounded-full bg-blush-deep flex items-center justify-center">
                    <svg className="w-3 h-3 text-cream" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              )}
              <p className="font-display text-sm text-forest">{option.label}</p>
              {option.price && (
                <p className="font-accent text-xs text-blush-deep mt-1">{option.price}</p>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Health profile */}
      <div className="admin-card p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sage/20 to-sage/5 border border-sage/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h3 className="font-display text-lg text-forest">Profil santé</h3>
        </div>
        <div className="space-y-5">
          {/* Concerns */}
          <div className="space-y-3">
            <label className="font-accent text-xs text-ink-soft/70 uppercase tracking-wider">
              Préoccupations principales
            </label>
            <div className="flex flex-wrap gap-2">
              {concernOptions.map((concern) => (
                <button
                  key={concern.value}
                  type="button"
                  onClick={() => toggleConcern(concern.value)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-accent text-xs uppercase tracking-wider transition-all ${
                    formData.healthProfile.concerns.includes(concern.value)
                      ? 'bg-sage text-cream shadow-md'
                      : 'bg-sage/10 text-sage hover:bg-sage/20'
                  }`}
                >
                  <span>{concern.icon}</span>
                  {concern.label}
                </button>
              ))}
            </div>
          </div>

          {/* Allergies */}
          <div className="space-y-2">
            <label className="font-accent text-xs text-ink-soft/70 uppercase tracking-wider">
              Allergies connues
            </label>
            <textarea
              value={formData.healthProfile.allergies}
              onChange={(e) => setFormData({
                ...formData,
                healthProfile: { ...formData.healthProfile, allergies: e.target.value },
              })}
              rows={2}
              className="admin-input resize-none"
              placeholder="Gluten, lactose, fruits à coque..."
            />
          </div>

          {/* Medications */}
          <div className="space-y-2">
            <label className="font-accent text-xs text-ink-soft/70 uppercase tracking-wider">
              Médicaments en cours
            </label>
            <textarea
              value={formData.healthProfile.medications}
              onChange={(e) => setFormData({
                ...formData,
                healthProfile: { ...formData.healthProfile, medications: e.target.value },
              })}
              rows={2}
              className="admin-input resize-none"
              placeholder="Levothyrox 50mg, Vitamine D..."
            />
          </div>
        </div>
      </div>

      {/* Internal Notes */}
      <div className="admin-card p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-forest/10 to-forest/5 border border-forest/10 flex items-center justify-center">
            <svg className="w-4 h-4 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <h3 className="font-display text-lg text-forest">Notes internes</h3>
          <span className="font-accent text-[10px] text-ink-soft/50 uppercase tracking-wider">Privé</span>
        </div>
        <textarea
          value={formData.internalNotes}
          onChange={(e) => setFormData({ ...formData, internalNotes: e.target.value })}
          rows={4}
          className="admin-input resize-none"
          placeholder="Notes privées sur cette cliente (visible uniquement par vous)..."
        />
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-6 py-3.5 rounded-xl font-accent text-xs uppercase tracking-wider bg-forest/5 text-forest hover:bg-forest/10 transition-all"
          >
            Annuler
          </button>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 group relative px-6 py-3.5 rounded-xl font-accent text-xs uppercase tracking-wider overflow-hidden transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-gold via-gold-light to-gold bg-[length:200%_100%] group-hover:bg-[position:100%_0] transition-all duration-500" />
          <span className="relative flex items-center justify-center gap-2 text-forest-deep">
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-forest-deep/30 border-t-forest-deep rounded-full animate-spin" />
                Enregistrement...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                </svg>
                {client?._id ? 'Mettre à jour' : 'Créer la cliente'}
              </>
            )}
          </span>
        </button>
      </div>
    </form>
  )
}
