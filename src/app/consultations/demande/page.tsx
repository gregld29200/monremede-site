'use client'

import { Header, Footer } from '@/components/layout'
import {
  QuestionnaireProvider,
  useQuestionnaire,
  QuestionnaireProgress,
  QuestionnaireIntro,
  QuestionnaireQuestion,
  QuestionnaireLoading,
  QuestionnaireResults,
} from '@/components/questionnaire'

function QuestionnaireContent() {
  const { state } = useQuestionnaire()

  return (
    <>
      {/* Progress bar - only visible during questions */}
      <QuestionnaireProgress />

      {/* Dynamic content based on current step */}
      {state.currentStep === 'intro' && <QuestionnaireIntro />}
      {state.currentStep === 'questions' && <QuestionnaireQuestion />}
      {state.currentStep === 'loading' && <QuestionnaireLoading />}
      {state.currentStep === 'results' && <QuestionnaireResults />}
    </>
  )
}

export default function QuestionnairePage() {
  return (
    <QuestionnaireProvider>
      <Header />
      <main className="bg-cream min-h-screen">
        <QuestionnaireContent />
      </main>
      <Footer />
    </QuestionnaireProvider>
  )
}
