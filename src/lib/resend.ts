import { Resend } from 'resend'

export const FROM_EMAIL = 'Mon Remède <noreply@monremede.com>'
export const REPLY_TO_EMAIL = 'contact@monremede.com'

// Create a lazy-loaded Resend instance
let resendInstance: Resend | null = null

export function getResendClient(): Resend | null {
  if (!process.env.RESEND_API_KEY) {
    console.warn('Warning: RESEND_API_KEY is not set. Email sending will be skipped.')
    return null
  }

  if (!resendInstance) {
    resendInstance = new Resend(process.env.RESEND_API_KEY)
  }

  return resendInstance
}
