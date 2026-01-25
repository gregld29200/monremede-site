interface QuestionnaireEmailData {
  firstName: string
}

export function generateQuestionnaireResultsEmail(data: QuestionnaireEmailData): string {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Merci pour votre questionnaire - Mon Remède</title>
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

              <!-- Success Icon -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding-bottom: 24px;">
                    <div style="width: 80px; height: 80px; background-color: rgba(139, 158, 126, 0.2); border-radius: 50%; line-height: 80px; text-align: center;">
                      <span style="font-size: 36px; color: #8b9e7e;">✓</span>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Greeting -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="text-align: center; padding-bottom: 24px;">
                    <p style="font-size: 12px; letter-spacing: 2px; text-transform: uppercase; color: #8b9e7e; margin: 0 0 12px 0;">
                      Questionnaire complété
                    </p>
                    <h2 style="font-family: 'Playfair Display', Georgia, serif; font-size: 26px; color: #2D4A3E; margin: 0;">
                      Merci ${data.firstName} !
                    </h2>
                  </td>
                </tr>
              </table>

              <!-- Message -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="text-align: center; padding-bottom: 30px;">
                    <p style="font-size: 16px; color: #3d3d38; line-height: 1.7; margin: 0 0 16px 0;">
                      <em style="color: #8b9e7e;">Assalamu alaykum,</em>
                    </p>
                    <p style="font-size: 16px; color: #3d3d38; line-height: 1.7; margin: 0 0 16px 0;">
                      Merci pour l'intérêt que vous portez à votre santé naturelle.
                    </p>
                    <p style="font-size: 16px; color: #3d3d38; line-height: 1.7; margin: 0 0 16px 0;">
                      Vous recevrez votre <strong style="color: #2D4A3E;">bilan de santé personnalisé</strong> analysé par <strong style="color: #2D4A3E;">Oum Soumayya</strong>, votre praticienne en naturopathie depuis 2009, sous <strong style="color: #2D4A3E;">24 heures</strong>.
                    </p>
                    <p style="font-size: 15px; color: #8b9e7e; line-height: 1.7; margin: 0; font-style: italic;">
                      Qu'Allah vous guérisse et fasse que notre collaboration soit un bien pour nous.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Spam Notice -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background-color: #efe9dc; border-radius: 12px; padding: 20px; text-align: center;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" style="padding-bottom: 8px;">
                          <span style="font-size: 24px;">📧</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="text-align: center;">
                          <p style="font-size: 14px; color: #3d3d38; margin: 0;">
                            Pensez à vérifier vos <strong style="color: #8b9e7e;">spams</strong> si vous ne recevez pas l'email d'ici là.
                          </p>
                        </td>
                      </tr>
                    </table>
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
                      En attendant votre bilan
                    </p>
                    <h3 style="font-family: 'Playfair Display', Georgia, serif; font-size: 22px; color: #f7f4ed; margin: 0 0 16px 0;">
                      Découvrez « La Santé dans l'Assiette »
                    </h3>
                    <p style="font-size: 14px; color: rgba(247, 244, 237, 0.7); line-height: 1.6; margin: 0 0 24px 0;">
                      30 jours pour guérir naturellement — Votre guide complet en naturopathie et médecine prophétique par Oum Soumayya.
                    </p>

                    <!-- CTA Button -->
                    <a href="https://www.amazon.fr/dp/2959216601" target="_blank" style="display: inline-block; background-color: #c4a35a; color: #1a2e23; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 14px; font-weight: 600;">
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

export function getEmailSubject(): string {
  return 'Merci pour votre questionnaire santé — Mon Remède'
}
