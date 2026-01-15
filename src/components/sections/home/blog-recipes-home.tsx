'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

export function BlogRecipesHome() {
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
    <section ref={sectionRef} className="relative py-32 lg:py-44 overflow-hidden bg-cream">
      {/* Subtle texture */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Decorative side shapes */}
      <div className="absolute top-1/2 -translate-y-1/2 left-0 w-24 h-80 bg-gradient-to-r from-sage/5 to-transparent pointer-events-none" />
      <div className="absolute top-1/2 -translate-y-1/2 right-0 w-24 h-80 bg-gradient-to-l from-blush/5 to-transparent pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-8 lg:px-16">
        {/* Header */}
        <div
          className={`text-center mb-20 lg:mb-24 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <span className="inline-flex items-center gap-4 mb-8">
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-sage" />
            <span className="text-xs tracking-[0.3em] uppercase text-sage font-medium">
              Ressources gratuites
            </span>
            <span className="h-px w-12 bg-gradient-to-l from-transparent to-sage" />
          </span>

          <h2 className="font-display text-5xl lg:text-6xl xl:text-7xl text-forest leading-[0.95] mb-6">
            Apprendre,
            <br />
            <span className="italic text-sage">jour après jour</span>
          </h2>

          <p className="text-ink-soft text-lg max-w-xl mx-auto">
            Des ressources gratuites pour vous accompagner sur le chemin de la santé naturelle.
          </p>
        </div>

        {/* Two cards grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Blog Card */}
          <div
            className={`group relative transition-all duration-1000 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
          >
            <Link href="/blog" className="block">
              {/* Visual area */}
              <div className="relative aspect-[4/3] mb-8 overflow-hidden rounded-sm bg-gradient-to-br from-sage/10 via-forest/5 to-cream-warm">
                {/* Placeholder illustration */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    {/* Open book with botanical elements */}
                    <div className="relative w-40 h-28">
                      {/* Book pages */}
                      <div className="absolute inset-0 flex">
                        <div className="w-1/2 h-full bg-cream rounded-l-sm shadow-lg border-r border-sage/10">
                          <div className="p-3 space-y-2">
                            <div className="h-1 bg-forest/10 rounded w-full" />
                            <div className="h-1 bg-forest/10 rounded w-4/5" />
                            <div className="h-1 bg-forest/10 rounded w-3/5" />
                          </div>
                        </div>
                        <div className="w-1/2 h-full bg-cream rounded-r-sm shadow-lg">
                          <div className="p-3 space-y-2">
                            <div className="h-1 bg-forest/10 rounded w-full" />
                            <div className="h-1 bg-forest/10 rounded w-4/5" />
                            <div className="h-1 bg-forest/10 rounded w-2/3" />
                          </div>
                        </div>
                      </div>
                      {/* Botanical accent */}
                      <svg
                        className="absolute -top-8 -right-4 w-16 h-24 text-sage/60"
                        viewBox="0 0 50 80"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                      >
                        <path d="M25 80 L25 40 Q30 20 25 5 Q20 20 25 40" />
                        <ellipse cx="35" cy="35" rx="8" ry="5" fill="currentColor" opacity="0.3" />
                        <ellipse cx="15" cy="25" rx="6" ry="4" fill="currentColor" opacity="0.2" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-forest/0 group-hover:bg-forest/5 transition-colors duration-500" />
              </div>

              {/* Content */}
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs tracking-[0.2em] text-sage/50 font-mono">01</span>
                  <span className="h-px w-6 bg-sage/30" />
                  <span className="text-xs tracking-widest uppercase text-sage/60">Articles</span>
                </div>

                <h3 className="font-display text-3xl text-forest mb-4 group-hover:text-forest-deep transition-colors">
                  Le Blog
                </h3>

                <p className="text-ink-soft leading-relaxed mb-6">
                  Articles sur la naturopathie, le jeûne, la digestion, l&apos;équilibre hormonal…
                  Pour comprendre votre corps et faire les bons choix.
                </p>

                <span className="inline-flex items-center gap-2 text-sage group-hover:text-gold transition-colors">
                  <span className="font-medium">Lire les articles</span>
                  <svg
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </div>
            </Link>
          </div>

          {/* Recipes Card */}
          <div
            className={`group relative transition-all duration-1000 delay-400 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
          >
            <Link href="/recettes" className="block">
              {/* Visual area */}
              <div className="relative aspect-[4/3] mb-8 overflow-hidden rounded-sm bg-gradient-to-br from-blush/10 via-gold/5 to-cream-warm">
                {/* Placeholder illustration */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    {/* Bowl with ingredients */}
                    <div className="relative w-36 h-28">
                      {/* Bowl */}
                      <div className="absolute bottom-0 w-full h-20 bg-cream-warm rounded-b-full border-2 border-sage/30 overflow-hidden">
                        {/* Contents */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                          <div className="w-6 h-6 rounded-full bg-sage/40" />
                          <div className="w-4 h-4 rounded-full bg-gold/40 mt-2" />
                          <div className="w-5 h-5 rounded-full bg-blush/50 mt-1" />
                        </div>
                      </div>
                      {/* Spoon */}
                      <div className="absolute -right-4 bottom-6 w-16 h-3 bg-cream rounded-full border border-sage/20 transform rotate-45 origin-left" />
                      {/* Steam/herb accent */}
                      <svg
                        className="absolute -top-4 -left-4 w-12 h-16 text-sage/50"
                        viewBox="0 0 40 60"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                      >
                        <path d="M20 60 L20 35 Q25 20 20 5 Q15 20 20 35" />
                        <ellipse cx="12" cy="20" rx="5" ry="3" fill="currentColor" opacity="0.3" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-blush/0 group-hover:bg-blush/5 transition-colors duration-500" />
              </div>

              {/* Content */}
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs tracking-[0.2em] text-sage/50 font-mono">02</span>
                  <span className="h-px w-6 bg-sage/30" />
                  <span className="text-xs tracking-widest uppercase text-sage/60">Cuisine</span>
                </div>

                <h3 className="font-display text-3xl text-forest mb-4 group-hover:text-forest-deep transition-colors">
                  Les Recettes
                </h3>

                <p className="text-ink-soft leading-relaxed mb-6">
                  Des recettes saines, simples et savoureuses. Parce que bien manger ne devrait
                  jamais être compliqué.
                </p>

                <span className="inline-flex items-center gap-2 text-sage group-hover:text-gold transition-colors">
                  <span className="font-medium">Voir les recettes</span>
                  <svg
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
