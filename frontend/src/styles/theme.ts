export const theme = {
  colors: {
    // Luxury Old Money Color Palette
    luxury: {
      darkGreen: '#014421',
      gold: '#BFA76A',
      beige: '#F5F5DC',
      charcoal: '#222222',
      brown: '#8B5C2A',
      cream: '#FDF5E6',
      sage: '#9CAF88',
      navy: '#1B365D',
    },
    // Semantic colors
    primary: '#014421',
    secondary: '#BFA76A',
    accent: '#8B5C2A',
    background: '#F5F5DC',
    text: '#222222',
    white: '#FFFFFF',
    black: '#000000',
  },
  
  fonts: {
    display: "'Playfair Display', serif",
    body: "'Inter', sans-serif",
    serif: "'Playfair Display', 'EB Garamond', Georgia, serif",
    sans: "'Inter', 'Lato', 'Open Sans', sans-serif",
  },
  
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '3.75rem',
  },
  
  fontWeights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
    '4xl': '6rem',
  },
  
  borderRadius: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    full: '9999px',
  },
  
  shadows: {
    luxury: '0 4px 6px -1px rgba(1, 68, 33, 0.1), 0 2px 4px -1px rgba(1, 68, 33, 0.06)',
    gold: '0 4px 6px -1px rgba(191, 167, 106, 0.1), 0 2px 4px -1px rgba(191, 167, 106, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  },
  
  gradients: {
    luxury: 'linear-gradient(135deg, #014421 0%, #1B365D 100%)',
    gold: 'linear-gradient(135deg, #BFA76A 0%, #8B5C2A 100%)',
  },
  
  transitions: {
    default: 'all 0.3s ease',
    fast: 'all 0.15s ease',
    slow: 'all 0.5s ease',
  },
  
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
} as const;

export type Theme = typeof theme; 