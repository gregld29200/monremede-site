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
  { label: 'Total prospects', value: '156', change: '+12%', icon: '👥' },
  { label: 'Nouveaux', value: '23', change: '+5', icon: '🆕' },
  { label: 'En discussion', value: '18', change: '-2', icon: '💬' },
  { label: 'Convertis', value: '45', change: '+8%', icon: '✅' },
]

const statusColors: Record<string, string> = {
  nouveau: 'bg-blue-50 text-blue-700',
  contacte: 'bg-slate-100 text-slate-700',
  discussion: 'bg-yellow-50 text-yellow-700',
  converti: 'bg-green-50 text-green-700',
}

const statusLabels: Record<string, string> = {
  nouveau: 'Nouveau',
  contacte: 'Contacté',
  discussion: 'En discussion',
  converti: 'Converti',
}

export default function Variation5() {
  return (
    <div className="min-h-screen bg-[#f6f9fc]" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Top bar */}
      <div className="bg-white border-b border-[#e3e8ee]">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/design-lab/admin-styles" className="text-[#8792a2] hover:text-[#3c4257] transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <h1 className="text-[15px] font-semibold text-[#3c4257]">Prospects</h1>
          </div>
          <span className="text-xs font-medium px-3 py-1.5 bg-[#f6f9fc] text-[#8792a2] rounded-full border border-[#e3e8ee]">
            Style 5: Stripe Style
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-5 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white rounded-lg p-5 border border-[#e3e8ee] shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-[13px] font-medium text-[#8792a2]">{stat.label}</p>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded ${stat.change.startsWith('+') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                  {stat.change}
                </span>
              </div>
              <p className="text-[28px] font-semibold text-[#3c4257] mt-2 tabular-nums">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Main card */}
        <div className="bg-white rounded-lg border border-[#e3e8ee] shadow-sm">
          {/* Filters */}
          <div className="px-5 py-4 border-b border-[#e3e8ee]">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8792a2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Rechercher des prospects..."
                  className="w-full max-w-md pl-10 pr-4 py-2 text-[13px] bg-white border border-[#e3e8ee] text-[#3c4257] placeholder-[#8792a2] rounded-md focus:outline-none focus:ring-2 focus:ring-[#635bff] focus:border-[#635bff]"
                />
              </div>
              <div className="flex items-center gap-2 border-l border-[#e3e8ee] pl-4">
                <span className="text-[13px] text-[#8792a2]">Statut:</span>
                <select className="text-[13px] text-[#3c4257] border border-[#e3e8ee] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#635bff] focus:border-[#635bff] bg-white">
                  <option>Tous</option>
                  <option>Nouveau</option>
                  <option>Contacté</option>
                  <option>En discussion</option>
                  <option>Converti</option>
                </select>
              </div>
              <button className="ml-auto px-4 py-2 bg-[#635bff] text-white text-[13px] font-medium rounded-md hover:bg-[#5046e4] transition-colors">
                Exporter
              </button>
            </div>
          </div>

          {/* Table */}
          <table className="w-full">
            <thead>
              <tr className="bg-[#f6f9fc]">
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-[#8792a2] uppercase tracking-wider">Prospect</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-[#8792a2] uppercase tracking-wider">Score santé</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-[#8792a2] uppercase tracking-wider">Statut</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-[#8792a2] uppercase tracking-wider">Date</th>
                <th className="text-right px-5 py-3 text-[11px] font-semibold text-[#8792a2] uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e3e8ee]">
              {prospects.map((prospect) => (
                <tr key={prospect.id} className="hover:bg-[#f6f9fc] transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#635bff] to-[#80b3ff] flex items-center justify-center text-sm font-semibold text-white">
                        {prospect.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-[14px] font-medium text-[#3c4257]">{prospect.name}</p>
                        <p className="text-[13px] text-[#8792a2]">{prospect.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-2 bg-[#e3e8ee] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${prospect.score >= 35 ? 'bg-[#ed5f74]' : prospect.score >= 25 ? 'bg-[#f5be3b]' : 'bg-[#3ecf8e]'}`}
                          style={{ width: `${(prospect.score / 50) * 100}%` }}
                        />
                      </div>
                      <span className="text-[13px] font-medium text-[#3c4257] tabular-nums">{prospect.score}/50</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-[12px] font-medium ${statusColors[prospect.status]}`}>
                      {statusLabels[prospect.status]}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-[13px] text-[#8792a2]">{prospect.date}</td>
                  <td className="px-5 py-4 text-right">
                    <button className="text-[13px] font-medium text-[#635bff] hover:text-[#5046e4] transition-colors">
                      Voir les détails &rarr;
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Footer */}
          <div className="px-5 py-4 border-t border-[#e3e8ee] flex items-center justify-between bg-[#f6f9fc]">
            <p className="text-[13px] text-[#8792a2]">Affichage de <span className="font-medium text-[#3c4257]">5</span> sur <span className="font-medium text-[#3c4257]">156</span> prospects</p>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 text-[13px] font-medium text-[#8792a2] border border-[#e3e8ee] rounded-md hover:bg-white transition-colors">
                Précédent
              </button>
              <button className="px-3 py-1.5 text-[13px] font-medium text-[#3c4257] border border-[#e3e8ee] bg-white rounded-md hover:bg-[#f6f9fc] transition-colors">
                Suivant
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
