'use client'

import { useEffect, useState } from 'react'

const loadingMessages = [
  'Analyse de vos réponses...',
  'Calcul de votre score santé...',
  'Identification de votre profil...',
  'Préparation de vos recommandations...',
]

export function QuestionnaireLoading() {
  const [messageIndex, setMessageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length)
    }, 1500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center">
        {/* Animated circles */}
        <div className="relative w-32 h-32 mx-auto mb-12">
          {/* Outer ring */}
          <div className="absolute inset-0 border-4 border-sage/20 rounded-full" />

          {/* Animated arc */}
          <div className="absolute inset-0 border-4 border-transparent border-t-gold rounded-full animate-spin" />

          {/* Inner pulse */}
          <div className="absolute inset-4 bg-gold/10 rounded-full animate-pulse" />

          {/* Center icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-forest"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
        </div>

        {/* Loading message */}
        <p className="font-accent text-xl text-forest mb-4 transition-all duration-300">
          {loadingMessages[messageIndex]}
        </p>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-2 h-2 rounded-full bg-sage animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
