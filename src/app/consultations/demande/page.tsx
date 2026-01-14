'use client'

import { Header, Footer } from '@/components/layout'
import { Button } from '@/components/ui'
import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

const consultationTypes = [
  { id: 'sante-generale', name: 'Santé Générale', price: 50 },
  { id: 'troubles-digestifs', name: 'Troubles Digestifs', price: 60 },
  { id: 'equilibre-hormonal', name: 'Équilibre Hormonal', price: 70 },
  { id: 'suivi-complet', name: 'Suivi Complet', price: 110 },
]

interface QuestionnaireFormProps {
  initialType: string
}

function QuestionnaireForm({ initialType }: QuestionnaireFormProps) {
  const [formData, setFormData] = useState({
    consultationType: initialType,
    firstName: '',
    lastName: '',
    email: '',
    age: '',
    symptoms: '',
    medicalHistory: '',
    currentMedications: '',
    lifestyle: '',
    goals: '',
    additionalInfo: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500))

    // In production, you would send this to an API endpoint
    console.log('Form submitted:', formData)

    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-6">
        <div className="max-w-lg text-center">
          <div className="w-20 h-20 bg-sage/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="display-medium text-forest mb-4">
            Demande envoyée !
          </h2>
          <p className="text-ink-soft mb-8">
            Merci pour votre demande. Je vous recontacterai sous 48h par email
            pour vous envoyer votre analyse personnalisée et les modalités de paiement.
          </p>
          <Button variant="outline" asChild>
            <a href="/consultations">Retour aux consultations</a>
          </Button>
        </div>
      </div>
    )
  }

  const selectedConsultation = consultationTypes.find(t => t.id === formData.consultationType)

  return (
    <div className="py-20 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <p className="label text-sage mb-4">Questionnaire</p>
          <h1 className="display-medium text-forest mb-4">
            Demande de consultation
          </h1>
          <p className="text-ink-soft">
            Remplissez ce questionnaire pour que je puisse préparer
            votre accompagnement personnalisé.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Consultation Type */}
          <div className="bg-cream-warm p-6 rounded-lg">
            <label className="block label text-forest mb-4">
              Type de consultation *
            </label>
            <select
              name="consultationType"
              value={formData.consultationType}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-cream border border-sage/20 rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
            >
              <option value="">Sélectionnez une formule</option>
              {consultationTypes.map(type => (
                <option key={type.id} value={type.id}>
                  {type.name} – {type.price}€
                </option>
              ))}
            </select>
            {selectedConsultation && (
              <p className="mt-3 text-sm text-sage">
                Formule sélectionnée : {selectedConsultation.name} ({selectedConsultation.price}€)
              </p>
            )}
          </div>

          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="heading text-forest">Informations personnelles</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-ink-soft mb-2">Prénom *</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-cream border border-sage/20 rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="Votre prénom"
                />
              </div>
              <div>
                <label className="block text-sm text-ink-soft mb-2">Nom *</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-cream border border-sage/20 rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="Votre nom"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-ink-soft mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-cream border border-sage/20 rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="votre@email.com"
                />
              </div>
              <div>
                <label className="block text-sm text-ink-soft mb-2">Âge *</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  required
                  min="1"
                  max="120"
                  className="w-full px-4 py-3 bg-cream border border-sage/20 rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="Votre âge"
                />
              </div>
            </div>
          </div>

          {/* Health Questions */}
          <div className="space-y-4">
            <h3 className="heading text-forest">Votre santé</h3>

            <div>
              <label className="block text-sm text-ink-soft mb-2">
                Décrivez vos symptômes ou préoccupations principales *
              </label>
              <textarea
                name="symptoms"
                value={formData.symptoms}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-3 bg-cream border border-sage/20 rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent resize-none"
                placeholder="Décrivez ce qui vous amène à consulter : symptômes, fréquence, depuis combien de temps..."
              />
            </div>

            <div>
              <label className="block text-sm text-ink-soft mb-2">
                Antécédents médicaux et familiaux
              </label>
              <textarea
                name="medicalHistory"
                value={formData.medicalHistory}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 bg-cream border border-sage/20 rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent resize-none"
                placeholder="Maladies passées, opérations, allergies, antécédents familiaux..."
              />
            </div>

            <div>
              <label className="block text-sm text-ink-soft mb-2">
                Médicaments et compléments actuels
              </label>
              <textarea
                name="currentMedications"
                value={formData.currentMedications}
                onChange={handleChange}
                rows={2}
                className="w-full px-4 py-3 bg-cream border border-sage/20 rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent resize-none"
                placeholder="Listez les médicaments, vitamines ou compléments que vous prenez..."
              />
            </div>
          </div>

          {/* Lifestyle */}
          <div className="space-y-4">
            <h3 className="heading text-forest">Mode de vie</h3>

            <div>
              <label className="block text-sm text-ink-soft mb-2">
                Décrivez votre alimentation et mode de vie *
              </label>
              <textarea
                name="lifestyle"
                value={formData.lifestyle}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-3 bg-cream border border-sage/20 rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent resize-none"
                placeholder="Habitudes alimentaires, qualité du sommeil, niveau de stress, activité physique..."
              />
            </div>

            <div>
              <label className="block text-sm text-ink-soft mb-2">
                Quels sont vos objectifs de santé ? *
              </label>
              <textarea
                name="goals"
                value={formData.goals}
                onChange={handleChange}
                required
                rows={3}
                className="w-full px-4 py-3 bg-cream border border-sage/20 rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent resize-none"
                placeholder="Qu'aimeriez-vous améliorer ? Quels résultats espérez-vous ?"
              />
            </div>
          </div>

          {/* Additional Info */}
          <div>
            <label className="block text-sm text-ink-soft mb-2">
              Informations complémentaires
            </label>
            <textarea
              name="additionalInfo"
              value={formData.additionalInfo}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 bg-cream border border-sage/20 rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent resize-none"
              placeholder="Tout autre détail que vous jugez important..."
            />
          </div>

          {/* Disclaimer */}
          <div className="bg-sage/10 p-6 rounded-lg">
            <p className="text-sm text-ink-soft">
              <strong className="text-forest">Important :</strong> La naturopathie est une approche complémentaire
              et ne remplace pas un avis médical. Je ne pose pas de diagnostic et ne prescris pas de traitement.
              Consultez toujours votre médecin pour tout problème de santé.
            </p>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full justify-center"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Envoi en cours...' : 'Envoyer ma demande'}
          </Button>

          <p className="text-center text-sm text-ink-soft">
            Vous recevrez une réponse sous 48h avec votre analyse personnalisée.
          </p>
        </form>
      </div>
    </div>
  )
}

function QuestionnaireWrapper() {
  const searchParams = useSearchParams()
  const typeParam = searchParams.get('type') || ''
  const validType = consultationTypes.find(t => t.id === typeParam) ? typeParam : ''

  return <QuestionnaireForm initialType={validType} />
}

export default function DemandePage() {
  return (
    <>
      <Header />
      <main className="bg-cream min-h-screen">
        <Suspense fallback={
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="animate-pulse text-sage">Chargement...</div>
          </div>
        }>
          <QuestionnaireWrapper />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
