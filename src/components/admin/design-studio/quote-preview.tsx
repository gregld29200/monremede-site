'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { cn } from '@/lib/utils'
import type { AspectRatio } from '@/types/design-studio'
import { BRAND_KIT } from '@/types/design-studio'

interface QuotePreviewProps {
  quote: string
  backgroundUrl: string | null
  aspectRatio: AspectRatio
  textColor?: 'light' | 'dark'
  textPosition?: 'center' | 'bottom'
  authorName?: string
  onExport?: (dataUrl: string) => void
}

// Aspect ratio dimensions for canvas
const ASPECT_DIMENSIONS: Record<AspectRatio, { width: number; height: number }> = {
  '1:1': { width: 1080, height: 1080 },
  '9:16': { width: 1080, height: 1920 },
  '16:9': { width: 1920, height: 1080 },
  '4:5': { width: 1080, height: 1350 },
  '2:3': { width: 1080, height: 1620 },
  '3:2': { width: 1620, height: 1080 },
}

// Preview container dimensions (scaled down for display)
const PREVIEW_MAX_WIDTH = 400
const PREVIEW_MAX_HEIGHT = 500

export function QuotePreview({
  quote,
  backgroundUrl,
  aspectRatio,
  textColor = 'light',
  textPosition = 'center',
  authorName = 'Mon Remède',
  onExport,
}: QuotePreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isExporting, setIsExporting] = useState(false)
  const [previewScale, setPreviewScale] = useState(1)

  const dimensions = ASPECT_DIMENSIONS[aspectRatio]

  // Calculate preview scale
  useEffect(() => {
    const scaleX = PREVIEW_MAX_WIDTH / dimensions.width
    const scaleY = PREVIEW_MAX_HEIGHT / dimensions.height
    setPreviewScale(Math.min(scaleX, scaleY))
  }, [dimensions])

  // Render the quote on canvas
  const renderCanvas = useCallback(async () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    canvas.width = dimensions.width
    canvas.height = dimensions.height

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw background
    if (backgroundUrl) {
      try {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve()
          img.onerror = reject
          img.src = backgroundUrl
        })

        // Cover the canvas while maintaining aspect ratio
        const imgAspect = img.width / img.height
        const canvasAspect = canvas.width / canvas.height

        let drawWidth, drawHeight, drawX, drawY

        if (imgAspect > canvasAspect) {
          drawHeight = canvas.height
          drawWidth = img.width * (canvas.height / img.height)
          drawX = (canvas.width - drawWidth) / 2
          drawY = 0
        } else {
          drawWidth = canvas.width
          drawHeight = img.height * (canvas.width / img.width)
          drawX = 0
          drawY = (canvas.height - drawHeight) / 2
        }

        ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight)
      } catch (error) {
        console.error('Error loading background image:', error)
        // Draw fallback gradient
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
        gradient.addColorStop(0, BRAND_KIT.colors.forest)
        gradient.addColorStop(1, BRAND_KIT.colors.forestDeep)
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }
    } else {
      // Draw default gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      gradient.addColorStop(0, BRAND_KIT.colors.forest)
      gradient.addColorStop(1, BRAND_KIT.colors.forestDeep)
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    // Add subtle overlay for better text readability
    ctx.fillStyle = textColor === 'light' ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.4)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Calculate text area
    const padding = Math.min(canvas.width, canvas.height) * 0.08
    const maxTextWidth = canvas.width - padding * 2

    // Set text styles
    const fontSize = Math.min(canvas.width, canvas.height) * 0.065
    ctx.font = `italic ${fontSize}px "Playfair Display", Georgia, serif`
    ctx.textAlign = 'center'
    ctx.fillStyle = textColor === 'light' ? '#FFFFFF' : BRAND_KIT.colors.forestDeep

    // Add text shadow for readability
    ctx.shadowColor = textColor === 'light' ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.5)'
    ctx.shadowBlur = 10
    ctx.shadowOffsetX = 2
    ctx.shadowOffsetY = 2

    // Word wrap the quote
    const words = quote.split(' ')
    const lines: string[] = []
    let currentLine = ''

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word
      const metrics = ctx.measureText(testLine)

      if (metrics.width > maxTextWidth && currentLine) {
        lines.push(currentLine)
        currentLine = word
      } else {
        currentLine = testLine
      }
    }
    if (currentLine) {
      lines.push(currentLine)
    }

    // Calculate text position
    const lineHeight = fontSize * 1.4
    const totalTextHeight = lines.length * lineHeight

    let startY: number
    if (textPosition === 'center') {
      startY = (canvas.height - totalTextHeight) / 2 + fontSize
    } else {
      startY = canvas.height - padding - totalTextHeight + fontSize - 60
    }

    // Draw quote marks
    const quoteMarkSize = fontSize * 1.5
    ctx.font = `${quoteMarkSize}px "Playfair Display", Georgia, serif`
    ctx.globalAlpha = 0.3
    ctx.fillText('"', canvas.width / 2, startY - fontSize * 0.5)
    ctx.globalAlpha = 1

    // Draw the quote lines
    ctx.font = `italic ${fontSize}px "Playfair Display", Georgia, serif`
    lines.forEach((line, index) => {
      ctx.fillText(line, canvas.width / 2, startY + index * lineHeight)
    })

    // Draw author attribution
    ctx.shadowBlur = 5
    const authorSize = fontSize * 0.5
    ctx.font = `${authorSize}px "Cormorant Garamond", Georgia, serif`
    ctx.globalAlpha = 0.8
    ctx.fillText(`— ${authorName}`, canvas.width / 2, startY + totalTextHeight + authorSize * 1.5)
    ctx.globalAlpha = 1

    // Reset shadow
    ctx.shadowColor = 'transparent'
    ctx.shadowBlur = 0
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 0

  }, [quote, backgroundUrl, dimensions, textColor, textPosition, authorName])

  // Render on changes
  useEffect(() => {
    renderCanvas()
  }, [renderCanvas])

  const handleExport = async () => {
    const canvas = canvasRef.current
    if (!canvas) return

    setIsExporting(true)

    try {
      // Ensure canvas is rendered at full resolution
      await renderCanvas()

      const dataUrl = canvas.toDataURL('image/png', 1.0)

      if (onExport) {
        onExport(dataUrl)
      } else {
        // Default: download
        const link = document.createElement('a')
        link.download = `citation-${Date.now()}.png`
        link.href = dataUrl
        link.click()
      }
    } finally {
      setIsExporting(false)
    }
  }

  const previewWidth = dimensions.width * previewScale
  const previewHeight = dimensions.height * previewScale

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-forest/20 to-forest/5 flex items-center justify-center">
          <svg className="w-4 h-4 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <div>
          <h3 className="font-display text-base text-forest font-medium tracking-tight">
            Aperçu
          </h3>
          <p className="font-body text-xs text-ink-soft/60">
            Rendu en temps réel
          </p>
        </div>
      </div>

      {/* Canvas preview */}
      <div
        className="relative bg-gradient-to-br from-forest/5 to-forest/10 rounded-2xl p-4 flex items-center justify-center overflow-hidden"
        style={{ minHeight: previewHeight + 32 }}
      >
        {/* Checkered background to show transparency */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(45deg, #000 25%, transparent 25%),
                              linear-gradient(-45deg, #000 25%, transparent 25%),
                              linear-gradient(45deg, transparent 75%, #000 75%),
                              linear-gradient(-45deg, transparent 75%, #000 75%)`,
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
          }}
        />

        <canvas
          ref={canvasRef}
          className="rounded-xl shadow-xl relative z-10"
          style={{
            width: previewWidth,
            height: previewHeight,
          }}
        />

        {/* Empty state overlay */}
        {!quote && (
          <div className="absolute inset-0 flex items-center justify-center z-20 bg-cream/80 rounded-2xl backdrop-blur-sm">
            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-forest/10 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-forest/40" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                </svg>
              </div>
              <p className="font-body text-sm text-forest/60">
                Entrez une citation pour voir l&apos;aperçu
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Export button */}
      <button
        onClick={handleExport}
        disabled={!quote || isExporting}
        className={cn(
          'group relative w-full px-6 py-4 rounded-2xl font-body text-base transition-all duration-300 overflow-hidden',
          'bg-gradient-to-r from-gold to-gold/90 text-white',
          'hover:shadow-xl hover:shadow-gold/25 hover:-translate-y-0.5',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none',
          'flex items-center justify-center gap-3'
        )}
      >
        <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        {isExporting ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span className="relative">Export en cours...</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5 relative" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            <span className="relative">Télécharger l&apos;image</span>
          </>
        )}
      </button>
    </div>
  )
}
