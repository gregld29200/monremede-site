'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

const ADMIN_PATH = '/gestion-mon-remede-oum'
const API_ADMIN_PATH = '/api/gestion-mon-remede-oum'

const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Bonjour'
  if (hour < 18) return 'Bon apres-midi'
  return 'Bonsoir'
}

const getPageTitle = (pathname: string): { title: string; subtitle: string } => {
  if (pathname === ADMIN_PATH) {
    return { title: 'Tableau de bord', subtitle: 'Vue d\'ensemble de votre activite' }
  }
  if (pathname.includes('/prospects') && pathname.includes('/')) {
    return { title: 'Detail prospect', subtitle: 'Informations et suivi' }
  }
  if (pathname.includes('/prospects')) {
    return { title: 'Prospects', subtitle: 'Soumissions de questionnaire' }
  }
  if (pathname.includes('/clients/nouveau')) {
    return { title: 'Nouvelle cliente', subtitle: 'Creer un dossier client' }
  }
  if (pathname.includes('/clients/import')) {
    return { title: 'Import CSV', subtitle: 'Importer des clientes en masse' }
  }
  if (pathname.includes('/clients') && pathname.split('/').length > 3) {
    return { title: 'Fiche cliente', subtitle: 'Dossier et suivi personnalise' }
  }
  if (pathname.includes('/clients')) {
    return { title: 'Clientes', subtitle: 'Gestion de votre clientele' }
  }
  // Blog pages
  if (pathname.includes('/blog/nouveau')) {
    return { title: 'Nouvel article', subtitle: 'Creer un article de blog' }
  }
  if (pathname.includes('/blog') && pathname.split('/').length > 3) {
    return { title: 'Modifier l\'article', subtitle: 'Edition du contenu' }
  }
  if (pathname.includes('/blog')) {
    return { title: 'Articles de blog', subtitle: 'Gerer vos articles' }
  }
  // Recipes pages
  if (pathname.includes('/recettes/nouveau')) {
    return { title: 'Nouvelle recette', subtitle: 'Creer une recette sante' }
  }
  if (pathname.includes('/recettes') && pathname.split('/').length > 3) {
    return { title: 'Modifier la recette', subtitle: 'Edition de la recette' }
  }
  if (pathname.includes('/recettes')) {
    return { title: 'Recettes', subtitle: 'Gerer vos recettes' }
  }
  // Categories pages
  if (pathname.includes('/categories')) {
    return { title: 'Categories', subtitle: 'Organiser vos contenus' }
  }
  // Guide page
  if (pathname.includes('/guide')) {
    return { title: 'Guide', subtitle: 'Comment utiliser l\'administration' }
  }
  return { title: 'Administration', subtitle: 'Mon Remede' }
}

export function AdminTopbar() {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await fetch(`${API_ADMIN_PATH}/auth/logout`, { method: 'POST' })
      router.push(`${ADMIN_PATH}/login`)
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  const { title, subtitle } = getPageTitle(pathname)
  const greeting = getGreeting()

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#e5e7eb]">
      <div className="px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Left section - Page info */}
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-lg font-semibold text-[#111827]">{title}</h1>
              <p className="text-sm text-[#6b7280] mt-0.5">{subtitle}</p>
            </div>
          </div>

          {/* Right section - User info and actions */}
          <div className="flex items-center gap-5">
            {/* Time and greeting */}
            <div className="hidden md:block text-right">
              <p className="text-sm text-[#374151]">
                {greeting}, <span className="font-medium text-[#111827]">Oum Soumayya</span>
              </p>
              <p className="text-xs text-[#9ca3af] mt-0.5">
                {currentTime.toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long'
                })}
              </p>
            </div>

            {/* Divider */}
            <div className="hidden md:block w-px h-8 bg-[#e5e7eb]" />

            {/* Actions */}
            <div className="flex items-center gap-1">
              {/* Notifications placeholder */}
              <button
                className="relative p-2.5 rounded-lg text-[#6b7280] hover:text-[#111827] hover:bg-[#f3f4f6] transition-colors"
                title="Notifications"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {/* Notification dot */}
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#2563eb]" />
              </button>

              {/* Logout button */}
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-[#6b7280] hover:text-[#111827] hover:bg-[#f3f4f6] transition-colors disabled:opacity-50"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="text-sm hidden sm:inline">
                  {isLoggingOut ? 'Deconnexion...' : 'Deconnexion'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
