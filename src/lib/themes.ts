// Earket Theme System
export interface EarketTheme {
  id: string
  name: string
  emoji: string
  primary: string
  gradient?: string
  accent: string
  textOnPrimary: string
  bestFor: string
}

export const EARKET_THEMES: EarketTheme[] = [
  {
    id: 'forest',
    name: 'Forest Green',
    emoji: '🌿',
    primary: '#1A7A4A',
    accent: '#25D366',
    textOnPrimary: '#ffffff',
    bestFor: 'Food, groceries, nature',
  },
  {
    id: 'ocean',
    name: 'Ocean Blue',
    emoji: '🌊',
    primary: '#1a56db',
    gradient: 'linear-gradient(135deg, #1e3a8a 0%, #1a56db 100%)',
    accent: '#3b82f6',
    textOnPrimary: '#ffffff',
    bestFor: 'Auto, tech, corporate',
  },
  {
    id: 'lavender',
    name: 'Lavender',
    emoji: '💜',
    primary: '#7c3aed',
    gradient: 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)',
    accent: '#a855f7',
    textOnPrimary: '#ffffff',
    bestFor: 'Spa, beauty, wellness',
  },
  {
    id: 'rose',
    name: 'Rose Gold',
    emoji: '🌸',
    primary: '#be185d',
    gradient: 'linear-gradient(135deg, #be185d 0%, #f43f5e 100%)',
    accent: '#f43f5e',
    textOnPrimary: '#ffffff',
    bestFor: 'Bridal, makeup, hair',
  },
  {
    id: 'ember',
    name: 'Ember',
    emoji: '🔥',
    primary: '#ea580c',
    gradient: 'linear-gradient(135deg, #dc2626 0%, #ea580c 50%, #f59e0b 100%)',
    accent: '#f59e0b',
    textOnPrimary: '#ffffff',
    bestFor: 'Food, catering, events',
  },
  {
    id: 'noir',
    name: 'Noir',
    emoji: '⚫',
    primary: '#1f2937',
    gradient: 'linear-gradient(135deg, #111827 0%, #374151 100%)',
    accent: '#6b7280',
    textOnPrimary: '#ffffff',
    bestFor: 'Photography, premium, luxury',
  },
  {
    id: 'crimson',
    name: 'Crimson',
    emoji: '❤️',
    primary: '#dc2626',
    gradient: 'linear-gradient(135deg, #991b1b 0%, #dc2626 100%)',
    accent: '#ef4444',
    textOnPrimary: '#ffffff',
    bestFor: 'Auto repair, bold brands',
  },
  {
    id: 'teal',
    name: 'Teal',
    emoji: '🩵',
    primary: '#0d9488',
    gradient: 'linear-gradient(135deg, #0d9488 0%, #0284c7 100%)',
    accent: '#06b6d4',
    textOnPrimary: '#ffffff',
    bestFor: 'Health, medical, fitness',
  },
  {
    id: 'sunset',
    name: 'Sunset',
    emoji: '🌅',
    primary: '#ec4899',
    gradient: 'linear-gradient(135deg, #f97316 0%, #ec4899 50%, #9333ea 100%)',
    accent: '#f97316',
    textOnPrimary: '#ffffff',
    bestFor: 'Events, creative, entertainment',
  },
  {
    id: 'midnight',
    name: 'Midnight',
    emoji: '🫐',
    primary: '#1e3a8a',
    gradient: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #312e81 100%)',
    accent: '#6366f1',
    textOnPrimary: '#ffffff',
    bestFor: 'Tech, digital, education',
  },
  {
    id: 'clean',
    name: 'Clean White',
    emoji: '🤍',
    primary: '#f1f5f9',
    accent: '#334155',
    textOnPrimary: '#1e293b',
    bestFor: 'Clinical, minimal, medical',
  },
  {
    id: 'gold',
    name: 'Black & Gold',
    emoji: '✨',
    primary: '#1a1a1a',
    gradient: 'linear-gradient(135deg, #1a1a1a 0%, #2d2010 50%, #1a1a1a 100%)',
    accent: '#d4a017',
    textOnPrimary: '#d4a017',
    bestFor: 'Luxury, premium spa, elite brands',
  },
  {
    id: 'sage',
    name: 'Sage & Cream',
    emoji: '🌿',
    primary: '#6b7c6e',
    gradient: 'linear-gradient(135deg, #4a5e4d 0%, #8a9e8d 100%)',
    accent: '#c8d5b9',
    textOnPrimary: '#ffffff',
    bestFor: 'Natural wellness, organic, holistic',
  },
  {
    id: 'blush',
    name: 'Blush & Ivory',
    emoji: '🩷',
    primary: '#c9847a',
    gradient: 'linear-gradient(135deg, #b5645a 0%, #e8a598 100%)',
    accent: '#f5e6e0',
    textOnPrimary: '#ffffff',
    bestFor: 'Spa, feminine brands, wellness',
  },
  {
    id: 'royal',
    name: 'Royal Navy',
    emoji: '👑',
    primary: '#1b2a4a',
    gradient: 'linear-gradient(135deg, #0d1b33 0%, #1b2a4a 50%, #2a3f6a 100%)',
    accent: '#c0a060',
    textOnPrimary: '#ffffff',
    bestFor: 'Corporate, professional, premium',
  },
]

export function getThemeById(id: string): EarketTheme {
  return EARKET_THEMES.find(t => t.id === id) || EARKET_THEMES[0]
}

// Returns the CSS style object for the hero/header background
export function getThemeStyle(theme: EarketTheme): Record<string, string> {
  if (theme.gradient) return { background: theme.gradient }
  return { backgroundColor: theme.primary }
}

// Returns the color string for buttons/accents (always the solid primary)
export function getThemeColor(theme: EarketTheme): string {
  return theme.primary
}
