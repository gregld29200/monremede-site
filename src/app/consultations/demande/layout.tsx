import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Questionnaire Consultation Naturopathie | Mon Remède',
  description: 'Remplissez notre questionnaire personnalisé pour recevoir des conseils naturopathie adaptés à votre situation. Analyse de votre mode de vie et recommandations sur mesure.',
}

export default function DemandeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
