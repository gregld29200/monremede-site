/**
 * Email template for Ramadan gifts lead magnet confirmation
 */

interface RamadanGiftsEmailProps {
  firstName: string
}

export function generateRamadanGiftsEmail({ firstName }: RamadanGiftsEmailProps): string {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Votre inscription est confirmée !</title>
</head>
<body style="margin: 0; padding: 0; font-family: Georgia, 'Times New Roman', serif; background-color: #f7f4ed; color: #1a2e23;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f7f4ed;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">

          <!-- Header -->
          <tr>
            <td style="background-color: #1a2e23; padding: 32px 40px; text-align: center;">
              <h1 style="margin: 0; color: #f7f4ed; font-size: 24px; font-weight: normal; letter-spacing: 2px;">
                MON REMÈDE
              </h1>
              <p style="margin: 8px 0 0; color: #c4a35a; font-size: 14px; font-style: italic;">
                Naturopathie & Bien-être
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 48px 40px;">

              <!-- Moon decoration -->
              <div style="text-align: center; margin-bottom: 24px;">
                <span style="font-size: 48px;">🌙</span>
              </div>

              <h2 style="margin: 0 0 16px; color: #1a2e23; font-size: 28px; font-weight: normal; text-align: center;">
                Inscription confirmée !
              </h2>

              <p style="margin: 0 0 24px; color: #3d3d38; font-size: 16px; line-height: 1.7;">
                Salaam alaikum ${firstName},
              </p>

              <p style="margin: 0 0 24px; color: #3d3d38; font-size: 16px; line-height: 1.7;">
                Merci pour votre confiance ! Votre inscription pour recevoir les guides Ramadan est bien enregistrée.
              </p>

              <!-- Info box -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 32px 0;">
                <tr>
                  <td style="padding: 24px; background-color: #efe9dc; border-radius: 8px; text-align: center;">
                    <p style="margin: 0 0 8px; color: #c4a35a; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; font-weight: 600;">
                      Prochaine étape
                    </p>
                    <p style="margin: 0; color: #1a2e23; font-size: 18px; line-height: 1.6;">
                      Vous recevrez le lien de téléchargement de vos guides<br>
                      <strong>dans les 24 heures</strong>, incha'Allah.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Guides preview -->
              <p style="margin: 24px 0 16px; color: #8b9e7e; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; text-align: center;">
                Vos 2 guides gratuits
              </p>

              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0 0 32px;">
                <tr>
                  <td style="padding: 20px; background-color: #f7f4ed; border-radius: 8px;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="padding-bottom: 16px;">
                          <p style="margin: 0; color: #c4a35a; font-size: 12px; font-weight: 600;">
                            01
                          </p>
                          <p style="margin: 4px 0 0; color: #1a2e23; font-size: 16px;">
                            Préparer son corps au Ramadan
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style="border-top: 1px solid #e8d4cf; padding-top: 16px;">
                          <p style="margin: 0; color: #c4a35a; font-size: 12px; font-weight: 600;">
                            02
                          </p>
                          <p style="margin: 4px 0 0; color: #1a2e23; font-size: 16px;">
                            Recettes saines pour le Ramadan
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <hr style="border: none; border-top: 1px solid #e8d4cf; margin: 32px 0;">

              <!-- Additional info -->
              <p style="margin: 0 0 16px; color: #3d3d38; font-size: 15px; line-height: 1.7;">
                Que ce Ramadan soit pour vous une source de bénédictions, de santé et de sérénité.
              </p>

              <p style="margin: 0; color: #3d3d38; font-size: 15px; line-height: 1.7;">
                Avec bienveillance,<br>
                <strong style="color: #1a2e23;">Zayneb OLD</strong><br>
                <span style="color: #8b9e7e; font-style: italic;">Naturopathe</span>
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #efe9dc; padding: 24px 40px; text-align: center;">
              <p style="margin: 0 0 8px; color: #8b9e7e; font-size: 13px;">
                Mon Remède - Naturopathie
              </p>
              <p style="margin: 0; color: #8b9e7e; font-size: 12px;">
                <a href="https://monremede.com" style="color: #8b9e7e; text-decoration: underline;">monremede.com</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()
}

export function getRamadanGiftsEmailSubject(): string {
  return '🌙 Votre inscription est confirmée - Guides Ramadan'
}
