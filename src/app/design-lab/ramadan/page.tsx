'use client'

import { useState } from 'react'

// ============== FIXTURES ==============
const guides = [
  {
    number: '01',
    title: 'Préparer son corps au Ramadan',
    description: 'Un guide complet de conseils naturopathiques pour optimiser votre énergie et votre bien-être pendant le mois béni.',
    includes: [
      'Comment préparer votre corps 2 semaines avant',
      'Gérer l\'énergie et éviter les coups de fatigue',
      'Les compléments naturels recommandés',
      'Rituels de bien-être pour le corps et l\'esprit',
    ],
  },
  {
    number: '02',
    title: 'Recettes saines pour le Ramadan',
    description: 'Des idées de repas équilibrés et nourrissants pour le ftour et le shour, faciles à préparer.',
    includes: [
      'Idées de ftour équilibré et énergisant',
      'Shour optimal pour tenir la journée',
      'Recettes rapides pour les journées chargées',
      'Alternatives saines aux plats traditionnels',
    ],
  },
]

const benefits = [
  { title: 'Plus d\'énergie', description: 'Maintenez votre vitalité malgré le jeûne grâce à des conseils nutritionnels adaptés.' },
  { title: 'Repas équilibrés', description: 'Des recettes simples et saines pour le ftour et le shour.' },
  { title: 'Bien-être global', description: 'Des rituels de naturopathie pour le corps et l\'esprit.' },
  { title: 'Préparation optimale', description: 'Préparez votre corps avant le Ramadan pour vivre le jeûne sereinement.' },
]

const author = {
  name: 'Oum Soumayya',
  title: 'Naturopathe depuis 2009',
  quote: 'Le Ramadan est une période de purification spirituelle et physique. Avec les bons outils, vous pouvez en faire une expérience de bien-être total.',
}

// ============== VARIANT A: Book Cover ==============
function VariantA() {
  const [email, setEmail] = useState('')
  return (
    <div className="min-h-screen bg-cream">
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gold/5 rounded-full blur-3xl" />
        </div>
        <div className="relative text-center max-w-4xl mx-auto">
          <p className="label text-gold mb-6">2 Guides Gratuits</p>
          <h1 className="display-large text-forest mb-4">Préparez votre Ramadan</h1>
          <p className="font-accent text-2xl text-sage italic mb-12">Corps, esprit et assiette</p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-16">
            {guides.map((guide, index) => (
              <div key={guide.number} className="group relative" style={{ transform: index === 0 ? 'rotate(-3deg)' : 'rotate(3deg)' }}>
                <div className="absolute inset-0 bg-forest-deep/20 rounded-lg blur-xl translate-y-4 group-hover:translate-y-6 transition-transform" />
                <div className="relative w-64 h-80 bg-gradient-to-br from-forest-deep to-forest rounded-lg shadow-2xl overflow-hidden group-hover:scale-105 transition-transform duration-300">
                  <div className="absolute top-0 left-0 right-0 h-2 bg-gold" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    <span className="text-gold text-sm tracking-widest mb-4">GUIDE {guide.number}</span>
                    <h3 className="font-display text-xl text-cream leading-tight mb-4">{guide.title}</h3>
                    <div className="w-12 h-px bg-gold/50 mb-4" />
                    <p className="text-cream/60 text-sm">Mon Remède</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="max-w-md mx-auto">
            <div className="flex gap-3">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Votre email" className="flex-1 px-5 py-4 rounded-lg border border-sage/30 bg-cream-warm text-forest placeholder:text-ink-soft/50 focus:outline-none focus:ring-2 focus:ring-gold" />
              <button className="px-8 py-4 bg-gold text-forest-deep font-medium rounded-lg hover:bg-gold-light transition-colors">Recevoir</button>
            </div>
            <p className="mt-4 text-ink-soft/60 text-sm">Gratuit · Pas de spam · Désinscription en un clic</p>
          </div>
        </div>
      </section>
      <section className="py-20 px-6 bg-cream-warm">
        <div className="max-w-5xl mx-auto">
          <p className="label text-sage text-center mb-4">Ce que vous recevrez</p>
          <h2 className="display-medium text-forest text-center mb-16">Deux guides complémentaires</h2>
          <div className="grid md:grid-cols-2 gap-12">
            {guides.map((guide) => (
              <div key={guide.number} className="bg-cream rounded-2xl p-8">
                <span className="font-display text-6xl text-sage/20">{guide.number}</span>
                <h3 className="heading text-forest mt-2 mb-4">{guide.title}</h3>
                <p className="text-ink-soft mb-6">{guide.description}</p>
                <ul className="space-y-3">
                  {guide.includes.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-ink-soft">
                      <span className="w-5 h-5 rounded-full bg-gold/20 text-gold flex items-center justify-center text-xs flex-shrink-0 mt-0.5">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 px-6 bg-forest-deep">
        <div className="max-w-3xl mx-auto text-center">
          <p className="label text-gold mb-6">Votre guide</p>
          <h2 className="display-medium text-cream mb-4">{author.name}</h2>
          <p className="text-sage-light mb-8">{author.title}</p>
          <blockquote className="font-accent text-xl text-sage-light italic">« {author.quote} »</blockquote>
        </div>
      </section>
    </div>
  )
}

// ============== VARIANT B: Split Screen ==============
function VariantB() {
  const [email, setEmail] = useState('')
  return (
    <div className="min-h-screen bg-cream">
      <section className="min-h-screen grid lg:grid-cols-2">
        <div className="flex flex-col justify-center px-8 lg:px-16 xl:px-24 py-20 order-2 lg:order-1">
          <div className="max-w-lg">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-px bg-gold" />
              <span className="label text-gold">Gratuit</span>
            </div>
            <h1 className="display-large text-forest mb-6 leading-tight">
              Votre guide<br /><span className="text-sage italic">naturopathique</span><br />pour le Ramadan
            </h1>
            <p className="body-large text-ink-soft mb-10">
              Recevez 2 guides complets pour préparer votre corps et cuisiner sainement pendant le mois sacré.
            </p>
            <div className="space-y-4 mb-10">
              {guides.map((guide) => (
                <div key={guide.number} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-forest-deep flex items-center justify-center text-gold text-sm font-medium">{guide.number}</div>
                  <span className="text-forest">{guide.title}</span>
                </div>
              ))}
            </div>
            <div className="space-y-3">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Entrez votre adresse email" className="w-full px-5 py-4 rounded-lg border border-sage/30 bg-cream-warm text-forest placeholder:text-ink-soft/50 focus:outline-none focus:ring-2 focus:ring-gold" />
              <button className="w-full px-8 py-4 bg-forest-deep text-cream font-medium rounded-lg hover:bg-forest transition-colors flex items-center justify-center gap-2">
                Recevoir mes guides gratuits <span>→</span>
              </button>
            </div>
            <p className="mt-4 text-ink-soft/60 text-sm text-center">Rejoignez +500 personnes accompagnées</p>
          </div>
        </div>
        <div className="relative bg-forest-deep order-1 lg:order-2 min-h-[50vh] lg:min-h-full">
          <div className="absolute inset-0 bg-gradient-to-br from-forest-deep via-forest to-forest-deep" />
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 right-20 w-64 h-64 border border-gold/20 rounded-full" />
            <div className="absolute bottom-32 left-16 w-40 h-40 border border-sage/20 rounded-full" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center p-12">
            <div className="text-center">
              <span className="font-display text-[120px] lg:text-[180px] text-cream/5 leading-none">رمضان</span>
              <p className="font-accent text-xl text-cream/40 mt-4 italic">Ramadan Kareem</p>
            </div>
          </div>
        </div>
      </section>
      <section className="py-24 px-6 bg-cream-warm">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="label text-sage mb-4">Contenu des guides</p>
            <h2 className="display-medium text-forest">Tout ce dont vous avez besoin</h2>
          </div>
          <div className="grid lg:grid-cols-2 gap-8">
            {guides.map((guide, index) => (
              <div key={guide.number} className={`rounded-2xl overflow-hidden ${index === 0 ? 'bg-forest-deep text-cream' : 'bg-cream border border-sage/20'}`}>
                <div className="p-8 lg:p-10">
                  <div className="flex items-center gap-4 mb-6">
                    <span className={`font-display text-5xl ${index === 0 ? 'text-gold/30' : 'text-sage/30'}`}>{guide.number}</span>
                    <div className={`h-px flex-1 ${index === 0 ? 'bg-cream/20' : 'bg-sage/20'}`} />
                  </div>
                  <h3 className={`heading mb-4 ${index === 0 ? 'text-cream' : 'text-forest'}`}>{guide.title}</h3>
                  <p className={`mb-8 ${index === 0 ? 'text-cream/70' : 'text-ink-soft'}`}>{guide.description}</p>
                  <ul className="space-y-3">
                    {guide.includes.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5 ${index === 0 ? 'bg-gold/20 text-gold' : 'bg-sage-light/50 text-forest'}`}>✓</span>
                        <span className={index === 0 ? 'text-cream/80' : 'text-ink-soft'}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

// ============== VARIANT C: Editorial ==============
function VariantC() {
  const [email, setEmail] = useState('')
  return (
    <div className="min-h-screen bg-cream">
      <section className="relative px-6 pt-32 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="absolute top-0 right-0 opacity-[0.03] pointer-events-none hidden lg:block">
            <span className="font-display text-[400px] text-forest leading-none">02</span>
          </div>
          <div className="relative grid lg:grid-cols-12 gap-12 items-end">
            <div className="lg:col-span-7">
              <p className="label text-gold mb-6 flex items-center gap-3">
                <span className="w-8 h-px bg-gold" />Édition Ramadan 2025
              </p>
              <h1 className="font-display text-[clamp(3rem,8vw,6rem)] text-forest leading-[0.9] mb-8">
                Préparez<br />votre corps<br /><em className="text-sage">naturellement</em>
              </h1>
              <p className="body-large text-ink-soft max-w-lg mb-10">
                Deux guides essentiels pour aborder le mois sacré avec énergie, sérénité et des repas qui nourrissent vraiment.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-lg">
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="votre@email.com" className="flex-1 px-6 py-5 border-b-2 border-forest bg-transparent text-forest placeholder:text-ink-soft/50 focus:outline-none focus:border-gold transition-colors" />
                <button className="px-10 py-5 bg-forest-deep text-cream font-medium hover:bg-forest transition-colors">Recevoir →</button>
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="bg-cream-warm p-8 rounded-sm">
                <p className="label text-sage mb-6">Inclus dans votre pack</p>
                {guides.map((guide, index) => (
                  <div key={guide.number} className={index > 0 ? 'mt-6 pt-6 border-t border-sage/20' : ''}>
                    <div className="flex items-baseline gap-4">
                      <span className="font-display text-4xl text-gold/40">{guide.number}</span>
                      <h3 className="heading text-forest">{guide.title}</h3>
                    </div>
                  </div>
                ))}
                <p className="mt-8 text-sm text-ink-soft">Format PDF · Téléchargement immédiat · Gratuit</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="h-px bg-gradient-to-r from-transparent via-sage/30 to-transparent" />
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          {guides.map((guide, index) => (
            <div key={guide.number} className={`grid lg:grid-cols-12 gap-12 items-center ${index > 0 ? 'mt-24 pt-24 border-t border-sage/10' : ''}`}>
              <div className={`lg:col-span-3 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                <span className="font-display text-[180px] lg:text-[240px] text-sage/10 leading-none block">{guide.number}</span>
              </div>
              <div className={`lg:col-span-9 ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                <p className="label text-gold mb-4">Guide {guide.number}</p>
                <h2 className="display-medium text-forest mb-6">{guide.title}</h2>
                <p className="body-large text-ink-soft mb-8 max-w-2xl">{guide.description}</p>
                <div className="grid sm:grid-cols-2 gap-4">
                  {guide.includes.map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-forest-deep/5 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-gold" />
                      </div>
                      <span className="text-ink-soft text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="py-32 px-6 bg-cream-warm">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-16 h-px bg-gold mx-auto mb-12" />
          <blockquote className="font-display text-[clamp(1.5rem,4vw,2.5rem)] text-forest leading-snug mb-12">« {author.quote} »</blockquote>
          <div>
            <p className="font-accent text-xl text-forest">{author.name}</p>
            <p className="text-sage text-sm mt-1">{author.title}</p>
          </div>
        </div>
      </section>
    </div>
  )
}

// ============== VARIANT D: Card Stack ==============
function VariantD() {
  const [email, setEmail] = useState('')
  const [activeGuide, setActiveGuide] = useState(0)
  return (
    <div className="min-h-screen bg-cream-warm">
      <section className="min-h-screen flex flex-col lg:flex-row">
        <div className="flex-1 flex items-center px-8 lg:px-16 py-20">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 rounded-full mb-8">
              <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
              <span className="text-sm text-gold font-medium">Gratuit - Téléchargement immédiat</span>
            </div>
            <h1 className="display-large text-forest mb-6">Votre kit<br /><span className="text-sage">Ramadan</span><br />complet</h1>
            <p className="body-large text-ink-soft mb-10">2 guides PDF exclusifs pour préparer votre corps et cuisiner sainement pendant le mois sacré.</p>
            <div className="bg-cream rounded-2xl p-6 shadow-lg">
              <p className="text-sm text-ink-soft mb-4">Entrez votre email pour recevoir le kit :</p>
              <div className="flex gap-3">
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="votre@email.com" className="flex-1 px-4 py-3 rounded-lg border border-sage/30 bg-cream-warm text-forest placeholder:text-ink-soft/50 focus:outline-none focus:ring-2 focus:ring-gold" />
                <button className="px-6 py-3 bg-forest-deep text-cream font-medium rounded-lg hover:bg-forest transition-colors whitespace-nowrap">Recevoir</button>
              </div>
            </div>
            <div className="flex gap-8 mt-8">
              <div><span className="font-display text-3xl text-forest">500+</span><p className="text-sm text-ink-soft">téléchargements</p></div>
              <div><span className="font-display text-3xl text-forest">2</span><p className="text-sm text-ink-soft">guides PDF</p></div>
              <div><span className="font-display text-3xl text-forest">15+</span><p className="text-sm text-ink-soft">recettes</p></div>
            </div>
          </div>
        </div>
        <div className="flex-1 relative bg-forest-deep flex items-center justify-center p-8 lg:p-16 min-h-[60vh]">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, var(--sage) 1px, transparent 0)', backgroundSize: '32px 32px' }} />
          </div>
          <div className="relative w-full max-w-sm h-96">
            {guides.map((guide, index) => (
              <div key={guide.number} className={`absolute inset-0 bg-cream rounded-2xl shadow-2xl cursor-pointer transition-all duration-500 ${activeGuide === index ? 'z-20 scale-100 rotate-0' : 'z-10 scale-95 rotate-3 translate-x-4 translate-y-4'}`} onClick={() => setActiveGuide(index)}>
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <span className="px-3 py-1 bg-gold/20 text-gold text-xs font-medium rounded-full">Guide {guide.number}</span>
                    <span className="text-sage text-sm">PDF</span>
                  </div>
                  <h3 className="heading text-forest mb-4">{guide.title}</h3>
                  <p className="text-ink-soft text-sm mb-6">{guide.description}</p>
                  <div className="space-y-2">
                    {guide.includes.slice(0, 3).map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <div className="w-4 h-4 rounded bg-sage-light/50 flex items-center justify-center"><span className="text-forest text-[10px]">✓</span></div>
                        <span className="text-ink-soft">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex gap-2">
              {guides.map((_, index) => (
                <button key={index} onClick={() => setActiveGuide(index)} className={`w-2 h-2 rounded-full transition-colors ${activeGuide === index ? 'bg-gold' : 'bg-cream/30'}`} />
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="py-24 px-6 bg-cream">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="label text-sage mb-4">Pourquoi ce kit ?</p>
            <h2 className="display-medium text-forest">Tout pour un Ramadan serein</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="group bg-cream-warm rounded-xl p-6 hover:bg-forest-deep transition-colors duration-300">
                <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors">
                  <span className="text-gold font-display text-lg">0{index + 1}</span>
                </div>
                <h3 className="heading text-forest mb-2 group-hover:text-cream transition-colors">{benefit.title}</h3>
                <p className="text-ink-soft text-sm group-hover:text-cream/70 transition-colors">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

// ============== VARIANT E: Immersive Story ==============
function VariantE() {
  const [email, setEmail] = useState('')
  return (
    <div className="min-h-screen bg-forest-deep">
      <section className="min-h-screen flex items-center justify-center px-6 relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-cream/5 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-gold/10 rounded-full" />
        </div>
        <div className="relative text-center max-w-3xl">
          <p className="label text-gold mb-8">Ramadan 2025</p>
          <h1 className="font-display text-[clamp(2.5rem,8vw,5rem)] text-cream leading-[1.1] mb-8">
            Et si cette année,<br /><em className="text-sage-light">tout était différent ?</em>
          </h1>
          <p className="font-accent text-xl text-cream/60 mb-12 max-w-xl mx-auto">
            Fini la fatigue dès le premier jour, les repas improvisés et le sentiment de ne pas être préparé(e).
          </p>
          <div className="flex flex-col items-center gap-4">
            <a href="#discover" className="px-8 py-4 bg-gold text-forest-deep font-medium rounded-full hover:bg-gold-light transition-colors">Découvrir comment →</a>
            <span className="text-cream/40 text-sm">Gratuit · 2 guides PDF</span>
          </div>
        </div>
      </section>
      <section className="py-32 px-6 bg-cream" id="discover">
        <div className="max-w-4xl mx-auto">
          <p className="label text-sage mb-6">Le constat</p>
          <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] text-forest leading-tight mb-12">Chaque année, c&apos;est la même histoire.</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {['La fatigue qui s\'installe dès les premiers jours', 'Les repas déséquilibrés qui alourdissent', 'Le sentiment de ne pas profiter pleinement'].map((problem, index) => (
              <div key={index} className="relative pl-8">
                <div className="absolute left-0 top-0 w-4 h-4 rounded-full border-2 border-blush-deep" />
                <p className="text-ink-soft leading-relaxed">{problem}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-32 px-6 bg-cream-warm">
        <div className="max-w-4xl mx-auto text-center">
          <p className="label text-gold mb-6">La solution</p>
          <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] text-forest leading-tight mb-8">2 guides pour tout changer</h2>
          <p className="body-large text-ink-soft max-w-2xl mx-auto mb-16">
            Après 15 ans d&apos;accompagnement en naturopathie, j&apos;ai créé deux guides qui rassemblent tout ce dont vous avez besoin.
          </p>
          <div className="space-y-16">
            {guides.map((guide, index) => (
              <div key={guide.number} className={`grid md:grid-cols-2 gap-12 items-center text-left`}>
                <div className={index % 2 === 1 ? 'md:order-2' : ''}>
                  <div className="aspect-[4/5] bg-forest-deep rounded-2xl flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-gold/20 to-transparent" />
                    <div className="relative text-center p-8">
                      <span className="font-display text-8xl text-cream/20">{guide.number}</span>
                      <p className="font-accent text-xl text-cream/80 mt-4">{guide.title}</p>
                    </div>
                  </div>
                </div>
                <div className={index % 2 === 1 ? 'md:order-1' : ''}>
                  <span className="inline-block px-4 py-2 bg-gold/10 text-gold text-sm font-medium rounded-full mb-6">Guide {guide.number}</span>
                  <h3 className="display-medium text-forest mb-4">{guide.title}</h3>
                  <p className="text-ink-soft mb-8">{guide.description}</p>
                  <ul className="space-y-4">
                    {guide.includes.map((item, i) => (
                      <li key={i} className="flex items-start gap-4">
                        <div className="w-6 h-6 rounded-full bg-gold flex items-center justify-center flex-shrink-0 mt-0.5"><span className="text-forest-deep text-xs font-bold">✓</span></div>
                        <span className="text-ink-soft">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="min-h-screen flex items-center justify-center px-6 bg-cream relative">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-forest-deep to-transparent" />
        <div className="max-w-xl text-center">
          <p className="label text-gold mb-6">Votre tour</p>
          <h2 className="font-display text-[clamp(2rem,6vw,4rem)] text-forest leading-tight mb-6">Commencez<br /><em className="text-sage">maintenant</em></h2>
          <p className="text-ink-soft mb-10">Entrez votre email pour recevoir immédiatement vos deux guides gratuits.</p>
          <div className="space-y-4">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="votre@email.com" className="w-full px-6 py-5 text-center text-lg border-2 border-forest rounded-full bg-transparent text-forest placeholder:text-ink-soft/50 focus:outline-none focus:border-gold transition-colors" />
            <button className="w-full px-8 py-5 bg-forest-deep text-cream font-medium rounded-full hover:bg-forest transition-colors text-lg">Recevoir mes guides gratuits</button>
          </div>
          <p className="mt-8 text-ink-soft/60 text-sm">Gratuit · Sans engagement · Désinscription en un clic</p>
        </div>
      </section>
    </div>
  )
}

// ============== LAB SHELL ==============
const variants = [
  { id: 'A', name: 'Book Cover', description: 'Les guides présentés comme des couvertures de livres. Style Apple épuré.' },
  { id: 'B', name: 'Split Screen', description: 'Écran divisé avec visuel atmosphérique. Style lifestyle premium.' },
  { id: 'C', name: 'Editorial', description: 'Style magazine luxe avec typographie expressive et numéros géants.' },
  { id: 'D', name: 'Card Stack', description: 'Cartes interactives empilées avec stats. Style app premium.' },
  { id: 'E', name: 'Immersive Story', description: 'Narration au scroll. Sections plein écran, style longform.' },
]

const variantComponents = [VariantA, VariantB, VariantC, VariantD, VariantE]

export default function DesignLabPage() {
  const [activeVariant, setActiveVariant] = useState(0)
  const ActiveComponent = variantComponents[activeVariant]

  return (
    <div className="min-h-screen bg-neutral-900">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-neutral-900/95 backdrop-blur-sm border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-white font-semibold">Design Lab</h1>
              <p className="text-neutral-400 text-sm">Landing Page Cadeaux Ramadan</p>
            </div>
            <span className="text-neutral-500 text-sm">{variants.length} variations</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {variants.map((variant, index) => (
              <button
                key={variant.id}
                onClick={() => setActiveVariant(index)}
                className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm transition-all ${
                  activeVariant === index
                    ? 'bg-amber-500 text-neutral-900 font-medium'
                    : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                }`}
              >
                <span className="font-mono mr-2">{variant.id}</span>
                {variant.name}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="pt-28">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="bg-neutral-800/50 rounded-lg p-4 mb-4">
            <p className="text-amber-400 font-mono text-sm mb-1">
              Variant {variants[activeVariant].id}: {variants[activeVariant].name}
            </p>
            <p className="text-neutral-300 text-sm">{variants[activeVariant].description}</p>
          </div>
        </div>
        <div className="bg-white min-h-screen">
          <ActiveComponent />
        </div>
      </main>
    </div>
  )
}
