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

export default function Home() {
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
