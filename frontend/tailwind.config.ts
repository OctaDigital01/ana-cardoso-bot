import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Background colors
        background: {
          primary: '#000000',
          secondary: '#0A0A0A',
          tertiary: '#141414',
          quaternary: '#1A1A1A',
        },
        
        // Glass effect colors
        glass: {
          bg: 'rgba(255, 255, 255, 0.05)',
          'bg-hover': 'rgba(255, 255, 255, 0.08)',
          'bg-active': 'rgba(255, 255, 255, 0.12)',
          border: 'rgba(255, 255, 255, 0.1)',
          'border-hover': 'rgba(255, 255, 255, 0.15)',
        },
        
        // Accent colors
        accent: {
          primary: '#007AFF',
          'primary-hover': '#0056CC',
          'primary-active': '#003D99',
          secondary: '#5E5CE6',
          'secondary-hover': '#4B49E6',
          'secondary-active': '#3837E6',
        },
        
        // Text colors
        text: {
          primary: '#FFFFFF',
          secondary: 'rgba(255, 255, 255, 0.8)',
          tertiary: 'rgba(255, 255, 255, 0.6)',
          quaternary: 'rgba(255, 255, 255, 0.4)',
        },
        
        // Status colors
        success: {
          DEFAULT: '#30D158',
          bg: 'rgba(48, 209, 88, 0.1)',
        },
        warning: {
          DEFAULT: '#FF9F0A',
          bg: 'rgba(255, 159, 10, 0.1)',
        },
        error: {
          DEFAULT: '#FF3B30',
          bg: 'rgba(255, 59, 48, 0.1)',
        },
        info: {
          DEFAULT: '#64D2FF',
          bg: 'rgba(100, 210, 255, 0.1)',
        },
      },
      
      // Background gradients
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #007AFF 0%, #5E5CE6 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #5E5CE6 0%, #AF52DE 100%)',
        'gradient-glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
        'gradient-glass-hover': 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 100%)',
        'gradient-shimmer': 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%)',
      },
      
      // Font family
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Oxygen',
          'Ubuntu',
          'Cantarell',
          'Helvetica Neue',
          'sans-serif',
        ],
        mono: [
          'SF Mono',
          'Monaco',
          'Cascadia Code',
          'Roboto Mono',
          'Consolas',
          'Courier New',
          'monospace',
        ],
      },
      
      // Font sizes
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.75rem' }],
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
      
      // Spacing
      spacing: {
        '0.5': '0.125rem',
        '1.5': '0.375rem',
        '2.5': '0.625rem',
        '3.5': '0.875rem',
        '4.5': '1.125rem',
        '5.5': '1.375rem',
        '6.5': '1.625rem',
        '7.5': '1.875rem',
        '8.5': '2.125rem',
        '9.5': '2.375rem',
        '18': '4.5rem',
        '88': '22rem',
        '100': '25rem',
        '120': '30rem',
      },
      
      // Border radius
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      
      // Backdrop blur
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '16px',
        xl: '24px',
        '2xl': '40px',
        '3xl': '64px',
      },
      
      // Box shadow
      boxShadow: {
        'glass': '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        'glass-hover': '0 12px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
        'accent': '0 4px 16px rgba(0, 122, 255, 0.3)',
        'accent-hover': '0 8px 24px rgba(0, 122, 255, 0.4)',
      },
      
      // Animation
      animation: {
        'fade-in': 'fadeIn 0.5s ease forwards',
        'scale-in': 'scaleIn 0.3s ease forwards',
        'slide-in-right': 'slideInRight 0.4s ease forwards',
        'shimmer': 'shimmer 2s infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      
      // Keyframes
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          '0%': { left: '-100%' },
          '100%': { left: '100%' },
        },
      },
      
      // Transitions
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
        '900': '900ms',
      },
      
      // Viewport
      screens: {
        'xs': '475px',
        '3xl': '1680px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    // Plugin personalizado para glass effects
    function({ addUtilities, theme }: any) {
      const newUtilities = {
        '.glass': {
          background: theme('colors.glass.bg'),
          backdropFilter: 'blur(20px)',
          '-webkit-backdrop-filter': 'blur(20px)',
          border: `1px solid ${theme('colors.glass.border')}`,
          boxShadow: theme('boxShadow.glass'),
        },
        '.glass-hover': {
          background: theme('colors.glass.bg-hover'),
          borderColor: theme('colors.glass.border-hover'),
          boxShadow: theme('boxShadow.glass-hover'),
        },
        '.glass-strong': {
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(40px)',
          '-webkit-backdrop-filter': 'blur(40px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        },
        '.glass-subtle': {
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(10px)',
          '-webkit-backdrop-filter': 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        },
        '.text-gradient': {
          background: theme('backgroundImage.gradient-primary'),
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
        },
        '.shimmer': {
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: "''",
            position: 'absolute',
            top: '0',
            left: '-100%',
            width: '100%',
            height: '100%',
            background: theme('backgroundImage.gradient-shimmer'),
            animation: theme('animation.shimmer'),
          },
        },
      }
      addUtilities(newUtilities)
    },
  ],
}

export default config