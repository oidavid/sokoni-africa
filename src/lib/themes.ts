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
  // ── ORIGINALS ────────────────────────────────────────────────
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
    primary: '#9d4e44',
    gradient: 'linear-gradient(135deg, #8b3a30 0%, #c9847a 100%)',
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

  // ── NEW THEMES ────────────────────────────────────────────────
  {
    id: 'slate',
    name: 'Slate Pro',
    emoji: '🩶',
    primary: '#475569',
    gradient: 'linear-gradient(135deg, #334155 0%, #64748b 100%)',
    accent: '#94a3b8',
    textOnPrimary: '#ffffff',
    bestFor: 'Professional services, consulting',
  },
  {
    id: 'copper',
    name: 'Copper & Brown',
    emoji: '🪵',
    primary: '#92400e',
    gradient: 'linear-gradient(135deg, #78350f 0%, #b45309 100%)',
    accent: '#d97706',
    textOnPrimary: '#ffffff',
    bestFor: 'Furniture, carpentry, artisan',
  },
  {
    id: 'mint',
    name: 'Mint Fresh',
    emoji: '🌱',
    primary: '#047857',
    gradient: 'linear-gradient(135deg, #065f46 0%, #10b981 100%)',
    accent: '#34d399',
    textOnPrimary: '#ffffff',
    bestFor: 'Pharmacy, health food, wellness',
  },
  {
    id: 'indigo',
    name: 'Indigo',
    emoji: '🔷',
    primary: '#4338ca',
    gradient: 'linear-gradient(135deg, #3730a3 0%, #4f46e5 100%)',
    accent: '#818cf8',
    textOnPrimary: '#ffffff',
    bestFor: 'Education, coaching, finance',
  },
  {
    id: 'coral',
    name: 'Coral',
    emoji: '🪸',
    primary: '#e11d48',
    gradient: 'linear-gradient(135deg, #be123c 0%, #fb7185 100%)',
    accent: '#fda4af',
    textOnPrimary: '#ffffff',
    bestFor: 'Childcare, events, playful brands',
  },
  {
    id: 'chocolate',
    name: 'Chocolate',
    emoji: '🍫',
    primary: '#3b1f0e',
    gradient: 'linear-gradient(135deg, #1c0a04 0%, #6b3a1f 100%)',
    accent: '#c27c3e',
    textOnPrimary: '#ffffff',
    bestFor: 'Bakery, food, premium café',
  },
  {
    id: 'sky',
    name: 'Sky Blue',
    emoji: '☁️',
    primary: '#0369a1',
    gradient: 'linear-gradient(135deg, #075985 0%, #38bdf8 100%)',
    accent: '#7dd3fc',
    textOnPrimary: '#ffffff',
    bestFor: 'Cleaning, laundry, transport',
  },
  {
    id: 'olive',
    name: 'Olive & Gold',
    emoji: '🫒',
    primary: '#3d4d1e',
    gradient: 'linear-gradient(135deg, #2d3a14 0%, #6b7c2e 100%)',
    accent: '#a3b55a',
    textOnPrimary: '#ffffff',
    bestFor: 'Agriculture, farm produce, organic',
  },
  {
    id: 'plum',
    name: 'Plum',
    emoji: '🍇',
    primary: '#6b21a8',
    gradient: 'linear-gradient(135deg, #4a044e 0%, #9333ea 100%)',
    accent: '#d8b4fe',
    textOnPrimary: '#ffffff',
    bestFor: 'Beauty, hair, nail salon',
  },
]

export function getThemeById(id: string): EarketTheme {
  return EARKET_THEMES.find(t => t.id === id) || EARKET_THEMES[0]
}

export function getThemeStyle(theme: EarketTheme): Record<string, string> {
  if (theme.gradient) return { background: theme.gradient }
  return { backgroundColor: theme.primary }
}

export function getThemeColor(theme: EarketTheme): string {
  return theme.primary
}
