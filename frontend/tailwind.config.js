/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enables toggleable Dark Mode support!
  theme: {
    extend: {
      colors: {
        // Sleek dashboard background colors
        brand: {
          dark: '#0B0F19',       // Deep rich obsidian space blue
          surface: '#161D30',    // Muted dark card surface
          border: '#1F2A45',     // Sleek subtle border accent
          text: '#F3F4F6',       // Vibrant light text
          muted: '#9CA3AF',      // Balanced readable subtitle gray
          
          // Action colors (gradients look amazing with these)
          primary: '#3B82F6',    // Electric Blue
          secondary: '#8B5CF6',  // Vivid Royal Violet
          accent: '#06B6D4',     // Hyper Cyan
          
          // Status-badge specific colors (elegant HSL look rather than generic primary colors)
          success: '#10B981',    // Emerald Green
          warning: '#F59E0B',    // Amber Yellow
          danger: '#EF4444',     // Coral Red
          info: '#3B82F6',       // Sky Blue
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Premium font configuration
      },
      boxShadow: {
        // Modern soft shadow styles
        'premium': '0 4px 20px -2px rgba(0, 0, 0, 0.3)',
        'glow-primary': '0 0 15px 0px rgba(59, 130, 246, 0.4)',
        'glow-secondary': '0 0 15px 0px rgba(139, 92, 246, 0.4)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
};
