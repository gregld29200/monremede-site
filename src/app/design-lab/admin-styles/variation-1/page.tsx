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
  nouveau: 'bg-blue-50 text-blue-700',
  contacte: 'bg-gray-100 text-gray-700',
  discussion: 'bg-amber-50 text-amber-700',
  converti: 'bg-green-50 text-green-700',
}

const statusLabels: Record<string, string> = {
  nouveau: 'Nouveau',
  contacte: 'Contacté',
  discussion: 'En discussion',
  converti: 'Converti',
}

export default function Variation1() {
  return (
    <div className="min-h-screen bg-[#fafafa]" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/design-lab/admin-styles" className="text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <h1 className="text-lg font-semibold text-gray-900">Prospects</h1>
          </div>
          <span className="text-xs font-medium px-3 py-1 bg-gray-100 text-gray-600 rounded-full">
            Style 1: Minimal Light
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white rounded-xl p-5 border border-gray-200">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{stat.label}</p>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-2xl font-semibold text-gray-900">{stat.value}</span>
                <span className="text-xs font-medium text-green-600">{stat.change}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Rechercher par nom ou email..."
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              {['Tous', 'Nouveau', 'Contacté', 'En discussion', 'Converti'].map((filter, i) => (
                <button
                  key={filter}
                  className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                    i === 0 ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Prospect</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Score</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Statut</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Date</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {prospects.map((prospect) => (
                <tr key={prospect.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-600">
                        {prospect.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{prospect.name}</p>
                        <p className="text-xs text-gray-500">{prospect.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${prospect.score >= 35 ? 'bg-red-400' : prospect.score >= 25 ? 'bg-amber-400' : 'bg-green-400'}`}
                          style={{ width: `${(prospect.score / 50) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600">{prospect.score}/50</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-medium ${statusColors[prospect.status]}`}>
                      {statusLabels[prospect.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{prospect.date}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-sm font-medium text-gray-600 hover:text-gray-900">
                      Voir &rarr;
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-6 py-3 border-t border-gray-100 bg-gray-50">
            <p className="text-xs text-gray-500">Affichage de 5 sur 156 prospects</p>
          </div>
        </div>
      </div>
    </div>
  )
}
