# Mon Remède - Site Naturopathie

## Aperçu du projet

Site web pour la marque Mon Remède, naturopathie avec Oum Soumayya. Le site propose:
- Un livre sur la santé naturelle "La Santé dans l'assiette - 30 jours pour guérir naturellement" (vendu sur Amazon)
- Des consultations en naturopathie en ligne
- Un blog d'articles et une section recettes

## Stack technique

- **Framework**: Next.js 15 (App Router)
- **React**: 18
- **Styling**: Tailwind CSS 4
- **CMS**: Sanity (embedded studio)
- **Déploiement**: Vercel
- **Langage**: TypeScript

## Structure du projet

```
src/
├── app/
│   ├── page.tsx                    # Page d'accueil
│   ├── livre/page.tsx              # Page détaillée du livre
│   ├── consultations/
│   │   ├── page.tsx                # Liste des consultations
│   │   └── demande/page.tsx        # Questionnaire de demande
│   ├── blog/
│   │   ├── page.tsx                # Liste des articles
│   │   └── [slug]/page.tsx         # Article individuel
│   ├── recettes/
│   │   ├── page.tsx                # Liste des recettes
│   │   └── [slug]/page.tsx         # Recette individuelle
│   └── studio/[[...tool]]/         # Sanity Studio
├── components/
│   ├── ui/                         # Composants réutilisables
│   ├── layout/                     # Header, Footer
│   └── sections/                   # Sections des pages
├── sanity/
│   ├── schemaTypes/                # Schémas Sanity
│   └── lib/                        # Client, queries, image helper
├── lib/
│   └── utils.ts                    # Utilitaires
└── types/
    └── sanity.ts                   # Types TypeScript pour Sanity
```

## Design System

### Palette de couleurs

```css
--forest-deep: #1a2e23   /* Vert forêt foncé - backgrounds sombres */
--forest: #2D4A3E        /* Vert forêt - texte principal sur fond clair */
--sage: #8b9e7e          /* Sauge - accents, labels */
--sage-light: #b5c4a8    /* Sauge clair - texte secondaire sur fond sombre */
--cream: #f7f4ed         /* Crème - background principal */
--cream-warm: #efe9dc    /* Crème chaud - backgrounds alternatifs */
--blush: #e8d4cf         /* Rose poudré - accents doux */
--blush-deep: #d4aea5    /* Rose profond - accents */
--gold: #c4a35a          /* Or - CTAs, badges premium */
--gold-light: #dcc78e    /* Or clair - accents */
--ink: #1a1a18           /* Encre - texte principal */
--ink-soft: #3d3d38      /* Encre douce - texte secondaire */
```

### Typographie

- **Display**: Playfair Display (titres grands)
- **Accent**: Cormorant Garamond (sous-titres, labels)
- **Body**: Lora (corps de texte)

### Classes utilitaires

- `.display-huge` - Très grands titres (hero)
- `.display-large` - Grands titres de section
- `.display-medium` - Titres moyens
- `.heading` - Sous-titres
- `.body-large` - Texte de lecture
- `.label` - Labels en majuscules espacées

## Sanity

### Project ID: `4otm8dqd`
### Dataset: `production`

### Types de documents

- `post` - Articles de blog
- `recipe` - Recettes avec ingrédients, étapes, bienfaits
- `author` - Auteurs
- `category` - Catégories
- `testimonial` - Témoignages clients
- `product` - Produits (livre)

### Accès au Studio

- URL locale: http://localhost:3000/studio
- URL production: https://monremede-site.vercel.app/studio

## Commandes

```bash
npm run dev    # Développement local
npm run build  # Build Next.js
npm run start  # Serveur de production local
npm run lint   # Linter
```

## Consultations

4 formules de consultation:
- **Santé Générale** - 50€
- **Troubles Digestifs** - 60€
- **Équilibre Hormonal** - 70€
- **Suivi Complet** - 110€

Les consultations utilisent un questionnaire (pas de paiement en ligne, contact par email).

## Vente du livre

Le livre est vendu sur Amazon (format broché et Kindle).
TODO: Remplacer le lien placeholder `AMAZON_LINK` dans les fichiers suivants:
- `src/components/sections/hero.tsx`
- `src/components/sections/pricing.tsx`
- `src/components/sections/final-cta.tsx`

## Notes importantes

1. **Images Sanity**: Utiliser `urlFor()` de `@/sanity/lib/image`
2. **ISR**: Les pages blog et recettes utilisent `revalidate = 60`
3. **SSG**: Les pages individuelles utilisent `generateStaticParams()`
4. **PortableText**: Utiliser `@portabletext/react` pour le contenu riche
