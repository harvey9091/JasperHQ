
import React from 'react';
import { motion } from 'framer-motion';

const brands = [
  'TechVibe', 'NexusLabs', 'Quantum', 'Elevate', 'Stellar', 'FlowState', 'Velocity',
  'Apex', 'Zenith', 'Horizon', 'Prisma', 'Vertex'
];

const SocialProof: React.FC = () => {
  return (
    <section className="py-20 border-y border-white/5 bg-black overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black z-10 pointer-events-none" />

      <div className="container mx-auto px-6 mb-12 relative z-20">
        <div className="text-center">
          <p className="text-[#99A1AF] text-sm font-bold uppercase tracking-[0.2em]">
            Trusted by industry leaders
          </p>
        </div>
      </div>

      <div className="relative flex whitespace-nowrap">
        <motion.div
          animate={{ x: [0, -2000] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="flex gap-20 md:gap-32 items-center pr-20"
        >
          {[...brands, ...brands, ...brands].map((brand, i) => (
            <span
              key={i}
              className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white/30 to-white/10 hover:from-white hover:to-white/80 transition-all cursor-default tracking-tighter uppercase font-display"
            >
              {brand}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default SocialProof;
