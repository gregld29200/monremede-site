'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'

const navigation = [
  { name: 'Accueil', href: '/' },
  { name: 'Le Livre', href: '/livre' },
  { name: 'Consultations', href: '/consultations' },
  { name: 'Blog', href: '/blog' },
  { name: 'Recettes', href: '/recettes' },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-forest-deep/95 backdrop-blur-md shadow-lg py-4'
          : 'bg-transparent py-6'
      )}
    >
      <div className="mx-auto max-w-7xl px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="Mon Remède"
            width={120}
            height={50}
            className={cn(
              "transition-all duration-300 h-auto",
              isScrolled ? "brightness-0 invert" : ""
            )}
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm text-cream/80 hover:text-gold transition-colors tracking-wide"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* CTA Button */}
        <div className="hidden md:block">
          <Link
            href="/livre"
            className="inline-flex items-center gap-2 bg-gold text-forest-deep px-5 py-2.5 text-xs font-medium uppercase tracking-wider hover:bg-gold-light transition-colors"
          >
            Découvrir le livre
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-cream p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-forest-deep/98 backdrop-blur-md border-t border-cream/10">
          <nav className="px-6 py-6 flex flex-col gap-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-cream/80 hover:text-gold transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/livre"
              className="inline-flex items-center justify-center gap-2 bg-gold text-forest-deep px-5 py-3 text-sm font-medium uppercase tracking-wider mt-4"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Découvrir le livre
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
