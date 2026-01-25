/**
 * Mon Remède Design System for Remotion Videos
 * Based on brand guidelines - Science • Douceur • Spiritualité
 */

// Color Palette
export const colors = {
  // Primary - Authority & Nature
  forestBottle: '#2D4A3E',
  sage: '#9CAF88',
  sageLight: '#B8C9A9',

  // Neutrals - Calm & Clean
  offWhite: '#FDFBF7',
  beigeLinen: '#F5F0E8',
  beigeWarm: '#E8DFD0',

  // Accents - Feminine & Premium
  rosePowder: '#E8D5D5',
  roseSoft: '#D4B8B8',
  goldSoft: '#C9A962',

  // Text
  ink: '#1a1a18',
  inkSoft: '#3d3d38',

  // Transparent overlays
  forestOverlay: 'rgba(45, 74, 62, 0.85)',
  creamOverlay: 'rgba(253, 251, 247, 0.95)',
} as const;

// Typography scale
export const typography = {
  displayHuge: {
    fontSize: 120,
    fontWeight: 700,
    lineHeight: 1.1,
  },
  displayLarge: {
    fontSize: 80,
    fontWeight: 600,
    lineHeight: 1.15,
  },
  displayMedium: {
    fontSize: 56,
    fontWeight: 600,
    lineHeight: 1.2,
  },
  heading: {
    fontSize: 42,
    fontWeight: 500,
    lineHeight: 1.3,
  },
  bodyLarge: {
    fontSize: 32,
    fontWeight: 400,
    lineHeight: 1.5,
  },
  label: {
    fontSize: 24,
    fontWeight: 500,
    letterSpacing: 3,
    textTransform: 'uppercase' as const,
  },
  quote: {
    fontSize: 36,
    fontWeight: 400,
    fontStyle: 'italic' as const,
    lineHeight: 1.6,
  },
} as const;

// Animation timings (in seconds)
export const timings = {
  fadeIn: 0.5,
  fadeOut: 0.4,
  slideIn: 0.6,
  stagger: 0.15,
  hold: 2.5,
  transitionDuration: 0.5,
} as const;

// Spring configurations
export const springs = {
  smooth: { damping: 200 },
  snappy: { damping: 20, stiffness: 200 },
  bouncy: { damping: 12, stiffness: 150 },
  gentle: { damping: 30, stiffness: 80 },
  premium: { damping: 100, stiffness: 120 },
} as const;

// Instagram Reels format
export const videoConfig = {
  width: 1080,
  height: 1920,
  fps: 30,
} as const;
