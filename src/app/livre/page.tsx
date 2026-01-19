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
  title: 'La Santé dans l\'assiette – Oum Soumayya',
  description: 'Et si vous pouviez enfin comprendre votre corps ? 190+ pages de conseils concrets pour reprendre le contrôle de votre santé naturellement.',
}

export default function LivrePage() {
  return (
    <>
      <Header />
      <main>
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
