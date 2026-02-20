/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                jasper: {
                    dark: '#0D0F10',
                    panel: '#16191B',
                    surface: '#1D2123',
                    border: '#2A2F33',
                },
                neon: {
                    green: '#4BFF88',
                    teal: '#39C4AF',
                    amber: '#E05F2F',
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
                display: ['SF Pro Display', 'Inter', 'sans-serif'],
            },
            boxShadow: {
                'neon': '0 0 10px rgba(75, 255, 136, 0.2), 0 0 20px rgba(75, 255, 136, 0.1)',
                'neon-hover': '0 0 15px rgba(75, 255, 136, 0.4), 0 0 30px rgba(75, 255, 136, 0.2)',
                'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
            },
            animation: {
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'scan': 'scan 4s linear infinite',
            },
            keyframes: {
                scan: {
                    '0%': { transform: 'translateY(-100%)' },
                    '100%': { transform: 'translateY(100%)' },
                }
            }
        },
    },
    plugins: [],
    darkMode: 'class',
}
