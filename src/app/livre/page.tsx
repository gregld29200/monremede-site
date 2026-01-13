import { Header, Footer } from '@/components/layout'
import {
  HeroSection,
  PainPointsSection,
  TransformationSection,
  BookContentSection,
  AuthorSection,
  TestimonialsSection,
  PricingSection,
  FAQSection,
  FinalCTASection,
} from '@/components/sections'

export const metadata = {
  title: 'La Santé dans l\'assiette – Oum Soumayya',
  description: '30 jours pour se soigner naturellement. Découvrez comment transformer votre Ramadan en période de guérison avec ce guide complet de naturopathie.',
}

export default function LivrePage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <PainPointsSection />
        <TransformationSection />
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
