'use client'

import { useState, useMemo } from 'react'

interface CSVMapperProps {
  headers: string[]
  rows: Record<string, string>[]
  onMap: (mapping: Record<string, string>) => void
  onBack: () => void
}

const fieldConfig = [
  { key: 'firstName', label: 'Prénom', required: true, icon: '👤' },
  { key: 'lastName', label: 'Nom', required: true, icon: '👤' },
  { key: 'email', label: 'Email', required: true, icon: '✉️' },
  { key: 'phone', label: 'Téléphone', required: false, icon: '📞' },
  { key: 'birthDate', label: 'Date de naissance', required: false, icon: '🎂' },
  { key: 'city', label: 'Ville', required: false, icon: '🏙️' },
  { key: 'postalCode', label: 'Code postal', required: false, icon: '📍' },
  { key: 'country', label: 'Pays', required: false, icon: '🌍' },
  { key: 'consultationType', label: 'Type de consultation', required: false, icon: '📋' },
  { key: 'notes', label: 'Notes', required: false, icon: '📝' },
]

// Auto-detect mapping based on header names
function getAutoMapping(headers: string[]): Record<string, string> {
  const autoMapping: Record<string, string> = {}
  const headerLower = headers.map((h) => h.toLowerCase())

  fieldConfig.forEach((field) => {
    const possibleNames: Record<string, string[]> = {
      firstName: ['prenom', 'prénom', 'firstname', 'first_name', 'first name'],
      lastName: ['nom', 'lastname', 'last_name', 'last name', 'name'],
      email: ['email', 'mail', 'e-mail', 'courriel'],
      phone: ['telephone', 'téléphone', 'tel', 'phone', 'mobile', 'portable'],
      birthDate: ['date de naissance', 'naissance', 'birth', 'birthdate', 'birth_date', 'date_naissance'],
      city: ['ville', 'city'],
      postalCode: ['code postal', 'cp', 'postal', 'postalcode', 'postal_code', 'zip'],
      country: ['pays', 'country'],
      consultationType: ['type', 'consultation', 'type de consultation', 'formule'],
      notes: ['notes', 'note', 'commentaire', 'commentaires', 'remarks'],
    }

    const names = possibleNames[field.key] || []
    const matchIndex = headerLower.findIndex((h) =>
      names.some((name) => h.includes(name))
    )
    if (matchIndex !== -1) {
      autoMapping[field.key] = headers[matchIndex]
    }
  })

  return autoMapping
}

export function CSVMapper({ headers, rows, onMap, onBack }: CSVMapperProps) {
  const initialMapping = useMemo(() => getAutoMapping(headers), [headers])
  const [mapping, setMapping] = useState<Record<string, string>>(initialMapping)
  const [showError, setShowError] = useState(false)

  const handleSubmit = () => {
    // Check required fields
    const missingRequired = fieldConfig
      .filter((f) => f.required && !mapping[f.key])
      .map((f) => f.label)

    if (missingRequired.length > 0) {
      setShowError(true)
      return
    }

    onMap(mapping)
  }

  // Count mapped fields
  const mappedCount = Object.values(mapping).filter(Boolean).length
  const requiredCount = fieldConfig.filter(f => f.required).length
  const mappedRequiredCount = fieldConfig.filter(f => f.required && mapping[f.key]).length

  // Preview first 3 rows
  const previewRows = rows.slice(0, 3)

  return (
    <div className="space-y-6 stagger-fade">
      {/* Mapping Card */}
      <div className="admin-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold/15 to-gold/5 border border-gold/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <div>
              <h3 className="font-display text-lg text-forest">Mapping des colonnes</h3>
              <p className="font-body text-xs text-ink-soft/60 mt-0.5">
                Associez les colonnes de votre fichier aux champs clients
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cream-warm/50 border border-forest/5">
            <span className={`font-accent text-xs uppercase tracking-wider ${
              mappedRequiredCount === requiredCount ? 'text-sage' : 'text-gold'
            }`}>
              {mappedCount}/{fieldConfig.length} mappés
            </span>
          </div>
        </div>

        {/* Error Alert */}
        {showError && mappedRequiredCount < requiredCount && (
          <div className="mb-6 admin-card border-blush-deep/30 bg-gradient-to-r from-blush/20 to-blush/5 p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blush-deep/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-blush-deep" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <p className="font-body text-sm text-blush-deep">
                Veuillez mapper tous les champs obligatoires (marqués *)
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fieldConfig.map((field) => {
            const isMapped = !!mapping[field.key]

            return (
              <div key={field.key} className="space-y-2">
                <label className="flex items-center gap-2">
                  <span className="text-base">{field.icon}</span>
                  <span className="font-accent text-xs text-ink-soft/70 uppercase tracking-wider">
                    {field.label}
                  </span>
                  {field.required && <span className="text-blush-deep text-xs">*</span>}
                  {isMapped && (
                    <svg className="w-3.5 h-3.5 text-sage ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </label>
                <div className="relative">
                  <select
                    value={mapping[field.key] || ''}
                    onChange={(e) => {
                      setMapping({ ...mapping, [field.key]: e.target.value })
                      setShowError(false)
                    }}
                    className={`admin-input admin-select pr-10 ${
                      isMapped
                        ? 'border-sage/30 bg-sage/5'
                        : field.required && showError
                        ? 'border-blush-deep/50 bg-blush/10'
                        : ''
                    }`}
                  >
                    <option value="">Ne pas importer</option>
                    {headers.map((header) => (
                      <option key={header} value={header}>
                        {header}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Preview Card */}
      <div className="admin-card p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sage/15 to-sage/5 border border-sage/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <div>
              <h3 className="font-display text-lg text-forest">Aperçu des données</h3>
              <p className="font-body text-xs text-ink-soft/60 mt-0.5">
                {rows.length} ligne{rows.length > 1 ? 's' : ''} détectée{rows.length > 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto -mx-6 px-6">
          <table className="admin-table">
            <thead>
              <tr>
                {headers.map((header) => (
                  <th key={header}>
                    <div className="flex items-center gap-2">
                      {header}
                      {Object.entries(mapping).some(([, v]) => v === header) && (
                        <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-sage/20">
                          <svg className="w-2.5 h-2.5 text-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {previewRows.map((row, index) => (
                <tr key={index}>
                  {headers.map((header) => (
                    <td key={header}>
                      <span className="font-body text-sm text-forest">
                        {row[header] || <span className="text-ink-soft/40">-</span>}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {rows.length > 3 && (
          <div className="mt-4 pt-4 border-t border-forest/5 text-center">
            <span className="font-accent text-xs text-ink-soft/50 uppercase tracking-wider">
              + {rows.length - 3} ligne{rows.length - 3 > 1 ? 's' : ''} supplémentaire{rows.length - 3 > 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onBack}
          className="flex-1 px-6 py-3.5 rounded-xl font-accent text-xs uppercase tracking-wider bg-forest/5 text-forest hover:bg-forest/10 transition-all flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
          Retour
        </button>
        <button
          onClick={handleSubmit}
          className="flex-1 group relative px-6 py-3.5 rounded-xl font-accent text-xs uppercase tracking-wider overflow-hidden transition-all"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-gold via-gold-light to-gold bg-[length:200%_100%] group-hover:bg-[position:100%_0] transition-all duration-500" />
          <span className="relative flex items-center justify-center gap-2 text-forest-deep">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Importer {rows.length} cliente{rows.length > 1 ? 's' : ''}
          </span>
        </button>
      </div>
    </div>
  )
}
