'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { StatusBadge } from '@/components/admin/status-badge'
import { SearchInput } from '@/components/admin/search-input'
import type { Prospect } from '@/types/admin'

const statusFilters = [
  { value: 'all', label: 'Tous' },
  { value: 'nouveau', label: 'Nouveau' },
  { value: 'contacte', label: 'Contacte' },
  { value: 'discussion', label: 'En discussion' },
  { value: 'converti', label: 'Converti' },
  { value: 'non_interesse', label: 'Non interesse' },
]

export default function ProspectsPage() {
  const [prospects, setProspects] = useState<Prospect[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const fetchProspects = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (statusFilter !== 'all') params.set('status', statusFilter)

      const response = await fetch(`/api/gestion-mon-remede-oum/prospects?${params}`)
      const data = await response.json()
      setProspects(data.prospects || [])
      setTotal(data.total || 0)
    } catch (error) {
      console.error('Error fetching prospects:', error)
    } finally {
      setIsLoading(false)
    }
  }, [search, statusFilter])

  useEffect(() => {
    fetchProspects()
  }, [fetchProspects])

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-forest">Prospects</h1>
          <p className="font-accent text-ink-soft mt-1">
            {total} soumission{total > 1 ? 's' : ''} de questionnaire
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-forest/10 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Rechercher par nom ou email..."
            className="flex-1"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 border border-forest/20 rounded-lg bg-white text-forest focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
          >
            {statusFilters.map((filter) => (
              <option key={filter.value} value={filter.value}>
                {filter.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-forest/10 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-ink-soft">Chargement...</div>
        ) : prospects.length === 0 ? (
          <div className="p-8 text-center text-ink-soft">
            Aucun prospect trouve
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-forest/10 bg-cream/30">
                  <th className="text-left px-6 py-4 font-accent text-sm text-ink-soft uppercase tracking-wider">
                    Nom
                  </th>
                  <th className="text-left px-6 py-4 font-accent text-sm text-ink-soft uppercase tracking-wider">
                    Email
                  </th>
                  <th className="text-left px-6 py-4 font-accent text-sm text-ink-soft uppercase tracking-wider">
                    Profil
                  </th>
                  <th className="text-left px-6 py-4 font-accent text-sm text-ink-soft uppercase tracking-wider">
                    Score
                  </th>
                  <th className="text-left px-6 py-4 font-accent text-sm text-ink-soft uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="text-left px-6 py-4 font-accent text-sm text-ink-soft uppercase tracking-wider">
                    Date
                  </th>
                  <th className="text-right px-6 py-4 font-accent text-sm text-ink-soft uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-forest/5">
                {prospects.map((prospect) => (
                  <tr
                    key={prospect._id}
                    className="hover:bg-cream/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-forest">
                        {prospect.firstName} {prospect.lastName}
                      </div>
                      <div className="text-sm text-ink-soft">
                        {prospect.age} ans
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-ink-soft">
                      {prospect.email}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge
                        status={prospect.profile || ''}
                        type="profile"
                      />
                    </td>
                    <td className="px-6 py-4 text-sm text-forest">
                      {prospect.totalScore !== undefined ? `${prospect.totalScore}/50` : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge
                        status={prospect.status}
                        type="prospect"
                      />
                    </td>
                    <td className="px-6 py-4 text-sm text-ink-soft">
                      {formatDate(prospect.submittedAt)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/gestion-mon-remede-oum/prospects/${prospect._id}`}
                        className="text-gold hover:text-gold-light font-medium text-sm transition-colors"
                      >
                        Voir
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
