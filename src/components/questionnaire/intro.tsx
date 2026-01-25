'use client'

import { useState } from 'react'
import { useQuestionnaire } from './context'
import { Button } from '@/components/ui'

export function QuestionnaireIntro() {
  const { setPersonalInfo } = useQuestionnaire()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    age: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Prénom requis'
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Nom requis'
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email requis'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email invalide'
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Téléphone requis'
    } else if (!/^[\d\s+\-().]{8,}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Numéro invalide'
    }
    if (!formData.age) {
      newErrors.age = 'Âge requis'
    } else if (parseInt(formData.age) < 1 || parseInt(formData.age) > 120) {
      newErrors.age = 'Âge invalide'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      setPersonalInfo({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        age: parseInt(formData.age),
      })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 pt-32 pb-20">
      <div className="max-w-xl w-full">
        {/* Decorative elements */}
        <div className="absolute top-20 right-10 w-64 h-64 bg-sage/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 left-10 w-48 h-48 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-forest mb-6 leading-tight">
              Faites le point sur<br />
              <span className="text-sage italic">votre état de santé</span>
            </h1>

            <p className="text-ink-soft text-lg leading-relaxed max-w-md mx-auto">
              En quelques minutes, découvrez les signaux que votre corps vous envoie
              — et que vous ignorez peut-être.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-cream-warm/50 p-8 rounded-2xl border border-sage/10">
              <p className="label text-sage mb-6 text-center">Vos informations</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm text-ink-soft mb-2">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-cream border rounded-lg text-ink
                      focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent
                      transition-all duration-200
                      ${errors.firstName ? 'border-blush-deep' : 'border-sage/20'}`}
                    placeholder="Votre prénom"
                  />
                  {errors.firstName && (
                    <p className="text-blush-deep text-xs mt-1">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm text-ink-soft mb-2">
                    Nom *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-cream border rounded-lg text-ink
                      focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent
                      transition-all duration-200
                      ${errors.lastName ? 'border-blush-deep' : 'border-sage/20'}`}
                    placeholder="Votre nom"
                  />
                  {errors.lastName && (
                    <p className="text-blush-deep text-xs mt-1">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="email" className="block text-sm text-ink-soft mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-cream border rounded-lg text-ink
                    focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent
                    transition-all duration-200
                    ${errors.email ? 'border-blush-deep' : 'border-sage/20'}`}
                  placeholder="votre@email.com"
                />
                {errors.email && (
                  <p className="text-blush-deep text-xs mt-1">{errors.email}</p>
                )}
                <p className="text-xs text-sage mt-1.5">
                  C&apos;est à cette adresse que vous recevrez votre bilan de santé personnalisé.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phone" className="block text-sm text-ink-soft mb-2">
                    Téléphone *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-cream border rounded-lg text-ink
                      focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent
                      transition-all duration-200
                      ${errors.phone ? 'border-blush-deep' : 'border-sage/20'}`}
                    placeholder="06 12 34 56 78"
                  />
                  {errors.phone && (
                    <p className="text-blush-deep text-xs mt-1">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="age" className="block text-sm text-ink-soft mb-2">
                    Âge *
                  </label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    min="1"
                    max="120"
                    className={`w-full px-4 py-3 bg-cream border rounded-lg text-ink
                      focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent
                      transition-all duration-200
                      ${errors.age ? 'border-blush-deep' : 'border-sage/20'}`}
                    placeholder="Votre âge"
                  />
                  {errors.age && (
                    <p className="text-blush-deep text-xs mt-1">{errors.age}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="text-center">
              <Button type="submit" variant="primary" size="lg">
                Commencer le questionnaire
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
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Button>

              <p className="text-xs text-ink-soft mt-4">
                Vos données sont confidentielles et ne seront jamais partagées.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
