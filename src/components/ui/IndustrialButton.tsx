import React from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

interface IndustrialButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger';
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
    const baseStyles = 'inline-flex items-center justify-center font-bold tracking-wide uppercase transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-neon-green text-jasper-dark shadow-[0_0_20px_rgba(75,255,136,0.2)] hover:shadow-[0_0_30px_rgba(75,255,136,0.4)] hover:bg-white',
        secondary: 'bg-transparent border border-neon-green/30 text-neon-green hover:bg-neon-green/10',
        danger: 'bg-red-500/10 border border-red-500/30 text-red-500 hover:bg-red-500/20',
    };

    const sizes = {
        sm: 'h-8 px-4 text-xs rounded-sm',
        md: 'h-10 px-6 text-sm rounded-md',
        lg: 'h-12 px-8 text-base rounded-md',
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={clsx(baseStyles, variants[variant], sizes[size], className)}
            {...props}
        >
            {Icon && <Icon className="w-4 h-4 mr-2" />}
            {children}
            {/* Clip-path detail for industrial look */}
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-current opacity-20 rotate-45" />
        </motion.button>
    );
};
