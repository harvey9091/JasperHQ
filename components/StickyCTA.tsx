
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface StickyCTAProps {
  isVisible: boolean;
}

const StickyCTA: React.FC<StickyCTAProps> = ({ isVisible }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 150, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 150, opacity: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="fixed bottom-8 left-0 right-0 z-[60] flex justify-center pointer-events-none"
        >
          <div className="bg-[#18181B] pointer-events-auto border border-white/10 rounded-full p-2 pl-8 flex items-center gap-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl">
            <div className="hidden md:block">
              <div className="text-white font-bold text-sm">Ready to scale?</div>
              <div className="text-[#99A1AF] text-xs">High-converting spots filling fast</div>
            </div>
            <button className="px-8 py-3 bg-[#BFF549] text-black font-black rounded-full hover:bg-white transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2">
              Get Started <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StickyCTA;
