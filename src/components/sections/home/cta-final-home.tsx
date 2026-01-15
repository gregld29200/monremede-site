'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

export function CTAFinalHome() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="relative py-32 lg:py-44 overflow-hidden bg-cream-warm">
      {/* Subtle texture */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Large decorative botanical frame */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Left foliage */}
        <svg
          className="absolute left-0 top-1/2 -translate-y-1/2 w-40 lg:w-64 h-auto text-sage/10"
          viewBox="0 0 100 300"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
        >
          <path d="M0 150 Q30 140 25 100 Q35 120 30 80 Q45 100 40 50 Q55 80 50 30" />
          <path d="M0 150 Q30 160 25 200 Q35 180 30 220 Q45 200 40 250 Q55 220 50 270" />
          <ellipse cx="28" cy="95" rx="10" ry="6" fill="currentColor" opacity="0.2" />
          <ellipse cx="33" cy="75" rx="8" ry="5" fill="currentColor" opacity="0.15" />
          <ellipse cx="43" cy="45" rx="6" ry="4" fill="currentColor" opacity="0.1" />
          <ellipse cx="28" cy="205" rx="10" ry="6" fill="currentColor" opacity="0.2" />
          <ellipse cx="33" cy="225" rx="8" ry="5" fill="currentColor" opacity="0.15" />
          <ellipse cx="43" cy="255" rx="6" ry="4" fill="currentColor" opacity="0.1" />
        </svg>

        {/* Right foliage - mirrored */}
        <svg
          className="absolute right-0 top-1/2 -translate-y-1/2 w-40 lg:w-64 h-auto text-sage/10"
          viewBox="0 0 100 300"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
          style={{ transform: 'translateY(-50%) scaleX(-1)' }}
        >
          <path d="M0 150 Q30 140 25 100 Q35 120 30 80 Q45 100 40 50 Q55 80 50 30" />
          <path d="M0 150 Q30 160 25 200 Q35 180 30 220 Q45 200 40 250 Q55 220 50 270" />
          <ellipse cx="28" cy="95" rx="10" ry="6" fill="currentColor" opacity="0.2" />
          <ellipse cx="33" cy="75" rx="8" ry="5" fill="currentColor" opacity="0.15" />
          <ellipse cx="43" cy="45" rx="6" ry="4" fill="currentColor" opacity="0.1" />
          <ellipse cx="28" cy="205" rx="10" ry="6" fill="currentColor" opacity="0.2" />
          <ellipse cx="33" cy="225" rx="8" ry="5" fill="currentColor" opacity="0.15" />
          <ellipse cx="43" cy="255" rx="6" ry="4" fill="currentColor" opacity="0.1" />
        </svg>
      </div>

      {/* Central glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] opacity-20 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, var(--gold) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />

      <div className="relative max-w-3xl mx-auto px-8 lg:px-16 text-center">
        {/* Decorative top element */}
        <div
          className={`flex justify-center mb-10 transition-all duration-1000 ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
          }`}
        >
          <div className="relative">
            <div className="w-px h-20 bg-gradient-to-b from-transparent via-gold to-gold/30" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-gold" />
          </div>
        </div>

        {/* Main content */}
        <div
          className={`transition-all duration-1000 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="font-display text-5xl lg:text-6xl xl:text-7xl text-forest leading-[0.95] mb-8">
            Prêt(e) à reprendre
            <br />
            <span className="italic text-gold">votre santé en main ?</span>
          </h2>

          <p className="text-ink-soft text-lg lg:text-xl leading-relaxed mb-12 max-w-xl mx-auto">
            Vous n&apos;avez pas à continuer à souffrir en silence. Que ce soit avec le livre
            ou un accompagnement personnalisé, le premier pas est souvent le plus difficile —
            mais vous n&apos;êtes pas seul(e).
          </p>
        </div>

        {/* CTAs */}
        <div
          className={`flex flex-col sm:flex-row gap-4 justify-center mb-16 transition-all duration-1000 delay-400 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <Link
            href="/livre"
            className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-forest text-cream rounded-sm hover:bg-forest-deep transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <span className="font-medium">Découvrir le livre</span>
            <svg
              className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>

          <Link
            href="/consultations"
            className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-gold text-forest-deep rounded-sm hover:bg-gold-light transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <span className="font-medium">Demander une consultation</span>
            <svg
              className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {/* Contact note */}
        <div
          className={`transition-all duration-1000 delay-600 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <p className="text-ink-soft/70 text-sm">
            Une question ? Écrivez-moi à{' '}
            <a
              href="mailto:mon.remede@gmail.com"
              className="text-forest hover:text-gold transition-colors underline underline-offset-4 decoration-sage/30 hover:decoration-gold"
            >
              mon.remede@gmail.com
            </a>
            {' '}— je réponds personnellement.
          </p>
        </div>

        {/* Decorative bottom element */}
        <div
          className={`flex justify-center mt-16 transition-all duration-1000 delay-800 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-sage/30" />
            <svg className="w-6 h-6 text-sage/40" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L12 8M12 8C9 8 6 10 6 14C6 18 9 22 12 22C15 22 18 18 18 14C18 10 15 8 12 8Z" />
              <path d="M8 12C8 12 10 10 12 10C14 10 16 12 16 12" fill="none" stroke="currentColor" strokeWidth="1" />
            </svg>
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-sage/30" />
          </div>
        </div>
      </div>
    </section>
  )
}
