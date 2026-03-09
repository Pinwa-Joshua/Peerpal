/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1F3A5F",
        secondary: "#4DA3FF",
        accent: "#FFC107",
        tutor: "#0D9488",
        "tutor-light": "#14B8A6",
        "bg-light": "#F7F9FC",
        "bg-dark": "#121826",
        "surface-light": "#FFFFFF",
        "surface-dark": "#1E293B",
      },
      fontFamily: {
        display: ["Poppins", "sans-serif"],
        sans: ["Inter", "sans-serif"],
      },
      boxShadow: {
        soft: "0 4px 20px -2px rgba(0, 0, 0, 0.06)",
      },
    },
  },
  plugins: [],
}

