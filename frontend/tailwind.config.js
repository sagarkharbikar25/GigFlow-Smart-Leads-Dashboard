/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#000000',       // Vercel pitch black background
          surface: '#0A0A0A',    // Extremely subtle card background
          border: '#27272A',     // Very fine zinc-800 border
          text: '#FAFAFA',       // Crisp white
          muted: '#A1A1AA',      // Zinc-400 for secondary text
          
          primary: '#FFFFFF',    // White for primary actions
          secondary: '#3B82F6',  // Blue for accents
          accent: '#8B5CF6',     // Violet for special highlights
          
          success: '#10B981',    
          warning: '#F59E0B',    
          danger: '#EF4444',     
          info: '#3B82F6',       
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], 
        mono: ['JetBrains Mono', 'monospace'], // For numbers/metrics
      },
      boxShadow: {
        'premium': '0 0 0 1px rgba(255,255,255,0.05), 0 4px 20px -2px rgba(0,0,0,0.5)',
        'glow-primary': '0 0 20px 0px rgba(255, 255, 255, 0.15)',
        'glow-secondary': '0 0 20px 0px rgba(59, 130, 246, 0.2)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
};
