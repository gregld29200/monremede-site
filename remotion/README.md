# Mon Remède - Instagram Promo Videos

Videos promotionnels premium pour Instagram Reels créés avec Remotion.

## Les 3 vidéos

### 1. Brand Story (`BrandStory`)
Introduction à la marque Mon Remède et à la philosophie d'Oum Soumayya.
- Scene 1: Reveal du logo avec animations botaniques
- Scene 2: Le parcours personnel - citation impactante
- Scene 3: Les 3 piliers (Science • Douceur • Spiritualité)
- Scene 4: CTA vers monremede.com

### 2. Book Promo (`BookPromo`)
Promotion du livre "La Santé dans l'Assiette - 30 jours pour se soigner"
- Scene 1: Présentation visuelle du livre avec effets 3D
- Scene 2: Statistiques choc sur les médicaments (animation compteur)
- Scene 3: Le programme 30 jours avec bénéfices animés
- Scene 4: Quote + CTA Amazon

### 3. Consultations Promo (`ConsultationsPromo`)
Showcase des services de consultation en naturopathie
- Scene 1: Identification des problèmes (bulles animées)
- Scene 2: Introduction d'Oum Soumayya et ses spécialités
- Scene 3: Les 4 formules de consultation (cartes animées)
- Scene 4: CTA émotionnel + lien consultations

## Format

- **Dimensions**: 1080x1920 (format vertical 9:16 pour Instagram Reels)
- **FPS**: 30
- **Durée**: ~18-19 secondes chacune

## Commandes

```bash
# Démarrer le studio de prévisualisation
npm run studio

# Rendre toutes les vidéos
npm run render:all

# Rendre une vidéo spécifique
npm run render:video1  # Brand Story
npm run render:video2  # Book Promo
npm run render:video3  # Consultations

# Mettre à jour Remotion
npm run upgrade
```

## Design System

### Couleurs
- **Vert Bouteille** `#2D4A3E` - Couleur d'autorité
- **Sauge** `#9CAF88` - Accents calmes
- **Blanc Cassé** `#FDFBF7` - Fond principal
- **Rose Poudré** `#E8D5D5` - Accents féminins
- **Or Doux** `#C9A962` - Touches premium

### Typographie
- **Playfair Display** - Titres principaux
- **Cormorant Garamond** - Sous-titres et labels
- **Lora** - Corps de texte

## Techniques avancées utilisées

- **Spring animations** avec configurations personnalisées (smooth, bouncy, snappy)
- **Staggered text animations** - Mots apparaissant un par un
- **Typewriter effect** - Effet machine à écrire avec curseur clignotant
- **Word highlighting** - Mise en évidence progressive des mots clés
- **Botanical SVG animations** - Feuilles flottantes, vignes qui poussent
- **Geometric Islamic patterns** - Motifs respectueux des principes islamiques
- **Fade transitions** - Transitions douces entre les scènes
- **Organic blobs** - Formes organiques animées en arrière-plan
- **Noise texture overlay** - Texture grain pour un rendu premium
- **Vignette effect** - Assombrissement des bords pour le focus
- **Light rays** - Rayons de lumière dorés animés

## Structure

```
remotion/
├── src/
│   ├── components/         # Composants réutilisables
│   │   ├── AnimatedText.tsx
│   │   ├── BotanicalElements.tsx
│   │   ├── Backgrounds.tsx
│   │   └── index.ts
│   ├── compositions/       # Les 3 vidéos
│   │   ├── BrandStory.tsx
│   │   ├── BookPromo.tsx
│   │   └── ConsultationsPromo.tsx
│   ├── theme.ts           # Design system
│   ├── Root.tsx           # Configuration Remotion
│   └── index.ts           # Point d'entrée
├── package.json
├── remotion.config.ts
└── tsconfig.json
```

## Export

Les vidéos sont exportées dans le dossier `out/` au format MP4 H.264, optimisées pour Instagram.
