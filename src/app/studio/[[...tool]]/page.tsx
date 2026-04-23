import Link from 'next/link'

export const metadata = {
  title: 'Studio Sanity | Mon Remede',
}

export default function StudioPage() {
  return (
    <main className="min-h-screen bg-cream px-6 py-20 text-forest">
      <div className="mx-auto max-w-2xl rounded-[2rem] border border-sage/20 bg-white/70 p-8 shadow-sm md:p-12">
        <p className="label mb-4 text-sage">Studio Sanity</p>
        <h1 className="display-medium mb-5 text-forest-deep">
          Le studio integre est desactive sur Cloudflare
        </h1>
        <p className="body-large mb-8 text-ink-soft">
          Cette version utilise l&apos;administration Mon Remede pour gerer le contenu,
          les clients, les recettes, les articles et les publications Telegram.
        </p>
        <Link
          href="/gestion-mon-remede-oum"
          className="inline-flex rounded-full bg-forest px-6 py-3 text-sm font-semibold text-cream transition hover:bg-forest-deep"
        >
          Ouvrir l&apos;administration
        </Link>
      </div>
    </main>
  )
}
