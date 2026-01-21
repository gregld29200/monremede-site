'use client'

import Link from 'next/link'

// Sample data
const prospects = [
  { id: 1, name: 'Marie Dupont', email: 'marie.dupont@email.com', score: 38, status: 'nouveau', date: "Aujourd'hui" },
  { id: 2, name: 'Jean Martin', email: 'jean.martin@email.com', score: 25, status: 'contacte', date: 'Hier' },
  { id: 3, name: 'Sophie Bernard', email: 'sophie.b@email.com', score: 42, status: 'discussion', date: 'Il y a 3 jours' },
  { id: 4, name: 'Pierre Leroy', email: 'p.leroy@email.com', score: 18, status: 'converti', date: 'Il y a 5 jours' },
  { id: 5, name: 'Claire Moreau', email: 'claire.m@email.com', score: 31, status: 'nouveau', date: 'Il y a 1 semaine' },
]

const stats = [
  { label: 'Total prospects', value: 156, change: '+12%' },
  { label: 'Nouveaux', value: 23, change: '+5' },
  { label: 'En discussion', value: 18, change: '-2' },
  { label: 'Convertis', value: 45, change: '+8%' },
]

const statusColors: Record<string, string> = {
  nouveau: 'bg-violet-500/10 text-violet-400 border border-violet-500/20',
  contacte: 'bg-slate-500/10 text-slate-400 border border-slate-500/20',
  discussion: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  converti: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
}

const statusLabels: Record<string, string> = {
  nouveau: 'Nouveau',
  contacte: 'Contacté',
  discussion: 'En discussion',
  converti: 'Converti',
}

export default function Variation4() {
  return (
    <div className="min-h-screen bg-[#08070b]" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Subtle gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-violet-950/20 via-transparent to-transparent pointer-events-none" />

      {/* Top bar */}
      <div className="relative border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/design-lab/admin-styles" className="text-slate-500 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <h1 className="text-lg font-medium text-white">Prospects</h1>
          </div>
          <span className="text-xs font-medium px-3 py-1 bg-violet-500/10 text-violet-400 border border-violet-500/20 rounded-full">
            Style 4: Linear Style
          </span>
        </div>
      </div>

      <div className="relative max-w-6xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white/[0.02] backdrop-blur rounded-lg p-5 border border-white/5 hover:border-violet-500/20 transition-colors">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{stat.label}</p>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-2xl font-semibold text-white tabular-nums">{stat.value}</span>
                <span className="text-xs font-medium text-emerald-400">{stat.change}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white/[0.02] backdrop-blur rounded-lg border border-white/5 p-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Rechercher..."
                className="w-full pl-10 pr-4 py-2 text-sm bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-md focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500"
              />
            </div>
            <div className="flex gap-1 p-1 bg-white/5 rounded-lg">
              {['Tous', 'Nouveau', 'Contacté', 'Discussion', 'Converti'].map((filter, i) => (
                <button
                  key={filter}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                    i === 0
                      ? 'bg-violet-500 text-white shadow-lg shadow-violet-500/25'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white/[0.02] backdrop-blur rounded-lg border border-white/5 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Prospect</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Score</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Statut</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {prospects.map((prospect) => (
                <tr key={prospect.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-violet-500/20 flex items-center justify-center text-sm font-medium text-violet-300">
                        {prospect.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{prospect.name}</p>
                        <p className="text-xs text-slate-500">{prospect.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-20 h-1 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${prospect.score >= 35 ? 'bg-gradient-to-r from-red-500 to-orange-500' : prospect.score >= 25 ? 'bg-gradient-to-r from-amber-500 to-yellow-500' : 'bg-gradient-to-r from-emerald-500 to-teal-500'}`}
                          style={{ width: `${(prospect.score / 50) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-slate-400 tabular-nums">{prospect.score}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-medium ${statusColors[prospect.status]}`}>
                      {statusLabels[prospect.status]}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-500">{prospect.date}</td>
                  <td className="px-5 py-4 text-right">
                    <button className="text-sm font-medium text-slate-500 hover:text-violet-400 transition-colors opacity-0 group-hover:opacity-100">
                      Voir &rarr;
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-5 py-3 border-t border-white/5 bg-white/[0.01]">
            <p className="text-xs text-slate-500">Affichage de 5 sur 156 prospects</p>
          </div>
        </div>
      </div>
    </div>
  )
}
