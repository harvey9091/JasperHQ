
import React, { useState } from 'react';
import { Loader2, CheckCircle2, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { analyzeConversion } from '../services/geminiService';
import { AuditResult } from '../types';

const AuditTool: React.FC = () => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AuditResult | null>(null);

  const handleAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    setResult(null);
    try {
      const analysis = await analyzeConversion(input);
      setResult(analysis);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="audit" className="relative py-40 bg-black overflow-hidden">
      {/* Optimized Volumetric Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-[#BFF549]/10 rounded-full blur-[180px] pointer-events-none z-0" />

      <div className="container relative z-10 mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl md:text-[84px] font-black leading-[0.9] tracking-tighter mb-8 uppercase">
                FREE AI <span className="text-transparent border-white/20 [-webkit-text-stroke:1px_white]">CONVERSION</span> <br />
                <span className="text-[#BFF549]">CRITIQUE</span>
              </h2>
              <p className="text-xl md:text-2xl text-[#99A1AF] font-light max-w-3xl mx-auto">
                Paste your URL or explain your funnel. Our AI CRO expert identifies profit leaks in under 10 seconds.
              </p>
            </motion.div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#BFF549]/20 to-transparent blur-3xl opacity-20 -z-10" />

            <form onSubmit={handleAudit} className="bg-white/[0.03] border border-white/10 hover:border-white/20 p-2 md:p-3 rounded-[40px] flex flex-col md:flex-row gap-4 backdrop-blur-3xl shadow-2xl transition-all duration-300">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ex: My Shopify store landing page isn't converting traffic..."
                className="flex-1 bg-transparent border-none rounded-[32px] px-8 py-6 text-white placeholder:text-white/30 focus:ring-0 outline-none text-xl focus:placeholder:text-white/50 transition-all"
              />
              <button
                disabled={isLoading}
                className="px-10 py-6 bg-[#BFF549] text-black font-black rounded-[32px] flex items-center justify-center gap-3 hover:bg-white hover:scale-105 transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:hover:scale-100 shadow-lg hover:shadow-[0_0_40px_rgba(191,245,73,0.5)]"
              >
                {isLoading ? (
                  <Loader2 className="w-7 h-7 animate-spin" />
                ) : (
                  <>Analyze Now</>
                )}
              </button>
            </form>
          </div>

          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8"
              >
                <div className="lg:col-span-4 bg-white/[0.03] border border-white/10 p-10 rounded-[40px] backdrop-blur-xl flex flex-col items-center justify-center text-center">
                  <div className="relative mb-6">
                    <svg className="w-40 h-40 transform -rotate-90">
                      <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
                      <circle
                        cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="8" fill="transparent"
                        strokeDasharray={440}
                        strokeDashoffset={440 - (440 * result.score) / 100}
                        className="text-[#BFF549] transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-black">{result.score}</span>
                      <span className="text-[10px] uppercase font-bold text-[#99A1AF] tracking-widest">Score</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-1.5 bg-[#BFF549]/10 text-[#BFF549] rounded-full text-xs font-bold uppercase tracking-widest">
                    <ShieldAlert className="w-3 h-3" /> Potential Found
                  </div>
                </div>

                <div className="lg:col-span-8 space-y-8">
                  <div className="bg-white/[0.03] border border-white/10 p-10 rounded-[40px] backdrop-blur-xl">
                    <h4 className="text-[#BFF549] font-bold uppercase text-xs tracking-widest mb-6">Expert Summary</h4>
                    <p className="text-2xl text-white/90 font-light leading-relaxed">
                      "{result.critique}"
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {result.recommendations.map((rec, i) => (
                      <div key={i} className="bg-white/[0.03] border border-white/10 p-6 rounded-[30px] flex items-start gap-4">
                        <CheckCircle2 className="w-5 h-5 text-[#BFF549] shrink-0 mt-1" />
                        <span className="text-sm text-[#99A1AF] leading-snug">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default AuditTool;
