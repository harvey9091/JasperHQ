
import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Check } from 'lucide-react';

const pricingPlans = [
  {
    name: "Starter",
    subtitle: "For emerging brands",
    price: "4,500",
    features: [
      "Custom Landing Page Design",
      "Mobile-First Optimization",
      "Basic SEO Implementation",
      "5-Day Turnaround"
    ],
    highlight: false,
    color: "bg-blue-600"
  },
  {
    name: "Growth",
    subtitle: "Most popular choice",
    price: "8,500",
    features: [
      "Full 5-Page Website",
      "Advanced CRO Strategy",
      "CMS Integration",
      "Interactive Motion Effects",
      "Copywriting Assistance"
    ],
    highlight: true,
    color: "bg-[#BFF549]"
  },
  {
    name: "Enterprise",
    subtitle: "For market leaders",
    price: "15,000+",
    features: [
      "Complete Design System",
      "Headless Architecture",
      "A/B Testing Setup",
      "Priority 24/7 Support",
      "Monthly Conversion Audits"
    ],
    highlight: false,
    color: "bg-purple-600"
  }
];

const Pricing: React.FC = () => {
  return (
    <section id="pricing" className="py-32 bg-[#02040a] relative overflow-hidden overflow-x-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-white/[0.02] rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-24">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-7xl font-black tracking-tighter text-white mb-6 uppercase"
          >
            INVEST IN <span className="text-[#BFF549]">ROI</span>
          </motion.h2>
          <p className="text-[#99A1AF] text-xl font-light max-w-2xl mx-auto px-6 md:px-0">
            Clear, transparent pricing. No hidden fees. Just results.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto items-center">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className={`relative flex flex-col p-10 rounded-[40px] border ${plan.highlight
                ? 'bg-white/[0.05] border-[#BFF549]/50 shadow-[0_0_50px_rgba(191,245,73,0.1)]'
                : 'bg-white/[0.02] border-white/5'
                } backdrop-blur-xl transition-all duration-300`}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-[#BFF549] text-black text-xs font-bold uppercase tracking-widest rounded-full">
                  Recommended
                </div>
              )}

              <div className="mb-10">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-[#99A1AF] text-sm">{plan.subtitle}</p>
              </div>

              <div className="mb-10 flex items-baseline gap-1">
                <span className="text-sm align-top text-[#99A1AF]">$</span>
                <span className="text-5xl font-black tracking-tight">{plan.price}</span>
              </div>

              <div className="space-y-5 mb-12 flex-1">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`mt-1 w-5 h-5 rounded-full flex items-center justify-center ${plan.highlight ? 'bg-[#BFF549] text-black' : 'bg-white/10 text-white'}`}>
                      <Check className="w-3 h-3" strokeWidth={3} />
                    </div>
                    <span className="text-white/80 font-light">{feature}</span>
                  </div>
                ))}
              </div>

              <button className={`w-full py-5 rounded-2xl font-bold text-lg transition-all transform active:scale-95 ${plan.highlight
                ? 'bg-[#BFF549] text-black hover:bg-white'
                : 'bg-white/10 text-white hover:bg-white hover:text-black'
                }`}>
                Choose {plan.name}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
