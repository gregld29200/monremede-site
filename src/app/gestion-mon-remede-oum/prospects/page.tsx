'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { StatusBadge } from '@/components/admin/status-badge'
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
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) return "Aujourd'hui"
    if (days === 1) return 'Hier'
    if (days < 7) return `Il y a ${days} jours`

    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  const getScoreColor = (score?: number) => {
    if (score === undefined) return 'text-[#9ca3af]'
    if (score >= 40) return 'text-[#dc2626]'
    if (score >= 25) return 'text-[#d97706]'
    return 'text-[#059669]'
  }

  const getScoreBarColor = (score?: number) => {
    if (score === undefined) return 'bg-[#e5e7eb]'
    if (score >= 40) return 'bg-[#dc2626]'
    if (score >= 25) return 'bg-[#d97706]'
    return 'bg-[#059669]'
  }

  return (
    <div className="space-y-6">
      {/* Header with stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#dbeafe] flex items-center justify-center">
            <svg className="w-6 h-6 text-[#2563eb]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-[#6b7280]">
              Soumissions questionnaire
            </p>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-3xl font-semibold text-[#111827] tabular-nums">{total}</span>
              <span className="text-sm text-[#6b7280]">prospect{total > 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-lg bg-[#dbeafe]">
            <span className="text-sm font-medium text-[#1d4ed8]">
              {prospects.filter(p => p.status === 'nouveau').length} nouveaux
            </span>
          </div>
          <div className="px-4 py-2 rounded-lg bg-[#fef3c7]">
            <span className="text-sm font-medium text-[#d97706]">
              {prospects.filter(p => p.status === 'discussion').length} en discussion
            </span>
          </div>
        </div>
      </div>

      {/* Filters card */}
      <div className="admin-card p-5">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par nom ou email..."
              className="admin-input pl-10"
            />
          </div>

          {/* Status filter chips */}
          <div className="flex flex-wrap gap-2">
            {statusFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setStatusFilter(filter.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  statusFilter === filter.value
                    ? 'bg-[#111827] text-white'
                    : 'bg-[#f3f4f6] text-[#374151] hover:bg-[#e5e7eb]'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table card */}
      <div className="admin-card overflow-hidden">
        {isLoading ? (
          <div className="p-12">
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 rounded-full border-2 border-[#e5e7eb]" />
                <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#2563eb] animate-spin" />
              </div>
              <p className="text-sm text-[#6b7280]">Chargement des prospects...</p>
            </div>
          </div>
        ) : prospects.length === 0 ? (
          <div className="admin-empty-state py-16">
            <div className="admin-empty-state-icon">
              <svg className="w-7 h-7 text-[#9ca3af]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <p className="text-lg font-medium text-[#374151]">Aucun prospect trouve</p>
            <p className="text-sm text-[#6b7280] mt-1">
              {search || statusFilter !== 'all'
                ? 'Essayez de modifier vos filtres'
                : 'Les nouvelles soumissions apparaitront ici'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Prospect</th>
                  <th>Profil sante</th>
                  <th>Score</th>
                  <th>Statut</th>
                  <th>Soumis</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="stagger-fade">
                {prospects.map((prospect) => (
                  <tr key={prospect._id} className="group">
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#e0e7ff] flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-medium text-[#4f46e5]">
                            {prospect.firstName?.[0]}{prospect.lastName?.[0]}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-[#111827] truncate">
                            {prospect.firstName} {prospect.lastName}
                          </p>
                          <p className="text-sm text-[#6b7280] truncate">
                            {prospect.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <StatusBadge
                        status={prospect.profile || ''}
                        type="profile"
                      />
                    </td>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-1.5 rounded-full bg-[#e5e7eb] overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${getScoreBarColor(prospect.totalScore)}`}
                            style={{ width: `${((prospect.totalScore || 0) / 50) * 100}%` }}
                          />
                        </div>
                        <span className={`text-sm font-medium tabular-nums ${getScoreColor(prospect.totalScore)}`}>
                          {prospect.totalScore !== undefined ? `${prospect.totalScore}/50` : '-'}
                        </span>
                      </div>
                    </td>
                    <td>
                      <StatusBadge
                        status={prospect.status}
                        type="prospect"
                      />
                    </td>
                    <td>
                      <span className="text-sm text-[#6b7280]">
                        {formatDate(prospect.submittedAt)}
                      </span>
                    </td>
                    <td className="text-right">
                      <Link
                        href={`/gestion-mon-remede-oum/prospects/${prospect._id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-[#2563eb] hover:bg-[#dbeafe] transition-colors"
                      >
                        <span>Voir</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Table footer */}
        {!isLoading && prospects.length > 0 && (
          <div className="px-5 py-3 border-t border-[#f3f4f6] bg-[#f9fafb]">
            <p className="text-sm text-[#6b7280]">
              Affichage de {prospects.length} sur {total} prospect{total > 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
