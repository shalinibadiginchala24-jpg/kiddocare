/**
 * KiddoCare Pastel Palette — shared across all screens
 * Child theme:  warm rose/peach/lavender
 * Parent theme: cool sky/mint/violet
 */

export const CHILD_PALETTE = {
  // Primary gradient
  grad1: ['#FFD1DC', '#FFB7C5'] as const,   // rose
  grad2: ['#FFE4E6', '#FECDD3'] as const,   // soft rose
  grad3: ['#EDE9FE', '#DDD6FE'] as const,   // lavender
  grad4: ['#FEF9C3', '#FDE68A'] as const,   // butter
  grad5: ['#DCFCE7', '#BBF7D0'] as const,   // mint
  // Background tones
  bg: '#FFF5F7',
  cardBg: '#FFFFFF',
  headerStart: '#FFD1DC',
  headerEnd: '#E2D1F9',
  // Accent colours
  accent: '#FF6B9D',
  accent2: '#C44DFF',
  accent3: '#FFD93D',
  // Text
  heading: '#3D1A2A',
  sub: '#9B7895',
  // Tab active
  tabActive: '#FF6B9D',
  tabInactive: '#C9A0B9',
};

export const PARENT_PALETTE = {
  grad1: ['#BAE6FD', '#7DD3FC'] as const,   // sky
  grad2: ['#BBF7D0', '#86EFAC'] as const,   // mint
  grad3: ['#DDD6FE', '#C4B5FD'] as const,   // violet
  grad4: ['#FDE68A', '#FCD34D'] as const,   // amber
  grad5: ['#FECDD3', '#FDA4AF'] as const,   // blush
  bg: '#F0F8FF',
  cardBg: '#FFFFFF',
  headerStart: '#4F46E5',
  headerEnd: '#7C3AED',
  accent: '#4F46E5',
  accent2: '#7C3AED',
  accent3: '#0EA5E9',
  heading: '#1E1B4B',
  sub: '#6B7280',
  tabActive: '#4F46E5',
  tabInactive: '#A5B4FC',
};

// Per-child pastel chip colours (for parent dashboard)
export const CHILD_CHIPS = [
  { bg: ['#FFD1DC', '#FFB7C5'] as const, chipBg: '#FFF0F4', dot: '#FF6B9D', textColor: '#A33060' },
  { bg: ['#B5EAD7', '#86EFAC'] as const, chipBg: '#F0FFF8', dot: '#059669', textColor: '#065F46' },
  { bg: ['#C7CEEA', '#DDD6FE'] as const, chipBg: '#F5F0FF', dot: '#7C3AED', textColor: '#4C1D95' },
  { bg: ['#FFDAC1', '#FCD34D'] as const, chipBg: '#FFF8F0', dot: '#D97706', textColor: '#92400E' },
  { bg: ['#BAE6FD', '#7DD3FC'] as const, chipBg: '#F0F8FF', dot: '#0284C7', textColor: '#075985' },
  { bg: ['#FEF9C3', '#FDE68A'] as const, chipBg: '#FFFFF0', dot: '#CA8A04', textColor: '#713F12' },
];
