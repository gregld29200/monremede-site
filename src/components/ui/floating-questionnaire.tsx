'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export function FloatingQuestionnaire() {
  const [isVisible, setIsVisible] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Apparaît après avoir scrollé 100vh (après le hero)
      const heroHeight = window.innerHeight
      setIsVisible(window.scrollY > heroHeight * 0.8)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Check initial position

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!isVisible) return null

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transition-all duration-500 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}
    >
      {isMinimized ? (
        // Version minimisée - juste un bouton rond
        <button
          onClick={() => setIsMinimized(false)}
          className="w-14 h-14 bg-gold text-forest-deep rounded-full shadow-lg hover:bg-gold-light hover:scale-105 transition-all duration-300 flex items-center justify-center"
          aria-label="Ouvrir le questionnaire"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        </button>
      ) : (
        // Carte complète
        <div className="bg-white border border-sage/10 shadow-2xl shadow-forest/10 p-5 max-w-[280px] relative">
          {/* Bouton fermer/minimiser */}
          <button
            onClick={() => setIsMinimized(true)}
            className="absolute top-2 right-2 w-6 h-6 text-sage/50 hover:text-sage transition-colors"
            aria-label="Réduire"
          >
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Coin décoratif */}
          <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-gold -translate-x-1 -translate-y-1" />

          {/* Contenu */}
          <div className="pr-6">
            <span className="text-[10px] tracking-[0.2em] uppercase text-sage mb-2 block">
              Test gratuit
            </span>
            <h3 className="font-display text-lg text-forest mb-2 leading-tight">
              Évaluez votre santé
            </h3>
            <p className="text-ink-soft/70 text-xs mb-4 leading-relaxed">
              3 minutes pour découvrir votre profil personnalisé
            </p>

            <Link
              href="/consultations/demande"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gold text-forest-deep text-sm font-medium hover:bg-gold-light transition-colors w-full justify-center"
            >
              Commencer
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
