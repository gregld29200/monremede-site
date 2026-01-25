import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cadeaux Ramadan - Guides Gratuits | Mon Remède',
  description: 'Recevez gratuitement 2 guides pour préparer le Ramadan : conseils naturopathiques et recettes saines pour le ftour et le shour.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function CadeauxRamadanLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
