'use client'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const faqs = [
  {
    question: 'Ce livre est-il uniquement pour le Ramadan ?',
    answer: 'Non, bien que le Ramadan soit un fil conducteur, ce livre contient des conseils applicables toute l\'année. Les principes de naturopathie, les listes d\'aliments et les conseils de gestion du stress sont valables en toute saison pour améliorer durablement votre santé.',
  },
  {
    question: 'Faut-il des connaissances en naturopathie ?',
    answer: 'Pas du tout ! Ce livre a été écrit pour être accessible aux non-initiés tout en étant utile aux naturopathes et professionnels de santé. Les explications sont simples, parfois imagées, pour que chacune puisse comprendre son corps et agir.',
  },
  {
    question: 'Ce livre remplace-t-il un suivi médical ?',
    answer: 'Non, ce livre est un support d\'information et ne remplace pas le diagnostic d\'un professionnel de santé. En cas de doute ou si les troubles persistent, consultez toujours votre praticien. Ce guide vous aidera à mieux comprendre votre corps et à adopter une hygiène de vie saine.',
  },
  {
    question: 'Comment recevoir le livre après l\'achat ?',
    answer: 'Immédiatement après votre paiement, vous recevrez un email avec le lien de téléchargement de votre livre en format PDF. Vous pourrez le lire sur tous vos appareils : téléphone, tablette, ordinateur, et même l\'imprimer si vous le souhaitez.',
  },
  {
    question: 'Y a-t-il une version papier disponible ?',
    answer: 'La version papier est en préparation et sera disponible prochainement. Inscrivez-vous à notre newsletter pour être informée dès sa sortie. En attendant, la version PDF vous permet de commencer immédiatement votre parcours vers une meilleure santé.',
  },
]

export function FAQSection() {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <section className="faq-section py-20 lg:py-32 px-6 lg:px-20 bg-cream-warm">
      <div className="faq-container max-w-3xl mx-auto">
        {/* Header */}
        <div className="faq-header text-center mb-12 lg:mb-16">
          <p className="label text-sage mb-4">Questions fréquentes</p>
          <h2 className="display-medium text-forest">
            Vous avez des questions ?
          </h2>
        </div>

        {/* FAQ List */}
        <div className="faq-list space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={cn(
                'faq-item border border-sage/20 bg-cream transition-all duration-300',
                activeIndex === index && 'border-gold/50'
              )}
            >
              <button
                onClick={() => setActiveIndex(activeIndex === index ? -1 : index)}
                className="faq-question w-full flex items-center justify-between p-6 text-left"
              >
                <span className="font-serif text-lg text-forest pr-8">{faq.question}</span>
                <span
                  className={cn(
                    'faq-icon w-8 h-8 rounded-full border border-sage/30 flex items-center justify-center text-sage transition-transform duration-300 flex-shrink-0',
                    activeIndex === index && 'rotate-45 bg-gold border-gold text-forest-deep'
                  )}
                >
                  +
                </span>
              </button>
              <div
                className={cn(
                  'faq-answer overflow-hidden transition-all duration-300',
                  activeIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                )}
              >
                <div className="faq-answer-content px-6 pb-6 text-ink-soft leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
