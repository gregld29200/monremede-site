'use client'

import Link from 'next/link'
import { BlogForm } from '@/components/admin/blog-form'

const ADMIN_PATH = '/gestion-mon-remede-oum'

export default function NewBlogPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href={`${ADMIN_PATH}/blog`}
          className="p-2 text-ink-soft/50 hover:text-forest hover:bg-forest/5 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h2 className="font-display text-2xl text-forest">Nouvel article</h2>
          <p className="font-body text-sm text-ink-soft/70 mt-1">
            Créez un nouvel article de blog
          </p>
        </div>
      </div>

      {/* Form */}
      <BlogForm />
    </div>
  )
}
