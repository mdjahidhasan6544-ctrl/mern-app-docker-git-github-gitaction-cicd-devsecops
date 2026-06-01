export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
        fontFamily: {
            'sans': ['Inter', 'sans-serif'],
            'serif': ['Playfair Display', 'serif'],
        },
        colors: {
            'luxury-dark': '#0f0f0f',
            'luxury-light': '#fafafa',
            'luxury-accent': '#c9a263',
        }
    },
  },
  plugins: [],
}
