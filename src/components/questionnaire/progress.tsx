'use client'

import { useQuestionnaire } from './context'
import { questions } from './data'

// Inline progress bar component for the bottom navigation
export function QuestionnaireProgressBar() {
  const { progress } = useQuestionnaire()

  return (
    <div className="h-1 bg-sage/20">
      <div
        className="h-full bg-gradient-to-r from-gold to-gold-light transition-all duration-500 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}

// Question counter component
export function QuestionnaireCounter() {
  const { state } = useQuestionnaire()

  return (
    <span className="text-xs text-sage tabular-nums">
      {state.currentQuestionIndex + 1} / {questions.length}
    </span>
  )
}

// Legacy export for backwards compatibility (now a no-op)
export function QuestionnaireProgress() {
  return null
}
