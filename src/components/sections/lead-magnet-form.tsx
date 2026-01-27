'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui'

interface LeadMagnetFormProps {
  variant?: 'light' | 'dark'
  className?: string
}

export function LeadMagnetForm({ variant = 'light', className = '' }: LeadMagnetFormProps) {
  const router = useRouter()
  const [firstName, setFirstName] = useState('')
  const [email, setEmail] = useState('')
  const [acquisitionSource, setAcquisitionSource] = useState('')
  const [hasConsultedNaturopath, setHasConsultedNaturopath] = useState('')
  const [wantsConsultation, setWantsConsultation] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!firstName.trim()) {
      setError('Veuillez entrer votre prénom')
      return
    }

    if (!email) {
      setError('Veuillez entrer votre email')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Veuillez entrer un email valide')
      return
    }

    if (!acquisitionSource) {
      setError('Veuillez indiquer où vous avez vu l\'annonce')
      return
    }

    if (!hasConsultedNaturopath) {
      setError('Veuillez indiquer si vous avez déjà consulté une naturopathe')
      return
    }

    if (!wantsConsultation) {
      setError('Veuillez indiquer si vous souhaitez consulter une naturopathe')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/lead-magnet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: firstName.trim(),
          email,
          source: 'cadeaux-ramadan',
          acquisitionSource,
          hasConsultedNaturopath,
          wantsConsultation,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Une erreur est survenue')
      }

      router.push('/cadeaux-ramadan/merci')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
      setIsLoading(false)
    }
  }

  const isDark = variant === 'dark'

  const inputClass = isDark
    ? 'w-full px-5 py-4 rounded-lg border border-cream/20 bg-cream/5 text-cream placeholder:text-cream/40 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all'
    : 'w-full px-5 py-4 rounded-lg border border-sage/30 bg-cream-warm text-forest placeholder:text-ink-soft/50 focus:outline-none focus:ring-2 focus:ring-gold'

  const selectClass = isDark
    ? 'w-full px-5 py-4 rounded-lg border border-cream/20 bg-cream/5 text-cream focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all appearance-none cursor-pointer'
    : 'w-full px-5 py-4 rounded-lg border border-sage/30 bg-cream-warm text-forest focus:outline-none focus:ring-2 focus:ring-gold appearance-none cursor-pointer'

  const optionClass = isDark ? 'bg-forest-deep' : ''

  return (
    <form onSubmit={handleSubmit} className={`space-y-3 ${className}`}>
      <input
        type="text"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        placeholder="Votre prénom"
        className={inputClass}
        disabled={isLoading}
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Votre adresse email"
        className={inputClass}
        disabled={isLoading}
      />
      <select
        value={acquisitionSource}
        onChange={(e) => setAcquisitionSource(e.target.value)}
        className={selectClass}
        disabled={isLoading}
      >
        <option value="" className={optionClass}>Où avez-vous vu l&apos;annonce ?</option>
        <option value="instagram" className={optionClass}>Instagram</option>
        <option value="facebook" className={optionClass}>Facebook</option>
        <option value="tiktok" className={optionClass}>TikTok</option>
        <option value="telegram" className={optionClass}>Telegram</option>
        <option value="youtube" className={optionClass}>YouTube</option>
        <option value="bouche-a-oreille" className={optionClass}>Bouche à oreille</option>
        <option value="google" className={optionClass}>Recherche Google</option>
        <option value="autre" className={optionClass}>Autre</option>
      </select>
      <select
        value={hasConsultedNaturopath}
        onChange={(e) => setHasConsultedNaturopath(e.target.value)}
        className={selectClass}
        disabled={isLoading}
      >
        <option value="" className={optionClass}>Avez-vous déjà consulté une naturopathe ?</option>
        <option value="oui" className={optionClass}>Oui</option>
        <option value="non" className={optionClass}>Non</option>
      </select>
      <select
        value={wantsConsultation}
        onChange={(e) => setWantsConsultation(e.target.value)}
        className={selectClass}
        disabled={isLoading}
      >
        <option value="" className={optionClass}>Souhaitez-vous consulter une naturopathe ?</option>
        <option value="oui" className={optionClass}>Oui</option>
        <option value="non" className={optionClass}>Non</option>
        <option value="peut-etre" className={optionClass}>Peut-être</option>
      </select>
      <Button
        type="submit"
        variant="primary"
        size="lg"
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2"
      >
        {isLoading ? 'Envoi...' : 'Recevoir mes guides gratuits'}
        {!isLoading && <span>→</span>}
      </Button>
      {error && (
        <p className="text-blush-deep text-sm">{error}</p>
      )}
    </form>
  )
}
