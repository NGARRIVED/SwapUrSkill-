/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        // Luxury Old Money Color Palette
        'luxury': {
          'dark-green': '#014421',      // Deep forest green
          'gold': '#BFA76A',            // Rich gold
          'beige': '#F5F5DC',           // Off-white/beige
          'charcoal': '#222222',        // Deep charcoal
          'brown': '#8B5C2A',           // Rich brown
          'cream': '#FDF5E6',           // Light cream
          'sage': '#9CAF88',            // Muted sage green
          'navy': '#1B365D',            // Deep navy blue
        },
        // Semantic colors
        'primary': '#014421',
        'secondary': '#BFA76A',
        'accent': '#8B5C2A',
        'background': '#F5F5DC',
        'text': '#222222',
      },
      fontFamily: {
        'serif': ['Playfair Display', 'EB Garamond', 'Georgia', 'serif'],
        'sans': ['Inter', 'Lato', 'Open Sans', 'sans-serif'],
        'display': ['Playfair Display', 'serif'],
        'body': ['Inter', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      boxShadow: {
        'luxury': '0 4px 6px -1px rgba(1, 68, 33, 0.1), 0 2px 4px -1px rgba(1, 68, 33, 0.06)',
        'gold': '0 4px 6px -1px rgba(191, 167, 106, 0.1), 0 2px 4px -1px rgba(191, 167, 106, 0.06)',
      },
      backgroundImage: {
        'luxury-gradient': 'linear-gradient(135deg, #014421 0%, #1B365D 100%)',
        'gold-gradient': 'linear-gradient(135deg, #BFA76A 0%, #8B5C2A 100%)',
      },
    },
  },
  plugins: [],
} 