/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                // ── Phoenix Stone Surfaces ──
                phoenix: {
                    dark: '#111215',  // App background base
                    surface: '#181A1D',  // Panel / card base
                    element: '#1C1E21',  // Elevated element
                    border: '#2A2D32',  // Stone bevel line
                    text: '#E2E4E9',  // Primary text
                    muted: '#7A7F8A',  // Muted / label text
                },
                // ── Ember Orange Accent (NO green anywhere) ──
                ember: {
                    primary: '#FF7A29',
                    deep: '#D95B16',
                    light: '#FFA057',
                    glow: 'rgba(255,122,41,0.15)',
                },
                // ── Stone Tones (Named for clarity) ──
                stone: {
                    charcoal: '#181A1D',  // Metrics cards
                    slate: '#202225',  // Log panels
                    deep: '#16181B',  // Large panels
                },
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                display: ['JetBrains Mono', 'monospace'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            backgroundImage: {
                // Global app gradient
                'phoenix-bg': 'linear-gradient(160deg, #111215 0%, #161820 50%, #1C1E22 100%)',
                // Nav gradient
                'nav-stone': 'linear-gradient(180deg, #1E2024 0%, #181A1D 100%)',
                // Hero panel
                'hero-stone': 'linear-gradient(145deg, #1A1C1F 0%, #222428 100%)',
                // Multi-tone card gradients
                'card-charcoal': 'linear-gradient(145deg, #181A1D 0%, #202226 100%)', // Metrics
                'card-slate': 'linear-gradient(145deg, #202225 0%, #26282C 100%)', // Logs
                'card-deep': 'linear-gradient(145deg, #16181B 0%, #1E2023 100%)', // Large panels
                // Orange energy flow
                'energy-flow': 'linear-gradient(90deg, transparent 0%, rgba(255,122,41,0.18) 50%, transparent 100%)',
                // Metallic top sheen
                'metal-sheen': 'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, transparent 60%)',
                // Dot grid (inline, not URL-based)
                'dot-grid': 'radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)',
                // Vignette
                'vignette': 'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.5) 100%)',
            },
            boxShadow: {
                'orange-glow': '0 0 20px rgba(255,122,41,0.28)',
                'orange-sm': '0 0 8px rgba(255,122,41,0.5)',
                'stone-bevel': 'inset 0 1px 0 rgba(255,255,255,0.05), 0 4px 16px rgba(0,0,0,0.45)',
                'panel-deep': '0 8px 32px rgba(0,0,0,0.6)',
                'inset-top': 'inset 0 1px 0 rgba(255,255,255,0.04)',
            },
            animation: {
                'energy-shift': 'energyShift 8s ease-in-out infinite',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4,0,0.6,1) infinite',
                'flow-sweep': 'flowSweep 3s linear infinite',
            },
            keyframes: {
                energyShift: {
                    '0%, 100%': { transform: 'translateX(0px)' },
                    '50%': { transform: 'translateX(4px)' },
                },
                flowSweep: {
                    '0%': { transform: 'translateX(-100%)' },
                    '100%': { transform: 'translateX(200%)' },
                },
            },
            backgroundSize: {
                'dot-sm': '18px 18px',
            },
        },
    },
    plugins: [],
};
