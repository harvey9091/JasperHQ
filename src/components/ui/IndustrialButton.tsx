import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface IndustrialButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    icon?: React.ElementType;
}

export const IndustrialButton: React.FC<IndustrialButtonProps> = ({
    children,
    className,
    variant = 'primary',
    size = 'md',
    icon: Icon,
    ...props
}) => {
    const base = 'relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl font-bold uppercase tracking-[0.1em] transition-all duration-200 cursor-pointer select-none';

    const sizes = {
        sm: 'h-9  px-4  text-[10px]',
        md: 'h-11 px-6  text-[11px]',
        lg: 'h-13 px-8  text-[12px]',
    };

    // Inline styles for precision (no Tailwind class conflicts)
    const variantStyles: Record<string, React.CSSProperties> = {
        primary: {
            background: 'linear-gradient(145deg, #1C1E22, #131416)',
            border: '1px solid rgba(255,122,41,0.5)',
            color: '#FF7A29',
            boxShadow: '0 0 16px rgba(255,122,41,0.18), inset 0 1px 0 rgba(255,255,255,0.04)',
            fontFamily: 'Orbitron, sans-serif',
        },
        secondary: {
            background: 'linear-gradient(145deg, #181A1D, #1C1E21)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: '#9CA0A8',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
            fontFamily: 'Orbitron, sans-serif',
        },
        ghost: {
            background: 'transparent',
            border: '1px solid transparent',
            color: '#7A7F8A',
            fontFamily: 'Orbitron, sans-serif',
        },
    };

    return (
        <motion.button
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.975 }}
            className={clsx(base, sizes[size], className)}
            style={variantStyles[variant]}
            {...(props as any)}
        >
            {/* Top bevel edge */}
            <span className="absolute inset-x-0 top-0 h-px" style={{ background: variant === 'primary' ? 'rgba(255,122,41,0.45)' : 'rgba(255,255,255,0.06)' }} />

            {/* Hover orange trail */}
            <motion.span
                className="absolute inset-0 pointer-events-none"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                style={{ background: 'linear-gradient(90deg, transparent, rgba(255,122,41,0.07), transparent)' }}
            />

            {Icon && <Icon size={13} />}
            <span className="relative">{children}</span>
        </motion.button>
    );
};
