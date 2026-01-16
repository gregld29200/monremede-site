'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AdminStatsCard } from '@/components/admin/admin-stats-card'
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
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full border-2 border-gold/20" />
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-gold animate-spin" />
          </div>
          <p className="font-accent text-sm text-ink-soft/60 tracking-wider">Chargement...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="admin-card bg-blush/10 border-blush-deep/20 p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blush-deep/10 flex items-center justify-center">
            <svg className="w-5 h-5 text-blush-deep" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <p className="font-display text-forest">{error}</p>
            <p className="font-body text-sm text-ink-soft/70 mt-0.5">Veuillez rafraîchir la page</p>
          </div>
        </div>
      </div>
    )
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)

    if (hours < 1) return 'À l\'instant'
    if (hours < 24) return `Il y a ${hours}h`
    if (days < 7) return `Il y a ${days}j`
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
  }

  const getActivityIcon = (type: string) => {
    const baseClass = 'w-10 h-10 rounded-xl flex items-center justify-center'

    switch (type) {
      case 'new_prospect':
        return (
          <div className={`${baseClass} bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/20`}>
            <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
        )
      case 'new_client':
        return (
          <div className={`${baseClass} bg-gradient-to-br from-sage/20 to-sage/5 border border-sage/20`}>
            <svg className="w-4 h-4 text-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        )
      case 'note_added':
        return (
          <div className={`${baseClass} bg-gradient-to-br from-blush/30 to-blush/10 border border-blush-deep/20`}>
            <svg className="w-4 h-4 text-blush-deep" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
        )
      default:
        return (
          <div className={`${baseClass} bg-gradient-to-br from-forest/10 to-forest/5 border border-forest/10`}>
            <svg className="w-4 h-4 text-forest/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        )
    }
  }

  return (
    <div className="space-y-8">
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 stagger-fade">
        <AdminStatsCard
          title="Clientes totales"
          value={stats?.totalClients || 0}
          accentColor="forest"
          delay={0}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
        />
        <AdminStatsCard
          title="Clientes actives"
          value={stats?.activeClients || 0}
          accentColor="sage"
          delay={100}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <AdminStatsCard
          title="Nouveaux prospects"
          value={stats?.newProspects || 0}
          accentColor="gold"
          delay={200}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          }
        />
        <AdminStatsCard
          title="En attente"
          value={stats?.pendingProspects || 0}
          accentColor="blush"
          delay={300}
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
        <div className="admin-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center border border-gold/20">
              <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="font-display text-lg text-forest">Actions rapides</h2>
          </div>

          <div className="space-y-2">
            <Link
              href="/gestion-mon-remede-oum/prospects"
              className="group flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-gold/5 to-transparent hover:from-gold/10 border border-transparent hover:border-gold/10 transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-display text-sm text-forest">Voir les prospects</p>
                <p className="font-body text-xs text-ink-soft/60 mt-0.5">
                  {stats?.newProspects || 0} nouveau{(stats?.newProspects || 0) > 1 ? 'x' : ''}
                </p>
              </div>
              <svg className="w-4 h-4 text-gold/50 group-hover:text-gold group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
              </svg>
            </Link>

            <Link
              href="/gestion-mon-remede-oum/clients/nouveau"
              className="group flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-sage/5 to-transparent hover:from-sage/10 border border-transparent hover:border-sage/10 transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-sage/10 flex items-center justify-center group-hover:bg-sage/20 transition-colors">
                <svg className="w-5 h-5 text-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-display text-sm text-forest">Ajouter une cliente</p>
                <p className="font-body text-xs text-ink-soft/60 mt-0.5">Créer un nouveau dossier</p>
              </div>
              <svg className="w-4 h-4 text-sage/50 group-hover:text-sage group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
              </svg>
            </Link>

            <Link
              href="/gestion-mon-remede-oum/clients/import"
              className="group flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-blush/10 to-transparent hover:from-blush/20 border border-transparent hover:border-blush/20 transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-blush/20 flex items-center justify-center group-hover:bg-blush/30 transition-colors">
                <svg className="w-5 h-5 text-blush-deep" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-display text-sm text-forest">Importer un CSV</p>
                <p className="font-body text-xs text-ink-soft/60 mt-0.5">Import en masse</p>
              </div>
              <svg className="w-4 h-4 text-blush-deep/50 group-hover:text-blush-deep group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Recent activity */}
        <div className="lg:col-span-2 admin-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-forest/15 to-forest/5 flex items-center justify-center border border-forest/10">
                <svg className="w-4 h-4 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="font-display text-lg text-forest">Activité récente</h2>
            </div>
            <span className="font-accent text-xs text-ink-soft/50 uppercase tracking-wider">
              Dernières 24h
            </span>
          </div>

          {stats?.recentActivity && stats.recentActivity.length > 0 ? (
            <div className="space-y-1 stagger-fade">
              {stats.recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="group flex items-center gap-4 p-3 -mx-3 rounded-xl hover:bg-forest/[0.02] transition-colors"
                >
                  {getActivityIcon(activity.type)}
                  <div className="flex-1 min-w-0">
                    <p className="font-display text-sm text-forest truncate">
                      {activity.title}
                    </p>
                    <p className="font-body text-xs text-ink-soft/60 truncate mt-0.5">
                      {activity.description}
                    </p>
                  </div>
                  <span className="font-accent text-[11px] text-ink-soft/40 whitespace-nowrap">
                    {formatTimestamp(activity.timestamp)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-forest/5 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-forest/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <p className="font-display text-forest/60">Aucune activité récente</p>
              <p className="font-body text-sm text-ink-soft/50 mt-1">
                Les nouvelles activités apparaîtront ici
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
