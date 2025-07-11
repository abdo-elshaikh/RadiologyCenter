module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#7c8cff',
          DEFAULT: '#646cff',
          dark: '#4a54e1',
        },
        secondary: {
          light: '#ff7c7c',
          DEFAULT: '#ff4a4a',
          dark: '#e14a4a',
        },
        background: {
          light: '#f9fafb',
          DEFAULT: '#ffffff',
          dark: '#1a1a1a',
          darker: '#121212',
        },
        text: {
          light: '#f9fafb',
          DEFAULT: '#242424',
          dark: '#121212',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        'xl': '1rem',
      },
      boxShadow: {
        'md-dark': '0 4px 6px rgba(0, 0, 0, 0.9)',
      },
    },
  },
  plugins: [require('daisyui')],
};
