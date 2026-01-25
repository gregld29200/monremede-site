import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mentions Légales | Mon Remède',
  description: 'Mentions légales du site monremede.com - Informations sur l\'éditeur, l\'hébergeur et les conditions d\'utilisation.',
}

export default function MentionsLegalesPage() {
  return (
    <main className="min-h-screen bg-cream pt-32 pb-20">
      <div className="mx-auto max-w-3xl px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="label text-sage mb-4">Informations légales</p>
          <h1 className="font-display text-4xl sm:text-5xl text-forest mb-4">
            Mentions Légales
          </h1>
          <p className="text-ink-soft">Dernière mise à jour : janvier 2025</p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <section className="mb-12">
            <h2 className="font-display text-2xl text-forest mb-4">1. Éditeur du site</h2>
            <div className="bg-cream-warm rounded-xl p-6">
              <p className="text-ink-soft mb-2">Le site monremede.com est édité par :</p>
              <ul className="text-ink-soft space-y-1 list-none pl-0">
                <li><strong>Nom :</strong> Zayneb OLD</li>
                <li><strong>Nom d&apos;usage professionnel :</strong> Oum Soumayya</li>
                <li><strong>Profession :</strong> Naturopathe certifiée</li>
                <li><strong>Adresse :</strong> Résidence des Roses — Fès, Maroc</li>
                <li><strong>Email :</strong> contact.swiftomatic@gmail.com</li>
                <li><strong>Statut juridique :</strong> Auto-entrepreneur</li>
              </ul>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl text-forest mb-4">2. Hébergement</h2>
            <div className="bg-cream-warm rounded-xl p-6">
              <p className="text-ink-soft mb-2">Le site monremede.com est hébergé par :</p>
              <ul className="text-ink-soft space-y-1 list-none pl-0">
                <li><strong>Vercel Inc.</strong></li>
                <li>340 S Lemon Ave #4133</li>
                <li>Walnut, CA 91789, États-Unis</li>
                <li>Site web : <a href="https://vercel.com" className="text-sage hover:text-forest">vercel.com</a></li>
                <li>Email : privacy@vercel.com</li>
              </ul>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl text-forest mb-4">3. Activité professionnelle</h2>
            <p className="text-ink-soft mb-4">
              Zayneb OLD exerce en qualité de Naturopathe certifiée depuis 17 ans, spécialisée en :
            </p>
            <ul className="text-ink-soft space-y-2 mb-6">
              <li>Médecine douce</li>
              <li>Médecine prophétique</li>
              <li>Accompagnement bien-être et nutrition</li>
            </ul>
            <div className="bg-blush/30 border border-blush-deep/30 rounded-xl p-6">
              <p className="text-ink-soft text-sm">
                <strong>Avertissement important :</strong> La naturopathie est une approche complémentaire de bien-être.
                Elle ne se substitue en aucun cas à un traitement médical. Les conseils prodigués ne constituent pas
                des prescriptions médicales. En cas de problème de santé, consultez votre médecin.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl text-forest mb-4">4. Propriété intellectuelle</h2>
            <p className="text-ink-soft mb-4">
              L&apos;ensemble des contenus présents sur le site monremede.com (textes, images, graphismes, logos,
              icônes, photographies, recettes, guides PDF, extraits du Livre de Préparation au Ramadan) sont la
              propriété exclusive de Zayneb OLD ou font l&apos;objet d&apos;une autorisation d&apos;utilisation.
            </p>
            <p className="text-ink-soft">
              Toute reproduction, représentation, modification, publication, distribution ou exploitation,
              totale ou partielle, de ces contenus est strictement interdite sans autorisation écrite préalable.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl text-forest mb-4">5. Responsabilité</h2>
            <p className="text-ink-soft mb-4">
              Les informations contenues sur ce site sont fournies à titre informatif et ne sauraient engager
              la responsabilité de l&apos;éditeur. Zayneb OLD s&apos;efforce de fournir des informations exactes et à jour,
              mais ne garantit pas l&apos;exhaustivité ou l&apos;exactitude des contenus.
            </p>
            <p className="text-ink-soft">
              L&apos;utilisation des informations et contenus disponibles sur ce site se fait sous l&apos;entière
              responsabilité de l&apos;utilisateur.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl text-forest mb-4">6. Liens hypertextes</h2>
            <p className="text-ink-soft">
              Le site peut contenir des liens vers d&apos;autres sites. Zayneb OLD n&apos;exerce aucun contrôle
              sur ces sites et décline toute responsabilité quant à leur contenu.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl text-forest mb-4">7. Droit applicable</h2>
            <p className="text-ink-soft">
              Les présentes mentions légales sont soumises au droit marocain. En cas de litige, et à défaut
              de résolution amiable, les tribunaux de Fès seront compétents.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-forest mb-4">8. Contact</h2>
            <p className="text-ink-soft">
              Pour toute question concernant ces mentions légales, vous pouvez nous contacter à :
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
