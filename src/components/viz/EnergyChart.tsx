import React from 'react';
import { motion } from 'framer-motion';

interface EnergyChartProps {
    className?: string;
    color?: 'green' | 'teal' | 'amber';
}

export const EnergyChart: React.FC<EnergyChartProps> = ({ className, color = 'green' }) => {
    // Mock data points for the "energy" curve
    const points = "M0,100 C150,100 150,20 300,20 C450,20 450,80 600,80 C750,80 750,40 900,40";

    const colors = {
        green: '#4BFF88',
        teal: '#39C4AF',
        amber: '#E05F2F',
    };

    return (
        <div className={`relative w-full h-full overflow-hidden ${className}`}>
            <svg className="w-full h-full" viewBox="0 0 900 120" preserveAspectRatio="none">
                {/* Glow effect filter */}
                <defs>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="5" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                    <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor={colors[color]} stopOpacity="0.1" />
                        <stop offset="50%" stopColor={colors[color]} stopOpacity="0.5" />
                        <stop offset="100%" stopColor={colors[color]} stopOpacity="0.1" />
                    </linearGradient>
                </defs>

                {/* Base line (dim) */}
                <path d={points} fill="none" stroke={colors[color]} strokeWidth="1" strokeOpacity="0.2" />

                {/* Animated Energy Pulse */}
                <motion.path
                    d={points}
                    fill="none"
                    stroke={colors[color]}
                    strokeWidth="3"
                    strokeDasharray="100 800"
                    strokeDashoffset="900"
                    filter="url(#glow)"
                    animate={{ strokeDashoffset: -900 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />

                {/* Fill area */}
                <path d={`${points} L900,120 L0,120 Z`} fill={`url(#gradient-${color})`} opacity="0.2" />
            </svg>
        </div>
    );
};
