# MonRemede - Site Oum Soumayya

## Aperçu du projet

Site web pour Oum Soumayya, naturopathe, vendant un livre sur la santé naturelle "La Santé dans l'assiette - 30 jours pour guérir naturellement". Le site comprend une page de vente, un blog d'articles et une section recettes.

## Stack technique

- **Framework**: Next.js 16 (App Router)
- **React**: 19
- **Styling**: Tailwind CSS 4
- **CMS**: Sanity (embedded studio)
- **Déploiement**: Cloudflare Pages avec @opennextjs/cloudflare
- **Langage**: TypeScript

## Structure du projet

```
src/
├── app/
│   ├── page.tsx              # Page d'accueil (page de vente)
│   ├── livre/page.tsx        # Page détaillée du livre
│   ├── blog/
│   │   ├── page.tsx          # Liste des articles
│   │   └── [slug]/page.tsx   # Article individuel
│   ├── recettes/
│   │   ├── page.tsx          # Liste des recettes
│   │   └── [slug]/page.tsx   # Recette individuelle
│   └── studio/[[...tool]]/   # Sanity Studio
├── components/
│   ├── ui/                   # Composants réutilisables (Button, Badge, Card, etc.)
│   ├── layout/               # Header, Footer
│   └── sections/             # Sections de la page de vente
├── sanity/
│   ├── schemaTypes/          # Schémas Sanity (post, recipe, author, etc.)
│   └── lib/                  # Client, queries, image helper
├── lib/
│   └── utils.ts              # Utilitaires (cn pour classnames)
└── types/
    └── sanity.ts             # Types TypeScript pour Sanity
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

- **Display**: Instrument Serif (titres grands)
- **Serif**: Fraunces (sous-titres, corps élégant)
- **Sans**: DM Sans (corps de texte, labels)

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

URL locale: http://localhost:3000/studio

## Commandes

```bash
npm run dev              # Développement local
npm run build            # Build Next.js standard
npm run build:cloudflare # Build pour Cloudflare Pages
npm run preview          # Preview Cloudflare local
npm run deploy           # Déployer sur Cloudflare
```

## Notes importantes

1. **Images Sanity**: Utiliser `urlFor()` de `@/sanity/lib/image` pour générer les URLs
2. **ISR**: Les pages blog et recettes utilisent `revalidate = 60` (1 minute)
3. **SSG**: Les pages individuelles utilisent `generateStaticParams()`
4. **PortableText**: Utiliser `@portabletext/react` pour le rendu du contenu riche

## TODO / Améliorations futures

- [ ] Affiner le design de la page de vente (inconsistances à corriger)
- [ ] Ajouter les vrais témoignages
- [ ] Intégrer le système de paiement
- [ ] Ajouter les métadonnées SEO complètes
- [ ] Configurer les analytics
