import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Microscope, Search, X, CheckCircle2, Clock, ArrowRight, FlaskConical, BarChart2, Brain, FileDown, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Lead } from '../../lib/supabase';
import { useToast } from '../components/ui/Toast';

const H = 'JetBrains Mono, monospace';
const BD = 'Inter, sans-serif';
const MN = 'JetBrains Mono, monospace';

// ─── Mock recent research log ─────────────────────────────────────────────────
interface ResearchEntry {
    id: string; leadName: string; company: string; date: string;
    status: 'complete' | 'running' | 'queued';
    score: number; insight: string; initials: string;
}
// ─── STATUS STYLE ─────────────────────────────────────────────────────────────
const STATUS_STYLE: Record<string, { label: string; color: string; bg: string }> = {
    complete: { label: 'COMPLETE', color: '#4BE77F', bg: 'rgba(75,231,127,0.08)' },
    running: { label: 'RUNNING', color: '#FF7A29', bg: 'rgba(255,122,41,0.08)' },
    queued: { label: 'QUEUED', color: '#7A9FFF', bg: 'rgba(122,159,255,0.08)' },
    done: { label: 'COMPLETE', color: '#4BE77F', bg: 'rgba(75,231,127,0.08)' }, // support 'done' from DB
    pending: { label: 'QUEUED', color: '#7A9FFF', bg: 'rgba(122,159,255,0.08)' }, // support 'pending' from DB
};

// ─── Lead Picker Modal ────────────────────────────────────────────────────────
const LeadPickerModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [allLeads, setAllLeads] = useState<Lead[]>([]);
    const [loadingLeads, setLoadingLeads] = useState(true);

    useEffect(() => {
        supabase.from('leads').select('id,name,company,score,initials').order('name')
            .then(({ data }) => { setAllLeads(data ?? []); setLoadingLeads(false); });
    }, []);

    const filtered = allLeads.filter(l =>
        (l.name ?? '').toLowerCase().includes(query.toLowerCase()) ||
        (l.company ?? '').toLowerCase().includes(query.toLowerCase())
    );

    // Close on ESC
    React.useEffect(() => {
        const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', fn);
        return () => window.removeEventListener('keydown', fn);
    }, [onClose]);

    const go = (id: string) => { onClose(); navigate(`/research/${id}`); };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(10px)', padding: 24 }}
            onClick={onClose}>
            <motion.div initial={{ scale: 0.94, y: 18 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.94, y: 18 }}
                transition={{ type: 'spring', stiffness: 340, damping: 30 }}
                onClick={e => e.stopPropagation()}
                style={{ width: '100%', maxWidth: 520, borderRadius: 20, background: 'linear-gradient(145deg,#181A1D,#1E2023)', border: '1px solid rgba(255,255,255,0.07)', boxShadow: '0 0 60px rgba(255,122,41,0.12),0 30px 80px rgba(0,0,0,0.7)', overflow: 'hidden' }}>
                {/* Orange top bar */}
                <div style={{ height: 2, background: 'linear-gradient(90deg,transparent,rgba(255,122,41,0.7),transparent)' }} />
                <div style={{ padding: '24px 28px 8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 30, height: 30, borderRadius: 9, background: 'rgba(255,122,41,0.1)', border: '1px solid rgba(255,122,41,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Microscope size={14} style={{ color: '#FF7A29' }} />
                            </div>
                            <p style={{ fontFamily: H, fontSize: 12, fontWeight: 700, color: '#E2E4E9', letterSpacing: '-0.2px' }}>Open Lead Research</p>
                        </div>
                        <motion.button whileHover={{ background: 'rgba(255,255,255,0.08)' }} whileTap={{ scale: 0.9 }}
                            onClick={onClose} style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7A7F8A' }}>
                            <X size={13} />
                        </motion.button>
                    </div>
                    {/* Search */}
                    <div style={{ position: 'relative', marginBottom: 8 }}>
                        <Search size={13} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#4A4F5A', pointerEvents: 'none' }} />
                        <input autoFocus value={query} onChange={e => setQuery(e.target.value)}
                            placeholder="Search lead or company…"
                            style={{ width: '100%', paddingLeft: 34, paddingRight: 14, paddingTop: 9, paddingBottom: 9, borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: '#E2E4E9', fontFamily: BD, fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
                    </div>
                </div>
                {/* Lead list */}
                <div style={{ padding: '0 14px 20px', display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 320, overflowY: 'auto' }}>
                    {loadingLeads && <div style={{ display: 'flex', justifyContent: 'center', padding: 20 }}><Loader2 size={16} style={{ color: '#3A3F4A', animation: 'spin 1s linear infinite' }} /></div>}
                    {!loadingLeads && filtered.length === 0 && <p style={{ fontFamily: MN, fontSize: 10, color: '#4A4F5A', textAlign: 'center', padding: '20px 0', letterSpacing: '0.14em' }}>NO LEADS FOUND</p>}
                    {filtered.map(lead => (
                        <motion.button key={lead.id} whileHover={{ background: 'rgba(255,122,41,0.07)', borderColor: 'rgba(255,122,41,0.22)' }} whileTap={{ scale: 0.98 }}
                            onClick={() => go(lead.id)}
                            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer', textAlign: 'left', transition: 'all 0.18s' }}>
                            <div style={{ width: 32, height: 32, borderRadius: 9, background: 'linear-gradient(135deg,#2A2D32,#1E2024)', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <span style={{ fontFamily: H, fontSize: 10, fontWeight: 700, color: '#FF7A29' }}>{lead.initials}</span>
                            </div>
                            <div style={{ flex: 1 }}>
                                <p style={{ fontFamily: BD, fontSize: 13, fontWeight: 600, color: '#E2E4E9' }}>{lead.name}</p>
                                <p style={{ fontFamily: BD, fontSize: 11, color: '#6A6F7A', marginTop: 1 }}>{lead.company}</p>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <span style={{ fontFamily: MN, fontSize: 9, color: (lead.score ?? 0) >= 80 ? '#4BE77F' : (lead.score ?? 0) >= 60 ? '#FF7A29' : '#6A6F7A', letterSpacing: '0.08em' }}>{lead.score}</span>
                                <ArrowRight size={12} style={{ color: '#4A4F5A' }} />
                            </div>
                        </motion.button>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );
};

// ─── RESEARCH HUB PAGE ─────────────────────────────────────────────────────────
export const ResearchHub: React.FC = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const [modal, setModal] = useState(false);
    const [log, setLog] = useState<ResearchEntry[]>([]);
    const [stats, setStats] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        // 1. Fetch Stats
        const { data: researchTasks } = await supabase.from('research_tasks').select('status');
        const { data: leads } = await supabase.from('leads').select('score');

        const completeCount = (researchTasks ?? []).filter(t => t.status === 'done' || t.status === 'complete').length;
        const queuedCount = (researchTasks ?? []).filter(t => t.status === 'pending' || t.status === 'queued').length;
        const avgScore = leads && leads.length > 0
            ? Math.round(leads.reduce((acc, curr) => acc + (curr.score || 0), 0) / leads.length)
            : 0;

        setStats([
            { icon: <CheckCircle2 size={15} />, label: 'Analyses Complete', value: String(completeCount), color: '#4BE77F' },
            { icon: <BarChart2 size={15} />, label: 'Avg Intent Score', value: String(avgScore), color: '#FF7A29' },
            { icon: <Brain size={15} />, label: 'Queued Reports', value: String(queuedCount), color: '#7A9FFF' },
            { icon: <FileDown size={15} />, label: 'Reports Generated', value: String(completeCount), color: '#A78BFA' },
        ]);

        // 2. Fetch Recent Log (Join Research with Leads)
        const { data: resLog } = await supabase
            .from('research')
            .select(`
                id,
                lead_id,
                summary,
                created_at,
                leads:lead_id (
                  name,
                  company,
                  score,
                  initials
                )
            `)
            .order('created_at', { ascending: false })
            .limit(10);

        if (resLog) {
            setLog(resLog.map(r => ({
                id: r.lead_id,
                leadName: (r.leads as any)?.name ?? 'Unknown',
                company: (r.leads as any)?.company ?? 'Private',
                date: new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), // Format date
                status: 'complete', // Assuming research entries are complete once in 'research' table
                score: (r.leads as any)?.score ?? 0,
                insight: r.summary,
                initials: (r.leads as any)?.initials ?? '??'
            })));
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
        // ─── Realtime: refresh when a research task finishes ──────────────────
        const ch = supabase
            .channel('research_tasks_hub_rt')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'research_tasks' },
                () => { toast.success('Research operations updated'); fetchData(); }
            )
            .subscribe();
        return () => { supabase.removeChannel(ch); };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
                <div>
                    <p style={{ fontFamily: MN, fontSize: 9, letterSpacing: '0.3em', color: '#7A7F8A', textTransform: 'uppercase', marginBottom: 10 }}>// Intelligence · Research Hub</p>
                    <h1 style={{ fontFamily: H, fontSize: 'clamp(28px,4vw,40px)', fontWeight: 800, color: '#FFF', letterSpacing: '-0.5px', textTransform: 'uppercase', lineHeight: 1 }}>Research Operations</h1>
                    <p style={{ fontFamily: BD, fontSize: 14, color: '#7A7F8A', marginTop: 8 }}>Deep intelligence workflows and historical analysis.</p>
                </div>
                <motion.button whileHover={{ boxShadow: '0 0 26px rgba(255,122,41,0.32)', borderColor: 'rgba(255,122,41,0.65)' }} whileTap={{ scale: 0.97 }}
                    onClick={() => setModal(true)}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 22px', borderRadius: 12, background: 'linear-gradient(145deg,#1E2024,#151719)', border: '1px solid rgba(255,122,41,0.48)', color: '#FF7A29', fontFamily: H, fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', cursor: 'pointer', boxShadow: '0 0 14px rgba(255,122,41,0.12)' }}>
                    <Microscope size={13} />OPEN LEAD RESEARCH
                </motion.button>
            </div>

            {/* Stats row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 14 }}>
                {loading ? [1, 2, 3, 4].map(i => (
                    <div key={i} style={{ height: 110, borderRadius: 16, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Loader2 size={20} style={{ color: '#1E2022', animation: 'spin 2s linear infinite' }} />
                    </div>
                )) : stats.map((s, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06, duration: 0.35 }}
                        style={{ borderRadius: 16, padding: '18px 22px', background: 'linear-gradient(145deg,#181A1D,#1E2022)', border: '1px solid rgba(255,255,255,0.06)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                            <div style={{ color: s.color }}>{s.icon}</div>
                            <p style={{ fontFamily: MN, fontSize: 9, color: '#6A6F7A', letterSpacing: '0.16em', textTransform: 'uppercase' }}>{s.label}</p>
                        </div>
                        <p style={{ fontFamily: H, fontSize: 28, fontWeight: 800, color: s.color, letterSpacing: '-0.5px' }}>{s.value}</p>
                    </motion.div>
                ))}
            </div>

            {/* Recent Research Log */}
            <div style={{ borderRadius: 20, background: 'linear-gradient(145deg,#14161A,#1A1C20)', border: '1px solid rgba(255,255,255,0.06)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04), 0 10px 50px rgba(0,0,0,0.5)', overflow: 'hidden' }}>
                <div style={{ height: 2, background: 'linear-gradient(90deg,transparent,rgba(255,122,41,0.5),transparent)' }} />
                <div style={{ padding: '22px 28px 10px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <FlaskConical size={15} style={{ color: '#FF7A29' }} />
                    <p style={{ fontFamily: H, fontSize: 11, fontWeight: 700, color: '#E2E4E9', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Recent Research Log</p>
                    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 99, background: 'rgba(255,122,41,0.07)', border: '1px solid rgba(255,122,41,0.18)' }}>
                        <Clock size={10} style={{ color: '#FF7A29' }} />
                        <span style={{ fontFamily: MN, fontSize: 9, color: '#FF7A29', letterSpacing: '0.12em' }}>{log.length} ENTRIES</span>
                    </div>
                </div>

                <div style={{ padding: '12px 16px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {loading ? (
                        <div style={{ padding: '40px 0', textAlign: 'center' }}>
                            <Loader2 size={24} style={{ color: '#FF7A29', animation: 'spin 1.2s linear infinite' }} />
                        </div>
                    ) : log.length === 0 ? (
                        <div style={{ padding: '60px 0', textAlign: 'center' }}>
                            <p style={{ fontFamily: MN, fontSize: 10, color: '#4A4F5A', letterSpacing: '0.15em' }}>NO RESEARCH HISTORY FOUND</p>
                        </div>
                    ) : (
                        <AnimatePresence initial={false}>
                            {log.map((entry, i) => {
                                const ss = STATUS_STYLE[entry.status] || STATUS_STYLE.complete;
                                return (
                                    <motion.div key={entry.id + i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                                        style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', borderRadius: 14, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', cursor: 'default' }}>
                                        {/* Avatar */}
                                        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#2A2D32,#1E2024)', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            <span style={{ fontFamily: H, fontSize: 10, fontWeight: 700, color: '#FF7A29' }}>{entry.initials}</span>
                                        </div>
                                        {/* Lead info */}
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <p style={{ fontFamily: BD, fontSize: 13, fontWeight: 600, color: '#E2E4E9' }}>{entry.leadName} <span style={{ color: '#6A6F7A', fontWeight: 400 }}>· {entry.company}</span></p>
                                            <p style={{ fontFamily: BD, fontSize: 12, color: '#6A6F7A', marginTop: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{entry.insight || 'Deep intelligence report generated.'}</p>
                                        </div>
                                        {/* Score */}
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 99, background: ss.bg, border: `1px solid ${ss.color}22` }}>
                                                <span style={{ fontFamily: MN, fontSize: 9, color: ss.color, letterSpacing: '0.12em' }}>{ss.label}</span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <span style={{ fontFamily: MN, fontSize: 9, color: '#4A4F5A', letterSpacing: '0.1em' }}>{entry.date}</span>
                                                <span style={{ fontFamily: H, fontSize: 11, fontWeight: 700, color: entry.score >= 80 ? '#4BE77F' : entry.score >= 60 ? '#FF7A29' : '#6A6F7A' }}>{entry.score}</span>
                                            </div>
                                        </div>
                                        {/* View button */}
                                        <motion.button whileHover={{ borderColor: 'rgba(255,122,41,0.45)', color: '#FF7A29' }} whileTap={{ scale: 0.93 }}
                                            onClick={() => navigate(`/research/${entry.id}`)}
                                            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', color: '#7A7F8A', fontFamily: H, fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', cursor: 'pointer', flexShrink: 0, transition: 'all 0.18s' }}>
                                            VIEW <ArrowRight size={10} />
                                        </motion.button>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    )}
                </div>
            </div>

            {/* Lead picker modal */}
            <AnimatePresence>{modal && <LeadPickerModal onClose={() => setModal(false)} />}</AnimatePresence>
        </div>
    );
};
