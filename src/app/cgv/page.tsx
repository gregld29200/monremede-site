import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Conditions Générales de Vente | Mon Remède',
  description: 'Conditions générales de vente du site monremede.com - Informations sur les produits, services, paiements et livraisons.',
}

export default function CGVPage() {
  return (
    <main className="min-h-screen bg-cream pt-32 pb-20">
      <div className="mx-auto max-w-3xl px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="label text-sage mb-4">Conditions de vente</p>
          <h1 className="font-display text-4xl sm:text-5xl text-forest mb-4">
            Conditions Générales de Vente
          </h1>
          <p className="text-ink-soft">Dernière mise à jour : janvier 2025</p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          {/* Préambule */}
          <section className="mb-12">
            <h2 className="font-display text-2xl text-forest mb-4">Préambule</h2>
            <p className="text-ink-soft mb-4">
              Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles entre :
            </p>
            <div className="bg-cream-warm rounded-xl p-6 mb-4">
              <p className="text-ink-soft font-medium mb-2">Le Vendeur :</p>
              <ul className="text-ink-soft space-y-1 list-none pl-0 text-sm">
                <li>Zayneb OLD (Oum Soumayya)</li>
                <li>Naturopathe certifiée</li>
                <li>Résidence des Roses — Fès, Maroc</li>
                <li>Email : contact.swiftomatic@gmail.com</li>
                <li>Statut : Auto-entrepreneur</li>
              </ul>
            </div>
            <p className="text-ink-soft">
              <strong>Et le Client :</strong> Toute personne physique effectuant un achat sur le site monremede.com.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl text-forest mb-4">Article 1 — Objet</h2>
            <p className="text-ink-soft mb-4">
              Les présentes CGV définissent les conditions de vente des produits et services proposés sur monremede.com, à savoir :
            </p>
            <ul className="text-ink-soft space-y-1">
              <li>Le Livre « La Santé dans l&apos;Assiette » (format physique et/ou numérique)</li>
              <li>Les consultations naturopathiques</li>
              <li>Les programmes d&apos;accompagnement</li>
              <li>Les contenus numériques (PDFs, guides, recettes)</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl text-forest mb-4">Article 2 — Produits et services</h2>

            <h3 className="font-display text-xl text-forest mt-6 mb-3">2.1. Le Livre « La Santé dans l&apos;Assiette »</h3>
            <p className="text-ink-soft mb-2">
              Guide complet de 30 jours pour guérir naturellement, combinant naturopathie et médecine prophétique.
            </p>
            <ul className="text-ink-soft space-y-1 text-sm">
              <li><strong>Format :</strong> Broché et Kindle</li>
              <li><strong>Langue :</strong> Français</li>
              <li><strong>Disponible sur :</strong> Amazon</li>
            </ul>

            <h3 className="font-display text-xl text-forest mt-6 mb-3">2.2. Consultations en naturopathie</h3>
            <p className="text-ink-soft mb-2">
              Accompagnement personnalisé avec Oum Soumayya.
            </p>
            <ul className="text-ink-soft space-y-1 text-sm">
              <li>Réponses à vos questions</li>
              <li>Conseils personnalisés basés sur votre questionnaire</li>
              <li>Suivi individualisé</li>
            </ul>

            <h3 className="font-display text-xl text-forest mt-6 mb-3">2.3. Contenus gratuits</h3>
            <p className="text-ink-soft">
              Contenus numériques offerts : guides, recettes, questionnaire de santé gratuit.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl text-forest mb-4">Article 3 — Prix</h2>
            <ul className="text-ink-soft space-y-2">
              <li>Les prix sont indiqués en euros (EUR).</li>
              <li>Les prix peuvent être modifiés à tout moment. Le prix applicable est celui affiché au moment de la validation de la commande.</li>
            </ul>
            <div className="bg-cream-warm rounded-xl p-6 mt-4">
              <p className="text-ink-soft text-sm">
                <strong>Livre « La Santé dans l&apos;Assiette » :</strong> Disponible sur Amazon aux prix en vigueur sur la plateforme.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl text-forest mb-4">Article 4 — Commande</h2>
            <p className="text-ink-soft mb-4">Pour passer commande, le Client doit :</p>
            <ol className="text-ink-soft space-y-2 list-decimal pl-6">
              <li>Sélectionner le(s) produit(s) ou service(s) souhaité(s)</li>
              <li>Remplir le formulaire avec ses coordonnées</li>
              <li>Accepter les présentes CGV</li>
              <li>Procéder au paiement</li>
            </ol>
            <p className="text-ink-soft mt-4">
              La validation de la commande vaut acceptation des CGV. Une confirmation de commande est envoyée par email.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl text-forest mb-4">Article 5 — Paiement</h2>
            <p className="text-ink-soft mb-4">Moyens de paiement acceptés :</p>
            <ul className="text-ink-soft space-y-1">
              <li>Carte bancaire (via Amazon pour le livre)</li>
              <li>Virement bancaire (pour les consultations)</li>
            </ul>
            <p className="text-ink-soft mt-4">
              Le paiement est exigible immédiatement à la commande. Les transactions sont sécurisées.
              Aucune donnée bancaire n&apos;est stockée sur notre site.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl text-forest mb-4">Article 6 — Livraison</h2>

            <h3 className="font-display text-xl text-forest mt-6 mb-3">6.1. Livre (via Amazon)</h3>
            <ul className="text-ink-soft space-y-1 text-sm">
              <li>Format Kindle : Livraison immédiate</li>
              <li>Format broché : Selon les délais Amazon</li>
            </ul>

            <h3 className="font-display text-xl text-forest mt-6 mb-3">6.2. Consultations</h3>
            <ul className="text-ink-soft space-y-1 text-sm">
              <li>Accès dans les 24h suivant le paiement</li>
              <li>Envoi du questionnaire naturopathique par email</li>
              <li>Début de l&apos;accompagnement dès réception du questionnaire complété</li>
            </ul>

            <h3 className="font-display text-xl text-forest mt-6 mb-3">6.3. Contenus numériques gratuits</h3>
            <p className="text-ink-soft text-sm">
              Livraison immédiate par email après inscription.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl text-forest mb-4">Article 7 — Droit de rétractation</h2>

            <h3 className="font-display text-xl text-forest mt-6 mb-3">7.1. Livre physique (via Amazon)</h3>
            <p className="text-ink-soft">
              Les conditions de retour d&apos;Amazon s&apos;appliquent. Consultez la politique de retour Amazon.
            </p>

            <h3 className="font-display text-xl text-forest mt-6 mb-3">7.2. Produits numériques</h3>
            <div className="bg-blush/30 border border-blush-deep/30 rounded-xl p-4">
              <p className="text-ink-soft text-sm">
                <strong>⚠️ Exception au droit de rétractation :</strong> Conformément à la réglementation,
                le droit de rétractation ne peut être exercé pour les contenus numériques fournis sur
                un support immatériel dont l&apos;exécution a commencé avec l&apos;accord du consommateur.
              </p>
            </div>

            <h3 className="font-display text-xl text-forest mt-6 mb-3">7.3. Consultations</h3>
            <div className="bg-blush/30 border border-blush-deep/30 rounded-xl p-4">
              <p className="text-ink-soft text-sm">
                <strong>⚠️ Exception au droit de rétractation :</strong> Le droit de rétractation ne s&apos;applique
                pas aux prestations de services pleinement exécutées avant la fin du délai de rétractation
                et dont l&apos;exécution a commencé avec l&apos;accord du Client.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl text-forest mb-4">Article 8 — Avertissement santé</h2>
            <div className="bg-blush/30 border border-blush-deep/30 rounded-xl p-6">
              <p className="text-ink-soft mb-4">
                Les produits et services proposés sur monremede.com relèvent de la naturopathie,
                une approche complémentaire de bien-être.
              </p>
              <p className="text-ink-soft mb-4">
                <strong>Ils ne se substituent en aucun cas à :</strong>
              </p>
              <ul className="text-ink-soft space-y-1 text-sm">
                <li>Un diagnostic médical</li>
                <li>Un traitement médical prescrit</li>
                <li>Une consultation chez un médecin ou professionnel de santé</li>
              </ul>
              <p className="text-ink-soft mt-4 text-sm">
                En cas de problème de santé, le Client est invité à consulter un médecin.
                Zayneb OLD décline toute responsabilité en cas de non-respect de cet avertissement.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl text-forest mb-4">Article 9 — Propriété intellectuelle</h2>
            <ul className="text-ink-soft space-y-2">
              <li>
                L&apos;ensemble des contenus (textes, images, recettes, méthodes) contenus dans le Livre,
                les PDFs et les programmes sont la propriété exclusive de Zayneb OLD.
              </li>
              <li>
                L&apos;achat d&apos;un produit confère au Client un droit d&apos;utilisation personnel et non cessible.
              </li>
              <li>
                Toute reproduction, partage, revente ou diffusion des contenus est strictement interdite
                et pourra faire l&apos;objet de poursuites.
              </li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl text-forest mb-4">Article 10 — Responsabilité</h2>
            <p className="text-ink-soft mb-4">
              Zayneb OLD s&apos;engage à fournir les produits et services conformément à leur description.
            </p>
            <p className="text-ink-soft">Sa responsabilité ne saurait être engagée pour :</p>
            <ul className="text-ink-soft space-y-1 mt-2">
              <li>Les dommages résultant d&apos;une mauvaise utilisation des conseils</li>
              <li>Les problèmes techniques indépendants de sa volonté</li>
              <li>Les retards de livraison imputables au transporteur</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl text-forest mb-4">Article 11 — Service client</h2>
            <div className="bg-cream-warm rounded-xl p-6">
              <p className="text-ink-soft">
                Pour toute question ou réclamation :
              </p>
              <p className="text-ink-soft mt-2">
                <strong>Email :</strong>{' '}
                <a href="mailto:contact.swiftomatic@gmail.com" className="text-sage hover:text-forest">
                  contact.swiftomatic@gmail.com
                </a>
              </p>
              <p className="text-ink-soft mt-1">
                <strong>Délai de réponse :</strong> 48h ouvrées
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl text-forest mb-4">Article 12 — Médiation</h2>
            <p className="text-ink-soft">
              En cas de litige non résolu à l&apos;amiable, le Client peut recourir gratuitement à un
              médiateur de la consommation.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl text-forest mb-4">Article 13 — Droit applicable</h2>
            <p className="text-ink-soft">
              Les présentes CGV sont soumises au droit marocain. En cas de litige, et à défaut de
              résolution amiable ou de médiation, les tribunaux de Fès (Maroc) seront seuls compétents.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-forest mb-4">Article 14 — Acceptation</h2>
            <p className="text-ink-soft">
              Le Client reconnaît avoir pris connaissance des présentes CGV avant de passer commande
              et les accepte sans réserve.
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
