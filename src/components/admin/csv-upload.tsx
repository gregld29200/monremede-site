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
      throw new Error('Le fichier doit contenir au moins un en-tete et une ligne de donnees')
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
      setError('Veuillez selectionner un fichier CSV')
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
    <div className="space-y-4">
      <div
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
          isDragging
            ? 'border-gold bg-gold/5'
            : 'border-forest/20 hover:border-gold/50 hover:bg-cream-warm/50'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          onChange={handleChange}
          className="hidden"
        />
        <svg
          className="w-12 h-12 mx-auto text-ink-soft mb-4"
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
        <p className="text-forest font-medium mb-1">
          Glissez-deposez votre fichier CSV ici
        </p>
        <p className="text-sm text-ink-soft">
          ou cliquez pour selectionner un fichier
        </p>
      </div>

      {error && (
        <div className="bg-blush/30 border border-blush-deep/50 text-forest px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="bg-cream-warm/50 rounded-lg p-4">
        <p className="text-sm font-medium text-forest mb-2">Format attendu</p>
        <p className="text-sm text-ink-soft">
          Le fichier CSV doit contenir au minimum les colonnes: Prenom, Nom, Email.
          Colonnes optionnelles: Telephone, Date de naissance, Ville, Code postal, Pays, Type de consultation, Notes.
        </p>
      </div>
    </div>
  )
}
