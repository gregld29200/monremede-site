'use client'

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  type ReactNode,
} from 'react'
import type {
  QuestionnaireState,
  QuestionnaireAction,
  PersonalInfo,
  Answer,
} from './types'
import { questions } from './data'
import {
  calculateTotalScore,
  calculateCategoryScores,
  determineProfile,
  formatSubmissionData,
} from './utils'

// État initial
const initialState: QuestionnaireState = {
  currentStep: 'intro',
  currentQuestionIndex: 0,
  personalInfo: null,
  answers: [],
  totalScore: 0,
  profile: null,
  categoryScores: null,
}

// Reducer
function questionnaireReducer(
  state: QuestionnaireState,
  action: QuestionnaireAction
): QuestionnaireState {
  switch (action.type) {
    case 'SET_PERSONAL_INFO':
      return {
        ...state,
        personalInfo: action.payload,
        currentStep: 'questions',
      }

    case 'SET_ANSWER': {
      const existingAnswerIndex = state.answers.findIndex(
        (a) => a.questionId === action.payload.questionId
      )
      let newAnswers: Answer[]

      if (existingAnswerIndex >= 0) {
        newAnswers = [...state.answers]
        newAnswers[existingAnswerIndex] = action.payload
      } else {
        newAnswers = [...state.answers, action.payload]
      }

      return {
        ...state,
        answers: newAnswers,
      }
    }

    case 'NEXT_QUESTION':
      if (state.currentQuestionIndex < questions.length - 1) {
        return {
          ...state,
          currentQuestionIndex: state.currentQuestionIndex + 1,
        }
      }
      return state

    case 'PREV_QUESTION':
      if (state.currentQuestionIndex > 0) {
        return {
          ...state,
          currentQuestionIndex: state.currentQuestionIndex - 1,
        }
      }
      return state

    case 'GO_TO_STEP':
      return {
        ...state,
        currentStep: action.payload,
      }

    case 'CALCULATE_RESULTS': {
      const totalScore = calculateTotalScore(state.answers)
      const categoryScores = calculateCategoryScores(state.answers)
      const profile = determineProfile(totalScore)

      return {
        ...state,
        totalScore,
        categoryScores,
        profile,
        currentStep: 'results',
      }
    }

    case 'RESET':
      return initialState

    default:
      return state
  }
}

// Context
interface QuestionnaireContextType {
  state: QuestionnaireState
  setPersonalInfo: (info: PersonalInfo) => void
  setAnswer: (answer: Answer) => void
  nextQuestion: () => void
  prevQuestion: () => void
  goToStep: (step: QuestionnaireState['currentStep']) => void
  calculateResults: () => void
  submitQuestionnaire: () => Promise<{ success: boolean; error?: string }>
  reset: () => void
  currentQuestion: typeof questions[number] | null
  progress: number
  canGoNext: boolean
  canGoPrev: boolean
  isLastQuestion: boolean
}

const QuestionnaireContext = createContext<QuestionnaireContextType | null>(null)

// Provider
export function QuestionnaireProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(questionnaireReducer, initialState)

  const setPersonalInfo = useCallback((info: PersonalInfo) => {
    dispatch({ type: 'SET_PERSONAL_INFO', payload: info })
  }, [])

  const setAnswer = useCallback((answer: Answer) => {
    dispatch({ type: 'SET_ANSWER', payload: answer })
  }, [])

  const nextQuestion = useCallback(() => {
    dispatch({ type: 'NEXT_QUESTION' })
  }, [])

  const prevQuestion = useCallback(() => {
    dispatch({ type: 'PREV_QUESTION' })
  }, [])

  const goToStep = useCallback((step: QuestionnaireState['currentStep']) => {
    dispatch({ type: 'GO_TO_STEP', payload: step })
  }, [])

  const calculateResults = useCallback(() => {
    dispatch({ type: 'CALCULATE_RESULTS' })
  }, [])

  const submitQuestionnaire = useCallback(async () => {
    if (!state.personalInfo) {
      return { success: false, error: 'Informations personnelles manquantes' }
    }

    try {
      const data = formatSubmissionData(state.personalInfo, state.answers)

      const response = await fetch('/api/questionnaire', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        return { success: false, error: errorData.error || 'Erreur serveur' }
      }

      return { success: true }
    } catch {
      return { success: false, error: 'Erreur de connexion' }
    }
  }, [state.personalInfo, state.answers])

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' })
  }, [])

  // Computed values
  const currentQuestion = questions[state.currentQuestionIndex] || null
  const progress = ((state.currentQuestionIndex + 1) / questions.length) * 100
  const currentAnswer = state.answers.find(
    (a) => a.questionId === currentQuestion?.id
  )
  const canGoNext = !!currentAnswer
  const canGoPrev = state.currentQuestionIndex > 0
  const isLastQuestion = state.currentQuestionIndex === questions.length - 1

  return (
    <QuestionnaireContext.Provider
      value={{
        state,
        setPersonalInfo,
        setAnswer,
        nextQuestion,
        prevQuestion,
        goToStep,
        calculateResults,
        submitQuestionnaire,
        reset,
        currentQuestion,
        progress,
        canGoNext,
        canGoPrev,
        isLastQuestion,
      }}
    >
      {children}
    </QuestionnaireContext.Provider>
  )
}

// Hook
export function useQuestionnaire() {
  const context = useContext(QuestionnaireContext)
  if (!context) {
    throw new Error(
      'useQuestionnaire must be used within a QuestionnaireProvider'
    )
  }
  return context
}
