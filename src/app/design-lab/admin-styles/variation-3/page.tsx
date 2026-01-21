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
  { label: 'Total prospects', value: 156, change: '+12%', emoji: '👥' },
  { label: 'Nouveaux', value: 23, change: '+5', emoji: '✨' },
  { label: 'En discussion', value: 18, change: '-2', emoji: '💬' },
  { label: 'Convertis', value: 45, change: '+8%', emoji: '🎉' },
]

const statusColors: Record<string, string> = {
  nouveau: 'bg-[#e8f4f8] text-[#0b6e99]',
  contacte: 'bg-[#eee] text-[#6b6b6b]',
  discussion: 'bg-[#fdecc8] text-[#9f6b00]',
  converti: 'bg-[#dbeddb] text-[#448361]',
}

const statusLabels: Record<string, string> = {
  nouveau: 'Nouveau',
  contacte: 'Contacté',
  discussion: 'En discussion',
  converti: 'Converti',
}

export default function Variation3() {
  return (
    <div className="min-h-screen bg-[#ffffff]" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Top bar */}
      <div className="border-b border-[#e8e5e0]">
        <div className="max-w-5xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/design-lab/admin-styles" className="text-[#9b9a97] hover:text-[#37352f]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <h1 className="text-xl font-semibold text-[#37352f]">Prospects</h1>
          </div>
          <span className="text-xs font-medium px-3 py-1.5 bg-[#f7f6f3] text-[#9b9a97] rounded-md">
            Style 3: Notion Style
          </span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="bg-[#f7f6f3] rounded-lg p-4 hover:bg-[#efeee9] transition-colors cursor-default">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{stat.emoji}</span>
                <p className="text-xs font-medium text-[#9b9a97]">{stat.label}</p>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-semibold text-[#37352f]">{stat.value}</span>
                <span className="text-xs font-medium text-[#448361]">{stat.change}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9b9a97]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Rechercher..."
                className="w-full pl-10 pr-4 py-2 text-sm bg-[#f7f6f3] border-none text-[#37352f] placeholder-[#9b9a97] rounded-md focus:outline-none focus:ring-2 focus:ring-[#2eaadc] focus:bg-white"
              />
            </div>
            <div className="flex gap-1">
              {['Tous', 'Nouveau', 'Contacté', 'Discussion', 'Converti'].map((filter, i) => (
                <button
                  key={filter}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                    i === 0 ? 'bg-[#37352f] text-white' : 'text-[#37352f] hover:bg-[#f7f6f3]'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="border border-[#e8e5e0] rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f7f6f3]">
                <th className="text-left px-4 py-2.5 text-xs font-medium text-[#9b9a97]">Prospect</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-[#9b9a97]">Score</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-[#9b9a97]">Statut</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-[#9b9a97]">Date</th>
                <th className="text-right px-4 py-2.5 text-xs font-medium text-[#9b9a97]"></th>
              </tr>
            </thead>
            <tbody>
              {prospects.map((prospect, idx) => (
                <tr key={prospect.id} className={`border-t border-[#e8e5e0] hover:bg-[#f7f6f3] transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-[#fafaf9]'}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#fdecc8] to-[#fadec9] flex items-center justify-center text-xs font-medium text-[#9f6b00]">
                        {prospect.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#37352f]">{prospect.name}</p>
                        <p className="text-xs text-[#9b9a97]">{prospect.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-[#e8e5e0] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${prospect.score >= 35 ? 'bg-[#eb5757]' : prospect.score >= 25 ? 'bg-[#f2c94c]' : 'bg-[#6fcf97]'}`}
                          style={{ width: `${(prospect.score / 50) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-[#9b9a97]">{prospect.score}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${statusColors[prospect.status]}`}>
                      {statusLabels[prospect.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#9b9a97]">{prospect.date}</td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-sm text-[#2eaadc] hover:underline">
                      Ouvrir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-4 py-2.5 border-t border-[#e8e5e0] bg-[#f7f6f3]">
            <p className="text-xs text-[#9b9a97]">5 sur 156</p>
          </div>
        </div>
      </div>
    </div>
  )
}
