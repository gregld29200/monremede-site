'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useQuestionnaire } from './context'
import { categories } from './data'
import { Button } from '@/components/ui'

export function QuestionnaireQuestion() {
  const {
    state,
    currentQuestion,
    setAnswer,
    nextQuestion,
    prevQuestion,
    canGoNext,
    canGoPrev,
    isLastQuestion,
    goToStep,
    calculateResults,
    submitQuestionnaire,
  } = useQuestionnaire()

  const [isAnimating, setIsAnimating] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Get current answer from global state
  const currentAnswer = useMemo(
    () => state.answers.find((a) => a.questionId === currentQuestion?.id),
    [state.answers, currentQuestion?.id]
  )

  // Derive selected option from current answer
  const selectedOption = currentAnswer?.optionId ?? null

  const category = currentQuestion
    ? categories.find((c) => c.id === currentQuestion.category)
    : null

  // Get additional info from current answer
  const additionalInfo = currentAnswer?.additionalInfo ?? ''

  const handleSelectOption = useCallback(
    (optionId: string) => {
      if (!currentQuestion) return
      const option = currentQuestion.options.find((o) => o.id === optionId)
      if (!option) return

      setAnswer({
        questionId: currentQuestion.id,
        optionId: optionId,
        points: option.points,
        additionalInfo: additionalInfo,
      })
    },
    [currentQuestion, additionalInfo, setAnswer]
  )

  const handleAdditionalInfoChange = useCallback(
    (value: string) => {
      if (!selectedOption || !currentQuestion) return
      const option = currentQuestion.options.find((o) => o.id === selectedOption)
      if (option) {
        setAnswer({
          questionId: currentQuestion.id,
          optionId: selectedOption,
          points: option.points,
          additionalInfo: value,
        })
      }
    },
    [selectedOption, currentQuestion, setAnswer]
  )

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true)
    goToStep('loading')

    // Submit to API
    const result = await submitQuestionnaire()

    // Simulate minimum loading time for better UX
    await new Promise((resolve) => setTimeout(resolve, 2000))

    if (result.success) {
      calculateResults()
    } else {
      // Handle error - could show a toast notification
      console.error(result.error)
      calculateResults() // Still show results even if save failed
    }

    setIsSubmitting(false)
  }, [goToStep, submitQuestionnaire, calculateResults])

  const handleNext = useCallback(() => {
    if (isLastQuestion) {
      handleSubmit()
    } else {
      setIsAnimating(true)
      setTimeout(() => {
        nextQuestion()
        setIsAnimating(false)
      }, 150)
    }
  }, [isLastQuestion, handleSubmit, nextQuestion])

  const handlePrev = useCallback(() => {
    setIsAnimating(true)
    setTimeout(() => {
      prevQuestion()
      setIsAnimating(false)
    }, 150)
  }, [prevQuestion])

  // Keyboard navigation
  useEffect(() => {
    if (!currentQuestion) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && canGoNext) {
        handleNext()
      }
      // Number keys to select options
      const num = parseInt(e.key)
      if (num >= 1 && num <= currentQuestion.options.length) {
        handleSelectOption(currentQuestion.options[num - 1].id)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [canGoNext, currentQuestion, handleNext, handleSelectOption])

  if (!currentQuestion) return null

  return (
    <div className="min-h-screen flex flex-col pt-20">
      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div
          className={`max-w-2xl w-full transition-all duration-300 ${
            isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
          }`}
        >
          {/* Category badge */}
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-sage/30" />
            <span className="text-xs tracking-[0.2em] uppercase text-sage font-medium px-4 py-2 bg-sage/10 rounded-full">
              {category?.name}
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-sage/30" />
          </div>

          {/* Question text */}
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl text-forest text-center mb-12 leading-snug">
            {currentQuestion.text}
          </h2>

          {/* Options */}
          <div className="space-y-4 mb-8">
            {currentQuestion.options.map((option, index) => (
              <button
                key={option.id}
                onClick={() => handleSelectOption(option.id)}
                className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-300
                  ${
                    selectedOption === option.id
                      ? 'border-gold bg-gold/10 shadow-lg shadow-gold/10'
                      : 'border-sage/20 bg-cream hover:border-sage/40 hover:bg-cream-warm'
                  }`}
              >
                <div className="flex items-start gap-4">
                  {/* Letter indicator */}
                  <span
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors
                      ${
                        selectedOption === option.id
                          ? 'bg-gold text-forest-deep'
                          : 'bg-sage/20 text-sage'
                      }`}
                  >
                    {String.fromCharCode(65 + index)}
                  </span>

                  {/* Option text */}
                  <span
                    className={`text-lg transition-colors ${
                      selectedOption === option.id ? 'text-forest' : 'text-ink-soft'
                    }`}
                  >
                    {option.text}
                  </span>

                  {/* Check icon */}
                  {selectedOption === option.id && (
                    <svg
                      className="w-6 h-6 text-gold ml-auto flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Additional info field */}
          {currentQuestion.hasAdditionalInfo && selectedOption && (
            <div className="mb-8 animate-fade-up">
              <label className="block text-sm text-ink-soft mb-2">
                {currentQuestion.additionalInfoPlaceholder || 'Précisez si nécessaire'}
              </label>
              <textarea
                value={additionalInfo}
                onChange={(e) => handleAdditionalInfoChange(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-cream border border-sage/20 rounded-lg text-ink
                  focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent
                  transition-all duration-200 resize-none"
                placeholder="Votre réponse (optionnel)..."
              />
            </div>
          )}

          {/* Keyboard hint */}
          <p className="text-center text-xs text-sage mb-8 hidden sm:block">
            Astuce : utilisez les touches <kbd className="px-2 py-1 bg-sage/10 rounded">1</kbd>-
            <kbd className="px-2 py-1 bg-sage/10 rounded">{currentQuestion.options.length}</kbd> pour sélectionner
            et <kbd className="px-2 py-1 bg-sage/10 rounded">Entrée</kbd> pour continuer
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="sticky bottom-0 bg-cream/95 backdrop-blur-sm border-t border-sage/10">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={!canGoPrev}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all
              ${
                canGoPrev
                  ? 'text-ink-soft hover:text-forest hover:bg-sage/10'
                  : 'text-sage/30 cursor-not-allowed'
              }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="hidden sm:inline">Précédent</span>
          </button>

          <Button
            onClick={handleNext}
            disabled={!canGoNext || isSubmitting}
            variant="primary"
            size="md"
          >
            {isLastQuestion ? (
              <>
                Voir mes résultats
                <svg
                  className="w-5 h-5 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </>
            ) : (
              <>
                Suivant
                <svg
                  className="w-5 h-5 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
