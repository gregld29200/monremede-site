'use client'

import { useState, useRef } from 'react'

interface CSVUploadProps {
  onUpload: (data: { headers: string[]; rows: Record<string, string>[] }) => void
}

export function CSVUpload({ onUpload }: CSVUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const parseCSV = (text: string) => {
    const lines = text.split(/\r?\n/).filter((line) => line.trim())
    if (lines.length < 2) {
      throw new Error('Le fichier doit contenir au moins un en-tête et une ligne de données')
    }

    // Parse header
    const headers = parseCSVLine(lines[0])

    // Parse rows
    const rows: Record<string, string>[] = []
    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i])
      const row: Record<string, string> = {}
      headers.forEach((header, index) => {
        row[header] = values[index] || ''
      })
      rows.push(row)
    }

    return { headers, rows }
  }

  const parseCSVLine = (line: string): string[] => {
    const result: string[] = []
    let current = ''
    let inQuotes = false

    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      const nextChar = line[i + 1]

      if (char === '"' && inQuotes && nextChar === '"') {
        current += '"'
        i++
      } else if (char === '"') {
        inQuotes = !inQuotes
      } else if ((char === ',' || char === ';') && !inQuotes) {
        result.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }
    result.push(current.trim())

    return result
  }

  const handleFile = async (file: File) => {
    setError('')

    if (!file.name.endsWith('.csv')) {
      setError('Veuillez sélectionner un fichier CSV')
      return
    }

    try {
      const text = await file.text()
      const data = parseCSV(text)
      onUpload(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la lecture du fichier')
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file) {
      handleFile(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFile(file)
    }
  }

  return (
    <div className="space-y-5">
      {/* Upload Zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`admin-card border-2 border-dashed p-12 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-gold bg-gold/5 shadow-lg'
            : 'border-forest/15 hover:border-gold/40 hover:bg-cream-warm/30'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          onChange={handleChange}
          className="hidden"
        />

        <div className={`w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-6 transition-all ${
          isDragging
            ? 'bg-gradient-to-br from-gold/30 to-gold/10 border-2 border-gold/30'
            : 'bg-gradient-to-br from-forest/10 to-forest/5 border border-forest/10'
        }`}>
          <svg
            className={`w-10 h-10 transition-colors ${isDragging ? 'text-gold' : 'text-forest/50'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
        </div>

        <p className="font-display text-lg text-forest mb-2">
          Glissez-déposez votre fichier CSV ici
        </p>
        <p className="font-body text-sm text-ink-soft/60 mb-6">
          ou cliquez pour sélectionner un fichier
        </p>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-forest/5 text-forest">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="font-accent text-xs uppercase tracking-wider">
            Formats acceptés: .csv
          </span>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="admin-card border-blush-deep/30 bg-gradient-to-r from-blush/20 to-blush/5 p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blush-deep/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-blush-deep" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="font-body text-sm text-blush-deep">{error}</p>
          </div>
        </div>
      )}

      {/* Help Card */}
      <div className="admin-card p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sage/15 to-sage/5 border border-sage/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="font-display text-sm text-forest">Format attendu</h3>
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gold/20 text-gold font-accent text-[10px] flex-shrink-0 mt-0.5">
              !
            </span>
            <div>
              <p className="font-accent text-xs text-forest uppercase tracking-wider mb-1">Colonnes obligatoires</p>
              <p className="font-body text-sm text-ink-soft/70">Prénom, Nom, Email</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-sage/20 text-sage font-accent text-[10px] flex-shrink-0 mt-0.5">
              +
            </span>
            <div>
              <p className="font-accent text-xs text-forest uppercase tracking-wider mb-1">Colonnes optionnelles</p>
              <p className="font-body text-sm text-ink-soft/70">
                Téléphone, Date de naissance, Ville, Code postal, Pays, Type de consultation, Notes
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-forest/5">
          <p className="font-body text-xs text-ink-soft/50">
            Les colonnes seront automatiquement détectées lors de l&apos;étape de mapping.
          </p>
        </div>
      </div>
    </div>
  )
}
