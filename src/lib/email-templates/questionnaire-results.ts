interface CategoryScores {
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

interface ProfileInfo {
  title: string
  emoji: string
  description: string
  recommendations: string[]
  bookBenefits: string[]
}

interface QuestionnaireEmailData {
  firstName: string
  lastName: string
  totalScore: number
  profile: 'equilibre' | 'alerte' | 'difficulte' | 'urgent'
  categoryScores: CategoryScores
}

const categories = [
  { id: 'etatGeneral', name: 'État de Santé Général', maxScore: 9 },
  { id: 'energieVitalite', name: 'Énergie & Vitalité', maxScore: 5 },
  { id: 'digestionTransit', name: 'Digestion & Transit', maxScore: 6 },
  { id: 'alimentationComportement', name: 'Alimentation & Comportement', maxScore: 6 },
  { id: 'emotionsMental', name: 'Émotions & Mental', maxScore: 6 },
  { id: 'sommeil', name: 'Sommeil', maxScore: 3 },
  { id: 'peauCheveux', name: 'Peau & Cheveux', maxScore: 3 },
  { id: 'douleursInconforts', name: 'Douleurs & Inconforts', maxScore: 3 },
  { id: 'modeVie', name: 'Mode de Vie', maxScore: 6 },
] as const

const profiles: Record<string, ProfileInfo> = {
  equilibre: {
    title: 'Profil « Équilibré »',
    emoji: '🌟',
    description: 'Félicitations ! Votre hygiène de vie est globalement excellente. Votre corps fonctionne de manière optimale et vous avez de bonnes habitudes.',
    recommendations: [
      'Maintenir vos bonnes habitudes',
      'Approfondir vos connaissances pour prévenir les déséquilibres futurs',
      'Optimiser encore certains aspects pour atteindre une santé rayonnante',
    ],
    bookBenefits: [
      'Les secrets de la longévité et du vieillissement en bonne santé',
      'Comment maximiser les bienfaits du jeûne',
      'Des recettes pour booster encore votre vitalité',
    ],
  },
  alerte: {
    title: 'Profil « En Alerte »',
    emoji: '⚠️',
    description: 'Attention ! Votre corps vous envoie des signaux qu\'il ne faut pas ignorer. Vous êtes dans une zone où de petits ajustements peuvent faire une grande différence.',
    recommendations: [
      'Fatigue récurrente',
      'Digestion perturbée',
      'Fringales sucrées',
      'Émotions difficiles à gérer',
    ],
    bookBenefits: [
      'Comment nettoyer votre organisme en douceur',
      'Les aliments qui drainent et ceux qui encrassent',
      'Un programme détox adapté au Ramadan',
      'Les erreurs alimentaires que vous faites sans le savoir',
      'Comment retrouver votre énergie naturelle',
    ],
  },
  difficulte: {
    title: 'Profil « En Difficulté »',
    emoji: '🔴',
    description: 'Votre corps tire la sonnette d\'alarme ! Les symptômes que vous ressentez ne sont pas « normaux » — ce sont des cris de détresse de votre organisme.',
    recommendations: [
      'Votre foie est surchargé',
      'Votre intestin est probablement poreux',
      'Votre système nerveux est épuisé',
      'Votre inflammation chronique silencieuse fait des dégâts',
    ],
    bookBenefits: [
      'Comment fonctionne votre corps pendant le jeûne',
      'Le protocole de détox en 15 jours étape par étape',
      'Les aliments anti-inflammatoires puissants',
      'Comment réparer votre intestin',
      'Les remèdes de la médecine prophétique validés par la science',
      'Un plan alimentaire complet pour chaque pathologie',
    ],
  },
  urgent: {
    title: 'Profil « Urgent »',
    emoji: '🚨',
    description: 'C\'est un appel à l\'action immédiat. Votre corps est en souffrance profonde et chaque jour qui passe aggrave la situation.',
    recommendations: [
      'Consulter un professionnel de santé pour écarter toute pathologie grave',
      'Revoir entièrement votre alimentation — ce n\'est plus une option',
      'Comprendre les mécanismes de votre corps pour ne plus subir',
    ],
    bookBenefits: [
      'Pourquoi vous en êtes arrivée là (et ce n\'est pas votre faute)',
      'Comment le corps se régénère — organe par organe',
      'Le pouvoir thérapeutique du jeûne, validé par la science',
      'Un programme complet de restauration',
      'Les aliments qui guérissent selon la médecine prophétique',
      'Comment transformer le Ramadan en cure de jouvence',
      'Des solutions concrètes pour chaque symptôme',
    ],
  },
}

const AMAZON_BOOK_LINK = 'https://www.amazon.fr/dp/2959216601'

function getCategoryAlertThreshold(categoryId: string): number {
  const thresholds: Record<string, number> = {
    etatGeneral: 5,
    energieVitalite: 3,
    digestionTransit: 4,
    alimentationComportement: 3,
    emotionsMental: 3,
    sommeil: 2,
    peauCheveux: 2,
    douleursInconforts: 2,
    modeVie: 3,
  }
  return thresholds[categoryId] || 0
}

export function generateQuestionnaireResultsEmail(data: QuestionnaireEmailData): string {
  const profileInfo = profiles[data.profile]

  // Calculer les catégories en alerte
  const alertCategories = categories.filter(cat => {
    const score = data.categoryScores[cat.id as keyof CategoryScores]
    return score > getCategoryAlertThreshold(cat.id)
  })

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Votre Pré-Bilan de Santé - Mon Remède</title>
</head>
<body style="margin: 0; padding: 0; font-family: Georgia, 'Times New Roman', serif; background-color: #f7f4ed; color: #1a1a18;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f7f4ed;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%;">

          <!-- Header -->
          <tr>
            <td style="text-align: center; padding-bottom: 30px;">
              <h1 style="font-family: 'Playfair Display', Georgia, serif; font-size: 28px; color: #2D4A3E; margin: 0;">
                Mon Remède
              </h1>
              <p style="font-size: 12px; letter-spacing: 2px; text-transform: uppercase; color: #8b9e7e; margin-top: 8px;">
                Naturopathie & Médecine Prophétique
              </p>
            </td>
          </tr>

          <!-- Main Content Card -->
          <tr>
            <td style="background-color: #ffffff; border-radius: 16px; padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">

              <!-- Greeting -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="text-align: center; padding-bottom: 30px;">
                    <p style="font-size: 14px; color: #8b9e7e; margin: 0 0 10px 0;">Votre Pré-Bilan de Santé</p>
                    <h2 style="font-family: 'Playfair Display', Georgia, serif; font-size: 24px; color: #2D4A3E; margin: 0;">
                      Bonjour ${data.firstName},
                    </h2>
                  </td>
                </tr>
              </table>

              <!-- Score Section -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 20px 0 30px 0;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="background-color: #efe9dc; border-radius: 50%; width: 120px; height: 120px; text-align: center; vertical-align: middle;">
                          <span style="font-family: 'Playfair Display', Georgia, serif; font-size: 42px; color: #2D4A3E;">${data.totalScore}</span>
                          <span style="font-size: 18px; color: #8b9e7e;">/50</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Profile Title -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="text-align: center; padding-bottom: 20px;">
                    <span style="font-size: 32px;">${profileInfo.emoji}</span>
                    <h3 style="font-family: 'Playfair Display', Georgia, serif; font-size: 22px; color: #2D4A3E; margin: 10px 0;">
                      ${profileInfo.title}
                    </h3>
                    <p style="font-size: 15px; color: #3d3d38; line-height: 1.6; margin: 0;">
                      ${profileInfo.description}
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <tr>
                <td style="padding: 30px 0;">
                  <hr style="border: none; border-top: 1px solid #e8d4cf; margin: 0;">
                </td>
              </tr>

              <!-- Category Analysis -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <h4 style="font-family: 'Playfair Display', Georgia, serif; font-size: 18px; color: #2D4A3E; margin: 0 0 20px 0; text-align: center;">
                      Analyse par catégorie
                    </h4>

                    ${categories.map(cat => {
                      const score = data.categoryScores[cat.id as keyof CategoryScores]
                      const percentage = Math.round((score / cat.maxScore) * 100)
                      const isAlert = score > getCategoryAlertThreshold(cat.id)
                      const barColor = isAlert ? '#d4aea5' : '#8b9e7e'

                      return `
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 12px;">
                          <tr>
                            <td style="padding-bottom: 4px;">
                              <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                  <td style="font-size: 13px; color: #3d3d38;">${cat.name}</td>
                                  <td style="font-size: 13px; color: ${isAlert ? '#d4aea5' : '#8b9e7e'}; text-align: right;">
                                    ${score}/${cat.maxScore} ${isAlert ? '⚠️' : ''}
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #efe9dc; border-radius: 4px; height: 8px;">
                                <tr>
                                  <td style="width: ${percentage}%; background-color: ${barColor}; border-radius: 4px;"></td>
                                  <td style="width: ${100 - percentage}%;"></td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      `
                    }).join('')}
                  </td>
                </tr>
              </table>

              ${alertCategories.length > 0 ? `
              <!-- Alert Categories -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 30px;">
                <tr>
                  <td style="background-color: #fdf5f3; border: 1px solid #e8d4cf; border-radius: 12px; padding: 20px;">
                    <h4 style="font-family: 'Playfair Display', Georgia, serif; font-size: 16px; color: #2D4A3E; margin: 0 0 12px 0;">
                      Points d'attention
                    </h4>
                    <p style="font-size: 14px; color: #3d3d38; margin: 0 0 12px 0;">
                      Les catégories suivantes nécessitent une attention particulière :
                    </p>
                    <ul style="margin: 0; padding-left: 20px;">
                      ${alertCategories.map(cat => `
                        <li style="font-size: 14px; color: #3d3d38; margin-bottom: 6px;">${cat.name}</li>
                      `).join('')}
                    </ul>
                  </td>
                </tr>
              </table>
              ` : ''}

              <!-- Recommendations -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 30px;">
                <tr>
                  <td>
                    <h4 style="font-family: 'Playfair Display', Georgia, serif; font-size: 18px; color: #2D4A3E; margin: 0 0 16px 0; text-align: center;">
                      ${data.profile === 'equilibre' ? 'Ce que vous pouvez améliorer' : 'Ce que votre corps essaie de vous dire'}
                    </h4>

                    ${profileInfo.recommendations.map((rec, index) => `
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 10px;">
                        <tr>
                          <td style="background-color: #efe9dc; border-radius: 8px; padding: 12px 16px;">
                            <table width="100%" cellpadding="0" cellspacing="0">
                              <tr>
                                <td style="width: 30px; vertical-align: top;">
                                  <span style="display: inline-block; width: 24px; height: 24px; background-color: rgba(139, 158, 126, 0.2); border-radius: 50%; text-align: center; line-height: 24px; font-size: 12px; color: #2D4A3E;">${index + 1}</span>
                                </td>
                                <td style="font-size: 14px; color: #3d3d38; vertical-align: middle;">
                                  ${rec}
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    `).join('')}
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Book CTA Section -->
          <tr>
            <td style="padding-top: 30px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #1a2e23; border-radius: 16px; padding: 40px;">
                <tr>
                  <td style="text-align: center;">
                    <p style="font-size: 12px; letter-spacing: 2px; text-transform: uppercase; color: #c4a35a; margin: 0 0 16px 0;">
                      La solution
                    </p>
                    <h3 style="font-family: 'Playfair Display', Georgia, serif; font-size: 22px; color: #f7f4ed; margin: 0 0 16px 0;">
                      Découvrez « La Santé dans l'Assiette »
                    </h3>
                    <p style="font-size: 14px; color: rgba(247, 244, 237, 0.7); line-height: 1.6; margin: 0 0 24px 0;">
                      Votre guide complet pour transformer le Ramadan en cure de régénération — par Oum Soumayya, praticienne en Médecine Prophétique et Naturopathie.
                    </p>

                    <!-- Book Benefits -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: rgba(247, 244, 237, 0.1); border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                      <tr>
                        <td>
                          <p style="font-size: 12px; letter-spacing: 1px; text-transform: uppercase; color: #c4a35a; margin: 0 0 12px 0; text-align: left;">
                            Dans ce livre, vous découvrirez :
                          </p>
                          ${profileInfo.bookBenefits.slice(0, 5).map(benefit => `
                            <p style="font-size: 14px; color: rgba(247, 244, 237, 0.9); margin: 0 0 8px 0; text-align: left;">
                              <span style="color: #c4a35a;">✓</span> ${benefit}
                            </p>
                          `).join('')}
                        </td>
                      </tr>
                    </table>

                    <!-- CTA Button -->
                    <a href="${AMAZON_BOOK_LINK}" target="_blank" style="display: inline-block; background-color: #c4a35a; color: #1a2e23; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 14px; font-weight: 600;">
                      Commander sur Amazon →
                    </a>
                    <p style="font-size: 12px; color: rgba(247, 244, 237, 0.5); margin-top: 12px;">
                      Disponible en format broché et Kindle
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Consultation CTA -->
          <tr>
            <td style="padding-top: 20px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; padding: 30px; text-align: center;">
                <tr>
                  <td>
                    <h4 style="font-family: 'Playfair Display', Georgia, serif; font-size: 18px; color: #2D4A3E; margin: 0 0 12px 0;">
                      Besoin d'un accompagnement personnalisé ?
                    </h4>
                    <p style="font-size: 14px; color: #3d3d38; margin: 0 0 20px 0;">
                      Découvrez nos consultations en naturopathie avec Oum Soumayya.
                    </p>
                    <a href="https://monremede.com/consultations" style="display: inline-block; background-color: transparent; color: #2D4A3E; text-decoration: none; padding: 12px 28px; border: 2px solid #8b9e7e; border-radius: 8px; font-size: 14px;">
                      Découvrir les consultations
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top: 40px; text-align: center;">
              <p style="font-size: 12px; color: #8b9e7e; margin: 0 0 8px 0;">
                Mon Remède — Naturopathie & Médecine Prophétique
              </p>
              <p style="font-size: 11px; color: #b5c4a8; margin: 0;">
                Ce questionnaire est à titre informatif et ne remplace pas un avis médical.<br>
                Consultez un professionnel de santé pour tout problème de santé.
              </p>
              <p style="font-size: 11px; color: #b5c4a8; margin-top: 20px;">
                © ${new Date().getFullYear()} Mon Remède. Tous droits réservés.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`
}

export function getEmailSubject(profile: string): string {
  const subjects: Record<string, string> = {
    equilibre: 'Votre pré-bilan de santé — Profil Équilibré 🌟',
    alerte: 'Votre pré-bilan de santé — Profil En Alerte ⚠️',
    difficulte: 'Votre pré-bilan de santé — Profil En Difficulté',
    urgent: 'Votre pré-bilan de santé — Profil Urgent',
  }
  return subjects[profile] || 'Votre pré-bilan de santé — Mon Remède'
}
