'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'

interface CSVMapperProps {
  headers: string[]
  rows: Record<string, string>[]
  onMap: (mapping: Record<string, string>) => void
  onBack: () => void
}

const fieldConfig = [
  { key: 'firstName', label: 'Prenom', required: true },
  { key: 'lastName', label: 'Nom', required: true },
  { key: 'email', label: 'Email', required: true },
  { key: 'phone', label: 'Telephone', required: false },
  { key: 'birthDate', label: 'Date de naissance', required: false },
  { key: 'city', label: 'Ville', required: false },
  { key: 'postalCode', label: 'Code postal', required: false },
  { key: 'country', label: 'Pays', required: false },
  { key: 'consultationType', label: 'Type de consultation', required: false },
  { key: 'notes', label: 'Notes', required: false },
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

  const handleSubmit = () => {
    // Check required fields
    const missingRequired = fieldConfig
      .filter((f) => f.required && !mapping[f.key])
      .map((f) => f.label)

    if (missingRequired.length > 0) {
      alert(`Veuillez mapper les champs obligatoires: ${missingRequired.join(', ')}`)
      return
    }

    onMap(mapping)
  }

  // Preview first 3 rows
  const previewRows = rows.slice(0, 3)

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-forest/10 p-6">
        <h3 className="font-display text-lg text-forest mb-4">
          Mapping des colonnes
        </h3>
        <p className="text-sm text-ink-soft mb-6">
          Associez les colonnes de votre fichier CSV aux champs de la fiche cliente.
          Les champs marques * sont obligatoires.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fieldConfig.map((field) => (
            <div key={field.key}>
              <label className="block text-sm font-medium text-forest mb-2">
                {field.label} {field.required && <span className="text-blush-deep">*</span>}
              </label>
              <select
                value={mapping[field.key] || ''}
                onChange={(e) =>
                  setMapping({ ...mapping, [field.key]: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-forest/20 rounded-lg bg-white text-forest focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
              >
                <option value="">Ne pas importer</option>
                {headers.map((header) => (
                  <option key={header} value={header}>
                    {header}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div className="bg-white rounded-lg border border-forest/10 p-6">
        <h3 className="font-display text-lg text-forest mb-4">
          Apercu des donnees ({rows.length} ligne{rows.length > 1 ? 's' : ''})
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-forest/10">
                {headers.map((header) => (
                  <th
                    key={header}
                    className="text-left px-4 py-2 font-medium text-ink-soft"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {previewRows.map((row, index) => (
                <tr key={index} className="border-b border-forest/5">
                  {headers.map((header) => (
                    <td key={header} className="px-4 py-2 text-forest">
                      {row[header] || '-'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {rows.length > 3 && (
          <p className="text-sm text-ink-soft mt-2">
            Et {rows.length - 3} ligne{rows.length - 3 > 1 ? 's' : ''} de plus...
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <Button variant="ghost" onClick={onBack} className="flex-1">
          Retour
        </Button>
        <Button onClick={handleSubmit} className="flex-1">
          Importer {rows.length} cliente{rows.length > 1 ? 's' : ''}
        </Button>
      </div>
    </div>
  )
}
