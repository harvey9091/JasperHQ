// ─── Phoenix OS Design Constants ─────────────────────────────────────────────
// The official heading font for JasperHQ — all-caps industrial style
// Matches the CRM kanban headers (font-display = Orbitron in tailwind.config.js)

export const PH = {
    // Fonts
    fontHeading: 'JetBrains Mono, monospace',
    fontBody: 'Inter, sans-serif',
    fontMono: 'JetBrains Mono, monospace',

    // Colors
    orange: '#FF7A29',
    orangeD: '#D95B16',
    orangeL: '#FFA057',
    text: '#E2E4E9',
    muted: '#7A7F8A',
    dim: '#4A4F5A',
    border: 'rgba(255,255,255,0.06)',
    borderHov: 'rgba(255,122,41,0.22)',

    // Backgrounds
    bgCharcoal: 'linear-gradient(145deg, #181A1D 0%, #202226 100%)',
    bgSlate: 'linear-gradient(145deg, #202225 0%, #26282C 100%)',
    bgDeep: 'linear-gradient(145deg, #16181B 0%, #1E2023 100%)',

    // Shadows
    bevel: 'inset 0 1px 0 rgba(255,255,255,0.05), 0 4px 16px rgba(0,0,0,0.45)',
    deep: '0 8px 32px rgba(0,0,0,0.6)',
    glow: '0 0 18px rgba(255,122,41,0.25)',

    // Common heading style object
    heading: (size = 32): React.CSSProperties => ({
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: size,
        fontWeight: 700,
        color: '#FFFFFF',
        letterSpacing: '0.04em',
        lineHeight: 1.1,
        textTransform: 'uppercase' as const,
    }),

    // Section label (JetBrains Mono micro-caps)
    label: (): React.CSSProperties => ({
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: '0.28em',
        color: '#7A7F8A',
        textTransform: 'uppercase' as const,
    }),

    // Phoenix card base style
    card: (variant: 'charcoal' | 'slate' | 'deep' = 'charcoal'): React.CSSProperties => ({
        background: variant === 'charcoal'
            ? 'linear-gradient(145deg, #181A1D 0%, #202226 100%)'
            : variant === 'slate'
                ? 'linear-gradient(145deg, #202225 0%, #26282C 100%)'
                : 'linear-gradient(145deg, #16181B 0%, #1E2023 100%)',
        border: 'rgba(255,255,255,0.05) 1px solid',
        borderRadius: 14,
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05), 0 4px 16px rgba(0,0,0,0.45)',
    }),
} as const;

// needed for React.CSSProperties usage inside the const
import React from 'react';
