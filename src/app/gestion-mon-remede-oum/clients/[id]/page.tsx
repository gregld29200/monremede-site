'use client'

import { useEffect, useState, use, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { StatusBadge } from '@/components/admin/status-badge'
import { NoteForm } from '@/components/admin/note-form'
import { NoteTimeline } from '@/components/admin/note-timeline'
import type { Client, ClientNote, NoteType, ClientStatus, ConsultationType } from '@/types/admin'

const statusOptions = [
  { value: 'actif', label: 'Actif', color: 'sage' },
  { value: 'pause', label: 'En pause', color: 'gold' },
  { value: 'archive', label: 'Archivé', color: 'gray' },
]

const consultationOptions = [
  { value: '', label: 'Non défini', price: '' },
  { value: 'sante-generale', label: 'Santé Générale', price: '50€' },
  { value: 'troubles-digestifs', label: 'Troubles Digestifs', price: '60€' },
  { value: 'equilibre-hormonal', label: 'Équilibre Hormonal', price: '70€' },
  { value: 'suivi-complet', label: 'Suivi Complet', price: '110€' },
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
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false)
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
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full border-2 border-sage/20" />
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-sage animate-spin" />
          </div>
          <p className="font-accent text-sm text-ink-soft/60 tracking-wider">Chargement...</p>
        </div>
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
    immunite: 'Immunité',
    autre: 'Autre',
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <Link
            href="/gestion-mon-remede-oum/clients"
            className="group inline-flex items-center gap-2 text-ink-soft/70 hover:text-forest transition-colors mb-4"
          >
            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-accent text-sm uppercase tracking-wider">Retour aux clientes</span>
          </Link>

          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${
              clientData.status === 'actif'
                ? 'bg-gradient-to-br from-sage/20 to-sage/5 border-sage/20'
                : clientData.status === 'pause'
                ? 'bg-gradient-to-br from-gold/20 to-gold/5 border-gold/20'
                : 'bg-gradient-to-br from-forest/10 to-forest/5 border-forest/10'
            }`}>
              <span className={`font-display text-lg ${
                clientData.status === 'actif' ? 'text-sage' : clientData.status === 'pause' ? 'text-gold' : 'text-ink-soft/60'
              }`}>
                {clientData.firstName?.[0]}{clientData.lastName?.[0]}
              </span>
            </div>
            <div>
              <h1 className="font-display text-2xl text-forest">
                {clientData.firstName} {clientData.lastName}
              </h1>
              <div className="flex items-center gap-3 mt-1.5">
                <StatusBadge status={clientData.status} type="client" />
                {clientData.source && (
                  <span className="font-accent text-xs text-ink-soft/50 uppercase tracking-wider">
                    {clientData.source === 'questionnaire' ? 'Via questionnaire' :
                     clientData.source === 'import' ? 'Importée' :
                     clientData.source === 'recommandation' ? 'Recommandation' : 'Manuel'}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {clientData.status !== 'archive' && (
            <button
              onClick={() => setShowArchiveConfirm(true)}
              className="px-4 py-2.5 rounded-xl font-accent text-xs uppercase tracking-wider bg-forest/5 text-forest/70 hover:bg-blush/10 hover:text-blush-deep transition-all"
            >
              Archiver
            </button>
          )}
          <button
            onClick={() => editMode ? handleSave() : setEditMode(true)}
            disabled={isSaving}
            className={`px-5 py-2.5 rounded-xl font-accent text-xs uppercase tracking-wider transition-all disabled:opacity-50 ${
              editMode
                ? 'bg-sage text-cream hover:bg-sage/90'
                : 'bg-forest/10 text-forest hover:bg-forest/20'
            }`}
          >
            {editMode ? (isSaving ? 'Enregistrement...' : 'Enregistrer') : 'Modifier'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6 stagger-fade">
          {/* Contact info card */}
          <div className="admin-card p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sage/20 to-sage/5 border border-sage/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="font-display text-lg text-forest">Informations de contact</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="font-accent text-xs text-ink-soft/60 uppercase tracking-[0.1em]">Email</p>
                <p className="font-body text-forest">{clientData.email}</p>
              </div>
              <div className="space-y-1">
                <p className="font-accent text-xs text-ink-soft/60 uppercase tracking-[0.1em]">Téléphone</p>
                <p className="font-body text-forest">{clientData.phone || '-'}</p>
              </div>
              {clientData.birthDate && (
                <div className="space-y-1">
                  <p className="font-accent text-xs text-ink-soft/60 uppercase tracking-[0.1em]">Date de naissance</p>
                  <p className="font-body text-forest">{formatDate(clientData.birthDate)}</p>
                </div>
              )}
              {clientData.address && (clientData.address.city || clientData.address.street) && (
                <div className="space-y-1 sm:col-span-2">
                  <p className="font-accent text-xs text-ink-soft/60 uppercase tracking-[0.1em]">Adresse</p>
                  <p className="font-body text-forest">
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

          {/* Health profile card */}
          {clientData.healthProfile && (
            <div className="admin-card p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blush/30 to-blush/10 border border-blush-deep/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-blush-deep" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h2 className="font-display text-lg text-forest">Profil santé</h2>
              </div>

              <div className="space-y-5">
                {clientData.healthProfile.concerns && clientData.healthProfile.concerns.length > 0 && (
                  <div>
                    <p className="font-accent text-xs text-ink-soft/60 uppercase tracking-[0.1em] mb-3">Préoccupations</p>
                    <div className="flex flex-wrap gap-2">
                      {clientData.healthProfile.concerns.map((concern) => (
                        <span
                          key={concern}
                          className="px-3 py-1.5 rounded-lg bg-gold/10 border border-gold/20 font-accent text-xs text-gold"
                        >
                          {concernLabels[concern] || concern}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {clientData.healthProfile.allergies && (
                  <div className="space-y-1">
                    <p className="font-accent text-xs text-ink-soft/60 uppercase tracking-[0.1em]">Allergies</p>
                    <p className="font-body text-forest">{clientData.healthProfile.allergies}</p>
                  </div>
                )}
                {clientData.healthProfile.medications && (
                  <div className="space-y-1">
                    <p className="font-accent text-xs text-ink-soft/60 uppercase tracking-[0.1em]">Médicaments</p>
                    <p className="font-body text-forest">{clientData.healthProfile.medications}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Linked questionnaire card */}
          {clientData.linkedSubmission && (
            <div className="admin-card p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className="font-display text-lg text-forest">Questionnaire lié</h2>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-cream to-cream-warm border border-forest/5">
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16">
                    <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="rgba(45, 74, 62, 0.1)"
                        strokeWidth="3"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="var(--gold)"
                        strokeWidth="3"
                        strokeDasharray={`${((clientData.linkedSubmission.totalScore || 0) / 50) * 100}, 100`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="font-display text-lg text-forest">{clientData.linkedSubmission.totalScore || 0}</span>
                      <span className="font-accent text-[9px] text-ink-soft/50">/50</span>
                    </div>
                  </div>
                  <div>
                    <StatusBadge
                      status={clientData.linkedSubmission.profile || ''}
                      type="profile"
                    />
                    <p className="font-body text-xs text-ink-soft/60 mt-1">
                      Soumis le {formatDate(clientData.linkedSubmission.submittedAt)}
                    </p>
                  </div>
                </div>
                <Link
                  href={`/gestion-mon-remede-oum/prospects/${clientData.linkedSubmission._id}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gold/10 text-gold hover:bg-gold/20 font-accent text-xs uppercase tracking-wider transition-all"
                >
                  Voir
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          )}

          {/* Notes card */}
          <div className="admin-card p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-forest/15 to-forest/5 border border-forest/10 flex items-center justify-center">
                <svg className="w-4 h-4 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h2 className="font-display text-lg text-forest">Historique des notes</h2>
            </div>

            <NoteForm onSubmit={handleAddNote} isLoading={isAddingNote} />
            <div className="mt-6 pt-6 border-t border-forest/5">
              <NoteTimeline notes={notes} />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6 stagger-slide">
          {/* Status & consultation card */}
          <div className="admin-card p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-forest/15 to-forest/5 border border-forest/10 flex items-center justify-center">
                <svg className="w-4 h-4 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="font-display text-lg text-forest">Statut & suivi</h2>
            </div>

            <div className="space-y-5">
              <div>
                <p className="font-accent text-xs text-ink-soft/60 uppercase tracking-[0.1em] mb-3">Statut</p>
                <div className="space-y-2">
                  {statusOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => editMode && setFormData({ ...formData, status: option.value as ClientStatus })}
                      disabled={!editMode}
                      className={`w-full px-4 py-3 rounded-xl text-left font-body text-sm transition-all disabled:cursor-default ${
                        formData.status === option.value
                          ? 'bg-forest text-cream shadow-md'
                          : editMode
                          ? 'bg-forest/5 text-forest/70 hover:bg-forest/10'
                          : 'bg-forest/5 text-forest/50'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-accent text-xs text-ink-soft/60 uppercase tracking-[0.1em] mb-3">Type de consultation</p>
                <div className="space-y-2">
                  {consultationOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => editMode && setFormData({ ...formData, consultationType: option.value as ConsultationType | '' })}
                      disabled={!editMode}
                      className={`w-full px-4 py-3 rounded-xl text-left flex items-center justify-between transition-all disabled:cursor-default ${
                        formData.consultationType === option.value
                          ? 'bg-gold/20 border-2 border-gold/30'
                          : editMode
                          ? 'bg-forest/5 border border-transparent hover:border-gold/20'
                          : 'bg-forest/5 border border-transparent'
                      }`}
                    >
                      <span className={`font-body text-sm ${formData.consultationType === option.value ? 'text-forest' : 'text-forest/70'}`}>
                        {option.label}
                      </span>
                      {option.price && (
                        <span className={`font-accent text-xs ${formData.consultationType === option.value ? 'text-gold' : 'text-ink-soft/50'}`}>
                          {option.price}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Internal notes card */}
          <div className="admin-card p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h2 className="font-display text-lg text-forest">Notes privées</h2>
            </div>

            <textarea
              value={formData.internalNotes}
              onChange={(e) => setFormData({ ...formData, internalNotes: e.target.value })}
              disabled={!editMode}
              rows={5}
              className="admin-input resize-none disabled:bg-cream/50 disabled:cursor-default"
              placeholder={editMode ? "Notes privées..." : "Aucune note privée"}
            />
          </div>

          {/* Dates card */}
          <div className="admin-card p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-forest/15 to-forest/5 border border-forest/10 flex items-center justify-center">
                <svg className="w-4 h-4 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="font-display text-lg text-forest">Dates clés</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-forest/5">
                <span className="font-accent text-xs text-ink-soft/60 uppercase tracking-wider">Création</span>
                <span className="font-body text-sm text-forest">{formatDate(clientData.createdAt)}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="font-accent text-xs text-ink-soft/60 uppercase tracking-wider">Dernier contact</span>
                <span className="font-body text-sm text-forest">{formatDate(clientData.lastContactAt)}</span>
              </div>
            </div>
          </div>

          {/* Cancel edit button */}
          {editMode && (
            <button
              onClick={() => {
                setEditMode(false)
                setFormData({
                  status: clientData.status || 'actif',
                  consultationType: clientData.consultationType || '',
                  internalNotes: clientData.internalNotes || '',
                })
              }}
              className="w-full py-3 rounded-xl font-accent text-xs uppercase tracking-wider bg-forest/5 text-forest/70 hover:bg-forest/10 transition-all"
            >
              Annuler les modifications
            </button>
          )}
        </div>
      </div>

      {/* Archive confirmation modal */}
      {showArchiveConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-forest-deep/60 backdrop-blur-sm"
            onClick={() => setShowArchiveConfirm(false)}
          />

          <div className="relative w-full max-w-sm animate-scale-up">
            <div className="absolute -inset-1 bg-gradient-to-r from-blush/20 via-cream/10 to-blush/20 rounded-3xl blur-xl opacity-50" />

            <div className="relative bg-gradient-to-br from-cream to-cream-warm rounded-2xl shadow-2xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-blush/20 border border-blush-deep/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-blush-deep" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-display text-lg text-forest">Archiver cette cliente ?</h3>
                  <p className="font-body text-sm text-ink-soft/70">Cette action peut être annulée</p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowArchiveConfirm(false)}
                  className="flex-1 py-3 rounded-xl font-accent text-xs uppercase tracking-wider bg-forest/5 text-forest hover:bg-forest/10 transition-all"
                >
                  Annuler
                </button>
                <button
                  onClick={handleArchive}
                  className="flex-1 py-3 rounded-xl font-accent text-xs uppercase tracking-wider bg-blush-deep text-cream hover:bg-blush-deep/90 transition-all"
                >
                  Archiver
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
