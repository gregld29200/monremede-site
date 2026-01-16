'use client'

import Link from 'next/link'
import Image from 'next/image'
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
              {/* Visual area with decorative frame */}
              <div className="relative mb-12">
                {/* Decorative frame layers */}
                <div className="absolute -inset-5 border border-sage/10 rounded-sm" />
                <div className="absolute -inset-2 border border-gold/20 rounded-sm" />

                {/* Image container */}
                <div className="relative aspect-[4/3] overflow-hidden rounded-sm shadow-lg">
                  <Image
                    src="/images/blog-placeholder.png"
                    alt="Le blog Mon Remède - Articles naturopathie"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />

                  {/* Subtle vignette */}
                  <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(26,46,35,0.08)]" />

                  {/* Corner accents */}
                  <div className="absolute top-3 left-3 w-6 h-6">
                    <div className="absolute top-0 left-0 w-full h-px bg-gold/50" />
                    <div className="absolute top-0 left-0 h-full w-px bg-gold/50" />
                  </div>
                  <div className="absolute bottom-3 right-3 w-6 h-6">
                    <div className="absolute bottom-0 right-0 w-full h-px bg-gold/50" />
                    <div className="absolute bottom-0 right-0 h-full w-px bg-gold/50" />
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-forest/0 group-hover:bg-forest/5 transition-colors duration-500" />
                </div>

                {/* Caption label */}
                <div className="absolute -bottom-3 left-6 bg-cream px-3 py-1 shadow-sm">
                  <span className="text-[9px] tracking-[0.2em] uppercase text-sage">
                    Articles
                  </span>
                </div>
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
              {/* Visual area with decorative frame */}
              <div className="relative mb-12">
                {/* Decorative frame layers */}
                <div className="absolute -inset-5 border border-sage/10 rounded-sm" />
                <div className="absolute -inset-2 border border-gold/20 rounded-sm" />

                {/* Image container */}
                <div className="relative aspect-[4/3] overflow-hidden rounded-sm shadow-lg">
                  <Image
                    src="/images/recipes-placeholder.png"
                    alt="Recettes saines - Cuisine naturelle"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />

                  {/* Subtle vignette */}
                  <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(26,46,35,0.08)]" />

                  {/* Corner accents */}
                  <div className="absolute top-3 left-3 w-6 h-6">
                    <div className="absolute top-0 left-0 w-full h-px bg-gold/50" />
                    <div className="absolute top-0 left-0 h-full w-px bg-gold/50" />
                  </div>
                  <div className="absolute bottom-3 right-3 w-6 h-6">
                    <div className="absolute bottom-0 right-0 w-full h-px bg-gold/50" />
                    <div className="absolute bottom-0 right-0 h-full w-px bg-gold/50" />
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gold/0 group-hover:bg-gold/5 transition-colors duration-500" />
                </div>

                {/* Caption label */}
                <div className="absolute -bottom-3 left-6 bg-cream px-3 py-1 shadow-sm">
                  <span className="text-[9px] tracking-[0.2em] uppercase text-sage">
                    Cuisine
                  </span>
                </div>
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
