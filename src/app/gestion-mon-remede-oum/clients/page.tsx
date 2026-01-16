'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { StatusBadge } from '@/components/admin/status-badge'
import { SearchInput } from '@/components/admin/search-input'
import { Button } from '@/components/ui/button'
import type { Client } from '@/types/admin'

const statusFilters = [
  { value: 'all', label: 'Tous' },
  { value: 'actif', label: 'Actif' },
  { value: 'pause', label: 'En pause' },
  { value: 'archive', label: 'Archive' },
]

const consultationLabels: Record<string, string> = {
  'sante-generale': 'Sante Generale',
  'troubles-digestifs': 'Troubles Digestifs',
  'equilibre-hormonal': 'Equilibre Hormonal',
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
          <h1 className="font-display text-2xl text-forest">Clientes</h1>
          <p className="font-accent text-ink-soft mt-1">
            {total} cliente{total > 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/gestion-mon-remede-oum/clients/import">
            <Button variant="outline" size="sm">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Importer CSV
            </Button>
          </Link>
          <Link href="/gestion-mon-remede-oum/clients/nouveau">
            <Button size="sm">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
              </svg>
              Nouvelle cliente
            </Button>
          </Link>
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
        ) : clients.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-ink-soft mb-4">Aucune cliente trouvee</p>
            <Link href="/gestion-mon-remede-oum/clients/nouveau">
              <Button size="sm">Ajouter une cliente</Button>
            </Link>
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
                    Telephone
                  </th>
                  <th className="text-left px-6 py-4 font-accent text-sm text-ink-soft uppercase tracking-wider">
                    Consultation
                  </th>
                  <th className="text-left px-6 py-4 font-accent text-sm text-ink-soft uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="text-left px-6 py-4 font-accent text-sm text-ink-soft uppercase tracking-wider">
                    Dernier contact
                  </th>
                  <th className="text-right px-6 py-4 font-accent text-sm text-ink-soft uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-forest/5">
                {clients.map((client) => (
                  <tr
                    key={client._id}
                    className="hover:bg-cream/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-forest">
                        {client.firstName} {client.lastName}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-ink-soft">
                      {client.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-ink-soft">
                      {client.phone || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-forest">
                      {client.consultationType
                        ? consultationLabels[client.consultationType] || client.consultationType
                        : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={client.status} type="client" />
                    </td>
                    <td className="px-6 py-4 text-sm text-ink-soft">
                      {formatDate(client.lastContactAt)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/gestion-mon-remede-oum/clients/${client._id}`}
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
