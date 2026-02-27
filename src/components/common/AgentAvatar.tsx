import React from 'react';
import { motion } from 'framer-motion';

interface AgentAvatarProps {
    src: string;
    alt: string;
    size?: number;
    className?: string;
}

export const AgentAvatar: React.FC<AgentAvatarProps> = ({ src, alt, size = 48, className = "" }) => {
    return (
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`relative flex-shrink-0 ${className}`}
            style={{ width: size, height: size }}
        >
            {/* Subtle orange glow */}
            <div
                className="absolute inset-0 rounded-full bg-[#FF7A29]/20 blur-md"
                style={{ transform: 'scale(1.1)' }}
            />

            {/* Avatar Image Container */}
            <div className="relative w-full h-full rounded-full border-2 border-[#FF7A29]/40 overflow-hidden shadow-[0_0_15px_rgba(255,122,41,0.2)] bg-[#1A1C20]">
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
