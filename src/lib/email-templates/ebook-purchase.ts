/**
 * Email template for ebook purchase confirmation
 */

interface EbookPurchaseEmailProps {
  customerName: string
  downloadUrl: string
  expirationTime: string
}

export function generateEbookPurchaseEmail({
  customerName,
  downloadUrl,
  expirationTime,
}: EbookPurchaseEmailProps): string {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Votre e-book est prêt !</title>
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
                MON REMEDE
              </h1>
              <p style="margin: 8px 0 0; color: #c4a35a; font-size: 14px; font-style: italic;">
                Naturopathie & Bien-être
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 48px 40px;">

              <!-- Book emoji -->
              <div style="text-align: center; margin-bottom: 24px;">
                <span style="font-size: 48px;">📖</span>
              </div>

              <h2 style="margin: 0 0 16px; color: #1a2e23; font-size: 28px; font-weight: normal; text-align: center;">
                Votre e-book est prêt !
              </h2>

              <p style="margin: 0 0 24px; color: #3d3d38; font-size: 16px; line-height: 1.7;">
                Bonjour ${customerName},
              </p>

              <p style="margin: 0 0 24px; color: #3d3d38; font-size: 16px; line-height: 1.7;">
                Merci pour votre achat ! Votre e-book <strong>"La Santé dans l'assiette"</strong> est maintenant disponible au téléchargement.
              </p>

              <!-- CTA Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 32px 0;">
                <tr>
                  <td align="center">
                    <a href="${downloadUrl}" style="display: inline-block; padding: 16px 32px; background-color: #c4a35a; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 6px; letter-spacing: 0.5px;">
                      Télécharger mon e-book
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Warning box -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 32px 0;">
                <tr>
                  <td style="padding: 20px; background-color: #fff3cd; border-left: 4px solid #c4a35a; border-radius: 4px;">
                    <p style="margin: 0; color: #856404; font-size: 14px; line-height: 1.6;">
                      <strong>Important :</strong> Ce lien expire le <strong>${expirationTime}</strong> et ne peut être utilisé qu'une seule fois. Téléchargez votre e-book dès maintenant !
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Book preview -->
              <p style="margin: 24px 0 16px; color: #8b9e7e; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; text-align: center;">
                Votre achat
              </p>

              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0 0 32px;">
                <tr>
                  <td style="padding: 20px; background-color: #f7f4ed; border-radius: 8px;">
                    <p style="margin: 0 0 8px; color: #1a2e23; font-size: 18px; font-weight: 600;">
                      La Santé dans l'assiette
                    </p>
                    <p style="margin: 0 0 4px; color: #8b9e7e; font-size: 14px;">
                      30 jours pour guérir naturellement
                    </p>
                    <p style="margin: 8px 0 0; color: #3d3d38; font-size: 14px; line-height: 1.6;">
                      190+ pages de conseils pratiques, questionnaires d'auto-évaluation, listes d'aliments thérapeutiques et recettes santé.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <hr style="border: none; border-top: 1px solid #e8d4cf; margin: 32px 0;">

              <!-- Help text -->
              <p style="margin: 0 0 16px; color: #3d3d38; font-size: 15px; line-height: 1.7;">
                Si vous rencontrez un problème avec le téléchargement, répondez simplement à cet email et nous vous aiderons.
              </p>

              <p style="margin: 0; color: #3d3d38; font-size: 15px; line-height: 1.7;">
                Bonne lecture !<br>
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

export function getEbookPurchaseEmailSubject(): string {
  return '📖 Votre e-book "La Santé dans l\'assiette" est prêt !'
}
