// Types pour le questionnaire interactif

export interface QuestionOption {
  id: string
  text: string
  points: number
}

export interface Question {
  id: string
  category: QuestionCategory
  text: string
  options: QuestionOption[]
  hasAdditionalInfo?: boolean
  additionalInfoPlaceholder?: string
}

export type QuestionCategory =
  | 'etatGeneral'
  | 'energieVitalite'
  | 'digestionTransit'
  | 'alimentationComportement'
  | 'emotionsMental'
  | 'sommeil'
  | 'peauCheveux'
  | 'douleursInconforts'
  | 'modeVie'

export interface CategoryInfo {
  id: QuestionCategory
  name: string
  maxScore: number
  alertThreshold: number
}

export interface Answer {
  questionId: string
  optionId: string
  points: number
  additionalInfo?: string
}

export interface PersonalInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  age: number
}

export interface CategoryScores {
  etatGeneral: number
  energieVitalite: number
  digestionTransit: number
  alimentationComportement: number
  emotionsMental: number
  sommeil: number
  peauCheveux: number
  douleursInconforts: number
  modeVie: number
}

export type ProfileType = 'equilibre' | 'alerte' | 'difficulte' | 'urgent'

export interface ProfileInfo {
  type: ProfileType
  title: string
  emoji: string
  color: string
  description: string
  recommendations: string[]
  bookBenefits: string[]
}

export interface QuestionnaireState {
  currentStep: 'intro' | 'questions' | 'loading' | 'results'
  currentQuestionIndex: number
  personalInfo: PersonalInfo | null
  answers: Answer[]
  totalScore: number
  profile: ProfileType | null
  categoryScores: CategoryScores | null
}

export type QuestionnaireAction =
  | { type: 'SET_PERSONAL_INFO'; payload: PersonalInfo }
  | { type: 'SET_ANSWER'; payload: Answer }
  | { type: 'NEXT_QUESTION' }
  | { type: 'PREV_QUESTION' }
  | { type: 'GO_TO_STEP'; payload: QuestionnaireState['currentStep'] }
  | { type: 'CALCULATE_RESULTS' }
  | { type: 'RESET' }
