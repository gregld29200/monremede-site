declare global {
  interface Window {
    gtag: (
      command: 'event' | 'config' | 'js',
      targetId: string | Date,
      config?: Record<string, unknown>
    ) => void
    dataLayer: unknown[]
  }
}

type GTagEvent = {
  action: string
  category: string
  label?: string
  value?: number
}

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

// Envoyer un événement personnalisé à GA4
export function sendGAEvent({ action, category, label, value }: GTagEvent) {
  if (typeof window === 'undefined' || !GA_MEASUREMENT_ID) return

  window.gtag?.('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  })
}

// Événements spécifiques pour Mon Remède

// Clic sur le lien Amazon pour acheter le livre
export function trackAmazonBookClick(format: 'broché' | 'kindle' = 'broché') {
  sendGAEvent({
    action: 'click_amazon_book',
    category: 'ecommerce',
    label: format,
  })
}

// Clic sur une consultation
export function trackConsultationClick(consultationType: string) {
  sendGAEvent({
    action: 'click_consultation',
    category: 'engagement',
    label: consultationType,
  })
}

// Début du questionnaire
export function trackQuestionnaireStart() {
  sendGAEvent({
    action: 'questionnaire_start',
    category: 'engagement',
  })
}

// Progression dans le questionnaire
export function trackQuestionnaireProgress(step: number, totalSteps: number) {
  sendGAEvent({
    action: 'questionnaire_progress',
    category: 'engagement',
    label: `step_${step}`,
    value: Math.round((step / totalSteps) * 100),
  })
}

// Fin du questionnaire
export function trackQuestionnaireComplete(consultationType: string) {
  sendGAEvent({
    action: 'questionnaire_complete',
    category: 'conversion',
    label: consultationType,
  })
}

// Inscription à la newsletter (futur)
export function trackEmailSignup(source: string) {
  sendGAEvent({
    action: 'email_signup',
    category: 'conversion',
    label: source,
  })
}

// Lecture d'un article de blog
export function trackBlogRead(slug: string, title: string) {
  sendGAEvent({
    action: 'blog_read',
    category: 'content',
    label: `${slug} - ${title}`,
  })
}

// Lecture d'une recette
export function trackRecipeRead(slug: string, title: string) {
  sendGAEvent({
    action: 'recipe_read',
    category: 'content',
    label: `${slug} - ${title}`,
  })
}

// Clic sur les réseaux sociaux
export function trackSocialClick(platform: string) {
  sendGAEvent({
    action: 'social_click',
    category: 'engagement',
    label: platform,
  })
}
