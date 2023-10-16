module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    'postcss-preset-mantine': {},
    'postcss-simple-vars': {
      variables: {
        // Taken from Tailwind
        'mantine-breakpoint-xs': '36em', // 576px
        'mantine-breakpoint-sm': '40em', // 640px
        'mantine-breakpoint-md': '48em', // 768px
        'mantine-breakpoint-lg': '64em', // 1024px
        'mantine-breakpoint-xl': '80em', // 1280px
      },
    },
  },
}
