import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, ChevronDown, ChevronRight, X, Twitter, Globe, Linkedin, Instagram, Facebook, Upload } from 'lucide-react';

const H = 'JetBrains Mono, monospace';
const BD = 'Inter, sans-serif';
const MN = 'JetBrains Mono, monospace';

// ─── Status config ────────────────────────────────────────────────────────────
interface StatusCfg { color: string; bg: string }
const STATUS: Record<string, StatusCfg> = {
    Active: { color: '#4BE77F', bg: 'rgba(75,231,127,0.08)' },
    Negotiating: { color: '#FF7A29', bg: 'rgba(255,122,41,0.08)' },
    New: { color: '#7A9FFF', bg: 'rgba(122,159,255,0.08)' },
    Archived: { color: '#6F6F72', bg: 'rgba(111,111,114,0.08)' },
};

interface Lead {
    id: string; initials: string; name: string; company: string;
    email: string; phone: string; value: string; score: number;
    status: 'Active' | 'Negotiating' | 'New' | 'Archived';
    twitter?: string; website?: string; linkedin?: string;
    instagram?: string; facebook?: string; tiktok?: string;
    notes?: string; lastAction?: string;
}

const LEADS: Lead[] = [
    { id: 'L1', initials: 'AK', name: 'Alex Khatri', company: 'Nexus Systems', email: 'alex@nexus.io', phone: '+1 555 0101', value: '$48,000', score: 88, status: 'Active', linkedin: 'alexkhatri', twitter: '@alexk', website: 'nexus.io', lastAction: 'Email sent 2d ago', notes: 'Interested in enterprise integration package.' },
    { id: 'L2', initials: 'SM', name: 'Sofia Martinez', company: 'ArcLight Tech', email: 'sofia@arclight.ca', phone: '+1 555 0199', value: '$125,000', score: 72, status: 'Negotiating', twitter: '@sofiam', website: 'arclight.ca', linkedin: 'sofiamartinez', lastAction: 'Call — 4d ago', notes: 'Proposal review in progress.' },
    { id: 'L3', initials: 'JO', name: 'James Okafor', company: 'Helix Analytics', email: 'j.oka@helix.ai', phone: '+1 555 0234', value: '$20,000', score: 55, status: 'New', website: 'helix.ai', lastAction: 'First contact 7d ago', notes: 'No reply yet, follow up needed.' },
    { id: 'L4', initials: 'PT', name: 'Priya Tewari', company: 'Quantum Ventures', email: 'priya@qv.net', phone: '+1 555 0312', value: '$85,000', score: 91, status: 'Active', linkedin: 'priyatewari', instagram: '@priyatewari', lastAction: 'Demo booked tomorrow', notes: 'Very warm lead, high priority.' },
    { id: 'L5', initials: 'CO', name: 'Calvin Osei', company: 'Orion Works', email: 'c.osei@orion.co', phone: '+1 555 0405', value: '$12,000', score: 30, status: 'Archived', lastAction: 'Archived 3w ago', notes: 'Deal lost — budget constraints.' },
];

const TABS = ['All', 'Active', 'Negotiating', 'New', 'Archived'];

// ─── Input helper ─────────────────────────────────────────────────────────────
const PhInput: React.FC<{ label: string; value: string; onChange: (v: string) => void; placeholder?: string; multiline?: boolean; half?: boolean }> =
    ({ label, value, onChange, placeholder, multiline }) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1, minWidth: 0 }}>
            <label style={{ fontFamily: MN, fontSize: 9, letterSpacing: '0.22em', color: '#7A7F8A', textTransform: 'uppercase' }}>{label}</label>
            {multiline
                ? <textarea rows={3} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
                    style={{ width: '100%', borderRadius: 10, padding: '10px 14px', background: 'linear-gradient(145deg,#131416,#181A1D)', border: '1px solid rgba(255,255,255,0.07)', color: '#E2E4E9', fontFamily: BD, fontSize: 13, caretColor: '#FF7A29', resize: 'vertical', outline: 'none', boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.3)' }} className="ph-input" />
                : <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
                    style={{ width: '100%', borderRadius: 10, padding: '10px 14px', background: 'linear-gradient(145deg,#131416,#181A1D)', border: '1px solid rgba(255,255,255,0.07)', color: '#E2E4E9', fontFamily: BD, fontSize: 13, caretColor: '#FF7A29', outline: 'none', boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.3)' }} />}
        </div>
    );

// ─── Modal ────────────────────────────────────────────────────────────────────
const emptyForm = (): Lead => ({ id: '', initials: '', name: '', company: '', email: '', phone: '', value: '', score: 50, status: 'New', notes: '' });

const AddLeadModal: React.FC<{ onClose: () => void; onSave: (l: Lead) => void }> = ({ onClose, onSave }) => {
    const [f, setF] = useState<Lead>(emptyForm());
    const set = (k: keyof Lead) => (v: string) => setF(p => ({ ...p, [k]: v }));
    const initials = f.name.split(' ').map(w => w[0] || '').join('').slice(0, 2).toUpperCase() || '?';

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(8px)', padding: 24 }}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                style={{ width: '100%', maxWidth: 760, maxHeight: '90vh', overflowY: 'auto', borderRadius: 20, background: 'linear-gradient(145deg,#181A1D,#1E2023)', border: '1px solid rgba(255,255,255,0.07)', boxShadow: '0 0 60px rgba(255,122,41,0.12),0 32px 80px rgba(0,0,0,0.7)', position: 'relative' }}>

                {/* Top orange glow accent */}
                <div style={{ position: 'absolute', top: -1, left: 48, right: 48, height: 2, borderRadius: 99, background: 'linear-gradient(90deg,transparent,rgba(255,122,41,0.7),transparent)' }} />

                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '28px 32px 0' }}>
                    <div>
                        <p style={{ fontFamily: MN, fontSize: 9, letterSpacing: '0.28em', color: '#7A7F8A', textTransform: 'uppercase', marginBottom: 8 }}>// New Record</p>
                        <h2 style={{ fontFamily: H, fontSize: 22, fontWeight: 900, color: '#FFF', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Add Lead</h2>
                    </div>
                    <motion.button whileTap={{ scale: 0.9 }} onClick={onClose} style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: '#7A7F8A', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={16} /></motion.button>
                </div>

                <div style={{ padding: '24px 32px 32px', display: 'flex', flexDirection: 'column', gap: 24 }}>
                    {/* Avatar preview */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                        <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(145deg,#1E2023,#252830)', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.4),0 0 14px rgba(255,122,41,0.09)' }}>
                            <span style={{ fontFamily: H, fontSize: 22, fontWeight: 900, color: '#FF7A29' }}>{initials}</span>
                        </div>
                        <motion.button whileHover={{ borderColor: 'rgba(255,122,41,0.4)' }} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 18px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', color: '#7A7F8A', fontFamily: BD, fontSize: 12, cursor: 'pointer' }}>
                            <Upload size={13} /> Upload Avatar
                        </motion.button>
                    </div>

                    {/* Core fields */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <PhInput label="Company Name" value={f.company} onChange={set('company')} placeholder="Acme Corp" />
                        <PhInput label="Contact Name" value={f.name} onChange={set('name')} placeholder="Jane Doe" />
                        <PhInput label="Email" value={f.email} onChange={set('email')} placeholder="jane@acme.com" />
                        <PhInput label="Phone" value={f.phone} onChange={set('phone')} placeholder="+1 555 0000" />
                        <PhInput label="Deal Value" value={f.value} onChange={set('value')} placeholder="$50,000" />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            <label style={{ fontFamily: MN, fontSize: 9, letterSpacing: '0.22em', color: '#7A7F8A', textTransform: 'uppercase' }}>Lead Score</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <input type="range" min={0} max={100} value={f.score} onChange={e => setF(p => ({ ...p, score: +e.target.value }))} style={{ flex: 1, accentColor: '#FF7A29' }} />
                                <span style={{ fontFamily: BD, fontSize: 14, fontWeight: 700, color: '#FF7A29', minWidth: 36, textAlign: 'right' }}>{f.score}</span>
                            </div>
                        </div>
                    </div>

                    {/* Status */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <label style={{ fontFamily: MN, fontSize: 9, letterSpacing: '0.22em', color: '#7A7F8A', textTransform: 'uppercase' }}>Status</label>
                        <select value={f.status} onChange={e => setF(p => ({ ...p, status: e.target.value as Lead['status'] }))}
                            style={{ padding: '10px 14px', borderRadius: 10, background: 'linear-gradient(145deg,#131416,#181A1D)', border: '1px solid rgba(255,255,255,0.07)', color: STATUS[f.status]?.color || '#E2E4E9', fontFamily: BD, fontSize: 13, outline: 'none', cursor: 'pointer' }}>
                            {Object.keys(STATUS).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>

                    {/* Socials */}
                    <div>
                        <p style={{ fontFamily: H, fontSize: 9, fontWeight: 700, letterSpacing: '0.22em', color: '#E2E4E9', textTransform: 'uppercase', marginBottom: 14 }}>Socials</p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                            <PhInput label="Twitter" value={f.twitter || ''} onChange={set('twitter')} placeholder="@handle" />
                            <PhInput label="Website" value={f.website || ''} onChange={set('website')} placeholder="company.com" />
                            <PhInput label="LinkedIn" value={f.linkedin || ''} onChange={set('linkedin')} placeholder="linkedin.com/in/..." />
                            <PhInput label="Instagram" value={f.instagram || ''} onChange={set('instagram')} placeholder="@handle" />
                            <PhInput label="Facebook" value={f.facebook || ''} onChange={set('facebook')} placeholder="facebook.com/..." />
                            <PhInput label="TikTok" value={f.tiktok || ''} onChange={set('tiktok')} placeholder="@handle" />
                        </div>
                    </div>

                    {/* Notes */}
                    <PhInput label="Notes" value={f.notes || ''} onChange={set('notes')} placeholder="Add any relevant notes about this lead..." multiline />

                    {/* Research Memory placeholder */}
                    <div style={{ borderRadius: 12, padding: '16px 18px', background: 'rgba(255,122,41,0.03)', border: '1px dashed rgba(255,122,41,0.18)' }}>
                        <p style={{ fontFamily: H, fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', color: '#FF7A29', marginBottom: 6 }}>RESEARCH MEMORY</p>
                        <p style={{ fontFamily: BD, fontSize: 12, color: '#4A4F5A', lineHeight: 1.6 }}>Agent-generated intelligence will appear here once research runs. This connects to your autonomous research module.</p>
                    </div>

                    {/* Save */}
                    <motion.button whileHover={{ scale: 1.01, boxShadow: '0 0 28px rgba(255,122,41,0.32)' }} whileTap={{ scale: 0.98 }}
                        onClick={() => { onSave({ ...f, id: `L${Date.now()}`, initials: initials || '?' }); onClose(); }}
                        style={{ width: '100%', padding: '14px', borderRadius: 12, background: 'linear-gradient(145deg,#1E2024,#151719)', border: '1px solid rgba(255,122,41,0.5)', color: '#FF7A29', fontFamily: H, fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', cursor: 'pointer', boxShadow: '0 0 18px rgba(255,122,41,0.18),inset 0 1px 0 rgba(255,255,255,0.04)' }}>
                        SAVE LEAD
                    </motion.button>
                </div>
            </motion.div>
        </motion.div>
    );
};

// ─── Expanded drawer ──────────────────────────────────────────────────────────
const LeadDrawer: React.FC<{ lead: Lead }> = ({ lead }) => {
    const socials: { icon: typeof Twitter; link?: string; label: string }[] = [
        { icon: Twitter, link: lead.twitter, label: 'Twitter' },
        { icon: Globe, link: lead.website, label: 'Website' },
        { icon: Linkedin, link: lead.linkedin, label: 'LinkedIn' },
        { icon: Instagram, link: lead.instagram, label: 'Instagram' },
        { icon: Facebook, link: lead.facebook, label: 'Facebook' },
    ].filter(s => s.link);
    return (
        <motion.tr key="drawer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <td colSpan={6} style={{ padding: 0 }}>
                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} style={{ overflow: 'hidden' }}>
                    <div style={{ margin: '0 8px 12px', borderRadius: 14, padding: '24px 28px', background: 'linear-gradient(145deg,#16181B,#1C1E21)', border: '1px solid rgba(255,122,41,0.12)', boxShadow: 'inset 0 2px 12px rgba(0,0,0,0.4)' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr 1fr', gap: 28, alignItems: 'start' }}>
                            {/* Avatar */}
                            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(145deg,#1E2023,#252830)', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.4),0 0 14px rgba(255,122,41,0.09)' }}>
                                <span style={{ fontFamily: H, fontSize: 20, fontWeight: 900, color: '#FF7A29' }}>{lead.initials}</span>
                            </div>
                            {/* Details */}
                            <div>
                                <p style={{ fontFamily: MN, fontSize: 9, letterSpacing: '0.28em', color: '#7A7F8A', textTransform: 'uppercase', marginBottom: 4 }}>Contact Details</p>
                                <p style={{ fontFamily: BD, fontSize: 13, fontWeight: 600, color: '#E2E4E9', marginBottom: 4 }}>{lead.name}</p>
                                <p style={{ fontFamily: BD, fontSize: 12, color: '#7A7F8A', marginBottom: 2 }}>{lead.email}</p>
                                <p style={{ fontFamily: BD, fontSize: 12, color: '#7A7F8A', marginBottom: 12 }}>{lead.phone}</p>
                                {socials.length > 0 && (
                                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                        {socials.map(s => (
                                            <motion.a key={s.label} href="#" whileHover={{ borderColor: 'rgba(255,122,41,0.5)', color: '#FF7A29' }}
                                                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', color: '#7A7F8A', fontFamily: BD, fontSize: 11, textDecoration: 'none', transition: 'all 0.2s' }}>
                                                <s.icon size={11} />{s.label}
                                            </motion.a>
                                        ))}
                                    </div>
                                )}
                            </div>
                            {/* Notes + timeline */}
                            <div>
                                {lead.notes && (
                                    <div style={{ borderRadius: 10, padding: '12px 14px', background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.05)', marginBottom: 14 }}>
                                        <p style={{ fontFamily: MN, fontSize: 9, letterSpacing: '0.22em', color: '#7A7F8A', marginBottom: 6 }}>NOTES</p>
                                        <p style={{ fontFamily: BD, fontSize: 12, color: '#9CA0A8', lineHeight: 1.6 }}>{lead.notes}</p>
                                    </div>
                                )}
                                {lead.lastAction && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#FF7A29', boxShadow: '0 0 6px rgba(255,122,41,0.6)' }} />
                                        <span style={{ fontFamily: MN, fontSize: 9, letterSpacing: '0.18em', color: '#5A5F69', textTransform: 'uppercase' }}>{lead.lastAction}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </td>
        </motion.tr>
    );
};

// ─── STATUS PILL ─────────────────────────────────────────────────────────────
const StatusPill: React.FC<{ status: string }> = ({ status }) => {
    const cfg = STATUS[status] ?? STATUS.Archived;
    return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 99, background: cfg.bg, border: `1px solid ${cfg.color}22` }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: cfg.color, boxShadow: `0 0 6px ${cfg.color}`, display: 'inline-block', animation: 'pulse 1.8s ease-in-out infinite' }} />
            <span style={{ fontFamily: MN, fontSize: 9, fontWeight: 700, color: cfg.color, letterSpacing: '0.18em' }}>{status.toUpperCase()}</span>
        </span>
    );
};

// ─── LEADS PAGE ──────────────────────────────────────────────────────────────
export const Leads: React.FC = () => {
    const [tab, setTab] = useState('All');
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [expanded, setExpanded] = useState<string | null>(null);
    const [leads, setLeads] = useState<Lead[]>(LEADS);

    const filtered = leads.filter(l => {
        if (tab !== 'All' && l.status !== tab) return false;
        if (search && !l.name.toLowerCase().includes(search.toLowerCase()) && !l.company.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
    });
    const counts = Object.keys(STATUS).reduce((acc, s) => ({ ...acc, [s]: leads.filter(l => l.status === s).length }), {} as Record<string, number>);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            <AnimatePresence>{showModal && <AddLeadModal onClose={() => setShowModal(false)} onSave={l => setLeads(p => [l, ...p])} />}</AnimatePresence>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
                <div>
                    <p style={{ fontFamily: MN, fontSize: 9, letterSpacing: '0.3em', color: '#7A7F8A', textTransform: 'uppercase', marginBottom: 10 }}>// Intelligence Module · v2.1</p>
                    <h1 style={{ fontFamily: H, fontSize: 'clamp(28px,4vw,40px)', fontWeight: 800, color: '#FFF', letterSpacing: '-0.5px', textTransform: 'uppercase', lineHeight: 1 }}>Lead Intelligence</h1>
                </div>
                <motion.button whileHover={{ scale: 1.015, boxShadow: '0 0 24px rgba(255,122,41,0.28)' }} whileTap={{ scale: 0.97 }}
                    onClick={() => setShowModal(true)}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 24px', borderRadius: 12, background: 'linear-gradient(145deg,#1E2024,#151719)', border: '1px solid rgba(255,122,41,0.48)', color: '#FF7A29', fontFamily: H, fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', cursor: 'pointer', boxShadow: '0 0 16px rgba(255,122,41,0.14),inset 0 1px 0 rgba(255,255,255,0.04)' }}>
                    <Plus size={14} />ADD LEAD
                </motion.button>
            </div>

            {/* Tabs + Search */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
                <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 0 }}>
                    {TABS.map(t => {
                        const active = t === tab;
                        return (
                            <motion.button key={t} onClick={() => setTab(t)} style={{ position: 'relative', padding: '8px 18px', background: 'none', border: 'none', color: active ? '#E2E4E9' : '#4A4F5A', fontFamily: H, fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', cursor: 'pointer', textTransform: 'uppercase' }}>
                                {active && (
                                    <>
                                        <motion.div layoutId="tab-ul" style={{ position: 'absolute', bottom: -1, left: 12, right: 12, height: 2, borderRadius: 99, background: '#FF7A29', boxShadow: '0 0 8px rgba(255,122,41,0.7)' }} />
                                        <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#FF7A29', position: 'absolute', top: 6, right: 8, boxShadow: '0 0 5px rgba(255,122,41,0.8)' }} />
                                    </>
                                )}
                                {t}
                            </motion.button>
                        );
                    })}
                </div>
                {/* Search */}
                <div style={{ position: 'relative' }}>
                    <Search size={13} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#FF7A29', pointerEvents: 'none' }} />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search leads..."
                        style={{ paddingLeft: 36, paddingRight: 16, paddingTop: 9, paddingBottom: 9, width: 240, borderRadius: 10, background: 'linear-gradient(145deg,#131416,#181A1D)', border: '1px solid rgba(255,255,255,0.07)', color: '#E2E4E9', fontFamily: BD, fontSize: 12, caretColor: '#FF7A29', outline: 'none', boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.3)' }} />
                </div>
            </div>

            {/* Table */}
            <div style={{ borderRadius: 16, background: 'linear-gradient(145deg,#181A1D,#1E2022)', border: '1px solid rgba(255,255,255,0.06)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04),0 8px 32px rgba(0,0,0,0.5)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            {['Lead', 'Company', 'Value', 'Score', 'Status', ''].map((h, i) => (
                                <th key={i} style={{ padding: i === 0 ? '14px 20px 14px 20px' : '14px 16px', textAlign: i === 5 ? 'right' : 'left', fontFamily: MN, fontSize: 9, fontWeight: 700, letterSpacing: '0.22em', color: '#7A7F8A', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence mode="popLayout" initial={false}>
                            {filtered.map((lead, i) => (
                                <React.Fragment key={lead.id}>
                                    <motion.tr
                                        layout
                                        initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }}
                                        transition={{ duration: 0.22 }}
                                        style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: i % 2 === 0 ? 'rgba(255,255,255,0)' : 'rgba(255,255,255,0.012)', cursor: 'pointer', transition: 'background 0.18s' }}
                                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,122,41,0.04)')}
                                        onMouseLeave={e => (e.currentTarget.style.background = i % 2 === 0 ? 'rgba(255,255,255,0)' : 'rgba(255,255,255,0.012)')}>
                                        {/* Avatar + name */}
                                        <td style={{ padding: '14px 20px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                                <div style={{ width: 38, height: 38, borderRadius: '50%', flexShrink: 0, background: 'linear-gradient(145deg,#1E2023,#252830)', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 1px 4px rgba(0,0,0,0.4)' }}>
                                                    <span style={{ fontFamily: H, fontSize: 11, fontWeight: 900, color: '#FF7A29' }}>{lead.initials}</span>
                                                </div>
                                                <div>
                                                    <p style={{ fontFamily: BD, fontSize: 13, fontWeight: 600, color: '#E2E4E9', marginBottom: 2 }}>{lead.name}</p>
                                                    <p style={{ fontFamily: BD, fontSize: 11, color: '#5A5F69' }}>{lead.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '14px 16px' }}><span style={{ fontFamily: BD, fontSize: 12, color: '#9CA0A8' }}>{lead.company}</span></td>
                                        <td style={{ padding: '14px 16px' }}><span style={{ fontFamily: BD, fontSize: 13, fontWeight: 700, color: '#E2E4E9' }}>{lead.value}</span></td>
                                        <td style={{ padding: '14px 16px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <div style={{ flex: 1, height: 3, borderRadius: 99, background: 'rgba(255,255,255,0.07)', overflow: 'hidden', minWidth: 60 }}>
                                                    <div style={{ height: '100%', width: `${lead.score}%`, borderRadius: 99, background: lead.score > 70 ? 'linear-gradient(90deg,#D95B16,#FF7A29)' : 'linear-gradient(90deg,#2A2D32,#7A7F8A)' }} />
                                                </div>
                                                <span style={{ fontFamily: BD, fontSize: 11, fontWeight: 700, color: lead.score > 70 ? '#FF7A29' : '#7A7F8A', minWidth: 28, textAlign: 'right' }}>{lead.score}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '14px 16px' }}><StatusPill status={lead.status} /></td>
                                        <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                                            <motion.button whileTap={{ scale: 0.88 }}
                                                onClick={() => setExpanded(expanded === lead.id ? null : lead.id)}
                                                style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', color: '#7A7F8A', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <motion.div animate={{ rotate: expanded === lead.id ? 90 : 0 }} transition={{ duration: 0.2 }}>
                                                    <ChevronRight size={14} />
                                                </motion.div>
                                            </motion.button>
                                        </td>
                                    </motion.tr>
                                    <AnimatePresence>{expanded === lead.id && <LeadDrawer lead={lead} />}</AnimatePresence>
                                </React.Fragment>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>

            {/* Footer legend */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, padding: '12px 20px', borderRadius: 12, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                {Object.entries(counts).map(([s, n]) => (
                    <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 7, height: 7, borderRadius: '50%', background: (STATUS[s]?.color || '#7A7F8A'), boxShadow: `0 0 6px ${STATUS[s]?.color || '#7A7F8A'}` }} />
                        <span style={{ fontFamily: MN, fontSize: 9, letterSpacing: '0.18em', color: '#7A7F8A', textTransform: 'uppercase' }}>{s}: <strong style={{ color: '#D0D3DA' }}>{n}</strong></span>
                    </div>
                ))}
                <div style={{ marginLeft: 'auto', fontFamily: MN, fontSize: 9, letterSpacing: '0.18em', color: '#4A4F5A' }}>TOTAL: {leads.length} LEADS</div>
            </div>
        </div>
    );
};
