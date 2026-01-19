'use client'
import Image from 'next/image'
import { Badge, Button } from '@/components/ui'

const AMAZON_LINK = 'https://www.amazon.fr/dp/2959216601'

export function HeroSection() {
  return (
    <section className="hero min-h-screen bg-forest-deep relative grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
      {/* Left Content */}
      <div className="hero-left px-6 sm:px-12 lg:px-20 pt-40 pb-20 lg:pt-36 lg:pb-20 flex flex-col justify-center relative z-10">
        <Badge
          variant="gold"
          className="mb-8 animate-[fadeSlideUp_1s_ease_0.2s_both] self-start"
        >
          Plus de 15 ans d&apos;expérience compilés en un guide
        </Badge>

        <h1 className="text-cream mb-6 animate-[fadeSlideUp_1s_ease_0.4s_both] max-w-[95%]">
          <span className="font-display text-[clamp(2.5rem,8vw,5.5rem)] leading-[0.95] block">
            Et si vous pouviez
          </span>
          <span className="font-display text-[clamp(2.5rem,8vw,5.5rem)] leading-[0.95] block">
            enfin
          </span>
          <em className="font-display italic text-gold-light text-[clamp(2.2rem,7vw,4.5rem)] leading-[1.1] block mt-2">
            comprendre votre corps ?
          </em>
        </h1>

        <p className="font-serif text-lg sm:text-xl font-light italic text-sage-light mb-8 max-w-lg animate-[fadeSlideUp_1s_ease_0.6s_both]">
          &laquo; La Santé dans l&apos;assiette &raquo; — Le guide de naturopathie qui a déjà aidé des centaines de familles à retrouver leur vitalité.
        </p>

        <p className="text-cream/75 max-w-md mb-10 body-large animate-[fadeSlideUp_1s_ease_0.8s_both]">
          260+ pages de conseils concrets, de listes d&apos;aliments thérapeutiques et de questionnaires
          d&apos;auto-évaluation pour reprendre le contrôle de votre santé — naturellement.
        </p>

        <div className="flex flex-wrap gap-5 animate-[fadeSlideUp_1s_ease_1s_both]">
          <Button variant="primary" size="lg" asChild>
            <a href={AMAZON_LINK} target="_blank" rel="noopener noreferrer">
              Commander sur Amazon
              <span>→</span>
            </a>
          </Button>
          <Button variant="secondary" size="lg" asChild>
            <a href="#decouvrir">
              Découvrir le contenu
            </a>
          </Button>
        </div>
      </div>

      {/* Right Visual */}
      <div className="hero-right relative hidden lg:block">
        {/* Main Image - Book Mockup */}
        <div
          className="absolute top-[12%] left-0 w-[85%] h-[70%] rounded-bl-[80px] animate-[fadeSlideLeft_1.2s_ease_0.5s_both] overflow-hidden"
        >
          <Image
            src="/images/book-mockup-hero.png"
            alt="La Santé dans l'assiette - Livre de naturopathie par Oum Soumayya"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-forest-deep/20" />
        </div>

        {/* Secondary Image - Open Book */}
        <div
          className="absolute bottom-[8%] right-[8%] w-[45%] h-[32%] rounded-tl-[40px] rounded-br-[40px] shadow-2xl animate-[fadeSlideUp_1.2s_ease_0.8s_both] overflow-hidden"
        >
          <Image
            src="/images/book-hero-small.png"
            alt="Livre ouvert sur une table avec une tasse de thé"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 50vw, 25vw"
          />
        </div>

        {/* Botanical Decoration */}
        <div className="absolute top-[18%] right-[12%] w-36 h-36 opacity-15 animate-float">
          <svg viewBox="0 0 100 100" className="w-full h-full fill-sage-light">
            <path d="M50 10 Q60 30 50 50 Q40 30 50 10" />
            <path d="M50 50 Q70 40 80 60 Q60 55 50 50" />
            <path d="M50 50 Q30 40 20 60 Q40 55 50 50" />
            <path d="M50 50 L50 90" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
        </div>
      </div>
    </section>
  )
}
