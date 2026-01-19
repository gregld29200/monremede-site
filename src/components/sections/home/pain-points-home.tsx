'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'

/**
 * PainPointsHome - Scroll + Auto-Loop Morphing Effect
 * L'image se transforme du brouillard au soleil :
 * - En fonction du scroll dans la section
 * - Continue en boucle automatique quand on arrête de scroller
 */

const painPoints = [
  {
    title: 'La fatigue qui ne part pas',
    description:
      "Vous dormez, mais vous vous réveillez épuisé(e). Le café ne suffit plus. Votre énergie d'avant vous manque.",
    pullQuote: 'épuisé(e)',
  },
  {
    title: 'Une digestion devenue un combat',
    description:
      'Ballonnements, acidités, lourdeurs après chaque repas… Manger est devenu une source de stress plutôt que de plaisir.',
    pullQuote: 'un combat',
  },
  {
    title: 'Des réponses qui ne satisfont pas',
    description:
      'On vous dit que "tout va bien" ou on vous prescrit encore un médicament. Mais au fond, vous sentez que quelque chose ne va pas.',
    pullQuote: 'quelque chose',
  },
  {
    title: "L'impression de tourner en rond",
    description:
      'Vous avez essayé des régimes, des compléments, des conseils trouvés ici et là. Rien ne tient sur la durée.',
    pullQuote: 'en rond',
  },
]

export function PainPointsHome() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [loopProgress, setLoopProgress] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const animationRef = useRef<number | null>(null)

  // Intersection observer for entrance animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
        setIsInView(entry.isIntersecting)
      },
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  // Scroll-based morphing effect
  const handleScroll = useCallback(() => {
    if (!imageRef.current) return

    // Mark as scrolling and reset timeout
    setIsScrolling(true)
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
    }
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false)
    }, 150) // Consider stopped after 150ms of no scroll

    const rect = imageRef.current.getBoundingClientRect()
    const windowHeight = window.innerHeight

    const startPoint = windowHeight * 0.8
    const endPoint = windowHeight * 0.2

    if (rect.top > startPoint) {
      setScrollProgress(0)
    } else if (rect.top < endPoint) {
      setScrollProgress(1)
    } else {
      const progress = (startPoint - rect.top) / (startPoint - endPoint)
      setScrollProgress(Math.max(0, Math.min(1, progress)))
    }
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    // Initial check on mount - intentional setState in effect
    // eslint-disable-next-line react-hooks/set-state-in-effect
    handleScroll()
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)
    }
  }, [handleScroll])

  // Auto-loop animation when not scrolling and in view
  useEffect(() => {
    if (isScrolling || !isInView) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
      return
    }

    let startTime: number | null = null
    const duration = 6000 // 6 seconds for full cycle

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime

      // Sine wave for smooth back-and-forth: 0 → 1 → 0 → 1...
      const cycle = (Math.sin((elapsed / duration) * Math.PI * 2 - Math.PI / 2) + 1) / 2
      setLoopProgress(cycle)

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isScrolling, isInView])

  // Combine scroll and loop progress
  // When scrolling: use scroll progress
  // When not scrolling: blend towards loop progress
  const displayProgress = isScrolling ? scrollProgress : loopProgress
  const isRevealed = displayProgress > 0.5

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #f2ebe1 0%, #efe9dc 100%)' }}
    >
      {/* Editorial grid lines */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-[8%] top-0 bottom-0 w-px bg-forest/5" />
        <div className="absolute left-[50%] top-0 bottom-0 w-px bg-forest/5" />
        <div className="absolute right-[8%] top-0 bottom-0 w-px bg-forest/5" />
      </div>

      <div className="relative max-w-[1400px] mx-auto px-8 lg:px-16 py-32">
        {/* Header */}
        <header
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className="h-px w-12 bg-terracotta/30" />
            <span className="text-[10px] tracking-[0.4em] uppercase text-terracotta font-medium">
              Chapitre Premier
            </span>
            <span className="h-px w-12 bg-terracotta/30" />
          </div>
          <h2 className="font-display text-5xl lg:text-7xl xl:text-8xl text-forest leading-[0.9]">
            Reconnaissez-vous<br />
            <span className="italic text-sage">ces signaux ?</span>
          </h2>
        </header>

        {/* Animated landscape image - centered */}
        <div
          ref={imageRef}
          className={`max-w-4xl mx-auto mb-20 transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          <div className="relative">
            {/* Decorative frames */}
            <div className="absolute -inset-6 border border-sage/10 rounded-sm hidden lg:block" />
            <div className="absolute -inset-3 border border-gold/20 rounded-sm" />

            {/* Animated image */}
            <div className="relative aspect-[16/9] rounded-sm overflow-hidden shadow-xl">
              {/* Base layer - Fog image */}
              <div
                className="absolute inset-0"
                style={{ opacity: 1 - displayProgress }}
              >
                <Image
                  src="/images/painpoint-fog.png"
                  alt="Collines dans le brouillard avec arbre solitaire"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 896px"
                  priority
                />
              </div>

              {/* Revealed layer - Sunny image */}
              <div
                className="absolute inset-0"
                style={{ opacity: displayProgress }}
              >
                <Image
                  src="/images/painpoint-sunny.png"
                  alt="Collines ensoleillées avec rayons de lumière et arbre solitaire"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 896px"
                  priority
                />
              </div>

              {/* Grain texture overlay */}
              <div
                className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                }}
              />

              {/* Subtle vignette */}
              <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(26,46,35,0.12)]" />

              {/* Corner accents */}
              <div className="absolute top-4 left-4 w-8 h-8">
                <div
                  className="absolute top-0 left-0 w-full h-px"
                  style={{
                    backgroundColor: `rgba(${isRevealed ? '196, 163, 90' : '255, 255, 255'}, ${isRevealed ? 0.6 : 0.3})`
                  }}
                />
                <div
                  className="absolute top-0 left-0 h-full w-px"
                  style={{
                    backgroundColor: `rgba(${isRevealed ? '196, 163, 90' : '255, 255, 255'}, ${isRevealed ? 0.6 : 0.3})`
                  }}
                />
              </div>
              <div className="absolute bottom-4 right-4 w-8 h-8">
                <div
                  className="absolute bottom-0 right-0 w-full h-px"
                  style={{
                    backgroundColor: `rgba(${isRevealed ? '196, 163, 90' : '255, 255, 255'}, ${isRevealed ? 0.6 : 0.3})`
                  }}
                />
                <div
                  className="absolute bottom-0 right-0 h-full w-px"
                  style={{
                    backgroundColor: `rgba(${isRevealed ? '196, 163, 90' : '255, 255, 255'}, ${isRevealed ? 0.6 : 0.3})`
                  }}
                />
              </div>

              {/* State indicator with progress */}
              <div
                className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-sm"
                style={{
                  backgroundColor: `rgba(${isRevealed ? '196, 163, 90' : '247, 244, 237'}, ${isRevealed ? 0.9 : 0.8})`,
                  color: isRevealed ? '#1a2e23' : '#2D4A3E'
                }}
              >
                <span className="text-[10px] tracking-[0.2em] uppercase font-medium">
                  {isRevealed ? 'Vers la clarté' : 'Dans le brouillard'}
                </span>
              </div>
            </div>

            {/* Caption with progress indicator */}
            <div className="flex items-center justify-center gap-3 mt-6">
              <span
                className="w-2 h-2 rounded-full transition-transform duration-150"
                style={{
                  backgroundColor: `rgba(139, 158, 126, ${1 - displayProgress * 0.7})`,
                  transform: `scale(${1 - displayProgress * 0.25})`
                }}
              />
              <span className="font-accent text-sm text-ink-soft italic">
                Du brouillard à la lumière
              </span>
              <span
                className="w-2 h-2 rounded-full transition-transform duration-150"
                style={{
                  backgroundColor: `rgba(196, 163, 90, ${0.3 + displayProgress * 0.7})`,
                  transform: `scale(${0.75 + displayProgress * 0.25})`
                }}
              />
            </div>
          </div>
        </div>

        {/* Pain points grid - 2x2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto mb-20">
          {painPoints.map((point, index) => (
            <article
              key={index}
              className={`relative p-8 rounded-sm transition-all duration-300 ease-in-out ${
                isRevealed
                  ? 'bg-gradient-to-br from-gold/5 to-transparent border border-gold/20'
                  : 'bg-gradient-to-br from-sage/5 to-transparent border border-sage/15'
              } ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: isVisible ? `${500 + index * 100}ms` : '0ms' }}
            >
              <span className={`absolute -top-4 -left-2 font-display text-6xl leading-none transition-colors duration-300 ease-in-out ${
                isRevealed ? 'text-gold/20' : 'text-forest/10'
              }`}>
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="font-display text-2xl text-forest mb-3 leading-tight mt-4">
                {point.title}
              </h3>
              <p className="text-ink-soft leading-relaxed">{point.description}</p>
              <span className={`block mt-4 font-display text-xl italic transition-colors duration-300 ease-in-out ${
                isRevealed ? 'text-gold/30' : 'text-terracotta/20'
              }`}>
                {point.pullQuote}
              </span>
            </article>
          ))}
        </div>

        {/* Quote */}
        <div
          className={`text-center transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '900ms' }}
        >
          <blockquote className="relative inline-block">
            <p className="font-accent text-3xl lg:text-4xl text-forest italic leading-snug mb-4">
              Ce n&apos;est pas dans votre tête.
            </p>
            <p className={`font-display text-xl tracking-wide transition-colors duration-300 ease-in-out ${
              isRevealed ? 'text-gold' : 'text-sage'
            }`}>
              Il existe un autre chemin.
            </p>
          </blockquote>

          {/* Progress bar */}
          <div className="flex justify-center gap-2 mt-8">
            <div className="w-20 h-1 bg-sage/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-sage to-gold rounded-full transition-all duration-100"
                style={{ width: `${displayProgress * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
