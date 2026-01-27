/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./app/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
        extend: {

        },
    },
    plugins: [require("@tailwindcss/typography")],
};