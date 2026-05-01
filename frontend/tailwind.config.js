/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#FAFAFA',
                accent: '#0F766E',
                ink: '#111827',
            },
            fontFamily: {
                heading: ['Space Grotesk', 'sans-serif'],
                body: ['Inter', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
