
import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: "Alex Rivera",
    role: "CEO of TechStream",
    content: "We saw a 140% lift in conversions within the first 30 days. The psychological hooks are absolutely real.",
    avatar: "https://picsum.photos/100/100?random=1",
    rating: 5
  },
  {
    name: "Sarah Chen",
    role: "Founder of GlowUp",
    content: "The most beautiful website I've ever owned. But more importantly, it actually makes me money while I sleep.",
    avatar: "https://picsum.photos/100/100?random=2",
    rating: 5
  },
  {
    name: "Jameson Blake",
    role: "VP Marketing, Velocity",
    content: "Their process is elite. They understood our enterprise needs and delivered a high-converting masterpiece.",
    avatar: "https://picsum.photos/100/100?random=3",
    rating: 5
  },
  {
    name: "Elena Rodriguez",
    role: "CMO, FutureScale",
    content: "A truly scientific approach to design. Every pixel has a purpose. The results speak for themselves.",
    avatar: "https://picsum.photos/100/100?random=4",
    rating: 5
  }
];

const Testimonials: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);

  return (
    <section id="testimonials" className="py-32 bg-[#02040a] overflow-hidden" ref={containerRef}>
      {/* Horizontal Scroll Track */}
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#02040a] to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#02040a] to-transparent z-10 pointer-events-none" />

        <div className="overflow-hidden">
          <motion.div
            className="flex gap-8 px-6 md:px-20 py-4"
            drag="x"
            dragConstraints={{ left: -1000, right: 0 }}
            dragElastic={0.1}
          >
            {testimonials.concat(testimonials).map((t, i) => (
              <div
                key={i}
                className="w-[350px] md:w-[500px] flex-shrink-0 bg-white/[0.03] border border-white/5 p-10 rounded-[40px] hover:bg-white/[0.05] transition-all duration-300 group"
              >
                <div className="flex gap-1 mb-6">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-[#BFF549] fill-current" />
                  ))}
                </div>

                <blockquote className="text-2xl font-light leading-relaxed mb-8 text-white group-hover:text-white/90">
                  "{t.content}"
                </blockquote>

                <div className="flex items-center gap-4">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-12 h-12 rounded-full border-2 border-[#BFF549]/20"
                  />
                  <div>
                    <div className="font-bold text-lg text-white">{t.name}</div>
                    <div className="text-[#BFF549] text-sm uppercase tracking-widest font-bold">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
