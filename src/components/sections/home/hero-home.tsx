'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'

export function HeroHome() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Rich layered background */}
      <div className="absolute inset-0 bg-cream-warm" />

      {/* Organic watercolor wash - top right */}
      <div
        className="absolute -top-32 -right-32 w-[600px] h-[600px] opacity-30 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, var(--sage) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Warm accent wash - bottom left */}
      <div
        className="absolute -bottom-48 -left-48 w-[500px] h-[500px] opacity-20 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, var(--blush) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />

      {/* Grain texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Decorative botanical line art - floating */}
      <svg
        className="absolute top-24 right-16 w-40 h-40 text-sage/20 hidden lg:block"
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.5"
      >
        <path d="M50 95 C50 95 50 50 50 30 C50 15 35 5 50 5 C65 5 50 15 50 30" />
        <path d="M50 60 C50 60 30 50 20 55 C10 60 15 45 25 40 C35 35 50 45 50 60" />
        <path d="M50 60 C50 60 70 50 80 55 C90 60 85 45 75 40 C65 35 50 45 50 60" />
        <circle cx="50" cy="5" r="3" fill="currentColor" opacity="0.3" />
      </svg>

      {/* Main content grid */}
      <div className="relative grid grid-cols-1 lg:grid-cols-12 min-h-screen">
        {/* Left content area - spans 7 columns */}
        <div className="lg:col-span-7 flex flex-col justify-center px-8 sm:px-12 lg:px-20 xl:px-28 pt-40 pb-20 lg:pt-32 lg:pb-0">
          <div className="max-w-2xl">
            {/* Eyebrow with decorative line */}
            <div
              className={`flex items-center gap-4 mb-8 transition-all duration-1000 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <div className="h-px w-12 bg-gradient-to-r from-gold to-gold/0" />
              <span className="text-xs tracking-[0.3em] uppercase text-sage font-medium">
                Naturopathie
              </span>
            </div>

            {/* Main headline - dramatic typography */}
            <h1
              className={`mb-10 transition-all duration-1000 delay-150 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <span className="block font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-forest leading-[1.1] tracking-tight">
                Fatigue persistante,
              </span>
              <span className="block font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-forest leading-[1.1] tracking-tight mt-1">
                digestion difficile,
              </span>
              <span className="block font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-forest leading-[1.1] tracking-tight mt-1">
                douleurs inexpliquées…
              </span>
              <span className="block font-accent text-2xl sm:text-3xl lg:text-4xl text-sage mt-6 italic font-light">
                Et si votre corps essayait de vous parler ?
              </span>
            </h1>

            {/* Subtitle - refined typography */}
            <p
              className={`text-ink-soft text-lg lg:text-xl leading-relaxed max-w-xl mb-14 transition-all duration-1000 delay-300 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              Depuis 2009, j&apos;accompagne ceux qui souffrent à retrouver leur vitalité
              grâce à une approche naturelle : l&apos;alimentation comme premier médicament,
              le jeûne comme outil de guérison.
            </p>

            {/* Two paths - editorial minimal design */}
            <div
              className={`flex flex-col sm:flex-row gap-8 sm:gap-12 transition-all duration-1000 delay-500 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              {/* Le Livre */}
              <Link href="/livre" className="group flex-1">
                <div className="relative">
                  {/* Decorative accent line */}
                  <div className="absolute -left-4 top-0 w-px h-full bg-gradient-to-b from-forest via-forest/50 to-transparent group-hover:from-gold group-hover:via-gold/50 transition-colors duration-500" />

                  <div className="pl-4">
                    {/* Number indicator */}
                    <span className="text-xs tracking-[0.2em] text-sage/50 font-mono mb-3 block">01</span>

                    <h3 className="font-display text-2xl lg:text-3xl text-forest mb-3 group-hover:text-forest-deep transition-colors">
                      Le Livre
                    </h3>

                    <p className="text-ink-soft text-sm leading-relaxed mb-4 max-w-xs">
                      Comprenez votre corps et apprenez à vous soigner au quotidien
                    </p>

                    <span className="inline-flex items-center gap-2 text-sage group-hover:text-gold transition-colors">
                      <span className="text-xs tracking-wider uppercase font-medium">Découvrir</span>
                      <svg
                        className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>

              {/* Divider for desktop */}
              <div className="hidden sm:block w-px bg-gradient-to-b from-transparent via-sage/20 to-transparent" />

              {/* Consultations */}
              <Link href="/consultations" className="group flex-1">
                <div className="relative">
                  {/* Decorative accent line */}
                  <div className="absolute -left-4 top-0 w-px h-full bg-gradient-to-b from-gold via-gold/50 to-transparent group-hover:from-forest group-hover:via-forest/50 transition-colors duration-500" />

                  <div className="pl-4">
                    {/* Number indicator */}
                    <span className="text-xs tracking-[0.2em] text-sage/50 font-mono mb-3 block">02</span>

                    <h3 className="font-display text-2xl lg:text-3xl text-forest mb-3 group-hover:text-forest-deep transition-colors">
                      Consultations
                    </h3>

                    <p className="text-ink-soft text-sm leading-relaxed mb-4 max-w-xs">
                      Un accompagnement personnalisé adapté à votre situation
                    </p>

                    <span className="inline-flex items-center gap-2 text-sage group-hover:text-gold transition-colors">
                      <span className="text-xs tracking-wider uppercase font-medium">Voir les formules</span>
                      <svg
                        className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Right visual area - spans 5 columns */}
        <div className="lg:col-span-5 relative min-h-[50vh] lg:min-h-full">
          {/* Diagonal color block */}
          <div
            className="absolute inset-0 bg-sage/20"
            style={{
              clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 0 100%)',
            }}
          />

          {/* Hero Image */}
          <div className="absolute inset-0 flex items-center justify-center p-8 lg:p-12">
            <div className="relative w-full max-w-md aspect-[3/4]">
              {/* Decorative frame */}
              <div className="absolute -inset-3 border border-gold/20 rounded-sm" />
              <div className="absolute -inset-6 border border-sage/10 rounded-sm hidden lg:block" />

              {/* Actual image with premium filter */}
              <div className="absolute inset-0 rounded-sm overflow-hidden shadow-2xl">
                <Image
                  src="/images/Hero.png"
                  alt="Mains tenant une tasse de tisane dorée avec le livre La Santé dans l'Assiette"
                  fill
                  className="object-cover saturate-[0.9] contrast-[1.05] brightness-[1.02]"
                  sizes="(max-width: 768px) 100vw, 40vw"
                  priority
                />
                {/* Warm overlay for organic feel */}
                <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-forest/5 mix-blend-overlay" />
                {/* Subtle vignette */}
                <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(26,46,35,0.15)]" />
              </div>

              {/* Floating botanical accent */}
              <svg
                className="absolute -bottom-10 -left-10 w-20 h-20 text-forest/10"
                viewBox="0 0 100 100"
                fill="currentColor"
              >
                <circle cx="20" cy="80" r="8" />
                <circle cx="40" cy="60" r="6" />
                <circle cx="60" cy="75" r="10" />
                <circle cx="80" cy="55" r="5" />
              </svg>
            </div>
          </div>

          {/* Bottom gradient fade */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-cream-warm to-transparent pointer-events-none" />
        </div>
      </div>

    </section>
  )
}
