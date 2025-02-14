import flowbite from "flowbite-react/tailwind";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", flowbite.content()],
  theme: {
    extend: {
      colors: {
        dark: "#0C0B10",
        secondary: "#F6F5F4",
        secondaryDark: "#09080D",
      },
    },
  },
  darkMode: "class",
  plugins: [flowbite.plugin()],
};