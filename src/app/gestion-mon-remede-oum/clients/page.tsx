'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { StatusBadge } from '@/components/admin/status-badge'
import type { Client } from '@/types/admin'

const statusFilters = [
  { value: 'all', label: 'Tous' },
  { value: 'actif', label: 'Actif' },
  { value: 'pause', label: 'En pause' },
  { value: 'archive', label: 'Archivé' },
]

const consultationLabels: Record<string, string> = {
  'sante-generale': 'Santé Générale',
  'troubles-digestifs': 'Troubles Digestifs',
  'equilibre-hormonal': 'Équilibre Hormonal',
  'suivi-complet': 'Suivi Complet',
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const fetchClients = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (statusFilter !== 'all') params.set('status', statusFilter)

      const response = await fetch(`/api/gestion-mon-remede-oum/clients?${params}`)
      const data = await response.json()
      setClients(data.clients || [])
      setTotal(data.total || 0)
    } catch (error) {
      console.error('Error fetching clients:', error)
    } finally {
      setIsLoading(false)
    }
  }, [search, statusFilter])

  useEffect(() => {
    fetchClients()
  }, [fetchClients])

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
    })
  }

  const getStatusCounts = () => {
    return {
      actif: clients.filter(c => c.status === 'actif').length,
      pause: clients.filter(c => c.status === 'pause').length,
      archive: clients.filter(c => c.status === 'archive').length,
    }
  }

  const counts = getStatusCounts()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sage/20 to-sage/5 border border-sage/20 flex items-center justify-center">
            <svg className="w-6 h-6 text-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <p className="font-accent text-xs text-ink-soft/60 uppercase tracking-[0.15em]">
              Gestion clientèle
            </p>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="font-display text-3xl text-forest tabular-nums">{total}</span>
              <span className="font-body text-sm text-ink-soft/60">cliente{total > 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3">
          <Link
            href="/gestion-mon-remede-oum/clients/import"
            className="group flex items-center gap-2 px-4 py-2.5 rounded-xl bg-forest/5 text-forest hover:bg-forest/10 font-accent text-xs uppercase tracking-wider transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <span>Importer CSV</span>
          </Link>
          <Link
            href="/gestion-mon-remede-oum/clients/nouveau"
            className="group relative px-5 py-2.5 rounded-xl font-accent text-xs uppercase tracking-wider overflow-hidden transition-all"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-gold via-gold-light to-gold bg-[length:200%_100%] group-hover:bg-[position:100%_0] transition-all duration-500" />
            <span className="relative flex items-center gap-2 text-forest-deep">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
              </svg>
              Nouvelle cliente
            </span>
          </Link>
        </div>
      </div>

      {/* Status summary pills */}
      <div className="flex items-center gap-3">
        <div className="px-4 py-2 rounded-xl bg-sage/10 border border-sage/20">
          <span className="font-accent text-xs text-sage uppercase tracking-wider">
            {counts.actif} actives
          </span>
        </div>
        <div className="px-4 py-2 rounded-xl bg-gold/10 border border-gold/20">
          <span className="font-accent text-xs text-gold uppercase tracking-wider">
            {counts.pause} en pause
          </span>
        </div>
        <div className="px-4 py-2 rounded-xl bg-forest/5 border border-forest/10">
          <span className="font-accent text-xs text-ink-soft/60 uppercase tracking-wider">
            {counts.archive} archivées
          </span>
        </div>
      </div>

      {/* Filters card */}
      <div className="admin-card p-5">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft/40">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par nom, email ou téléphone..."
              className="admin-input pl-11"
            />
          </div>

          {/* Status filter chips */}
          <div className="flex flex-wrap gap-2">
            {statusFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setStatusFilter(filter.value)}
                className={`px-4 py-2.5 rounded-xl font-accent text-xs uppercase tracking-wider transition-all ${
                  statusFilter === filter.value
                    ? 'bg-forest text-cream shadow-md'
                    : 'bg-forest/5 text-forest/70 hover:bg-forest/10 hover:text-forest'
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
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 rounded-full border-2 border-sage/20" />
                <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-sage animate-spin" />
              </div>
              <p className="font-accent text-sm text-ink-soft/60 tracking-wider">Chargement des clientes...</p>
            </div>
          </div>
        ) : clients.length === 0 ? (
          <div className="admin-empty-state py-16">
            <div className="admin-empty-state-icon">
              <svg className="w-8 h-8 text-forest/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="font-display text-lg text-forest/70">Aucune cliente trouvée</p>
            <p className="font-body text-sm text-ink-soft/50 mt-1 mb-6">
              {search || statusFilter !== 'all'
                ? 'Essayez de modifier vos filtres'
                : 'Commencez par ajouter votre première cliente'}
            </p>
            {!search && statusFilter === 'all' && (
              <Link
                href="/gestion-mon-remede-oum/clients/nouveau"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold text-forest-deep font-accent text-xs uppercase tracking-wider hover:bg-gold-light transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                </svg>
                Ajouter une cliente
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Contact</th>
                  <th>Consultation</th>
                  <th>Statut</th>
                  <th>Dernier contact</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="stagger-fade">
                {clients.map((client) => (
                  <tr key={client._id} className="group">
                    <td>
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border ${
                          client.status === 'actif'
                            ? 'bg-gradient-to-br from-sage/15 to-sage/5 border-sage/20'
                            : client.status === 'pause'
                            ? 'bg-gradient-to-br from-gold/15 to-gold/5 border-gold/20'
                            : 'bg-gradient-to-br from-forest/10 to-forest/5 border-forest/10'
                        }`}>
                          <span className={`font-display text-sm ${
                            client.status === 'actif' ? 'text-sage' : client.status === 'pause' ? 'text-gold' : 'text-ink-soft/60'
                          }`}>
                            {client.firstName?.[0]}{client.lastName?.[0]}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="font-display text-sm text-forest truncate">
                            {client.firstName} {client.lastName}
                          </p>
                          {client.source && (
                            <p className="font-accent text-[10px] text-ink-soft/50 uppercase tracking-wider">
                              {client.source === 'questionnaire' ? 'Via questionnaire' :
                               client.source === 'import' ? 'Importée' :
                               client.source === 'recommandation' ? 'Recommandation' : 'Manuel'}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="space-y-0.5">
                        <p className="font-body text-sm text-forest truncate max-w-[180px]">
                          {client.email}
                        </p>
                        {client.phone && (
                          <p className="font-body text-xs text-ink-soft/60">
                            {client.phone}
                          </p>
                        )}
                      </div>
                    </td>
                    <td>
                      {client.consultationType ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-lg bg-blush/10 border border-blush/20 font-accent text-xs text-blush-deep">
                          {consultationLabels[client.consultationType] || client.consultationType}
                        </span>
                      ) : (
                        <span className="font-body text-sm text-ink-soft/40">-</span>
                      )}
                    </td>
                    <td>
                      <StatusBadge status={client.status} type="client" />
                    </td>
                    <td>
                      <span className="font-body text-sm text-ink-soft/70">
                        {formatDate(client.lastContactAt)}
                      </span>
                    </td>
                    <td className="text-right">
                      <Link
                        href={`/gestion-mon-remede-oum/clients/${client._id}`}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sage/10 text-sage hover:bg-sage/20 font-accent text-xs uppercase tracking-wider transition-all group-hover:shadow-sm"
                      >
                        <span>Fiche</span>
                        <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        {!isLoading && clients.length > 0 && (
          <div className="px-6 py-4 border-t border-forest/5 bg-cream/30">
            <p className="font-accent text-xs text-ink-soft/50 tracking-wider">
              Affichage de {clients.length} sur {total} cliente{total > 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
