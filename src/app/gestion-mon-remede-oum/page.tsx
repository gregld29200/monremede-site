'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { StatsCard } from '@/components/admin/stats-card'
import type { DashboardStats } from '@/types/admin'

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/gestion-mon-remede-oum/stats')
        if (!response.ok) throw new Error('Erreur de chargement')
        const data = await response.json()
        setStats(data)
      } catch {
        setError('Impossible de charger les statistiques')
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-ink-soft">Chargement...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-blush/30 border border-blush-deep/50 text-forest px-6 py-4 rounded-lg">
        {error}
      </div>
    )
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)

    if (hours < 1) return 'Il y a moins d\'une heure'
    if (hours < 24) return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`
    if (days < 7) return `Il y a ${days} jour${days > 1 ? 's' : ''}`
    return date.toLocaleDateString('fr-FR')
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'new_prospect':
        return (
          <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
        )
      case 'new_client':
        return (
          <div className="w-8 h-8 rounded-full bg-sage/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        )
      case 'note_added':
        return (
          <div className="w-8 h-8 rounded-full bg-blush/30 flex items-center justify-center">
            <svg className="w-4 h-4 text-blush-deep" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
        )
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-forest/10 flex items-center justify-center">
            <svg className="w-4 h-4 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        )
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl text-forest">Tableau de bord</h1>
        <p className="font-accent text-ink-soft mt-1">
          Vue d&apos;ensemble de votre activite
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Clientes totales"
          value={stats?.totalClients || 0}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          }
        />
        <StatsCard
          title="Clientes actives"
          value={stats?.activeClients || 0}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatsCard
          title="Nouveaux prospects"
          value={stats?.newProspects || 0}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          }
        />
        <StatsCard
          title="Prospects en attente"
          value={stats?.pendingProspects || 0}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      {/* Quick actions and recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick actions */}
        <div className="bg-white rounded-lg border border-forest/10 p-6">
          <h2 className="font-display text-lg text-forest mb-4">Actions rapides</h2>
          <div className="space-y-3">
            <Link
              href="/gestion-mon-remede-oum/prospects"
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gold/5 hover:bg-gold/10 text-forest transition-colors"
            >
              <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="font-sans text-sm">Voir les prospects</span>
            </Link>
            <Link
              href="/gestion-mon-remede-oum/clients/nouveau"
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-sage/5 hover:bg-sage/10 text-forest transition-colors"
            >
              <svg className="w-5 h-5 text-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              <span className="font-sans text-sm">Ajouter une cliente</span>
            </Link>
            <Link
              href="/gestion-mon-remede-oum/clients/import"
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-blush/10 hover:bg-blush/20 text-forest transition-colors"
            >
              <svg className="w-5 h-5 text-blush-deep" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <span className="font-sans text-sm">Importer un CSV</span>
            </Link>
          </div>
        </div>

        {/* Recent activity */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-forest/10 p-6">
          <h2 className="font-display text-lg text-forest mb-4">Activite recente</h2>
          {stats?.recentActivity && stats.recentActivity.length > 0 ? (
            <div className="space-y-4">
              {stats.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  {getActivityIcon(activity.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-forest font-medium truncate">
                      {activity.title}
                    </p>
                    <p className="text-sm text-ink-soft truncate">
                      {activity.description}
                    </p>
                  </div>
                  <span className="text-xs text-ink-soft whitespace-nowrap">
                    {formatTimestamp(activity.timestamp)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-ink-soft text-sm">Aucune activite recente</p>
          )}
        </div>
      </div>
    </div>
  )
}
