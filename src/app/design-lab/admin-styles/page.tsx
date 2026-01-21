'use client'

import Link from 'next/link'

const variations = [
  {
    id: 1,
    name: 'Minimal Light',
    description: 'Clean whites, subtle grays, maximum clarity. Apple-inspired minimalism.',
    preview: 'bg-white border-gray-200',
  },
  {
    id: 2,
    name: 'Dark Mode',
    description: 'Dark backgrounds with excellent contrast. Easy on the eyes for long sessions.',
    preview: 'bg-gray-900 border-gray-700 text-white',
  },
  {
    id: 3,
    name: 'Notion Style',
    description: 'Warm grays, rounded corners, friendly feel. Comfortable and approachable.',
    preview: 'bg-[#fffefc] border-[#e8e5e0]',
  },
  {
    id: 4,
    name: 'Linear Style',
    description: 'Sharp edges, modern feel, purple accents. Tech-forward and precise.',
    preview: 'bg-[#0a0a0b] border-purple-500/30 text-white',
  },
  {
    id: 5,
    name: 'Stripe Style',
    description: 'Professional blue accents, clean typography. Business-grade clarity.',
    preview: 'bg-[#f6f9fc] border-[#e3e8ee]',
  },
]

export default function AdminStylesPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link href="/design-lab" className="text-blue-600 hover:underline text-sm mb-4 inline-block">
            &larr; Back to Design Lab
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard Styles</h1>
          <p className="text-gray-600 mt-2">
            Choose your preferred admin dashboard style. Click to view full page preview.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {variations.map((v) => (
            <Link
              key={v.id}
              href={`/design-lab/admin-styles/variation-${v.id}`}
              className="group block"
            >
              <div className={`h-40 rounded-t-xl border-2 ${v.preview} flex items-center justify-center transition-transform group-hover:scale-[1.02]`}>
                <span className="text-4xl font-bold opacity-20">{v.id}</span>
              </div>
              <div className="bg-white rounded-b-xl border-2 border-t-0 border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900">{v.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{v.description}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>Tip:</strong> Each variation shows a prospects list page with stats, filters, and data table.
            All use Inter font for optimal readability. View each to compare the full experience.
          </p>
        </div>
      </div>
    </div>
  )
}
