import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Filter, ArrowUpDown, Plus, X, Zap, FlaskConical,
    ChevronDown, Twitter, Linkedin, Globe, Instagram, Facebook,
    ExternalLink, Mail, Phone, CheckCircle2, Loader2, AlertCircle,
    Youtube, Link as LinkIcon
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Lead } from '../../lib/supabase';
import { triggerDFY, triggerAPV } from '../lib/openClaw';
import { useToast } from '../components/ui/Toast';

export type { Lead };

const H = 'JetBrains Mono, monospace';
const BD = 'Inter, sans-serif';
const MN = 'JetBrains Mono, monospace';

// ─── Status Pill ───────────────────────────────────────────────────────────────
const STATUS_COLORS: Record<string, { bg: string; border: string; text: string }> = {
    Active: { bg: 'rgba(75,231,127,0.08)', border: 'rgba(75,231,127,0.28)', text: '#4BE77F' },
    Negotiating: { bg: 'rgba(255,122,41,0.08)', border: 'rgba(255,122,41,0.3)', text: '#FF7A29' },
    New: { bg: 'rgba(122,159,255,0.08)', border: 'rgba(122,159,255,0.3)', text: '#7A9FFF' },
    Archived: { bg: 'rgba(120,120,130,0.08)', border: 'rgba(120,120,130,0.25)', text: '#7A7F8A' },
};

const StatusPill: React.FC<{ status: Lead['status'] }> = ({ status }) => {
    const c = STATUS_COLORS[status] ?? STATUS_COLORS.New;
    return (
        <span style={{ fontFamily: MN, fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', padding: '4px 10px', borderRadius: 99, background: c.bg, border: `1px solid ${c.border}`, color: c.text }}>
            {status}
        </span>
    );
};

// ─── Empty / Loading / Error states ────────────────────────────────────────────
const LoadingRow = () => (
    <tr>
        <td colSpan={8} style={{ padding: '48px 0', textAlign: 'center' }}>
            <Loader2 size={22} style={{ color: '#FF7A29', animation: 'spin 1s linear infinite' }} />
            <p style={{ fontFamily: BD, fontSize: 13, color: '#4A4F5A', marginTop: 12 }}>Loading leads…</p>
        </td>
    </tr>
);

const EmptyRow = () => (
    <tr>
        <td colSpan={8} style={{ padding: '64px 0', textAlign: 'center' }}>
            <p style={{ fontFamily: H, fontSize: 14, color: '#3A3F4A' }}>NO LEADS YET</p>
            <p style={{ fontFamily: BD, fontSize: 13, color: '#4A4F5A', marginTop: 8 }}>Click "+ Add Lead" to get started.</p>
        </td>
    </tr>
);

// ─── LeadGenModal (progress animation) ────────────────────────────────────────
const STEPS_DFY = ['Scraping profile data', 'Analysing company signals', 'Generating outreach copy', 'Compiling DFY package', 'Done'];
const STEPS_APV = ['Loading lead context', 'Running APV heuristics', 'Scoring qualification', 'Building APV report', 'Done'];

const LeadGenModal: React.FC<{ type: 'DFY' | 'APV'; onClose: () => void }> = ({ type, onClose }) => {
    const steps = type === 'DFY' ? STEPS_DFY : STEPS_APV;
    const [step, setStep] = useState(0);
    const color = type === 'DFY' ? '#FF7A29' : '#7A9FFF';
    const toast = useToast();

    useEffect(() => {
        if (step >= steps.length - 1) return;
        const t = setTimeout(() => setStep(s => s + 1), 900);
        return () => clearTimeout(t);
    }, [step, steps.length]);

    const done = step === steps.length - 1;

    // Fire toast when the animation reaches Done
    useEffect(() => {
        if (done) toast.success('Strategy generated!');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [done]);

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(10px)', padding: 24 }}
            onClick={done ? onClose : undefined}>
            <motion.div initial={{ scale: 0.94, y: 18 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.94, y: 18 }}
                transition={{ type: 'spring', stiffness: 340, damping: 30 }}
                onClick={e => e.stopPropagation()}
                style={{ width: '100%', maxWidth: 460, borderRadius: 20, background: 'linear-gradient(145deg,#181A1D,#1E2023)', border: '1px solid rgba(255,255,255,0.07)', boxShadow: `0 0 60px ${color}22,0 30px 80px rgba(0,0,0,0.7)`, overflow: 'hidden' }}>
                <div style={{ height: 2, background: `linear-gradient(90deg,transparent,${color}88,transparent)` }} />
                <div style={{ padding: '28px 32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                        <div style={{ width: 34, height: 34, borderRadius: 10, background: `${color}15`, border: `1px solid ${color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {type === 'DFY' ? <Zap size={14} style={{ color }} /> : <FlaskConical size={14} style={{ color }} />}
                        </div>
                        <p style={{ fontFamily: H, fontSize: 12, fontWeight: 700, color: '#E2E4E9', letterSpacing: '-0.2px' }}>
                            GENERATE {type} <span style={{ color }}>· QUEUED</span>
                        </p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {steps.map((s, i) => {
                            const isActive = i === step && !done;
                            const isDone = i < step || done;
                            return (
                                <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 12, opacity: i > step ? 0.25 : 1, transition: 'opacity 0.4s' }}>
                                    <div style={{ width: 20, height: 20, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: isDone ? `${color}20` : isActive ? `${color}15` : 'rgba(255,255,255,0.03)', border: `1px solid ${isDone || isActive ? color + '55' : 'rgba(255,255,255,0.06)'}` }}>
                                        {isDone ? <CheckCircle2 size={11} style={{ color }} /> : isActive ? <Loader2 size={11} style={{ color, animation: 'spin 0.8s linear infinite' }} /> : null}
                                    </div>
                                    <span style={{ fontFamily: BD, fontSize: 13, color: isDone ? '#C0C4CC' : isActive ? '#E2E4E9' : '#4A4F5A', fontWeight: isActive ? 500 : 400 }}>{s}</span>
                                </div>
                            );
                        })}
                    </div>
                    {done && (
                        <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                            onClick={onClose}
                            style={{ marginTop: 24, width: '100%', padding: '13px', borderRadius: 12, background: `linear-gradient(145deg,${color}22,${color}10)`, border: `1px solid ${color}55`, color, fontFamily: H, fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', cursor: 'pointer' }}>
                            CLOSE
                        </motion.button>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

// ─── Add Lead Modal ────────────────────────────────────────────────────────────
const emptyForm = (): Omit<Lead, 'id' | 'created_at'> => ({
    initials: '', name: '', company: '', email: '', phone: '',
    value: '', score: 50, status: 'New', notes: '', twitter: '',
    linkedin: '', website: '', instagram: '', facebook: '', tiktok: '',
    youtube: '', blog: '',
    last_action: '',
});

const AddLeadModal: React.FC<{ onClose: () => void; onSaved: () => void; lead?: Lead }> = ({ onClose, onSaved, lead }) => {
    const [f, setF] = useState(lead ? { ...lead } : emptyForm());
    const [saving, setSaving] = useState(false);
    const [err, setErr] = useState('');
    const set = (k: keyof typeof f, v: string | number) => setF(p => ({ ...p, [k]: v }));

    const handleSave = async () => {
        if (!f.name) return;
        setSaving(true);
        setErr('');
        const initials = f.name.split(' ').map(w => w[0] || '').join('').slice(0, 2).toUpperCase() || '??';
        const last_action = lead ? lead.last_action : 'Added just now';

        let error;
        if (lead) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { id, created_at, ...updateData } = f as any;
            ({ error } = await supabase.from('leads').update({ ...updateData, initials }).eq('id', lead.id));
        } else {
            ({ error } = await supabase.from('leads').insert([{ ...f, initials, last_action }]));
        }

        setSaving(false);
        if (error) { setErr(error.message); return; }
        onSaved();
        onClose();
    };

    const inputSt: React.CSSProperties = {
        padding: '10px 14px', borderRadius: 10,
        background: 'linear-gradient(145deg,#131416,#181A1D)',
        border: '1px solid rgba(255,255,255,0.07)',
        color: 'var(--text-primary, #E2E4E9)',
        fontFamily: BD, fontSize: 13, outline: 'none', width: '100%', boxSizing: 'border-box'
    };
    const labelSt: React.CSSProperties = { fontFamily: MN, fontSize: 8, letterSpacing: '0.22em', color: '#7A7F8A', textTransform: 'uppercase', display: 'block', marginBottom: 5 };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(10px)', padding: 24 }}
            onClick={onClose}>
            <motion.div initial={{ scale: 0.94, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.94, y: 20 }}
                transition={{ type: 'spring', stiffness: 340, damping: 30 }}
                onClick={e => e.stopPropagation()}
                style={{ width: '100%', maxWidth: 520, maxHeight: '82vh', display: 'flex', flexDirection: 'column', borderRadius: 20, background: 'linear-gradient(145deg,#181A1D,#1E2023)', border: '1px solid rgba(255,255,255,0.07)', boxShadow: '0 0 60px rgba(255,122,41,0.1),0 30px 80px rgba(0,0,0,0.7)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ height: 2, background: 'linear-gradient(90deg,transparent,rgba(255,122,41,0.7),transparent)', flexShrink: 0 }} />

                {/* Scrollable content areas */}
                <div style={{ padding: '24px 28px', flex: 1, overflowY: 'auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                        <p style={{ fontFamily: H, fontSize: 12, fontWeight: 700, color: '#E2E4E9' }}>ADD NEW LEAD</p>
                        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#7A7F8A', cursor: 'pointer' }}><X size={16} /></button>
                    </div>
                    {err && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 10, background: 'rgba(217,91,22,0.1)', border: '1px solid rgba(217,91,22,0.3)', marginBottom: 16 }}>
                            <AlertCircle size={13} style={{ color: '#D95B16' }} />
                            <span style={{ fontFamily: BD, fontSize: 12, color: '#D95B16' }}>{err}</span>
                        </div>
                    )}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                        {([
                            ['Name *', 'name', 'text'],
                            ['Company', 'company', 'text'],
                            ['Email', 'email', 'email'],
                            ['Phone', 'phone', 'tel'],
                            ['Deal Value', 'value', 'text'],
                            ['Score (0-100)', 'score', 'number'],
                            ['Status', 'status', 'select'],
                            ['Website', 'website', 'text'],
                            ['LinkedIn', 'linkedin', 'text'],
                            ['Twitter', 'twitter', 'text'],
                            ['YouTube', 'youtube', 'text'],
                            ['Instagram', 'instagram', 'text'],
                            ['Facebook', 'facebook', 'text'],
                            ['TikTok', 'tiktok', 'text'],
                            ['Blog', 'blog', 'text'],
                        ] as [string, keyof typeof f, string][]).map(([lbl, key, type]) => {
                            if (type === 'select') {
                                return (
                                    <div key={key}>
                                        <label style={labelSt}>{lbl}</label>
                                        <select value={f.status} onChange={e => set('status', e.target.value as Lead['status'])} style={{ ...inputSt }}>
                                            {['New', 'Active', 'Negotiating', 'Archived'].map(s => <option key={s}>{s}</option>)}
                                        </select>
                                    </div>
                                );
                            }
                            return (
                                <div key={key}>
                                    <label style={labelSt}>{lbl}</label>
                                    <input type={type} value={String(f[key] ?? '')} onChange={e => set(key, type === 'number' ? +e.target.value : e.target.value)} style={inputSt} />
                                </div>
                            );
                        })}
                    </div>
                    <div style={{ marginTop: 14 }}>
                        <label style={labelSt}>Notes</label>
                        <textarea value={f.notes ?? ''} onChange={e => set('notes', e.target.value)} rows={3}
                            style={{ ...inputSt, resize: 'vertical' }} />
                    </div>
                </div>
                <div style={{ padding: '20px 28px', borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.1)', flexShrink: 0 }}>
                    <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.97 }}
                        onClick={handleSave} disabled={saving}
                        style={{ width: '100%', padding: '13px', borderRadius: 12, background: 'linear-gradient(145deg,#1E2024,#151719)', border: '1px solid rgba(255,122,41,0.48)', color: saving ? '#7A7F8A' : '#FF7A29', fontFamily: H, fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', cursor: saving ? 'default' : 'pointer', boxShadow: '0 0 14px rgba(255,122,41,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                        {saving ? <><Loader2 size={12} style={{ animation: 'spin 0.8s linear infinite' }} />SAVING…</> : 'SAVE LEAD'}
                    </motion.button>
                </div>
            </motion.div>
        </motion.div>
    );
};

// ─── Leads Page ────────────────────────────────────────────────────────────────
export const Leads: React.FC = () => {
    const toast = useToast();
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [showAdd, setShowAdd] = useState(false);
    const [showDFY, setShowDFY] = useState(false);
    const [showAPV, setShowAPV] = useState(false);
    const [activeLeadId, setActiveLeadId] = useState<string | null>(null);
    const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [editingLead, setEditingLead] = useState<Lead | null>(null);

    const fetchLeads = useCallback(async () => {
        setLoading(true);
        setError('');
        const { data, error: err } = await supabase
            .from('leads')
            .select('*')
            .order('created_at', { ascending: false });

        setLoading(false);
        if (err) { setError(err.message); return; }
        setLeads(data ?? []);
    }, []);

    useEffect(() => { fetchLeads(); }, [fetchLeads]);

    // ─── Realtime: auto-close DFY/APV modal on report insert ──────────────────
    useEffect(() => {
        const dfyCh = supabase
            .channel('dfy_reports_rt')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'dfy_reports' }, () => {
                setShowDFY(false);
                toast.success('Strategy generated!');
                fetchLeads();
            })
            .subscribe();
        const apvCh = supabase
            .channel('apv_reports_rt')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'apv_reports' }, () => {
                setShowAPV(false);
                toast.success('Strategy generated!');
                fetchLeads();
            })
            .subscribe();
        return () => {
            supabase.removeChannel(dfyCh);
            supabase.removeChannel(apvCh);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchLeads]);

    const handleDFY = async (leadId?: string | null) => {
        if (leadId) setActiveLeadId(leadId);
        setShowDFY(true);
        try {
            await triggerDFY({ leadId: leadId || null });
        } catch (err) {
            console.error('DFY fail:', err);
        }
    };

    const handleAPV = async (leadId?: string | null) => {
        if (leadId) setActiveLeadId(leadId);
        setShowAPV(true);
        try {
            await triggerAPV({ leadId: leadId || null });
        } catch (err) {
            console.error('APV fail:', err);
        }
    };

    const handleDelete = async (leadId: string) => {
        if (!confirm('Are you sure you want to delete this lead?')) return;
        const { error } = await supabase.from('leads').delete().eq('id', leadId);
        if (error) { toast.error(error.message); return; }
        toast.success('Lead deleted');
        fetchLeads();
    };

    const STATUSES = ['All', 'Active', 'Negotiating', 'New', 'Archived'];

    const filtered = leads.filter(l => {
        const q = search.toLowerCase();
        const matchSearch = !q || l.name.toLowerCase().includes(q) || (l.company ?? '').toLowerCase().includes(q) || (l.email ?? '').toLowerCase().includes(q);
        const matchStatus = statusFilter === 'All' || l.status === statusFilter;
        return matchSearch && matchStatus;
    });

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
                <div>
                    <p style={{ fontFamily: MN, fontSize: 9, letterSpacing: '0.3em', color: '#7A7F8A', textTransform: 'uppercase', marginBottom: 10 }}>// CRM · Leads</p>
                    <h1 style={{ fontFamily: H, fontSize: 'clamp(28px,4vw,40px)', fontWeight: 800, color: 'var(--text-primary,#FFF)', letterSpacing: '-0.5px', textTransform: 'uppercase', lineHeight: 1 }}>Lead Manager</h1>
                    <p style={{ fontFamily: BD, fontSize: 14, color: '#7A7F8A', marginTop: 8 }}>
                        {leads.length} lead{leads.length !== 1 ? 's' : ''} · Live from Supabase
                    </p>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                    <motion.button whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.97 }}
                        onClick={() => handleDFY(selectedLeadId)}
                        style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 12, background: 'rgba(255,122,41,0.03)', border: '1px solid rgba(255,122,41,0.48)', color: '#FF7A29', fontFamily: H, fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', cursor: 'pointer' }}>
                        <Zap size={12} />DFY
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.97 }}
                        onClick={() => handleAPV(selectedLeadId)}
                        style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 12, background: 'rgba(122,159,255,0.03)', border: '1px solid rgba(122,159,255,0.35)', color: '#7A9FFF', fontFamily: H, fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', cursor: 'pointer' }}>
                        <FlaskConical size={12} />APV
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.015, boxShadow: '0 0 22px rgba(255,122,41,0.22)' }} whileTap={{ scale: 0.97 }}
                        onClick={() => setShowAdd(true)}
                        style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 12, background: 'linear-gradient(145deg,#1E2024,#151719)', border: '1px solid rgba(255,122,41,0.48)', color: '#FF7A29', fontFamily: H, fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', cursor: 'pointer', boxShadow: '0 0 12px rgba(255,122,41,0.1)' }}>
                        <Plus size={12} />ADD LEAD
                    </motion.button>
                </div>
            </div>

            {/* Error banner */}
            {error && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 18px', borderRadius: 12, background: 'rgba(217,91,22,0.08)', border: '1px solid rgba(217,91,22,0.3)' }}>
                    <AlertCircle size={14} style={{ color: '#D95B16' }} />
                    <span style={{ fontFamily: BD, fontSize: 13, color: '#D95B16' }}>Failed to load leads: {error}</span>
                    <button onClick={fetchLeads} style={{ marginLeft: 'auto', fontFamily: H, fontSize: 9, color: '#FF7A29', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.1em' }}>RETRY</button>
                </div>
            )}

            {/* Search + Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
                    <Search size={13} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#4A4F5A' }} />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search leads…"
                        style={{ width: '100%', paddingLeft: 38, paddingRight: 14, paddingTop: 10, paddingBottom: 10, borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', color: 'var(--text-primary,#E2E4E9)', fontFamily: BD, fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                    {STATUSES.map(s => (
                        <button key={s} onClick={() => setStatusFilter(s)}
                            style={{ padding: '8px 14px', borderRadius: 10, fontFamily: H, fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', cursor: 'pointer', transition: 'all 0.18s', background: statusFilter === s ? 'rgba(255,122,41,0.1)' : 'rgba(255,255,255,0.03)', border: `1px solid ${statusFilter === s ? 'rgba(255,122,41,0.45)' : 'rgba(255,255,255,0.06)'}`, color: statusFilter === s ? '#FF7A29' : '#7A7F8A' }}>
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div style={{ borderRadius: 20, background: 'linear-gradient(145deg,#14161A,#1A1C20)', border: '1px solid rgba(255,255,255,0.06)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04),0 10px 50px rgba(0,0,0,0.5)', overflow: 'hidden' }}>
                <div style={{ height: 2, background: 'linear-gradient(90deg,transparent,rgba(255,122,41,0.5),transparent)' }} />
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                {['LEAD', 'COMPANY', 'CONTACT', 'VALUE', 'SCORE', 'STATUS', 'LAST ACTION', 'ACTIONS'].map(h => (
                                    <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontFamily: MN, fontSize: 8, letterSpacing: '0.2em', color: '#4A4F5A', fontWeight: 700, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? <LoadingRow /> : filtered.length === 0 ? <EmptyRow /> : filtered.map((lead, i) => (
                                <React.Fragment key={lead.id}>
                                    <motion.tr initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                                        onClick={() => {
                                            setExpandedId(expandedId === lead.id ? null : lead.id);
                                            setSelectedLeadId(lead.id);
                                        }}
                                        style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer', background: selectedLeadId === lead.id ? 'rgba(255,122,41,0.06)' : 'transparent', transition: 'background 0.2s' }}>
                                        <td style={{ padding: '14px 16px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                <div style={{ width: 34, height: 34, borderRadius: '50%', background: selectedLeadId === lead.id ? 'rgba(255,122,41,0.15)' : 'linear-gradient(145deg,#252830,#1E2023)', border: selectedLeadId === lead.id ? '1px solid #FF7A29' : '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                    <span style={{ fontFamily: H, fontSize: 11, fontWeight: 800, color: '#FF7A29' }}>{lead.initials || '??'}</span>
                                                </div>
                                                <div>
                                                    <p style={{ fontFamily: BD, fontSize: 13, fontWeight: 600, color: 'var(--text-primary,#E2E4E9)', whiteSpace: 'nowrap' }}>{lead.name}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '14px 16px', fontFamily: BD, fontSize: 13, color: 'var(--text-secondary,#9A9FA8)', whiteSpace: 'nowrap' }}>{lead.company ?? '—'}</td>
                                        <td style={{ padding: '14px 16px' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                                {lead.email && <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: BD, fontSize: 11, color: '#6A6F7A' }}><Mail size={10} />{lead.email}</span>}
                                                {lead.phone && <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: BD, fontSize: 11, color: '#6A6F7A' }}><Phone size={10} />{lead.phone}</span>}
                                            </div>
                                        </td>
                                        <td style={{ padding: '14px 16px', fontFamily: H, fontSize: 12, fontWeight: 700, color: '#4BE77F', whiteSpace: 'nowrap' }}>{lead.value ?? '—'}</td>
                                        <td style={{ padding: '14px 16px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <div style={{ flex: 1, minWidth: 60, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                                                    <div style={{ height: '100%', width: `${lead.score ?? 0}%`, background: `hsl(${(lead.score ?? 0) * 1.2},80%,55%)`, borderRadius: 2, transition: 'width 0.6s' }} />
                                                </div>
                                                <span style={{ fontFamily: MN, fontSize: 10, color: 'var(--text-secondary,#9A9FA8)', minWidth: 28 }}>{lead.score ?? 0}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '14px 16px' }}><StatusPill status={(lead.status as Lead['status']) ?? 'New'} /></td>
                                        <td style={{ padding: '14px 16px', fontFamily: BD, fontSize: 11, color: '#4A4F5A', whiteSpace: 'nowrap' }}>{lead.last_action ?? '—'}</td>
                                        <td style={{ padding: '14px 16px' }}>
                                            <div style={{ display: 'flex', gap: 6 }} onClick={e => e.stopPropagation()}>
                                                <button onClick={() => setExpandedId(expandedId === lead.id ? null : lead.id)}
                                                    style={{ background: 'none', border: 'none', color: '#7A7F8A', cursor: 'pointer', fontFamily: MN, fontSize: 8, letterSpacing: '0.1em' }}>VIEW</button>
                                                <button onClick={() => setEditingLead(lead)}
                                                    style={{ background: 'none', border: 'none', color: '#7A9FFF', cursor: 'pointer', fontFamily: MN, fontSize: 8, letterSpacing: '0.1em' }}>EDIT</button>
                                                <button onClick={() => handleDelete(lead.id)}
                                                    style={{ background: 'none', border: 'none', color: '#FF4B4B', cursor: 'pointer', fontFamily: MN, fontSize: 8, letterSpacing: '0.1em' }}>DELETE</button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                    {/* Expanded row */}
                                    <AnimatePresence>
                                        {expandedId === lead.id && (
                                            <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                                <td colSpan={8} style={{ padding: '0 16px 16px' }}>
                                                    <div style={{ borderRadius: 14, padding: '16px 20px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: 32, flexWrap: 'wrap' }}>
                                                        {lead.notes && <div><p style={{ fontFamily: MN, fontSize: 8, letterSpacing: '0.2em', color: '#4A4F5A', textTransform: 'uppercase', marginBottom: 6 }}>Notes</p><p style={{ fontFamily: BD, fontSize: 13, color: '#9A9FA8', maxWidth: 420, lineHeight: 1.7 }}>{lead.notes}</p></div>}
                                                        <div>
                                                            <p style={{ fontFamily: MN, fontSize: 8, letterSpacing: '0.2em', color: '#4A4F5A', textTransform: 'uppercase', marginBottom: 8 }}>Socials</p>
                                                            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                                                                {lead.website && <a href={`https://${lead.website.replace('https://', '').replace('http://', '')}`} target="_blank" rel="noreferrer" style={{ color: '#7A9FFF' }} title="Website"><Globe size={15} /></a>}
                                                                {lead.linkedin && <a href={`https://linkedin.com/in/${lead.linkedin}`} target="_blank" rel="noreferrer" style={{ color: '#7A9FFF' }} title="LinkedIn"><Linkedin size={15} /></a>}
                                                                {lead.twitter && <a href={`https://twitter.com/${lead.twitter}`} target="_blank" rel="noreferrer" style={{ color: '#7A9FFF' }} title="Twitter"><Twitter size={15} /></a>}
                                                                {lead.youtube && <a href={lead.youtube.startsWith('http') ? lead.youtube : `https://youtube.com/@${lead.youtube}`} target="_blank" rel="noreferrer" style={{ color: '#7A9FFF' }} title="YouTube"><Youtube size={15} /></a>}
                                                                {lead.instagram && <a href={`https://instagram.com/${lead.instagram}`} target="_blank" rel="noreferrer" style={{ color: '#7A9FFF' }} title="Instagram"><Instagram size={15} /></a>}
                                                                {lead.facebook && <a href={`https://facebook.com/${lead.facebook}`} target="_blank" rel="noreferrer" style={{ color: '#7A9FFF' }} title="Facebook"><Facebook size={15} /></a>}
                                                                {lead.tiktok && <a href={`https://tiktok.com/@${lead.tiktok}`} target="_blank" rel="noreferrer" style={{ color: '#7A9FFF' }} title="TikTok"><ExternalLink size={15} /></a>}
                                                                {lead.blog && <a href={lead.blog.startsWith('http') ? lead.blog : `https://${lead.blog}`} target="_blank" rel="noreferrer" style={{ color: '#7A9FFF' }} title="Blog"><LinkIcon size={15} /></a>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        )}
                                    </AnimatePresence>
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modals */}
            <AnimatePresence>
                {showAdd && <AddLeadModal onClose={() => setShowAdd(false)} onSaved={fetchLeads} />}
                {editingLead && (
                    <AddLeadModal
                        lead={editingLead}
                        onClose={() => setEditingLead(null)}
                        onSaved={fetchLeads}
                    />
                )}
                {showDFY && <LeadGenModal type="DFY" onClose={() => setShowDFY(false)} />}
                {showAPV && <LeadGenModal type="APV" onClose={() => setShowAPV(false)} />}
            </AnimatePresence>
        </div>
    );
};
