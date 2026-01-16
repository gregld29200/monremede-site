'use client'

import { useQuestionnaire } from './context'
import { questions } from './data'

export function QuestionnaireProgress() {
  const { state, progress } = useQuestionnaire()

  if (state.currentStep !== 'questions') return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-cream/95 backdrop-blur-sm border-b border-sage/10">
      <div className="max-w-3xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs tracking-[0.2em] uppercase text-sage font-medium">
            Questionnaire Santé
          </span>
          <span className="text-sm text-ink-soft">
            Question {state.currentQuestionIndex + 1} / {questions.length}
          </span>
        </div>

        {/* Progress bar */}
        <div className="relative h-1 bg-sage/20 rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-gold to-gold-light rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}
