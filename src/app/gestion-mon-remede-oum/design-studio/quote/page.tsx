'use client'

import { useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import {
  QuoteEditor,
  QuotePreview,
  BackgroundPicker,
  AspectRatioPicker,
} from '@/components/admin/design-studio'
import type { AspectRatio, Resolution } from '@/types/design-studio'

const ADMIN_PATH = '/gestion-mon-remede-oum'

type TextColor = 'light' | 'dark'
type TextPosition = 'center' | 'bottom'

export default function QuoteCardPage() {
  // Quote state
  const [quote, setQuote] = useState('')
  const [authorName, setAuthorName] = useState('Mon Remède')

  // Visual settings
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1')
  const [resolution, setResolution] = useState<Resolution>('2K')
  const [backgroundUrl, setBackgroundUrl] = useState<string | null>(null)
  const [textColor, setTextColor] = useState<TextColor>('light')
  const [textPosition, setTextPosition] = useState<TextPosition>('center')

  const handleExport = (dataUrl: string) => {
    // Download the image
    const link = document.createElement('a')
    link.download = `citation-monremede-${Date.now()}.png`
    link.href = dataUrl
    link.click()
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href={`${ADMIN_PATH}/design-studio`}
          className="group p-2.5 text-forest/50 hover:text-forest bg-white hover:bg-cream-warm rounded-xl border border-forest/5 hover:border-forest/10 transition-all"
        >
          <svg className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h2 className="font-display text-2xl text-forest">Carte citation</h2>
            <span className="px-2.5 py-1 bg-gold/10 text-gold text-xs font-accent uppercase tracking-wider rounded-full border border-gold/20">
              Nouveau
            </span>
          </div>
          <p className="font-body text-sm text-ink-soft/60">
            Créez des citations visuelles pour vos réseaux sociaux
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Left panel - Settings (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quote text */}
          <div className="bg-gradient-to-br from-cream-warm to-cream rounded-3xl border border-forest/8 p-6">
            <QuoteEditor
              value={quote}
              onChange={setQuote}
              maxLength={280}
            />
          </div>

          {/* Author name */}
          <div className="bg-gradient-to-br from-cream-warm to-cream rounded-3xl border border-forest/8 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blush/30 to-blush/10 flex items-center justify-center">
                <svg className="w-4 h-4 text-blush-deep" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
              <div>
                <h3 className="font-display text-base text-forest font-medium tracking-tight">
                  Attribution
                </h3>
                <p className="font-body text-xs text-ink-soft/60">
                  Nom affiché sous la citation
                </p>
              </div>
            </div>
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="Mon Remède"
              className="w-full px-4 py-3 rounded-xl border border-forest/15 bg-cream-warm/50 font-body text-forest placeholder:text-forest/30 focus:outline-none focus:border-gold/50 focus:bg-white transition-all"
            />
          </div>

          {/* Text style */}
          <div className="bg-gradient-to-br from-cream-warm to-cream rounded-3xl border border-forest/8 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-forest/20 to-forest/5 flex items-center justify-center">
                <svg className="w-4 h-4 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
                </svg>
              </div>
              <div>
                <h3 className="font-display text-base text-forest font-medium tracking-tight">
                  Style du texte
                </h3>
                <p className="font-body text-xs text-ink-soft/60">
                  Couleur et position
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Text color */}
              <div>
                <p className="font-accent text-xs text-forest/60 uppercase tracking-wider mb-2">
                  Couleur du texte
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setTextColor('light')}
                    className={cn(
                      'flex-1 py-3 px-4 rounded-xl border-2 flex items-center justify-center gap-2 transition-all duration-300',
                      textColor === 'light'
                        ? 'border-gold/50 bg-forest text-cream'
                        : 'border-forest/10 bg-forest/80 text-cream/80 hover:border-forest/20'
                    )}
                  >
                    <span className="w-4 h-4 rounded-full bg-white" />
                    <span className="font-body text-sm">Clair</span>
                  </button>
                  <button
                    onClick={() => setTextColor('dark')}
                    className={cn(
                      'flex-1 py-3 px-4 rounded-xl border-2 flex items-center justify-center gap-2 transition-all duration-300',
                      textColor === 'dark'
                        ? 'border-gold/50 bg-cream text-forest'
                        : 'border-forest/10 bg-cream-warm text-forest/80 hover:border-forest/20'
                    )}
                  >
                    <span className="w-4 h-4 rounded-full bg-forest" />
                    <span className="font-body text-sm">Sombre</span>
                  </button>
                </div>
              </div>

              {/* Text position */}
              <div>
                <p className="font-accent text-xs text-forest/60 uppercase tracking-wider mb-2">
                  Position du texte
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setTextPosition('center')}
                    className={cn(
                      'flex-1 py-3 px-4 rounded-xl border-2 flex items-center justify-center gap-2 transition-all duration-300',
                      textPosition === 'center'
                        ? 'border-gold/50 bg-gold/10'
                        : 'border-forest/10 bg-cream-warm hover:border-forest/20'
                    )}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                    <span className="font-body text-sm text-forest">Centre</span>
                  </button>
                  <button
                    onClick={() => setTextPosition('bottom')}
                    className={cn(
                      'flex-1 py-3 px-4 rounded-xl border-2 flex items-center justify-center gap-2 transition-all duration-300',
                      textPosition === 'bottom'
                        ? 'border-gold/50 bg-gold/10'
                        : 'border-forest/10 bg-cream-warm hover:border-forest/20'
                    )}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                    <span className="font-body text-sm text-forest">Bas</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Aspect ratio */}
          <div className="bg-gradient-to-br from-cream-warm to-cream rounded-3xl border border-forest/8 p-6">
            <AspectRatioPicker
              aspectRatio={aspectRatio}
              resolution={resolution}
              onAspectRatioChange={setAspectRatio}
              onResolutionChange={setResolution}
            />
          </div>
        </div>

        {/* Right panel - Background & Preview (3 cols) */}
        <div className="lg:col-span-3 space-y-6">
          {/* Background picker */}
          <div className="bg-gradient-to-br from-cream-warm to-cream rounded-3xl border border-forest/8 p-6">
            <BackgroundPicker
              onSelect={setBackgroundUrl}
              selectedUrl={backgroundUrl}
              aspectRatio={aspectRatio}
            />
          </div>

          {/* Preview */}
          <div className="bg-gradient-to-br from-cream-warm to-cream rounded-3xl border border-forest/8 p-6 sticky top-6">
            <QuotePreview
              quote={quote}
              backgroundUrl={backgroundUrl}
              aspectRatio={aspectRatio}
              textColor={textColor}
              textPosition={textPosition}
              authorName={authorName}
              onExport={handleExport}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
