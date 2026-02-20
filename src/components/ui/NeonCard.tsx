import React from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

interface NeonCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
    glowColor?: 'green' | 'teal' | 'amber';
}

const glowMap = {
    green: 'hover:border-neon-green/50 hover:shadow-[0_0_20px_rgba(75,255,136,0.1)]',
    teal: 'hover:border-neon-teal/50 hover:shadow-[0_0_20px_rgba(57,196,175,0.1)]',
    amber: 'hover:border-neon-amber/50 hover:shadow-[0_0_20px_rgba(224,95,47,0.1)]',
};

export const NeonCard: React.FC<NeonCardProps> = ({
    children,
    className,
    glowColor = 'green',
    ...props
}) => {
    return (
        <motion.div
            whileHover={{ y: -2 }}
            className={clsx(
                'relative overflow-hidden rounded-xl border border-white/5 bg-jasper-panel/60 p-6 backdrop-blur-md transition-all duration-300',
                'before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/5 before:to-transparent before:opacity-0 hover:before:opacity-100',
                glowMap[glowColor],
                className
            )}
            {...props}
        >
            <div className="relative z-10">{children}</div>

            {/* Industrial corner accents */}
            <div className="absolute top-0 right-0 h-4 w-4 border-r border-t border-white/10 opacity-50" />
            <div className="absolute bottom-0 left-0 h-4 w-4 border-l border-b border-white/10 opacity-50" />
        </motion.div>
    );
};
