import React from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

// ─── PhoenixCard ──────────────────────────────────────────────────────────────
// variant controls the 3 stone background tones used by Phoenix:
//   'charcoal' → Metrics row  (#181A1D → #202226)
//   'slate'    → Logs/panels  (#202225 → #26282C)
//   'deep'     → Large panels (#16181B → #1E2023)
// dotted adds the Phoenix dot-grid texture overlay.
// glow adds a soft ember inner glow (for live/active cards).
// ─────────────────────────────────────────────────────────────────────────────

interface PhoenixCardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'charcoal' | 'slate' | 'deep';
    glow?: boolean;
    dotted?: boolean;
    active?: boolean;
    children: React.ReactNode;
}

const VARIANTS = {
    charcoal: {
        bg: 'linear-gradient(145deg, #181A1D 0%, #202226 100%)',
        border: 'rgba(255,255,255,0.055)',
    },
    slate: {
        bg: 'linear-gradient(145deg, #202225 0%, #26282C 100%)',
        border: 'rgba(255,255,255,0.06)',
    },
    deep: {
        bg: 'linear-gradient(145deg, #16181B 0%, #1E2023 100%)',
        border: 'rgba(255,255,255,0.045)',
    },
};

export const PhoenixCard: React.FC<PhoenixCardProps> = ({
    variant = 'charcoal',
    glow = false,
    dotted = false,
    active = false,
    className,
    children,
    style,
    ...rest
}) => {
    const v = VARIANTS[variant];

    return (
        <motion.div
            className={clsx('relative overflow-hidden rounded-2xl', className)}
            style={{
                background: v.bg,
                border: `1px solid ${v.border}`,
                boxShadow: [
                    `inset 0 1px 0 rgba(255,255,255,0.05)`,
                    `0 6px 24px rgba(0,0,0,0.5)`,
                    active ? '0 0 0 1px rgba(255,122,41,0.35), 0 0 20px rgba(255,122,41,0.08)' : '',
                ].filter(Boolean).join(', '),
                ...style,
            }}
            {...rest}
        >
            {/* Dot-grid texture */}
            {dotted && (
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)',
                        backgroundSize: '18px 18px',
                        zIndex: 0,
                    }}
                />
            )}

            {/* Top metallic sheen */}
            <div
                className="absolute inset-x-0 top-0 pointer-events-none"
                style={{
                    height: '40%',
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, transparent 100%)',
                    zIndex: 1,
                }}
            />

            {/* Ember inner glow */}
            {glow && (
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: 'radial-gradient(ellipse at 50% 0%, rgba(255,122,41,0.07) 0%, transparent 65%)',
                        zIndex: 1,
                    }}
                />
            )}

            {/* Content */}
            <div className="relative" style={{ zIndex: 2 }}>
                {children}
            </div>
        </motion.div>
    );
};
