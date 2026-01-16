'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { StatusBadge } from '@/components/admin/status-badge'
import { Button } from '@/components/ui/button'
import type { Prospect, ProspectStatus } from '@/types/admin'

const statusOptions: { value: ProspectStatus; label: string }[] = [
  { value: 'nouveau', label: 'Nouveau' },
  { value: 'contacte', label: 'Contacte' },
  { value: 'discussion', label: 'En discussion' },
  { value: 'converti', label: 'Converti' },
  { value: 'non_interesse', label: 'Non interesse' },
]

const consultationTypes = [
  { value: 'sante-generale', label: 'Sante Generale - 50€' },
  { value: 'troubles-digestifs', label: 'Troubles Digestifs - 60€' },
  { value: 'equilibre-hormonal', label: 'Equilibre Hormonal - 70€' },
  { value: 'suivi-complet', label: 'Suivi Complet - 110€' },
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
      etatGeneral: 'Etat General',
      energieVitalite: 'Energie & Vitalite',
      digestionTransit: 'Digestion & Transit',
      alimentationComportement: 'Alimentation',
      emotionsMental: 'Emotions & Mental',
      sommeil: 'Sommeil',
      peauCheveux: 'Peau & Cheveux',
      douleursInconforts: 'Douleurs',
      modeVie: 'Mode de Vie',
    }
    return labels[key] || key
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-ink-soft">Chargement...</div>
      </div>
    )
  }

  if (!prospect) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link
            href="/gestion-mon-remede-oum/prospects"
            className="text-sm text-ink-soft hover:text-forest mb-2 inline-flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
            Retour aux prospects
          </Link>
          <h1 className="font-display text-2xl text-forest">
            {prospect.firstName} {prospect.lastName}
          </h1>
          <p className="font-accent text-ink-soft mt-1">
            Soumission du {formatDate(prospect.submittedAt)}
          </p>
        </div>
        {prospect.status !== 'converti' && (
          <Button onClick={() => setShowConvertModal(true)}>
            Convertir en cliente
          </Button>
        )}
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
                <p className="text-forest">{prospect.email}</p>
              </div>
              <div>
                <p className="text-sm text-ink-soft">Age</p>
                <p className="text-forest">{prospect.age} ans</p>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="bg-white rounded-lg border border-forest/10 p-6">
            <h2 className="font-display text-lg text-forest mb-4">Resultats du questionnaire</h2>
            <div className="flex items-center gap-4 mb-6">
              <div className="text-center">
                <p className="text-3xl font-display text-forest">{prospect.totalScore || 0}</p>
                <p className="text-sm text-ink-soft">/ 50</p>
              </div>
              <StatusBadge status={prospect.profile || ''} type="profile" />
            </div>

            {prospect.categoryScores && (
              <div className="space-y-3">
                <p className="text-sm font-medium text-ink-soft uppercase tracking-wider">Scores par categorie</p>
                {Object.entries(prospect.categoryScores).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-3">
                    <span className="text-sm text-ink-soft w-32">{getCategoryLabel(key)}</span>
                    <div className="flex-1 h-2 bg-cream rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gold rounded-full transition-all"
                        style={{ width: `${((value || 0) / 6) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-forest w-8 text-right">{value || 0}/6</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Answers */}
          {prospect.answers && prospect.answers.length > 0 && (
            <div className="bg-white rounded-lg border border-forest/10 p-6">
              <h2 className="font-display text-lg text-forest mb-4">Reponses detaillees</h2>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {prospect.answers.map((answer, index) => (
                  <div key={index} className="border-b border-forest/5 pb-4 last:border-0">
                    <p className="text-sm text-ink-soft mb-1">{answer.questionText}</p>
                    <p className="text-forest">{answer.answerText}</p>
                    {answer.additionalInfo && (
                      <p className="text-sm text-sage mt-1 italic">{answer.additionalInfo}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <div className="bg-white rounded-lg border border-forest/10 p-6">
            <h2 className="font-display text-lg text-forest mb-4">Statut</h2>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ProspectStatus)}
              className="w-full px-4 py-2.5 border border-forest/20 rounded-lg bg-white text-forest focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-lg border border-forest/10 p-6">
            <h2 className="font-display text-lg text-forest mb-4">Notes internes</h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-forest/20 rounded-lg bg-white text-forest focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent resize-none"
              placeholder="Ajouter des notes..."
            />
          </div>

          {/* Save button */}
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full"
            variant="outline"
          >
            {isSaving ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </Button>
        </div>
      </div>

      {/* Convert Modal */}
      {showConvertModal && (
        <div className="fixed inset-0 bg-forest/50 flex items-center justify-center z-50">
          <div className="bg-cream rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
            <h2 className="font-display text-xl text-forest mb-4">Convertir en cliente</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-forest mb-2">
                  Type de consultation
                </label>
                <select
                  value={convertData.consultationType}
                  onChange={(e) => setConvertData({ ...convertData, consultationType: e.target.value })}
                  className="w-full px-4 py-2.5 border border-forest/20 rounded-lg bg-white text-forest focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                >
                  <option value="">Selectionner...</option>
                  {consultationTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-forest mb-2">
                  Notes initiales (optionnel)
                </label>
                <textarea
                  value={convertData.internalNotes}
                  onChange={(e) => setConvertData({ ...convertData, internalNotes: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-forest/20 rounded-lg bg-white text-forest focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent resize-none"
                  placeholder="Notes pour le dossier cliente..."
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button
                variant="ghost"
                onClick={() => setShowConvertModal(false)}
                className="flex-1"
              >
                Annuler
              </Button>
              <Button
                onClick={handleConvert}
                disabled={isConverting}
                className="flex-1"
              >
                {isConverting ? 'Conversion...' : 'Convertir'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
