'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CSVUpload } from '@/components/admin/csv-upload'
import { CSVMapper } from '@/components/admin/csv-mapper'
import { Button } from '@/components/ui/button'
import type { CSVImportResult } from '@/types/admin'

type Step = 'upload' | 'map' | 'importing' | 'results'

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

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/gestion-mon-remede-oum/clients"
          className="text-sm text-ink-soft hover:text-forest mb-2 inline-flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
          Retour aux clientes
        </Link>
        <h1 className="font-display text-2xl text-forest">Importer des clientes</h1>
        <p className="font-accent text-ink-soft mt-1">
          Importez vos clientes depuis un fichier CSV
        </p>
      </div>

      {/* Steps indicator */}
      <div className="flex items-center gap-4">
        {['Upload', 'Mapping', 'Import', 'Resultats'].map((label, index) => {
          const stepIndex = ['upload', 'map', 'importing', 'results'].indexOf(step)
          const isActive = index === stepIndex
          const isComplete = index < stepIndex

          return (
            <div key={label} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  isActive
                    ? 'bg-gold text-forest-deep'
                    : isComplete
                    ? 'bg-sage text-white'
                    : 'bg-forest/10 text-ink-soft'
                }`}
              >
                {isComplete ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              <span className={isActive ? 'text-forest' : 'text-ink-soft'}>
                {label}
              </span>
              {index < 3 && (
                <div className="w-8 h-px bg-forest/20 ml-2" />
              )}
            </div>
          )
        })}
      </div>

      {/* Content */}
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
        <div className="bg-white rounded-lg border border-forest/10 p-12 text-center">
          <div className="animate-spin w-12 h-12 border-4 border-gold border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-forest font-medium">Import en cours...</p>
          <p className="text-sm text-ink-soft mt-1">
            Cela peut prendre quelques instants
          </p>
        </div>
      )}

      {step === 'results' && result && (
        <div className="space-y-6">
          {/* Summary */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-sage/10 rounded-lg p-6 text-center">
              <p className="text-3xl font-display text-sage">{result.success}</p>
              <p className="text-sm text-forest mt-1">
                cliente{result.success > 1 ? 's' : ''} importee{result.success > 1 ? 's' : ''}
              </p>
            </div>
            <div className={`rounded-lg p-6 text-center ${result.failed > 0 ? 'bg-blush/20' : 'bg-forest/5'}`}>
              <p className={`text-3xl font-display ${result.failed > 0 ? 'text-blush-deep' : 'text-forest'}`}>
                {result.failed}
              </p>
              <p className="text-sm text-forest mt-1">
                erreur{result.failed > 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {/* Errors */}
          {result.errors.length > 0 && (
            <div className="bg-white rounded-lg border border-forest/10 p-6">
              <h3 className="font-display text-lg text-forest mb-4">
                Detail des erreurs
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {result.errors.map((error, index) => (
                  <div
                    key={index}
                    className="bg-blush/10 rounded px-4 py-2 text-sm"
                  >
                    <span className="font-medium">Ligne {error.row}:</span>{' '}
                    <span className="text-ink-soft">{error.error}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4">
            <Button variant="ghost" onClick={handleReset} className="flex-1">
              Nouvel import
            </Button>
            <Link href="/gestion-mon-remede-oum/clients" className="flex-1">
              <Button className="w-full">
                Voir les clientes
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
