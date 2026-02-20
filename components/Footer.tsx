
import React from 'react';
import { Zap, Twitter, Github, Linkedin, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black pt-32 pb-12 border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-32">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-8 h-8 bg-[#BFF549] rounded-lg flex items-center justify-center">
                <Zap className="text-black w-5 h-5" fill="currentColor" />
              </div>
              <span className="text-lg font-black tracking-tighter text-white uppercase">VOLTFLOW</span>
            </div>
            <p className="text-[#99A1AF] font-light leading-relaxed mb-8">
              We help elite businesses dominate their market through performance-first web design. No fluff. Just ROI.
            </p>
            <div className="flex gap-4">
              {[Twitter, Github, Linkedin, Instagram].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:border-[#BFF549] hover:text-[#BFF549] transition-all">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {[
            {
              title: "Expertise",
              links: ["Neuro-Design", "SaaS Growth", "E-commerce", "Conversion Audits"]
            },
            {
              title: "Agency",
              links: ["Case Studies", "Our Process", "Careers", "Blog"]
            },
            {
              title: "Support",
              links: ["Contact Us", "Privacy Policy", "Terms of Service", "Help Center"]
            }
          ].map((col, i) => (
            <div key={i}>
              <h4 className="text-white font-bold mb-8 uppercase tracking-widest text-sm">{col.title}</h4>
              <ul className="space-y-4">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-[#99A1AF] hover:text-[#BFF549] transition-colors font-light">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-8 border-t border-white/5 text-[#99A1AF] text-sm">
          <p>© 2026 VoltFlow Design Agency. All rights reserved.</p>
          <p>Built with ❤️ for performance.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
