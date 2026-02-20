import React from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

interface NeonCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
    glowColor?: 'green' | 'teal' | 'amber' | 'mint';
    variant?: 'glass' | 'panel' | 'primary';
}

const glowMap = {
    green: 'hover:border-neon-green/50 hover:shadow-bloom',
    teal: 'hover:border-neon-teal/50 hover:shadow-bloom',
    amber: 'hover:border-neon-amber/50 hover:shadow-[0_0_80px_rgba(230,126,34,0.18)]',
    mint: 'hover:border-neon-mint/50 hover:shadow-[0_0_80px_rgba(200,255,215,0.18)]',
};

const variantMap = {
    glass: 'bg-jasper-surface/40 backdrop-blur-md border border-white/5 shadow-glass-heavy',
    panel: 'bg-jasper-panel border border-jasper-border shadow-panel-depth',
    primary: 'bg-gradient-to-br from-jasper-panel to-jasper-dark border border-white/10 relative overflow-hidden shadow-aura',
};

export const NeonCard: React.FC<NeonCardProps> = ({
    children,
    className,
    glowColor = 'green',
    variant = 'panel',
    ...props
}) => {
    return (
        <motion.div
            whileHover={{ y: -2, scale: 1.005 }}
            transition={{ duration: 0.3 }}
            className={clsx(
                'relative rounded-2xl p-6 transition-all duration-500',
                variantMap[variant],
                'after:absolute after:inset-0 after:rounded-2xl after:shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] after:pointer-events-none', // Inner bezel
                glowMap[glowColor],
                className
            )}
            {...props}
        >
            <div className="relative z-10">{children}</div>

            {/* Premium internal vignette */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-transparent to-black/20 pointer-events-none" />
        </motion.div>
    );
};
