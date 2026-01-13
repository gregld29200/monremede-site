'use client'
import { Badge, Button } from '@/components/ui'

export function HeroSection() {
  return (
    <section className="hero min-h-screen bg-forest-deep relative grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
      {/* Left Content */}
      <div className="hero-left px-6 sm:px-12 lg:px-20 py-20 lg:py-0 flex flex-col justify-center relative z-10">
        <Badge
          variant="gold"
          className="mb-10 animate-[fadeSlideUp_1s_ease_0.2s_both]"
        >
          <span className="text-xs">✦</span>
          Nouveau Livre 2025
        </Badge>

        <h1 className="display-huge text-cream mb-5 animate-[fadeSlideUp_1s_ease_0.4s_both]">
          La Santé<br/>dans <em className="italic text-gold-light">l&apos;assiette</em>
        </h1>

        <p className="font-serif text-lg sm:text-xl font-light italic text-sage-light mb-10 animate-[fadeSlideUp_1s_ease_0.6s_both]">
          30 Jours pour se soigner — Ramadan, ma guérison
        </p>

        <p className="text-cream/75 max-w-md mb-12 body-large animate-[fadeSlideUp_1s_ease_0.8s_both]">
          Un guide complet de naturopathie pour transformer votre Ramadan en période de guérison profonde.
          Retrouvez votre énergie, apaisez votre digestion et reconnectez-vous à votre corps.
        </p>

        <div className="flex flex-wrap gap-5 animate-[fadeSlideUp_1s_ease_1s_both]">
          <Button variant="primary" size="lg" asChild>
            <a href="#commander">
              Commander le livre
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
        {/* Main Image */}
        <div
          className="absolute top-[10%] left-[-15%] w-[90%] h-[75%] rounded-bl-[80px] bg-gradient-to-br from-sage to-sage-light animate-[fadeSlideLeft_1.2s_ease_0.5s_both] overflow-hidden"
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="label text-forest-deep/60 text-center px-8">
              Image Hero : Femme en hijab cuisinant sereinement des légumes frais dans une cuisine lumineuse aux tons neutres
            </span>
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-sage/50 animate-shimmer" />
        </div>

        {/* Secondary Image */}
        <div
          className="absolute bottom-[5%] right-[8%] w-[45%] h-[35%] rounded-tl-[40px] rounded-br-[40px] bg-gradient-to-br from-blush to-blush-deep shadow-2xl animate-[fadeSlideUp_1.2s_ease_0.8s_both] overflow-hidden"
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="label text-forest-deep/60 text-center px-4 text-[0.6rem]">
              Ingrédients naturels
            </span>
          </div>
        </div>

        {/* Botanical Decoration */}
        <div className="absolute top-[15%] right-[10%] w-44 h-44 opacity-15 animate-float">
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
