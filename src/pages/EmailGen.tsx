import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Copy, Save, ChevronDown, User, Mail } from 'lucide-react';

const H = 'JetBrains Mono, monospace';
const BD = 'Inter, sans-serif';
const MN = 'JetBrains Mono, monospace';

const LEADS_DATA = [
    { id: 'L1', name: 'Alex Khatri', company: 'Nexus Systems', value: '$48k', status: 'Active', notes: 'Interested in enterprise integration.', research: 'Nexus Systems raised $12M Series B in 2024. Decision maker is the CTO. Company is expanding SE Asia ops.' },
    { id: 'L2', name: 'Sofia Martinez', company: 'ArcLight Tech', value: '$125k', status: 'Negotiating', notes: 'Proposal under review.', research: 'ArcLight recently acquired smaller analytics firm. Sofia is VP of Ops. Budget confirmed at $120-130k range.' },
    { id: 'L3', name: 'James Okafor', company: 'Helix Analytics', value: '$20k', status: 'New', notes: 'No reply yet.', research: 'James is Head of Growth. Helix uses Python stack. Active on LinkedIn. Best contact window: 9-11am weekdays.' },
    { id: 'L4', name: 'Priya Tewari', company: 'Quantum Ventures', value: '$85k', status: 'Active', notes: 'Demo booked tomorrow.', research: 'Quantum is Series A. Priya reports to CEO directly. She favours data-heavy, concise pitches. No fluff emails.' },
];

const TONES = ['Professional', 'Friendly', 'Aggressive', 'Hyper Personal'];
const CTAS = ['Book a Call', 'Schedule Demo', 'Reply to Learn More', 'Claim Free Audit'];

function generateEmail(lead: typeof LEADS_DATA[0], tone: string, cta: string): string {
    const greet = tone === 'Friendly' ? 'Hey' : 'Hi';
    const first = lead.name.split(' ')[0];
    const urgency = tone === 'Aggressive' ? '\n\nThis offer won\'t be on the table indefinitely. ' : tone === 'Hyper Personal' ? `\n\nBased on your recent work at ${lead.company}, I think this is a perfect fit specifically for you. ` : ' ';
    return `Subject: ${lead.company} × JasperHQ — Quick note from Jasper\n\n${greet} ${first},\n\nI came across ${lead.company} and noticed some exciting momentum in what you're building.${urgency}\nWe help teams like yours accelerate pipeline velocity using AI-powered outreach and lead intelligence — our clients typically see a 30-40% lift in qualified conversations within 60 days.\n\nGiven your focus at ${lead.company}, I think there's a strong alignment.\n\n→ ${cta} — takes under 3 minutes.\n\nHappy to send over relevant case studies if useful.\n\nBest,\nJasper\nJasperHQ · AI Revenue Operations\n\n—\nResearch context: ${lead.research}`;
}

export const EmailGen: React.FC = () => {
    const [selectedId, setSelectedId] = useState(LEADS_DATA[0].id);
    const [tone, setTone] = useState('Professional');
    const [cta, setCta] = useState('Book a Call');
    const [email, setEmail] = useState('');
    const [generating, setGenerating] = useState(false);
    const [copied, setCopied] = useState(false);

    const lead = LEADS_DATA.find(l => l.id === selectedId)!;

    const handleGenerate = () => {
        setGenerating(true);
        setEmail('');
        setTimeout(() => {
            setEmail(generateEmail(lead, tone, cta));
            setGenerating(false);
        }, 1200);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(email);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            {/* Header */}
            <div>
                <p style={{ fontFamily: MN, fontSize: 9, letterSpacing: '0.3em', color: '#7A7F8A', textTransform: 'uppercase', marginBottom: 10 }}>// AI Outreach Module · GPT-4o</p>
                <h1 style={{ fontFamily: H, fontSize: 'clamp(28px,4vw,40px)', fontWeight: 900, color: '#FFF', letterSpacing: '0.08em', textTransform: 'uppercase', lineHeight: 1, marginBottom: 8 }}>Email Generator</h1>
                <p style={{ fontFamily: BD, fontSize: 14, color: '#7A7F8A' }}>Generate personalised cold outreach using research insights.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 24, alignItems: 'start' }}>
                {/* LEFT PANE */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {/* Lead selector */}
                    <div style={{ borderRadius: 16, background: 'linear-gradient(145deg,#181A1D,#202226)', border: '1px solid rgba(255,255,255,0.06)', padding: 22, boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)' }}>
                        <p style={{ fontFamily: H, fontSize: 9, fontWeight: 700, letterSpacing: '0.22em', color: '#E2E4E9', textTransform: 'uppercase', marginBottom: 14 }}>Select Lead</p>
                        <div style={{ position: 'relative' }}>
                            <select value={selectedId} onChange={e => setSelectedId(e.target.value)}
                                style={{ width: '100%', padding: '11px 14px', borderRadius: 10, background: 'linear-gradient(145deg,#131416,#181A1D)', border: '1px solid rgba(255,255,255,0.07)', color: '#E2E4E9', fontFamily: BD, fontSize: 13, caretColor: '#FF7A29', outline: 'none', cursor: 'pointer', boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.3)', appearance: 'none' }}>
                                {LEADS_DATA.map(l => <option key={l.id} value={l.id}>{l.name} — {l.company}</option>)}
                            </select>
                            <ChevronDown size={13} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#7A7F8A', pointerEvents: 'none' }} />
                        </div>
                    </div>

                    {/* Lead preview */}
                    <div style={{ borderRadius: 16, background: 'linear-gradient(145deg,#16181B,#1E2023)', border: '1px solid rgba(255,255,255,0.05)', padding: 22 }}>
                        <p style={{ fontFamily: H, fontSize: 9, fontWeight: 700, letterSpacing: '0.22em', color: '#E2E4E9', textTransform: 'uppercase', marginBottom: 16 }}>Lead Data</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
                            <div style={{ width: 46, height: 46, borderRadius: '50%', background: 'linear-gradient(145deg,#1E2023,#252830)', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <span style={{ fontFamily: H, fontSize: 13, fontWeight: 900, color: '#FF7A29' }}>{lead.name.split(' ').map(w => w[0]).join('')}</span>
                            </div>
                            <div>
                                <p style={{ fontFamily: BD, fontSize: 13, fontWeight: 600, color: '#E2E4E9' }}>{lead.name}</p>
                                <p style={{ fontFamily: BD, fontSize: 11, color: '#7A7F8A' }}>{lead.company} · {lead.value}</p>
                            </div>
                        </div>
                        {[['Status', lead.status], ['Notes', lead.notes]].map(([l, v]) => (
                            <div key={String(l)} style={{ marginBottom: 14 }}>
                                <p style={{ fontFamily: MN, fontSize: 8, letterSpacing: '0.2em', color: '#5A5F69', textTransform: 'uppercase', marginBottom: 5 }}>{l}</p>
                                <p style={{ fontFamily: BD, fontSize: 12, color: '#9CA0A8', lineHeight: 1.5 }}>{v}</p>
                            </div>
                        ))}
                        {/* Research memory */}
                        <div style={{ borderRadius: 10, padding: '12px 14px', background: 'rgba(255,122,41,0.04)', border: '1px solid rgba(255,122,41,0.14)', marginTop: 6 }}>
                            <p style={{ fontFamily: H, fontSize: 8, fontWeight: 700, letterSpacing: '0.2em', color: '#FF7A29', marginBottom: 6 }}>RESEARCH MEMORY</p>
                            <p style={{ fontFamily: BD, fontSize: 11, color: '#7A7F8A', lineHeight: 1.6 }}>{lead.research}</p>
                        </div>
                    </div>
                </div>

                {/* RIGHT PANE */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ borderRadius: 16, background: 'linear-gradient(145deg,#181A1D,#202226)', border: '1px solid rgba(255,255,255,0.06)', padding: 22, boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)' }}>
                        <p style={{ fontFamily: H, fontSize: 9, fontWeight: 700, letterSpacing: '0.22em', color: '#E2E4E9', textTransform: 'uppercase', marginBottom: 18 }}>Configuration</p>

                        {/* Tone selector */}
                        <div style={{ marginBottom: 18 }}>
                            <p style={{ fontFamily: MN, fontSize: 8, letterSpacing: '0.2em', color: '#5A5F69', textTransform: 'uppercase', marginBottom: 10 }}>Tone</p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                {TONES.map(t => (
                                    <motion.button key={t} onClick={() => setTone(t)} whileTap={{ scale: 0.94 }}
                                        style={{
                                            padding: '8px 14px', borderRadius: 99, fontFamily: H, fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', cursor: 'pointer', transition: 'all 0.2s',
                                            background: tone === t ? 'linear-gradient(145deg,#1E2024,#151719)' : 'rgba(255,255,255,0.03)',
                                            border: tone === t ? '1px solid rgba(255,122,41,0.48)' : '1px solid rgba(255,255,255,0.06)',
                                            color: tone === t ? '#FF7A29' : '#5A5F69',
                                            boxShadow: tone === t ? '0 0 10px rgba(255,122,41,0.12)' : 'none'
                                        }}>
                                        {t}
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* CTA selector */}
                        <div style={{ marginBottom: 22 }}>
                            <p style={{ fontFamily: MN, fontSize: 8, letterSpacing: '0.2em', color: '#5A5F69', textTransform: 'uppercase', marginBottom: 10 }}>CTA Style</p>
                            <div style={{ position: 'relative' }}>
                                <select value={cta} onChange={e => setCta(e.target.value)}
                                    style={{ width: '100%', padding: '11px 14px', borderRadius: 10, background: 'linear-gradient(145deg,#131416,#181A1D)', border: '1px solid rgba(255,255,255,0.07)', color: '#E2E4E9', fontFamily: BD, fontSize: 13, outline: 'none', cursor: 'pointer', appearance: 'none' }}>
                                    {CTAS.map(c => <option key={c}>{c}</option>)}
                                </select>
                                <ChevronDown size={13} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#7A7F8A', pointerEvents: 'none' }} />
                            </div>
                        </div>

                        {/* Generate button */}
                        <motion.button whileHover={{ scale: 1.01, boxShadow: '0 0 28px rgba(255,122,41,0.3)' }} whileTap={{ scale: 0.98 }}
                            onClick={handleGenerate}
                            style={{ width: '100%', padding: 14, borderRadius: 12, background: 'linear-gradient(145deg,#1E2024,#151719)', border: '1px solid rgba(255,122,41,0.5)', color: '#FF7A29', fontFamily: H, fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', cursor: 'pointer', boxShadow: '0 0 18px rgba(255,122,41,0.16),inset 0 1px 0 rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                            <Sparkles size={14} />
                            {generating ? 'GENERATING...' : 'GENERATE EMAIL'}
                        </motion.button>
                    </div>

                    {/* Email output */}
                    <AnimatePresence>
                        {(email || generating) && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                style={{ borderRadius: 16, background: 'linear-gradient(145deg,#16181B,#1E2023)', border: '1px solid rgba(255,122,41,0.14)', boxShadow: '0 0 30px rgba(255,122,41,0.06)', padding: 24, position: 'relative' }}>
                                <div style={{ position: 'absolute', top: -1, left: 32, right: 32, height: 2, borderRadius: 99, background: 'linear-gradient(90deg,transparent,rgba(255,122,41,0.5),transparent)' }} />
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <Mail size={12} style={{ color: '#FF7A29' }} />
                                        <span style={{ fontFamily: H, fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', color: '#FFF', textTransform: 'uppercase' }}>Generated Output</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: 10 }}>
                                        <motion.button whileTap={{ scale: 0.92 }} onClick={handleCopy}
                                            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 9, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: copied ? '#FF7A29' : '#7A7F8A', fontFamily: H, fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', cursor: 'pointer' }}>
                                            <Copy size={11} />{copied ? 'COPIED!' : 'COPY'}
                                        </motion.button>
                                        <motion.button whileTap={{ scale: 0.92 }}
                                            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 9, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: '#7A7F8A', fontFamily: H, fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', cursor: 'pointer' }}>
                                            <Save size={11} />SAVE
                                        </motion.button>
                                    </div>
                                </div>
                                {generating
                                    ? <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '30px 0' }}>
                                        {[0, 1, 2].map(i => <motion.div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#FF7A29' }} animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }} transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }} />)}
                                        <span style={{ fontFamily: MN, fontSize: 10, color: '#7A7F8A', letterSpacing: '0.2em' }}>SYNTHESISING...</span>
                                    </div>
                                    : <pre style={{ fontFamily: BD, fontSize: 12, color: '#C0C4CC', lineHeight: 1.75, whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0 }}>{email}</pre>
                                }
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};
