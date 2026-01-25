import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Politique de Confidentialité | Mon Remède',
  description: 'Politique de confidentialité du site monremede.com - Protection de vos données personnelles et vos droits RGPD.',
}

export default function ConfidentialitePage() {
  return (
    <main className="min-h-screen bg-cream pt-32 pb-20">
      <div className="mx-auto max-w-3xl px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="label text-sage mb-4">Protection des données</p>
          <h1 className="font-display text-4xl sm:text-5xl text-forest mb-4">
            Politique de Confidentialité
          </h1>
          <p className="text-ink-soft">Dernière mise à jour : janvier 2025</p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          {/* Introduction */}
          <section className="mb-12">
            <div className="bg-sage/10 rounded-xl p-6">
              <p className="text-ink-soft">
                Zayneb OLD, exerçant sous le nom Oum Soumayya via le site monremede.com, s&apos;engage à protéger
                la vie privée des utilisateurs de son site. Cette politique de confidentialité explique comment
                nous collectons, utilisons et protégeons vos données personnelles.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl text-forest mb-4">1. Responsable du traitement</h2>
            <div className="bg-cream-warm rounded-xl p-6">
              <ul className="text-ink-soft space-y-1 list-none pl-0">
                <li><strong>Responsable :</strong> Zayneb OLD (Oum Soumayya)</li>
                <li><strong>Adresse :</strong> Résidence des Roses — Fès, Maroc</li>
                <li><strong>Email :</strong> contact.swiftomatic@gmail.com</li>
              </ul>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl text-forest mb-4">2. Données collectées</h2>

            <h3 className="font-display text-xl text-forest mt-6 mb-3">a) Données d&apos;identification</h3>
            <ul className="text-ink-soft space-y-1">
              <li>Nom et prénom</li>
              <li>Adresse email</li>
              <li>Numéro de téléphone</li>
            </ul>

            <h3 className="font-display text-xl text-forest mt-6 mb-3">b) Données collectées via le questionnaire naturopathique</h3>
            <ul className="text-ink-soft space-y-1">
              <li>Informations sur votre état de santé général</li>
              <li>Habitudes alimentaires</li>
              <li>Niveau de stress et qualité du sommeil</li>
              <li>Antécédents et préoccupations de bien-être</li>
              <li>Objectifs personnels</li>
            </ul>

            <h3 className="font-display text-xl text-forest mt-6 mb-3">c) Données de navigation</h3>
            <ul className="text-ink-soft space-y-1">
              <li>Adresse IP</li>
              <li>Type de navigateur</li>
              <li>Pages consultées</li>
              <li>Date et heure de connexion</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl text-forest mb-4">3. Finalités de la collecte</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-sage/20">
                    <th className="text-left py-3 text-forest">Finalité</th>
                    <th className="text-left py-3 text-forest">Base légale</th>
                  </tr>
                </thead>
                <tbody className="text-ink-soft">
                  <tr className="border-b border-sage/10">
                    <td className="py-3">Envoi des PDFs gratuits (recettes, guide préparation)</td>
                    <td className="py-3">Consentement</td>
                  </tr>
                  <tr className="border-b border-sage/10">
                    <td className="py-3">Gestion des consultations par email</td>
                    <td className="py-3">Exécution du contrat</td>
                  </tr>
                  <tr className="border-b border-sage/10">
                    <td className="py-3">Réponse à vos questions via le formulaire de contact</td>
                    <td className="py-3">Intérêt légitime</td>
                  </tr>
                  <tr className="border-b border-sage/10">
                    <td className="py-3">Envoi de la newsletter (si consentement)</td>
                    <td className="py-3">Consentement</td>
                  </tr>
                  <tr className="border-b border-sage/10">
                    <td className="py-3">Personnalisation de l&apos;accompagnement naturopathique</td>
                    <td className="py-3">Consentement explicite</td>
                  </tr>
                  <tr className="border-b border-sage/10">
                    <td className="py-3">Traitement des commandes du Livre</td>
                    <td className="py-3">Exécution du contrat</td>
                  </tr>
                  <tr>
                    <td className="py-3">Amélioration du site</td>
                    <td className="py-3">Intérêt légitime</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl text-forest mb-4">4. Protection des données de santé</h2>
            <div className="bg-blush/30 border border-blush-deep/30 rounded-xl p-6 mb-6">
              <p className="text-ink font-medium mb-2">⚠️ Attention particulière aux données sensibles</p>
              <p className="text-ink-soft text-sm">
                Le questionnaire naturopathique proposé sur notre site collecte des informations relatives
                à votre santé et votre bien-être. Ces données sont considérées comme données sensibles
                et bénéficient d&apos;une protection renforcée.
              </p>
            </div>

            <h3 className="font-display text-xl text-forest mt-6 mb-3">a) Nature des données de santé collectées</h3>
            <ul className="text-ink-soft space-y-1">
              <li>État de santé général déclaré</li>
              <li>Symptômes ressentis (fatigue, stress, troubles digestifs, etc.)</li>
              <li>Antécédents de santé pertinents pour l&apos;accompagnement</li>
              <li>Traitements en cours (pour éviter les contre-indications)</li>
              <li>Habitudes de vie impactant la santé</li>
            </ul>

            <h3 className="font-display text-xl text-forest mt-6 mb-3">b) Garanties spécifiques</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-sage">✓</span>
                <p className="text-ink-soft"><strong>Consentement explicite :</strong> Avant de remplir le questionnaire, vous devez confirmer que vous acceptez le traitement de ces données sensibles.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-sage">✓</span>
                <p className="text-ink-soft"><strong>Accès restreint :</strong> Seule Zayneb OLD (Oum Soumayya) a accès à vos réponses au questionnaire.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-sage">✓</span>
                <p className="text-ink-soft"><strong>Stockage sécurisé :</strong> Les données du questionnaire sont stockées de manière chiffrée et séparée des autres données.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-sage">✓</span>
                <p className="text-ink-soft"><strong>Pas de partage :</strong> Vos données de santé ne sont JAMAIS partagées, vendues ou transmises à des tiers.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-sage">✓</span>
                <p className="text-ink-soft"><strong>Finalité unique :</strong> Ces données servent UNIQUEMENT à personnaliser votre accompagnement naturopathique.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-sage">✓</span>
                <p className="text-ink-soft"><strong>Suppression sur demande :</strong> Vous pouvez demander la suppression immédiate et complète de votre questionnaire à tout moment.</p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl text-forest mb-4">5. Durée de conservation</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-sage/20">
                    <th className="text-left py-3 text-forest">Type de données</th>
                    <th className="text-left py-3 text-forest">Durée de conservation</th>
                  </tr>
                </thead>
                <tbody className="text-ink-soft">
                  <tr className="border-b border-sage/10">
                    <td className="py-3">Données prospects (email pour PDFs)</td>
                    <td className="py-3">3 ans après le dernier contact</td>
                  </tr>
                  <tr className="border-b border-sage/10">
                    <td className="py-3">Données clients (achat livre/consultation)</td>
                    <td className="py-3">5 ans (obligations légales)</td>
                  </tr>
                  <tr className="border-b border-sage/10">
                    <td className="py-3">Données du questionnaire naturopathique</td>
                    <td className="py-3">2 ans ou jusqu&apos;à demande de suppression</td>
                  </tr>
                  <tr>
                    <td className="py-3">Données de navigation</td>
                    <td className="py-3">13 mois</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl text-forest mb-4">6. Destinataires des données</h2>
            <p className="text-ink-soft mb-4">Vos données peuvent être transmises aux destinataires suivants :</p>
            <ul className="text-ink-soft space-y-2">
              <li><strong>Vercel :</strong> hébergeur du site (données techniques uniquement)</li>
              <li><strong>Sanity :</strong> gestion du contenu (données du questionnaire)</li>
              <li><strong>Resend :</strong> envoi des emails</li>
            </ul>
            <div className="bg-sage/10 rounded-xl p-4 mt-4">
              <p className="text-ink-soft text-sm">
                <strong>Important :</strong> Vos données de santé issues du questionnaire ne sont JAMAIS
                transmises à ces prestataires à des fins commerciales.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl text-forest mb-4">7. Vos droits</h2>
            <p className="text-ink-soft mb-4">Conformément à la réglementation applicable, vous disposez des droits suivants :</p>
            <div className="grid gap-3">
              <div className="flex items-start gap-3">
                <span className="text-sage">✓</span>
                <p className="text-ink-soft"><strong>Droit d&apos;accès :</strong> Obtenir une copie de vos données personnelles</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-sage">✓</span>
                <p className="text-ink-soft"><strong>Droit de rectification :</strong> Corriger des données inexactes</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-sage">✓</span>
                <p className="text-ink-soft"><strong>Droit de suppression :</strong> Demander l&apos;effacement de vos données</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-sage">✓</span>
                <p className="text-ink-soft"><strong>Droit d&apos;opposition :</strong> Vous opposer au traitement de vos données</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-sage">✓</span>
                <p className="text-ink-soft"><strong>Droit de portabilité :</strong> Recevoir vos données dans un format structuré</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-sage">✓</span>
                <p className="text-ink-soft"><strong>Droit de retrait du consentement :</strong> Retirer votre consentement à tout moment</p>
              </div>
            </div>
            <div className="bg-cream-warm rounded-xl p-6 mt-6">
              <p className="text-ink-soft text-sm">
                <strong>Pour exercer vos droits :</strong><br />
                Envoyez un email à : <a href="mailto:contact.swiftomatic@gmail.com" className="text-sage hover:text-forest">contact.swiftomatic@gmail.com</a><br />
                Objet : &quot;Exercice de mes droits — [votre nom]&quot;<br />
                Nous répondrons dans un délai de 30 jours.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl text-forest mb-4">8. Cookies</h2>
            <p className="text-ink-soft mb-4">Notre site utilise des cookies pour :</p>
            <ul className="text-ink-soft space-y-1 mb-6">
              <li>Assurer le bon fonctionnement du site</li>
              <li>Mémoriser vos préférences</li>
              <li>Analyser la fréquentation (statistiques anonymes)</li>
            </ul>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-sage/20">
                    <th className="text-left py-3 text-forest">Type</th>
                    <th className="text-left py-3 text-forest">Finalité</th>
                    <th className="text-left py-3 text-forest">Durée</th>
                  </tr>
                </thead>
                <tbody className="text-ink-soft">
                  <tr className="border-b border-sage/10">
                    <td className="py-3">Cookies essentiels</td>
                    <td className="py-3">Fonctionnement du site</td>
                    <td className="py-3">Session</td>
                  </tr>
                  <tr>
                    <td className="py-3">Cookies analytiques</td>
                    <td className="py-3">Statistiques de visite</td>
                    <td className="py-3">13 mois</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-ink-soft text-sm mt-4">
              Vous pouvez configurer votre navigateur pour refuser les cookies. Cependant, certaines
              fonctionnalités du site pourraient ne plus être disponibles.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl text-forest mb-4">9. Sécurité</h2>
            <p className="text-ink-soft mb-4">
              Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données :
            </p>
            <ul className="text-ink-soft space-y-1">
              <li>Connexion sécurisée (HTTPS)</li>
              <li>Accès restreint aux données</li>
              <li>Mots de passe robustes</li>
              <li>Mises à jour régulières</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl text-forest mb-4">10. Modifications</h2>
            <p className="text-ink-soft">
              Cette politique de confidentialité peut être modifiée à tout moment. La date de dernière
              mise à jour est indiquée en haut du document. Nous vous encourageons à la consulter régulièrement.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-forest mb-4">11. Contact</h2>
            <p className="text-ink-soft">
              Pour toute question relative à cette politique de confidentialité :
            </p>
            <p className="text-ink-soft mt-2">
              <strong>Email :</strong>{' '}
              <a href="mailto:contact.swiftomatic@gmail.com" className="text-sage hover:text-forest">
                contact.swiftomatic@gmail.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
