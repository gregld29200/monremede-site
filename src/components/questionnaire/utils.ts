import type { Answer, CategoryScores, ProfileType, QuestionCategory } from './types'
import { questions, profiles, categories } from './data'

/**
 * Calcule le score total à partir des réponses
 */
export function calculateTotalScore(answers: Answer[]): number {
  return answers.reduce((total, answer) => total + answer.points, 0)
}

/**
 * Calcule les scores par catégorie
 */
export function calculateCategoryScores(answers: Answer[]): CategoryScores {
  const scores: CategoryScores = {
    etatGeneral: 0,
    energieVitalite: 0,
    digestionTransit: 0,
    alimentationComportement: 0,
    emotionsMental: 0,
    sommeil: 0,
    peauCheveux: 0,
    douleursInconforts: 0,
    modeVie: 0,
  }

  answers.forEach((answer) => {
    const question = questions.find((q) => q.id === answer.questionId)
    if (question) {
      scores[question.category] += answer.points
    }
  })

  return scores
}

/**
 * Détermine le profil en fonction du score total
 */
export function determineProfile(totalScore: number): ProfileType {
  if (totalScore <= 12) return 'equilibre'
  if (totalScore <= 25) return 'alerte'
  if (totalScore <= 37) return 'difficulte'
  return 'urgent'
}

/**
 * Récupère les informations du profil
 */
export function getProfileInfo(profileType: ProfileType) {
  return profiles[profileType]
}

/**
 * Identifie les catégories en alerte (score élevé)
 */
export function getAlertCategories(categoryScores: CategoryScores): QuestionCategory[] {
  const alertCategories: QuestionCategory[] = []

  categories.forEach((cat) => {
    if (categoryScores[cat.id] > cat.alertThreshold) {
      alertCategories.push(cat.id)
    }
  })

  return alertCategories
}

/**
 * Récupère le nom d'une catégorie
 */
export function getCategoryName(categoryId: QuestionCategory): string {
  const category = categories.find((c) => c.id === categoryId)
  return category?.name || categoryId
}

/**
 * Récupère les infos d'une catégorie
 */
export function getCategoryInfo(categoryId: QuestionCategory) {
  return categories.find((c) => c.id === categoryId)
}

/**
 * Calcule le pourcentage d'un score de catégorie
 */
export function getCategoryScorePercentage(
  categoryId: QuestionCategory,
  score: number
): number {
  const category = categories.find((c) => c.id === categoryId)
  if (!category) return 0
  return Math.round((score / category.maxScore) * 100)
}

/**
 * Récupère le texte de la question à partir de son ID
 */
export function getQuestionText(questionId: string): string {
  const question = questions.find((q) => q.id === questionId)
  return question?.text || ''
}

/**
 * Récupère le texte de l'option sélectionnée
 */
export function getAnswerText(questionId: string, optionId: string): string {
  const question = questions.find((q) => q.id === questionId)
  if (!question) return ''
  const option = question.options.find((o) => o.id === optionId)
  return option?.text || ''
}

/**
 * Formate les données pour l'envoi à l'API
 */
export function formatSubmissionData(
  personalInfo: { firstName: string; lastName: string; email: string; phone: string; age: number },
  answers: Answer[]
) {
  const totalScore = calculateTotalScore(answers)
  const categoryScores = calculateCategoryScores(answers)
  const profile = determineProfile(totalScore)

  return {
    ...personalInfo,
    totalScore,
    profile,
    categoryScores,
    answers: answers.map((answer) => ({
      questionId: answer.questionId,
      questionText: getQuestionText(answer.questionId),
      answerText: getAnswerText(answer.questionId, answer.optionId),
      points: answer.points,
      additionalInfo: answer.additionalInfo || '',
    })),
  }
}
