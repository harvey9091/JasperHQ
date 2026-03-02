import React from 'react';
import { motion } from 'framer-motion';

interface AgentAvatarProps {
    src: string;
    alt: string;
    size?: number;
    className?: string;
    glow?: boolean;
}

export const AgentAvatar: React.FC<AgentAvatarProps> = ({ src, alt, size = 48, className = "", glow = false }) => {
    return (
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`relative flex-shrink-0 ${className}`}
            style={{ width: size, height: size }}
        >
            {/* Subtle orange glow */}
            <div
                className={`absolute inset-0 rounded-full bg-[#FF7A29]/20 blur-md transition-opacity duration-300 ${glow ? 'opacity-100' : 'opacity-0'}`}
                style={{ transform: 'scale(1.2)' }}
            />

            {/* Avatar Image Container */}
            <div className={`relative w-full h-full rounded-full border-2 transition-all duration-300 ${glow ? 'border-[#FF7A29] shadow-[0_0_20px_rgba(255,122,41,0.5)] scale-105' : 'border-[#FF7A29]/40 shadow-[0_0_15px_rgba(255,122,41,0.2)]'} overflow-hidden bg-[#1A1C20]`}>
                <img
                    src={src}
                    alt={alt}
                    className="w-full h-full object-cover"
                    loading="lazy"
                />
            </div>

            {/* Inner Ring Glow */}
            <div className="absolute inset-0 rounded-full border border-white/10 pointer-events-none" />
        </motion.div>
    );
};
