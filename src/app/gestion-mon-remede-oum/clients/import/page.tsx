'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CSVUpload } from '@/components/admin/csv-upload'
import { CSVMapper } from '@/components/admin/csv-mapper'
import type { CSVImportResult } from '@/types/admin'

type Step = 'upload' | 'map' | 'importing' | 'results'

const steps = [
  { key: 'upload', label: 'Fichier', icon: '📁' },
  { key: 'map', label: 'Mapping', icon: '🔗' },
  { key: 'importing', label: 'Import', icon: '⚡' },
  { key: 'results', label: 'Résultats', icon: '✓' },
]

export default function ImportPage() {
  const [step, setStep] = useState<Step>('upload')
  const [csvData, setCSVData] = useState<{
    headers: string[]
    rows: Record<string, string>[]
  } | null>(null)
  const [result, setResult] = useState<CSVImportResult | null>(null)

  const handleUpload = (data: { headers: string[]; rows: Record<string, string>[] }) => {
    setCSVData(data)
    setStep('map')
  }

  const handleMap = async (mapping: Record<string, string>) => {
    if (!csvData) return

    setStep('importing')

    try {
      const response = await fetch('/api/gestion-mon-remede-oum/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rows: csvData.rows,
          mapping,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'import')
      }

      setResult(data)
      setStep('results')
    } catch (error) {
      console.error('Import error:', error)
      setResult({
        success: 0,
        failed: csvData.rows.length,
        errors: [{
          row: 0,
          error: error instanceof Error ? error.message : 'Erreur lors de l\'import',
        }],
      })
      setStep('results')
    }
  }

  const handleReset = () => {
    setStep('upload')
    setCSVData(null)
    setResult(null)
  }

  const stepIndex = steps.findIndex(s => s.key === step)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/gestion-mon-remede-oum/clients"
            className="group w-10 h-10 rounded-xl bg-forest/5 hover:bg-forest/10 flex items-center justify-center transition-all"
          >
            <svg className="w-5 h-5 text-forest group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sage/20 to-sage/5 border border-sage/20 flex items-center justify-center">
            <svg className="w-6 h-6 text-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          </div>
          <div>
            <p className="font-accent text-xs text-ink-soft/60 uppercase tracking-[0.15em]">
              Gestion clientèle
            </p>
            <h1 className="font-display text-2xl text-forest">Import CSV</h1>
          </div>
        </div>

        {csvData && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cream-warm/50 border border-forest/5">
            <svg className="w-4 h-4 text-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="font-accent text-xs text-forest uppercase tracking-wider">
              {csvData.rows.length} lignes détectées
            </span>
          </div>
        )}
      </div>

      {/* Steps indicator */}
      <div className="admin-card p-4">
        <div className="flex items-center justify-between">
          {steps.map((s, index) => {
            const isActive = index === stepIndex
            const isComplete = index < stepIndex

            return (
              <div key={s.key} className="flex items-center flex-1">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm transition-all ${
                      isActive
                        ? 'bg-gradient-to-br from-gold to-gold-light text-forest-deep shadow-md'
                        : isComplete
                        ? 'bg-sage text-cream'
                        : 'bg-forest/5 text-ink-soft/50'
                    }`}
                  >
                    {isComplete ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span className="text-base">{s.icon}</span>
                    )}
                  </div>
                  <div className="hidden sm:block">
                    <p className={`font-accent text-xs uppercase tracking-wider ${
                      isActive ? 'text-forest' : isComplete ? 'text-sage' : 'text-ink-soft/50'
                    }`}>
                      {s.label}
                    </p>
                    <p className="font-body text-[10px] text-ink-soft/40 mt-0.5">
                      Étape {index + 1}
                    </p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className="flex-1 mx-4">
                    <div className={`h-0.5 rounded-full transition-all ${
                      index < stepIndex ? 'bg-sage' : 'bg-forest/10'
                    }`} />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Content */}
      <div className="animate-fade-up">
        {step === 'upload' && (
          <CSVUpload onUpload={handleUpload} />
        )}

        {step === 'map' && csvData && (
          <CSVMapper
            headers={csvData.headers}
            rows={csvData.rows}
            onMap={handleMap}
            onBack={() => setStep('upload')}
          />
        )}

        {step === 'importing' && (
          <div className="admin-card p-12">
            <div className="flex flex-col items-center gap-6">
              <div className="relative w-20 h-20">
                {/* Outer ring */}
                <div className="absolute inset-0 rounded-full border-4 border-gold/20" />
                {/* Spinning arc */}
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-gold animate-spin" />
                {/* Inner icon */}
                <div className="absolute inset-4 rounded-full bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center">
                  <svg className="w-6 h-6 text-gold animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                </div>
              </div>
              <div className="text-center">
                <p className="font-display text-lg text-forest">Import en cours...</p>
                <p className="font-body text-sm text-ink-soft/60 mt-1">
                  Création des fiches clientes
                </p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cream-warm/50 border border-forest/5">
                <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                <span className="font-accent text-xs text-ink-soft/60 uppercase tracking-wider">
                  {csvData?.rows.length || 0} clientes à importer
                </span>
              </div>
            </div>
          </div>
        )}

        {step === 'results' && result && (
          <div className="space-y-6 stagger-fade">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="admin-card p-6 border-sage/20">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sage/20 to-sage/5 border border-sage/20 flex items-center justify-center">
                    <svg className="w-7 h-7 text-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-display text-3xl text-sage tabular-nums">{result.success}</p>
                    <p className="font-accent text-xs text-ink-soft/60 uppercase tracking-wider mt-0.5">
                      cliente{result.success > 1 ? 's' : ''} importée{result.success > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </div>

              <div className={`admin-card p-6 ${result.failed > 0 ? 'border-blush-deep/20' : 'border-forest/5'}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                    result.failed > 0
                      ? 'bg-gradient-to-br from-blush/20 to-blush/5 border border-blush-deep/20'
                      : 'bg-gradient-to-br from-forest/10 to-forest/5 border border-forest/10'
                  }`}>
                    {result.failed > 0 ? (
                      <svg className="w-7 h-7 text-blush-deep" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    ) : (
                      <svg className="w-7 h-7 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className={`font-display text-3xl tabular-nums ${
                      result.failed > 0 ? 'text-blush-deep' : 'text-forest'
                    }`}>{result.failed}</p>
                    <p className="font-accent text-xs text-ink-soft/60 uppercase tracking-wider mt-0.5">
                      erreur{result.failed > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Success Message */}
            {result.success > 0 && result.failed === 0 && (
              <div className="admin-card border-sage/20 bg-gradient-to-r from-sage/10 to-sage/5 p-5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-sage/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-display text-sm text-forest">Import réussi !</p>
                    <p className="font-body text-sm text-sage mt-0.5">
                      Toutes les clientes ont été importées avec succès.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Errors */}
            {result.errors.length > 0 && (
              <div className="admin-card p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blush/20 to-blush/5 border border-blush-deep/20 flex items-center justify-center">
                    <svg className="w-4 h-4 text-blush-deep" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <h3 className="font-display text-lg text-forest">Détail des erreurs</h3>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                  {result.errors.map((error, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 bg-blush/10 rounded-xl px-4 py-3"
                    >
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blush-deep/20 text-blush-deep font-accent text-xs flex-shrink-0">
                        {error.row}
                      </span>
                      <p className="font-body text-sm text-ink-soft">
                        {error.error}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleReset}
                className="flex-1 px-6 py-3.5 rounded-xl font-accent text-xs uppercase tracking-wider bg-forest/5 text-forest hover:bg-forest/10 transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Nouvel import
              </button>
              <Link
                href="/gestion-mon-remede-oum/clients"
                className="flex-1 group relative px-6 py-3.5 rounded-xl font-accent text-xs uppercase tracking-wider overflow-hidden transition-all text-center"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-gold via-gold-light to-gold bg-[length:200%_100%] group-hover:bg-[position:100%_0] transition-all duration-500" />
                <span className="relative flex items-center justify-center gap-2 text-forest-deep">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Voir les clientes
                </span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
