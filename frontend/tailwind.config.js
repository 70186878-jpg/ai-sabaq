/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f7ff',
          100: '#ebf0ff',
          500: '#3b82f6', // Core branding blue
          600: '#2563eb',
          700: '#1d4ed8',
        },
        gamification: {
          xp: '#f59e0b', // Amber
          streak: '#ef4444', // Red for hot streaks
          level: '#10b981', // Emerald
          badgeGold: '#d97706',
          badgeSilver: '#94a3b8',
          badgeBronze: '#b45309',
        },
      },
    },
  },
  plugins: [],
}