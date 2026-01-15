import { Header, Footer } from '@/components/layout'
import {
  HeroHome,
  PainPointsHome,
  PhilosophyHome,
  SolutionsHome,
  AuthorHome,
  TestimonialsHome,
  BlogRecipesHome,
  CTAFinalHome,
} from '@/components/sections/home'

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroHome />
        <PainPointsHome />
        <PhilosophyHome />
        <SolutionsHome />
        <AuthorHome />
        <TestimonialsHome />
        <BlogRecipesHome />
        <CTAFinalHome />
      </main>
      <Footer />
    </>
  )
}
