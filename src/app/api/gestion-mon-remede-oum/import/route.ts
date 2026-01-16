import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'
import { writeClient } from '@/sanity/lib/writeClient'
import type { CSVImportResult } from '@/types/admin'

interface ImportRow {
  firstName: string
  lastName: string
  email: string
  phone?: string
  birthDate?: string
  city?: string
  postalCode?: string
  country?: string
  consultationType?: string
  notes?: string
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { rows, mapping } = body as {
      rows: Record<string, string>[]
      mapping: Record<string, string>
    }

    if (!rows || !Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json(
        { error: 'Aucune donnee a importer' },
        { status: 400 }
      )
    }

    // Map CSV columns to our fields
    const mappedRows: ImportRow[] = rows.map((row) => ({
      firstName: row[mapping.firstName] || '',
      lastName: row[mapping.lastName] || '',
      email: row[mapping.email] || '',
      phone: mapping.phone ? row[mapping.phone] : undefined,
      birthDate: mapping.birthDate ? row[mapping.birthDate] : undefined,
      city: mapping.city ? row[mapping.city] : undefined,
      postalCode: mapping.postalCode ? row[mapping.postalCode] : undefined,
      country: mapping.country ? row[mapping.country] : undefined,
      consultationType: mapping.consultationType ? row[mapping.consultationType] : undefined,
      notes: mapping.notes ? row[mapping.notes] : undefined,
    }))

    // Get existing emails to check for duplicates
    const existingEmails = await client.fetch<string[]>(
      `*[_type == "client"].email`
    )
    const existingEmailSet = new Set(existingEmails.map((e) => e?.toLowerCase()))

    const result: CSVImportResult = {
      success: 0,
      failed: 0,
      errors: [],
    }

    // Process each row
    for (let i = 0; i < mappedRows.length; i++) {
      const row = mappedRows[i]
      const rowNumber = i + 2 // +2 because row 1 is header

      // Validate required fields
      if (!row.firstName || !row.lastName || !row.email) {
        result.failed++
        result.errors.push({
          row: rowNumber,
          error: 'Prenom, nom et email sont requis',
        })
        continue
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(row.email)) {
        result.failed++
        result.errors.push({
          row: rowNumber,
          error: `Email invalide: ${row.email}`,
        })
        continue
      }

      // Check for duplicate
      if (existingEmailSet.has(row.email.toLowerCase())) {
        result.failed++
        result.errors.push({
          row: rowNumber,
          error: `Email deja existant: ${row.email}`,
        })
        continue
      }

      // Parse birth date if provided
      let birthDate: string | undefined
      if (row.birthDate) {
        const date = new Date(row.birthDate)
        if (!isNaN(date.getTime())) {
          birthDate = date.toISOString().split('T')[0]
        }
      }

      // Map consultation type
      let consultationType: string | undefined
      if (row.consultationType) {
        const typeMap: Record<string, string> = {
          'sante generale': 'sante-generale',
          'sante-generale': 'sante-generale',
          'general': 'sante-generale',
          'troubles digestifs': 'troubles-digestifs',
          'troubles-digestifs': 'troubles-digestifs',
          'digestif': 'troubles-digestifs',
          'equilibre hormonal': 'equilibre-hormonal',
          'equilibre-hormonal': 'equilibre-hormonal',
          'hormonal': 'equilibre-hormonal',
          'suivi complet': 'suivi-complet',
          'suivi-complet': 'suivi-complet',
          'complet': 'suivi-complet',
        }
        consultationType = typeMap[row.consultationType.toLowerCase()] || undefined
      }

      try {
        // Create the client
        await writeClient.create({
          _type: 'client',
          firstName: row.firstName.trim(),
          lastName: row.lastName.trim(),
          email: row.email.toLowerCase().trim(),
          phone: row.phone?.trim() || undefined,
          birthDate: birthDate,
          address: (row.city || row.postalCode || row.country)
            ? {
                city: row.city?.trim() || undefined,
                postalCode: row.postalCode?.trim() || undefined,
                country: row.country?.trim() || 'France',
              }
            : undefined,
          status: 'actif',
          source: 'import',
          consultationType: consultationType,
          internalNotes: row.notes?.trim() || undefined,
          createdAt: new Date().toISOString(),
        })

        result.success++
        existingEmailSet.add(row.email.toLowerCase())
      } catch (error) {
        result.failed++
        result.errors.push({
          row: rowNumber,
          error: `Erreur lors de la creation: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
        })
      }
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Import error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'import' },
      { status: 500 }
    )
  }
}
