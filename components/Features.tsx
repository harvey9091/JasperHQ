
import React from 'react';
import { Layout, Target, MousePointer2, Layers, BarChart3, ShieldCheck, Zap, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Features: React.FC = () => {
  return (
    <section id="expertise" className="py-32 bg-[#02040a] relative overflow-hidden overflow-x-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#BFF549]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="inline-block text-[#BFF549] font-bold tracking-widest uppercase mb-4 text-sm"
            >
              Our Expertise
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-7xl font-black tracking-tighter text-white"
            >
              SCIENTIFIC <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">PRECISION.</span>
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-[#99A1AF] max-w-lg font-light leading-relaxed"
          >
            We adhere to a rigorous, data-backed design methodology. No guesswork, just results.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 md:grid-rows-2 gap-6 h-auto md:h-[800px]">
          {/* Main Large Card */}
          <motion.div
            whileHover={{ scale: 0.98 }}
            className="md:col-span-4 md:row-span-2 bg-gradient-to-br from-white/[0.08] to-transparent border border-white/5 rounded-[40px] p-10 flex flex-col justify-between group overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#BFF549]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            <div className="relative z-10">
              <div className="w-16 h-16 bg-[#BFF549] rounded-2xl flex items-center justify-center mb-8 rotate-3 group-hover:rotate-12 transition-transform duration-500">
                <BarChart3 className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-4xl font-bold mb-6">Velocity-First <br />Architecture</h3>
              <p className="text-lg text-[#99A1AF] max-w-md">
                We engineer sites that load in sub-100ms. Speed isn't just a feature; it's the foundation of conversion. Google loves it, users demand it.
              </p>
            </div>

            <div className="relative mt-10 h-64 bg-black/40 rounded-3xl border border-white/5 overflow-hidden">
              {/* Mock Graph Animation */}
              <div className="absolute bottom-0 left-0 right-0 h-full flex items-end gap-2 px-8 pb-8">
                {[40, 65, 55, 80, 70, 95, 100].map((height, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    whileInView={{ height: `${height}%` }}
                    transition={{ delay: i * 0.1, duration: 1, ease: "circOut" }}
                    className="flex-1 bg-gradient-to-t from-[#BFF549]/20 to-[#BFF549] rounded-t-lg opacity-80"
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Secondary Card 1 */}
          <motion.div
            whileHover={{ scale: 0.98 }}
            className="md:col-span-2 md:row-span-1 bg-white/[0.03] border border-white/5 rounded-[40px] p-8 flex flex-col justify-center relative group overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-4 group-hover:translate-x-0 duration-300">
              <ArrowUpRight className="w-8 h-8 text-[#BFF549]" />
            </div>
            <Layout className="w-10 h-10 text-white mb-6" />
            <h3 className="text-2xl font-bold mb-3">Neuro-Design</h3>
            <p className="text-sm text-[#99A1AF]">
              Eye-tracking data guides every pixel placement.
            </p>
          </motion.div>

          {/* Secondary Card 2 */}
          <motion.div
            whileHover={{ scale: 0.98 }}
            className="md:col-span-2 md:row-span-1 bg-white/[0.03] border border-white/5 rounded-[40px] p-8 flex flex-col justify-center relative group overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <Target className="w-10 h-10 text-purple-400 mb-6" />
            <h3 className="text-2xl font-bold mb-3">Conversion CRO</h3>
            <p className="text-sm text-[#99A1AF]">
              Frictionless funnels that turn visitors into revenue.
            </p>
          </motion.div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-6">
          <motion.div whileHover={{ y: -5 }} className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 flex items-center gap-4">
            <div className="p-3 bg-white/5 rounded-xl"><Layers className="w-6 h-6 text-[#BFF549]" /></div>
            <div><h4 className="font-bold">Brand Authority</h4><p className="text-xs text-gray-500">Premium Aesthetics</p></div>
          </motion.div>
          <motion.div whileHover={{ y: -5 }} className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 flex items-center gap-4">
            <div className="p-3 bg-white/5 rounded-xl"><MousePointer2 className="w-6 h-6 text-blue-400" /></div>
            <div><h4 className="font-bold">Behavioral Triggers</h4><p className="text-xs text-gray-500">Intent Response</p></div>
          </motion.div>
          <motion.div whileHover={{ y: -5 }} className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 flex items-center gap-4">
            <div className="p-3 bg-white/5 rounded-xl"><Zap className="w-6 h-6 text-yellow-400" /></div>
            <div><h4 className="font-bold">Instant Iteration</h4><p className="text-xs text-gray-500">Rapid Testing</p></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Features;
