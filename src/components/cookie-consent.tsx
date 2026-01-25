'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const COOKIE_CONSENT_KEY = 'cookie-consent'

type ConsentStatus = 'pending' | 'accepted' | 'refused'

export function CookieConsent() {
  const [status, setStatus] = useState<ConsentStatus | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Read consent from localStorage on mount
    const savedConsent = localStorage.getItem(COOKIE_CONSENT_KEY)

    if (savedConsent === 'accepted' || savedConsent === 'refused') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStatus(savedConsent as ConsentStatus)
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStatus('pending')
      // Show banner after a short delay for better UX
      const timer = setTimeout(() => setIsVisible(true), 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted')
    setStatus('accepted')
    setIsVisible(false)
    // Reload to enable analytics
    window.location.reload()
  }

  const handleRefuse = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'refused')
    setStatus('refused')
    setIsVisible(false)
  }

  // Don't render during SSR or if consent already given
  if (status === null || status !== 'pending' || !isVisible) {
    return null
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6">
      <div className="mx-auto max-w-4xl">
        <div className="bg-forest-deep rounded-2xl shadow-2xl p-6 sm:p-8 border border-sage/20">
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
            {/* Text */}
            <div className="flex-1">
              <h3 className="font-display text-lg text-cream mb-2">
                Nous respectons votre vie privée
              </h3>
              <p className="text-cream/70 text-sm leading-relaxed">
                Nous utilisons des cookies pour analyser le trafic de notre site et améliorer votre expérience.
                Aucune donnée personnelle n&apos;est partagée à des fins publicitaires.{' '}
                <Link href="/confidentialite" className="text-gold hover:text-gold-light underline">
                  En savoir plus
                </Link>
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 w-full sm:w-auto">
              <button
                onClick={handleRefuse}
                className="flex-1 sm:flex-none px-5 py-2.5 text-sm font-medium text-cream/70 hover:text-cream border border-cream/20 hover:border-cream/40 rounded-lg transition-colors"
              >
                Refuser
              </button>
              <button
                onClick={handleAccept}
                className="flex-1 sm:flex-none px-5 py-2.5 text-sm font-medium bg-gold text-forest-deep hover:bg-gold-light rounded-lg transition-colors"
              >
                Accepter
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper function to check consent (can be used outside React)
export function getAnalyticsConsent(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(COOKIE_CONSENT_KEY) === 'accepted'
}
