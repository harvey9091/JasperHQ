
import React, { useRef, useState, useMemo } from 'react';
import { motion, useTransform, useSpring, useScroll } from 'framer-motion';
import { ArrowRight, Zap } from 'lucide-react';
import GradientMenuInline from './ui/gradient-menu-inline';

const StarField: React.FC = () => {
  const stars = useMemo(() => {
    return Array.from({ length: 100 }).map((_, i) => ({
      id: i,
      size: Math.random() * 2 + 1,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: 10 + Math.random() * 20,
      delay: Math.random() * -20,
      opacity: 0.1 + Math.random() * 0.4,
    }));
  }, []);

  return (
    <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            width: star.size,
            height: star.size,
            left: `${star.x}%`,
            top: `${star.y}%`,
            opacity: star.opacity,
          }}
          animate={{
            opacity: [star.opacity, star.opacity * 2, star.opacity],
            y: [0, -20, 0],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            ease: "linear",
            delay: star.delay,
          }}
        />
      ))}
    </div>
  );
};

const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePosition({
      x: (e.clientX - rect.left) / rect.width - 0.5,
      y: (e.clientY - rect.top) / rect.height - 0.5,
    });
  };

  const springConfig = { damping: 20, stiffness: 100, mass: 0.5 };
  const mouseXSpring = useSpring(mousePosition.x, springConfig);
  const mouseYSpring = useSpring(mousePosition.y, springConfig);

  const textX = useTransform(mouseXSpring, [-0.5, 0.5], [-20, 20]);
  const textY = useTransform(mouseYSpring, [-0.5, 0.5], [-20, 20]);
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [5, -5]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-5, 5]);

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#02040a] pt-20"
    >
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(15,20,35,1)_0%,rgba(0,0,0,1)_100%)] z-0" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)] z-0 opacity-50" />

      <StarField />

      {/* Dynamic Orbs */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.div
          style={{
            x: useTransform(mouseXSpring, [-0.5, 0.5], [-50, 50]),
            y: y1
          }}
          className="absolute top-0 -left-[10%] w-[800px] h-[800px] bg-[#BFF549] rounded-full blur-[250px] opacity-10"
        />
        <motion.div
          style={{
            x: useTransform(mouseXSpring, [-0.5, 0.5], [50, -50]),
            y: y2
          }}
          className="absolute bottom-0 -right-[10%] w-[600px] h-[600px] bg-blue-600 rounded-full blur-[200px] opacity-10"
        />
      </div>

      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#02040a] to-transparent z-[5] pointer-events-none" />

      <motion.div
        style={{ x: textX, y: textY, rotateX, rotateY, perspective: 1000 }}
        className="relative z-10 container mx-auto px-6 text-center"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative inline-block"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full border border-[#BFF549]/30 bg-[#BFF549]/5 text-[#BFF549] text-xs font-bold uppercase tracking-[0.2em] backdrop-blur-md">
            <Zap className="w-3 h-3 fill-current" />
            Performance Optimized
          </span>

          <h1 className="text-6xl md:text-[120px] font-black leading-[0.85] tracking-tighter mb-8 text-white mix-blend-difference">
            WE BUILD <br />
            <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50">
              GORGEOUS
            </span> <br />
            <span className="text-[#BFF549]">WEBSITES.</span>
          </h1>

          <p className="text-lg md:text-2xl text-[#99A1AF] max-w-2xl mx-auto mb-12 font-light leading-relaxed tracking-tight">
            Elevating digital presence through scientific design. We don't just build sites; we engineer visual identities that convert.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <div className="relative group w-auto">
              <div className="absolute inset-0 bg-[#BFF549] rounded-full blur-[20px] opacity-40 group-hover:opacity-60 transition-all duration-300 transform group-hover:scale-110" />
              <button className="relative px-12 py-6 bg-[#BFF549] text-black font-black text-xl rounded-full overflow-hidden transition-all hover:scale-[1.02] active:scale-95 z-10 flex items-center gap-3 whitespace-nowrap">
                Start Project
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <button className="px-10 py-6 text-white font-bold text-lg rounded-full border border-white/10 hover:bg-white/5 transition-all flex items-center gap-3 backdrop-blur-sm whitespace-nowrap">
              View Our Work
            </button>
          </div>

          {/* Gradient Menu Buttons */}
          <GradientMenuInline />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
