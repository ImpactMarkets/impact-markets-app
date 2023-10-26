import colors from 'tailwindcss/colors'
import defaultTheme from 'tailwindcss/defaultTheme'

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-open-sans)', ...defaultTheme.fontFamily.sans],
        display: [
          'var(--font-barlow-condensed)',
          ...defaultTheme.fontFamily.sans,
        ],
      },
      fontSize: {
        base: ['16px', '24px'],
        xl: ['20px', '24px'],
        '2xl': ['24px', '28px'],
        '3xl': ['28px', '32px'],
        '4xl': ['32px', '36px'],
      },
      backgroundColor: {
        primary: colors.slate[800],
        secondary: colors.white,
        highlight: '#0e73cc',
      },
      borderColor: {
        primary: colors.slate[800],
        secondary: colors.gray[200],
      },
      divideColor: {
        primary: colors.slate[800],
        secondary: colors.gray[200],
      },
      borderRadius: {
        none: '0',
        xs: '2px',
        sm: '4px',
        DEFAULT: '6px',
        md: '8px',
        lg: '10px',
        full: '9999px',
      },
      boxShadow: {
        sm: '0px 1px 2px rgba(0, 0, 0, 0.05)',
        lg: '0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)',
        xl: '0 20px 25px -5px rgba(0,0,0,0.1),0 10px 10px -5px rgba(0,0,0,0.04)',
      },
      textColor: {
        primary: colors.white,
        secondary: colors.gray[900],
        highlight: '#0e73cc',
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(.25,1.6,.5,.8)',
      },
      letterSpacing: {
        tight: '-.01em',
      },
      ringWidth: {
        6: '6px',
      },
      height: {
        button: '34px',
      },
      width: {
        'icon-button': '34px',
      },
      zIndex: {
        '-1': -1,
      },
      typography: {
        DEFAULT: {
          css: {
            color: colors.gray[900],
            img: {
              marginTop: '1.5em',
              marginBottom: '1.5em',
            },
            h1: {
              fontWeight: 'bold',
              fontSize: '28px',
            },
            h2: {
              fontWeight: 'bold',
              fontSize: '24px',
            },
            h3: {
              fontWeight: 'bold',
              fontSize: '20px',
            },
            h4: {
              fontWeight: 'bold',
              fontSize: '16px',
            },
            h5: {
              fontWeight: 'bold',
              fontSize: '16px',
            },
            h6: {
              fontWeight: 'bold',
              fontSize: '16px',
            },
            li: {
              marginTop: '0.25em',
              marginBottom: '0.25em',
            },
          },
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
}
