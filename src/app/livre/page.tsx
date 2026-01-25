import { Header, Footer } from '@/components/layout'
import {
  HeroSection,
  PainPointsSection,
  BookContentSection,
  AuthorSection,
  TestimonialsSection,
  PricingSection,
  FAQSection,
  FinalCTASection,
} from '@/components/sections'

export const metadata = {
  title: 'La Santé dans l\'assiette - Livre Naturopathie | Oum Soumayya',
  description: 'Découvrez le livre "La Santé dans l\'assiette" par Oum Soumayya. 190+ pages de conseils naturopathie pour reprendre le contrôle de votre santé naturellement.',
}

export default function LivrePage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <HeroSection />
        <PainPointsSection />
        <BookContentSection />
        <AuthorSection />
        <TestimonialsSection />
        <PricingSection />
        <FAQSection />
        <FinalCTASection />
      </main>
      <Footer />
    </>
  )
}
