'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const ADMIN_PATH = '/gestion-mon-remede-oum'

interface AdminSidebarProps {
  collapsed: boolean
  onToggle: () => void
}

const navigation = [
  {
    name: 'Tableau de bord',
    href: ADMIN_PATH,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 12a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1v-7z" />
      </svg>
    ),
    badge: null,
  },
  {
    name: 'Prospects',
    href: `${ADMIN_PATH}/prospects`,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m0-9.803V4m0 0a4 4 0 104 4m-4-4a4 4 0 00-4 4" />
      </svg>
    ),
    badge: 'new',
  },
  {
    name: 'Clientes',
    href: `${ADMIN_PATH}/clients`,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    badge: null,
  },
  {
    name: 'Blog',
    href: `${ADMIN_PATH}/blog`,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
      </svg>
    ),
    badge: null,
  },
  {
    name: 'Recettes',
    href: `${ADMIN_PATH}/recettes`,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    ),
    badge: null,
  },
]

const quickLinks = [
  {
    name: 'Nouvel article',
    href: `${ADMIN_PATH}/blog/nouveau`,
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
  },
  {
    name: 'Nouvelle recette',
    href: `${ADMIN_PATH}/recettes/nouveau`,
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
  {
    name: 'Nouvelle cliente',
    href: `${ADMIN_PATH}/clients/nouveau`,
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
      </svg>
    ),
  },
]

export function AdminSidebar({ collapsed, onToggle }: AdminSidebarProps) {
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-screen flex flex-col transition-all duration-300 ease-out z-50',
        collapsed ? 'w-20' : 'w-72'
      )}
    >
      {/* Main background */}
      <div className="absolute inset-0 bg-gradient-to-b from-forest-deep via-forest-deep to-[#152119]" />

      {/* Botanical pattern overlay */}
      <div className="absolute inset-0 botanical-pattern opacity-100" />

      {/* Subtle vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10" />

      {/* Content */}
      <div className="relative flex flex-col h-full">
        {/* Logo section */}
        <div className={cn(
          'p-6 border-b border-cream/5 transition-all duration-300',
          collapsed && 'px-4 py-6'
        )}>
          <Link href={ADMIN_PATH} className="block group">
            <div className="flex items-center gap-3">
              {/* Logo mark */}
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center border border-gold/20 group-hover:border-gold/40 transition-colors">
                <svg className="w-5 h-5 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-xl bg-gold/10 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Text */}
              {!collapsed && (
                <div className="overflow-hidden">
                  <h1 className="font-display text-lg text-cream tracking-wide">Mon Remède</h1>
                  <p className="font-accent text-[11px] text-sage-light/70 uppercase tracking-[0.2em]">
                    Administration
                  </p>
                </div>
              )}
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <div className={cn(
            'mb-4 transition-opacity',
            collapsed ? 'opacity-0 h-0 mb-0' : 'opacity-100'
          )}>
            <p className="font-accent text-[10px] text-cream/30 uppercase tracking-[0.25em] px-3 mb-2">
              Navigation
            </p>
          </div>

          {navigation.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== ADMIN_PATH && pathname.startsWith(item.href))

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'group relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200',
                  collapsed && 'justify-center px-2',
                  isActive
                    ? 'bg-cream/10 text-cream'
                    : 'text-cream/50 hover:bg-cream/5 hover:text-cream/80'
                )}
              >
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-gold" />
                )}

                {/* Icon */}
                <span className={cn(
                  'flex-shrink-0 transition-colors',
                  isActive ? 'text-gold' : 'text-cream/40 group-hover:text-cream/70'
                )}>
                  {item.icon}
                </span>

                {/* Label */}
                {!collapsed && (
                  <span className="font-body text-sm tracking-wide">{item.name}</span>
                )}

                {/* Badge */}
                {item.badge && !collapsed && (
                  <span className="ml-auto px-2 py-0.5 text-[10px] font-accent uppercase tracking-wider bg-gold/20 text-gold rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Quick actions */}
        {!collapsed && (
          <div className="p-4 border-t border-cream/5">
            <p className="font-accent text-[10px] text-cream/30 uppercase tracking-[0.25em] px-3 mb-3">
              Actions rapides
            </p>
            <div className="space-y-1">
              {quickLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-cream/40 hover:text-cream/70 hover:bg-cream/5 transition-all"
                >
                  {link.icon}
                  <span className="font-body text-xs">{link.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Bottom section */}
        <div className="p-4 border-t border-cream/5">
          {/* Site link */}
          <Link
            href="/"
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-cream/30 hover:text-cream/60 transition-all',
              collapsed && 'justify-center px-2'
            )}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            {!collapsed && <span className="font-body text-xs">Voir le site</span>}
          </Link>

          {/* Collapse toggle */}
          <button
            onClick={onToggle}
            className={cn(
              'mt-2 flex items-center gap-3 px-3 py-2.5 rounded-lg text-cream/30 hover:text-cream/60 hover:bg-cream/5 transition-all w-full',
              collapsed && 'justify-center px-2'
            )}
          >
            <svg
              className={cn('w-4 h-4 transition-transform duration-300', collapsed && 'rotate-180')}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
            {!collapsed && <span className="font-body text-xs">Réduire</span>}
          </button>
        </div>
      </div>
    </aside>
  )
}
