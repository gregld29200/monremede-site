'use client'

import { useEffect, useState, use, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { StatusBadge } from '@/components/admin/status-badge'
import { NoteForm } from '@/components/admin/note-form'
import { NoteTimeline } from '@/components/admin/note-timeline'
import { Button } from '@/components/ui/button'
import type { Client, ClientNote, NoteType, ClientStatus, ConsultationType } from '@/types/admin'

const statusOptions = [
  { value: 'actif', label: 'Actif' },
  { value: 'pause', label: 'En pause' },
  { value: 'archive', label: 'Archive' },
]

const consultationOptions = [
  { value: '', label: 'Non defini' },
  { value: 'sante-generale', label: 'Sante Generale' },
  { value: 'troubles-digestifs', label: 'Troubles Digestifs' },
  { value: 'equilibre-hormonal', label: 'Equilibre Hormonal' },
  { value: 'suivi-complet', label: 'Suivi Complet' },
]

interface LinkedSubmission {
  _id: string
  totalScore?: number
  profile?: string
  submittedAt?: string
}

interface ClientWithSubmission extends Omit<Client, 'linkedSubmission'> {
  linkedSubmission?: LinkedSubmission
}

export default function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [clientData, setClientData] = useState<ClientWithSubmission | null>(null)
  const [notes, setNotes] = useState<ClientNote[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isAddingNote, setIsAddingNote] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState({
    status: '' as ClientStatus | '',
    consultationType: '' as ConsultationType | '',
    internalNotes: '',
  })

  const fetchClient = useCallback(async () => {
    try {
      const response = await fetch(`/api/gestion-mon-remede-oum/clients/${id}`)
      if (!response.ok) throw new Error('Not found')
      const data = await response.json()
      setClientData(data)
      setFormData({
        status: data.status || 'actif',
        consultationType: data.consultationType || '',
        internalNotes: data.internalNotes || '',
      })
    } catch {
      router.push('/gestion-mon-remede-oum/clients')
    }
  }, [id, router])

  const fetchNotes = useCallback(async () => {
    try {
      const response = await fetch(`/api/gestion-mon-remede-oum/clients/${id}/notes`)
      if (response.ok) {
        const data = await response.json()
        setNotes(data)
      }
    } catch (error) {
      console.error('Error fetching notes:', error)
    }
  }, [id])

  useEffect(() => {
    const loadData = async () => {
      await fetchClient()
      await fetchNotes()
      setIsLoading(false)
    }
    loadData()
  }, [fetchClient, fetchNotes])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await fetch(`/api/gestion-mon-remede-oum/clients/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      setEditMode(false)
      await fetchClient()
    } catch (error) {
      console.error('Save error:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddNote = async (content: string, type: NoteType) => {
    setIsAddingNote(true)
    try {
      const response = await fetch(`/api/gestion-mon-remede-oum/clients/${id}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, type }),
      })
      if (response.ok) {
        await fetchNotes()
        await fetchClient()
      }
    } catch (error) {
      console.error('Add note error:', error)
    } finally {
      setIsAddingNote(false)
    }
  }

  const handleArchive = async () => {
    if (!confirm('Etes-vous sur de vouloir archiver cette cliente ?')) return

    try {
      await fetch(`/api/gestion-mon-remede-oum/clients/${id}`, { method: 'DELETE' })
      router.push('/gestion-mon-remede-oum/clients')
    } catch (error) {
      console.error('Archive error:', error)
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-ink-soft">Chargement...</div>
      </div>
    )
  }

  if (!clientData) {
    return null
  }

  const concernLabels: Record<string, string> = {
    digestion: 'Digestion',
    fatigue: 'Fatigue',
    sommeil: 'Sommeil',
    stress: 'Stress',
    poids: 'Poids',
    peau: 'Peau',
    hormones: 'Hormones',
    douleurs: 'Douleurs',
    immunite: 'Immunite',
    autre: 'Autre',
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
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
          <h1 className="font-display text-2xl text-forest">
            {clientData.firstName} {clientData.lastName}
          </h1>
          <div className="flex items-center gap-3 mt-2">
            <StatusBadge status={clientData.status} type="client" />
            {clientData.source && (
              <span className="text-sm text-ink-soft">
                Source: {clientData.source}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          {clientData.status !== 'archive' && (
            <Button variant="ghost" size="sm" onClick={handleArchive}>
              Archiver
            </Button>
          )}
          <Button
            variant={editMode ? 'primary' : 'outline'}
            size="sm"
            onClick={() => editMode ? handleSave() : setEditMode(true)}
            disabled={isSaving}
          >
            {editMode ? (isSaving ? 'Enregistrement...' : 'Enregistrer') : 'Modifier'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact info */}
          <div className="bg-white rounded-lg border border-forest/10 p-6">
            <h2 className="font-display text-lg text-forest mb-4">Informations de contact</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-ink-soft">Email</p>
                <p className="text-forest">{clientData.email}</p>
              </div>
              <div>
                <p className="text-sm text-ink-soft">Telephone</p>
                <p className="text-forest">{clientData.phone || '-'}</p>
              </div>
              {clientData.birthDate && (
                <div>
                  <p className="text-sm text-ink-soft">Date de naissance</p>
                  <p className="text-forest">{formatDate(clientData.birthDate)}</p>
                </div>
              )}
              {clientData.address && (clientData.address.city || clientData.address.street) && (
                <div className="col-span-2">
                  <p className="text-sm text-ink-soft">Adresse</p>
                  <p className="text-forest">
                    {[
                      clientData.address.street,
                      clientData.address.postalCode,
                      clientData.address.city,
                      clientData.address.country,
                    ]
                      .filter(Boolean)
                      .join(', ')}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Health profile */}
          {clientData.healthProfile && (
            <div className="bg-white rounded-lg border border-forest/10 p-6">
              <h2 className="font-display text-lg text-forest mb-4">Profil sante</h2>
              <div className="space-y-4">
                {clientData.healthProfile.concerns && clientData.healthProfile.concerns.length > 0 && (
                  <div>
                    <p className="text-sm text-ink-soft mb-2">Preoccupations</p>
                    <div className="flex flex-wrap gap-2">
                      {clientData.healthProfile.concerns.map((concern) => (
                        <span
                          key={concern}
                          className="px-3 py-1 bg-gold/10 text-forest text-sm rounded-full"
                        >
                          {concernLabels[concern] || concern}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {clientData.healthProfile.allergies && (
                  <div>
                    <p className="text-sm text-ink-soft">Allergies</p>
                    <p className="text-forest">{clientData.healthProfile.allergies}</p>
                  </div>
                )}
                {clientData.healthProfile.medications && (
                  <div>
                    <p className="text-sm text-ink-soft">Medicaments</p>
                    <p className="text-forest">{clientData.healthProfile.medications}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Linked questionnaire */}
          {clientData.linkedSubmission && (
            <div className="bg-white rounded-lg border border-forest/10 p-6">
              <h2 className="font-display text-lg text-forest mb-4">Questionnaire lie</h2>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-display text-forest">
                      {clientData.linkedSubmission.totalScore || 0}
                    </p>
                    <p className="text-sm text-ink-soft">/ 50</p>
                  </div>
                  <StatusBadge
                    status={clientData.linkedSubmission.profile || ''}
                    type="profile"
                  />
                </div>
                <Link
                  href={`/gestion-mon-remede-oum/prospects/${clientData.linkedSubmission._id}`}
                  className="text-gold hover:text-gold-light text-sm font-medium transition-colors"
                >
                  Voir le questionnaire
                </Link>
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="bg-white rounded-lg border border-forest/10 p-6">
            <h2 className="font-display text-lg text-forest mb-4">Notes</h2>
            <NoteForm onSubmit={handleAddNote} isLoading={isAddingNote} />
            <div className="mt-6 border-t border-forest/10 pt-6">
              <NoteTimeline notes={notes} />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status & consultation */}
          <div className="bg-white rounded-lg border border-forest/10 p-6">
            <h2 className="font-display text-lg text-forest mb-4">Statut</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-forest mb-2">
                  Statut
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as ClientStatus })}
                  disabled={!editMode}
                  className="w-full px-4 py-2.5 border border-forest/20 rounded-lg bg-white text-forest focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent disabled:bg-cream/50 disabled:cursor-not-allowed"
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
                  Type de consultation
                </label>
                <select
                  value={formData.consultationType}
                  onChange={(e) => setFormData({ ...formData, consultationType: e.target.value as ConsultationType | '' })}
                  disabled={!editMode}
                  className="w-full px-4 py-2.5 border border-forest/20 rounded-lg bg-white text-forest focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent disabled:bg-cream/50 disabled:cursor-not-allowed"
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

          {/* Internal notes */}
          <div className="bg-white rounded-lg border border-forest/10 p-6">
            <h2 className="font-display text-lg text-forest mb-4">Notes internes</h2>
            <textarea
              value={formData.internalNotes}
              onChange={(e) => setFormData({ ...formData, internalNotes: e.target.value })}
              disabled={!editMode}
              rows={4}
              className="w-full px-4 py-3 border border-forest/20 rounded-lg bg-white text-forest focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent resize-none disabled:bg-cream/50 disabled:cursor-not-allowed"
              placeholder="Notes privees..."
            />
          </div>

          {/* Dates */}
          <div className="bg-white rounded-lg border border-forest/10 p-6">
            <h2 className="font-display text-lg text-forest mb-4">Dates</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-ink-soft">Creation</span>
                <span className="text-forest">{formatDate(clientData.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft">Dernier contact</span>
                <span className="text-forest">{formatDate(clientData.lastContactAt)}</span>
              </div>
            </div>
          </div>

          {editMode && (
            <Button
              variant="ghost"
              onClick={() => {
                setEditMode(false)
                setFormData({
                  status: clientData.status || 'actif',
                  consultationType: clientData.consultationType || '',
                  internalNotes: clientData.internalNotes || '',
                })
              }}
              className="w-full"
            >
              Annuler les modifications
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
