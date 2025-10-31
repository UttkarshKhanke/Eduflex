/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    // tailwind.config.js (theme.extend snippet)
extend: {
  colors: {
    brand: {
      50: '#EEF2FF',
      100: '#E9EAFF',
      300: '#A78BFA',
      400: '#7C3AED',
      500: '#6037E6',
      600: '#4F46E5', // primary
      700: '#4338CA',
    },
    accent: {
      cyan: '#22D3EE',
      blue: '#3B82F6',
    },
    ui: {
      bg: '#F8FAFC',      // page background
      surface: '#FFFFFF', // cards
      muted: '#F1F5F9',   // subtle surfaces
      divider: '#E6EEF8',
    },
    semantic: {
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
    },
  },
  fontFamily: {
    sans: ['Inter', 'ui-sans-serif', 'system-ui'],
  },
  borderRadius: {
    xl: '1rem',
    '2xl': '1.25rem',
  },
}

  },
  plugins: [],
}
