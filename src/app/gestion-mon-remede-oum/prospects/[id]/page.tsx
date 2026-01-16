'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { StatusBadge } from '@/components/admin/status-badge'
import type { Prospect, ProspectStatus } from '@/types/admin'

const statusOptions: { value: ProspectStatus; label: string; color: string }[] = [
  { value: 'nouveau', label: 'Nouveau', color: 'gold' },
  { value: 'contacte', label: 'Contacté', color: 'sage' },
  { value: 'discussion', label: 'En discussion', color: 'blush' },
  { value: 'converti', label: 'Converti', color: 'forest' },
  { value: 'non_interesse', label: 'Non intéressé', color: 'gray' },
]

const consultationTypes = [
  { value: 'sante-generale', label: 'Santé Générale', price: '50€' },
  { value: 'troubles-digestifs', label: 'Troubles Digestifs', price: '60€' },
  { value: 'equilibre-hormonal', label: 'Équilibre Hormonal', price: '70€' },
  { value: 'suivi-complet', label: 'Suivi Complet', price: '110€' },
]

export default function ProspectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [prospect, setProspect] = useState<Prospect | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isConverting, setIsConverting] = useState(false)
  const [showConvertModal, setShowConvertModal] = useState(false)
  const [notes, setNotes] = useState('')
  const [status, setStatus] = useState<ProspectStatus>('nouveau')
  const [convertData, setConvertData] = useState({
    consultationType: '',
    internalNotes: '',
  })

  useEffect(() => {
    const fetchProspect = async () => {
      try {
        const response = await fetch(`/api/gestion-mon-remede-oum/prospects/${id}`)
        if (!response.ok) throw new Error('Not found')
        const data = await response.json()
        setProspect(data)
        setNotes(data.notes || '')
        setStatus(data.status || 'nouveau')
      } catch {
        router.push('/gestion-mon-remede-oum/prospects')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProspect()
  }, [id, router])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await fetch(`/api/gestion-mon-remede-oum/prospects/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, notes }),
      })
    } catch (error) {
      console.error('Save error:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleConvert = async () => {
    setIsConverting(true)
    try {
      const response = await fetch(`/api/gestion-mon-remede-oum/prospects/${id}/convert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(convertData),
      })

      if (!response.ok) throw new Error('Convert failed')

      const data = await response.json()
      router.push(`/gestion-mon-remede-oum/clients/${data.clientId}`)
    } catch (error) {
      console.error('Convert error:', error)
    } finally {
      setIsConverting(false)
      setShowConvertModal(false)
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getCategoryLabel = (key: string) => {
    const labels: Record<string, string> = {
      etatGeneral: 'État Général',
      energieVitalite: 'Énergie & Vitalité',
      digestionTransit: 'Digestion & Transit',
      alimentationComportement: 'Alimentation',
      emotionsMental: 'Émotions & Mental',
      sommeil: 'Sommeil',
      peauCheveux: 'Peau & Cheveux',
      douleursInconforts: 'Douleurs',
      modeVie: 'Mode de Vie',
    }
    return labels[key] || key
  }

  const getScoreLevel = (score: number) => {
    if (score >= 40) return { label: 'Élevé', color: 'blush-deep', bg: 'blush' }
    if (score >= 25) return { label: 'Modéré', color: 'gold', bg: 'gold' }
    return { label: 'Faible', color: 'sage', bg: 'sage' }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full border-2 border-gold/20" />
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-gold animate-spin" />
          </div>
          <p className="font-accent text-sm text-ink-soft/60 tracking-wider">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!prospect) {
    return null
  }

  const scoreLevel = getScoreLevel(prospect.totalScore || 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <Link
            href="/gestion-mon-remede-oum/prospects"
            className="group inline-flex items-center gap-2 text-ink-soft/70 hover:text-forest transition-colors mb-4"
          >
            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-accent text-sm uppercase tracking-wider">Retour aux prospects</span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-forest/15 to-forest/5 border border-forest/15 flex items-center justify-center">
              <span className="font-display text-lg text-forest">
                {prospect.firstName?.[0]}{prospect.lastName?.[0]}
              </span>
            </div>
            <div>
              <h1 className="font-display text-2xl text-forest">
                {prospect.firstName} {prospect.lastName}
              </h1>
              <p className="font-body text-sm text-ink-soft/70 mt-0.5">
                Soumis le {formatDate(prospect.submittedAt)}
              </p>
            </div>
          </div>
        </div>

        {prospect.status !== 'converti' && (
          <button
            onClick={() => setShowConvertModal(true)}
            className="group relative px-6 py-3 rounded-xl font-display text-sm tracking-wide overflow-hidden transition-all"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-gold via-gold-light to-gold bg-[length:200%_100%] group-hover:bg-[position:100%_0] transition-all duration-500" />
            <span className="relative flex items-center gap-2 text-forest-deep">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              Convertir en cliente
            </span>
          </button>
        )}
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
                <p className="font-body text-forest">{prospect.email}</p>
              </div>
              <div className="space-y-1">
                <p className="font-accent text-xs text-ink-soft/60 uppercase tracking-[0.1em]">Âge</p>
                <p className="font-body text-forest">{prospect.age} ans</p>
              </div>
            </div>
          </div>

          {/* Results card */}
          <div className="admin-card p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h2 className="font-display text-lg text-forest">Résultats du questionnaire</h2>
            </div>

            {/* Score overview */}
            <div className="flex items-center gap-6 p-5 rounded-xl bg-gradient-to-r from-cream to-cream-warm border border-forest/5 mb-6">
              <div className="relative w-20 h-20">
                <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="rgba(45, 74, 62, 0.1)"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke={`var(--${scoreLevel.color})`}
                    strokeWidth="3"
                    strokeDasharray={`${((prospect.totalScore || 0) / 50) * 100}, 100`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-display text-2xl text-forest">{prospect.totalScore || 0}</span>
                  <span className="font-accent text-[10px] text-ink-soft/50">/50</span>
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <StatusBadge status={prospect.profile || ''} type="profile" />
                </div>
                <p className="font-body text-sm text-ink-soft/70 mt-2">
                  Niveau de déséquilibre : <span className={`font-accent text-${scoreLevel.color}`}>{scoreLevel.label}</span>
                </p>
              </div>
            </div>

            {/* Category scores */}
            {prospect.categoryScores && (
              <div className="space-y-4">
                <p className="font-accent text-xs text-ink-soft/60 uppercase tracking-[0.1em]">Scores par catégorie</p>
                <div className="grid gap-3">
                  {Object.entries(prospect.categoryScores).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-4">
                      <span className="font-body text-sm text-ink-soft/80 w-36 truncate">{getCategoryLabel(key)}</span>
                      <div className="flex-1 h-2 rounded-full bg-forest/10 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            (value || 0) >= 4 ? 'bg-blush-deep' : (value || 0) >= 2 ? 'bg-gold' : 'bg-sage'
                          }`}
                          style={{ width: `${((value || 0) / 6) * 100}%` }}
                        />
                      </div>
                      <span className="font-accent text-xs text-ink-soft/60 w-10 text-right tabular-nums">{value || 0}/6</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Answers card */}
          {prospect.answers && prospect.answers.length > 0 && (
            <div className="admin-card p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blush/30 to-blush/10 border border-blush-deep/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-blush-deep" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="font-display text-lg text-forest">Réponses détaillées</h2>
              </div>

              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {prospect.answers.map((answer, index) => (
                  <div key={index} className="p-4 rounded-xl bg-cream/50 border border-forest/5">
                    <p className="font-accent text-xs text-ink-soft/60 uppercase tracking-wider mb-2">{answer.questionText}</p>
                    <p className="font-body text-forest">{answer.answerText}</p>
                    {answer.additionalInfo && (
                      <p className="font-body text-sm text-sage mt-2 italic border-l-2 border-sage/30 pl-3">
                        {answer.additionalInfo}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6 stagger-slide">
          {/* Status card */}
          <div className="admin-card p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-forest/15 to-forest/5 border border-forest/10 flex items-center justify-center">
                <svg className="w-4 h-4 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="font-display text-lg text-forest">Statut</h2>
            </div>

            <div className="space-y-2">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setStatus(option.value)}
                  className={`w-full px-4 py-3 rounded-xl text-left font-body text-sm transition-all ${
                    status === option.value
                      ? 'bg-forest text-cream shadow-md'
                      : 'bg-forest/5 text-forest/70 hover:bg-forest/10'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Notes card */}
          <div className="admin-card p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h2 className="font-display text-lg text-forest">Notes internes</h2>
            </div>

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={5}
              className="admin-input resize-none"
              placeholder="Ajouter des notes sur ce prospect..."
            />
          </div>

          {/* Save button */}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full py-3.5 rounded-xl font-display text-sm tracking-wide bg-forest/10 text-forest hover:bg-forest hover:text-cream transition-all disabled:opacity-50"
          >
            {isSaving ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Enregistrement...
              </span>
            ) : (
              'Enregistrer les modifications'
            )}
          </button>
        </div>
      </div>

      {/* Convert Modal */}
      {showConvertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-forest-deep/60 backdrop-blur-sm"
            onClick={() => setShowConvertModal(false)}
          />

          {/* Modal */}
          <div className="relative w-full max-w-md animate-scale-up">
            {/* Modal glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-gold/20 via-cream/10 to-gold/20 rounded-3xl blur-xl opacity-50" />

            <div className="relative bg-gradient-to-br from-cream to-cream-warm rounded-2xl shadow-2xl overflow-hidden">
              {/* Modal header accent */}
              <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

              <div className="p-6 pt-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="font-display text-xl text-forest">Convertir en cliente</h2>
                    <p className="font-body text-sm text-ink-soft/70">
                      {prospect.firstName} {prospect.lastName}
                    </p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block font-accent text-xs text-ink-soft/70 uppercase tracking-[0.1em] mb-3">
                      Type de consultation
                    </label>
                    <div className="space-y-2">
                      {consultationTypes.map((type) => (
                        <button
                          key={type.value}
                          onClick={() => setConvertData({ ...convertData, consultationType: type.value })}
                          className={`w-full px-4 py-3 rounded-xl text-left flex items-center justify-between transition-all ${
                            convertData.consultationType === type.value
                              ? 'bg-gold/20 border-2 border-gold/30'
                              : 'bg-white/50 border border-forest/10 hover:border-gold/20'
                          }`}
                        >
                          <span className="font-body text-sm text-forest">{type.label}</span>
                          <span className={`font-accent text-sm ${convertData.consultationType === type.value ? 'text-gold' : 'text-ink-soft/50'}`}>
                            {type.price}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block font-accent text-xs text-ink-soft/70 uppercase tracking-[0.1em] mb-3">
                      Notes initiales (optionnel)
                    </label>
                    <textarea
                      value={convertData.internalNotes}
                      onChange={(e) => setConvertData({ ...convertData, internalNotes: e.target.value })}
                      rows={3}
                      className="admin-input resize-none"
                      placeholder="Notes pour le dossier cliente..."
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <button
                    onClick={() => setShowConvertModal(false)}
                    className="flex-1 py-3 rounded-xl font-display text-sm tracking-wide bg-forest/5 text-forest hover:bg-forest/10 transition-all"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleConvert}
                    disabled={isConverting || !convertData.consultationType}
                    className="flex-1 py-3 rounded-xl font-display text-sm tracking-wide bg-gradient-to-r from-gold to-gold-light text-forest-deep hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    {isConverting ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Conversion...
                      </span>
                    ) : (
                      'Convertir'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
