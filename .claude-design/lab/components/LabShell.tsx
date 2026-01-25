'use client'

import { useState } from 'react'

interface LabShellProps {
  children: React.ReactNode[]
  variants: {
    id: string
    name: string
    description: string
  }[]
}

export function LabShell({ children, variants }: LabShellProps) {
  const [activeVariant, setActiveVariant] = useState(0)
  const [viewMode, setViewMode] = useState<'single' | 'grid'>('single')

  return (
    <div className="min-h-screen bg-neutral-900">
      {/* Header fixe */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-neutral-900/95 backdrop-blur-sm border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Titre */}
            <div>
              <h1 className="text-white font-semibold">Design Lab</h1>
              <p className="text-neutral-400 text-sm">Landing Page Cadeaux Ramadan</p>
            </div>

            {/* Contrôles */}
            <div className="flex items-center gap-4">
              {/* Toggle view mode */}
              <div className="flex bg-neutral-800 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('single')}
                  className={`px-3 py-1.5 rounded text-sm transition-colors ${
                    viewMode === 'single'
                      ? 'bg-neutral-700 text-white'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Single
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1.5 rounded text-sm transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-neutral-700 text-white'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Grid
                </button>
              </div>

              {/* Info */}
              <span className="text-neutral-500 text-sm">
                {variants.length} variations
              </span>
            </div>
          </div>

          {/* Tabs des variants (en mode single) */}
          {viewMode === 'single' && (
            <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
              {variants.map((variant, index) => (
                <button
                  key={variant.id}
                  onClick={() => setActiveVariant(index)}
                  className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm transition-all ${
                    activeVariant === index
                      ? 'bg-amber-500 text-neutral-900 font-medium'
                      : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                  }`}
                >
                  <span className="font-mono mr-2">{variant.id}</span>
                  {variant.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Contenu */}
      <main className={viewMode === 'single' ? 'pt-32' : 'pt-20'}>
        {viewMode === 'single' ? (
          // Vue single
          <div>
            {/* Description du variant actif */}
            <div className="max-w-7xl mx-auto px-4 py-4">
              <div className="bg-neutral-800/50 rounded-lg p-4 mb-4">
                <p className="text-amber-400 font-mono text-sm mb-1">
                  Variant {variants[activeVariant].id}: {variants[activeVariant].name}
                </p>
                <p className="text-neutral-300 text-sm">
                  {variants[activeVariant].description}
                </p>
              </div>
            </div>

            {/* Iframe du variant */}
            <div className="bg-white min-h-screen">
              {children[activeVariant]}
            </div>
          </div>
        ) : (
          // Vue grid
          <div className="p-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {variants.map((variant, index) => (
                <div key={variant.id} className="bg-neutral-800 rounded-xl overflow-hidden">
                  {/* Header de la carte */}
                  <div className="p-4 border-b border-neutral-700">
                    <p className="text-amber-400 font-mono text-sm mb-1">
                      {variant.id}: {variant.name}
                    </p>
                    <p className="text-neutral-400 text-xs line-clamp-2">
                      {variant.description}
                    </p>
                  </div>

                  {/* Preview (scrollable) */}
                  <div
                    className="h-[500px] overflow-y-auto bg-white cursor-pointer"
                    onClick={() => {
                      setActiveVariant(index)
                      setViewMode('single')
                    }}
                  >
                    <div className="transform scale-[0.5] origin-top-left w-[200%]">
                      {children[index]}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="p-3 bg-neutral-900">
                    <button
                      onClick={() => {
                        setActiveVariant(index)
                        setViewMode('single')
                      }}
                      className="w-full py-2 bg-amber-500 text-neutral-900 font-medium rounded-lg text-sm hover:bg-amber-400 transition-colors"
                    >
                      Voir en plein écran
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
