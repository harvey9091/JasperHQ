import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, Mail, Database, BookOpen, Cpu, Target, Dumbbell, RefreshCw, MessageSquare, Clock, X, Check, ChevronRight, Zap, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useToast } from '../components/ui/Toast';
import { usePlannerStore, TimeBlock } from '../store/plannerStore';
import { useAgentStatusStore } from '../store/agentStatusStore';

const H = 'JetBrains Mono, monospace';
const BD = 'Inter, sans-serif';
const MN = 'JetBrains Mono, monospace';

// ─── Data ─────────────────────────────────────────────────────────────────────
const CRON_TRIGGERS = [
    { name: 'Lead Harvest', next: 'in 38m', agent: 'Spectre', color: '#FF7A29' },
    { name: 'CRM Sync', next: 'in 12m', agent: 'Ghost', color: '#4BE77F' },
    { name: 'Outreach Blast', next: 'Tomorrow', agent: 'Phantom', color: '#7A9FFF' },
    { name: 'Report Compile', next: 'in 6h', agent: 'Mirage', color: '#A78BFA' },
];

const PLANNER_ICON_MAP: Record<string, React.ReactNode> = {
    video: <Video size={14} />, mail: <Mail size={14} />, database: <Database size={14} />,
    book: <BookOpen size={14} />, cpu: <Cpu size={14} />, target: <Target size={14} />,
    dumbbell: <Dumbbell size={14} />, message: <MessageSquare size={14} />,
};



const FOCUS_PLANS: Record<string, TimeBlock[]> = {
    editing: [
        { time: '8:00', label: 'Raw Footage Review', description: 'Screen and tag clips from yesterday\'s shoot.', type: 'video', color: '#FF7A29', tag: 'CREATIVE' },
        { time: '10:00', label: 'Edit Session A', description: 'Primary edit on current project — cut to music.', type: 'video', color: '#FF7A29', tag: 'CREATIVE' },
        { time: '12:00', label: 'Break + CRM Scan', description: 'Lunch. Quick 10-min CRM update.', type: 'database', color: '#4A4F5A', tag: 'ADMIN' },
        { time: '14:00', label: 'Colour Grade', description: 'Grade scene 1–3 with your base LUT.', type: 'video', color: '#FF7A29', tag: 'CREATIVE' },
        { time: '16:00', label: 'Audio Mix', description: 'Balance levels, add SFX layer, export stems.', type: 'video', color: '#FF7A29', tag: 'CREATIVE' },
        { time: '18:00', label: 'Agent Monitoring', description: 'Check Spectre, Phantom status. Review overnight logs.', type: 'cpu', color: '#7A9FFF', tag: 'OPS' },
    ],
    outreach: [
        { time: '8:00', label: 'Lead Qualification', description: 'Score and filter new leads from Spectre\'s overnight run.', type: 'target', color: '#FF7A29', tag: 'SALES' },
        { time: '10:00', label: 'Email Sequence Build', description: 'Draft 3 personalised outreach emails via Email Gen.', type: 'mail', color: '#FF7A29', tag: 'SALES' },
        { time: '12:00', label: 'Break', description: 'Step away. Reset.', type: 'dumbbell', color: '#4A4F5A', tag: 'BREAK' },
        { time: '14:00', label: 'Prospect Calls', description: 'Block 2h for live calls — only warm leads.', type: 'target', color: '#4BE77F', tag: 'SALES' },
        { time: '16:00', label: 'CRM Deal Updates', description: 'Move deals to correct stages, add call notes.', type: 'database', color: '#7A9FFF', tag: 'ADMIN' },
        { time: '18:00', label: 'Research Prep', description: 'Queue research for tomorrow\'s call leads.', type: 'book', color: '#A78BFA', tag: 'OPS' },
    ],
    business: [
        { time: '8:00', label: 'Morning Review', description: 'Check overnight analytics, revenue dashboard, agent logs.', type: 'database', color: '#7A9FFF', tag: 'STRATEGY' },
        { time: '10:00', label: 'Strategic Planning', description: 'Review weekly OKRs. Update task priorities.', type: 'target', color: '#FF7A29', tag: 'STRATEGY' },
        { time: '12:00', label: 'Team/Partner Calls', description: 'Block for external meetings and collab discussions.', type: 'message', color: '#A78BFA', tag: 'COMMS' },
        { time: '14:00', label: 'Content Creation', description: 'Script or record one business content piece.', type: 'video', color: '#FF7A29', tag: 'CREATIVE' },
        { time: '16:00', label: 'Finance & Admin', description: 'Invoice review, expenses, Stripe reconcile.', type: 'database', color: '#4A4F5A', tag: 'ADMIN' },
        { time: '18:00', label: 'End-of-Day Systems Check', description: 'Agent ops, scheduled crons, pending deals review.', type: 'cpu', color: '#7A9FFF', tag: 'OPS' },
    ],
    fitness: [
        { time: '8:00', label: 'Morning Workout', description: 'Strength or cardio block — non-negotiable.', type: 'dumbbell', color: '#4BE77F', tag: 'FITNESS' },
        { time: '10:00', label: 'Deep Work Session', description: 'Primary project focus — no meetings, no Slack.', type: 'target', color: '#FF7A29', tag: 'FOCUS' },
        { time: '12:00', label: 'Nutrition Break', description: 'Meal prep, eat well. 30-min walk optional.', type: 'dumbbell', color: '#4BE77F', tag: 'HEALTH' },
        { time: '14:00', label: 'Comms & Outreach', description: 'Emails, calls, CRM updates in a contained block.', type: 'mail', color: '#FF7A29', tag: 'SALES' },
        { time: '16:00', label: 'Skills / Learning', description: 'Read, course, or skill-building — 45 min minimum.', type: 'book', color: '#A78BFA', tag: 'GROWTH' },
        { time: '18:00', label: 'Agent Review + Wind Down', description: 'Ops check. Journal. Plan tomorrow. Disconnect by 7PM.', type: 'cpu', color: '#7A9FFF', tag: 'OPS' },
    ],
};

const FOCUS_OPTIONS = [
    { key: 'editing', label: 'Creative Editing', color: '#FF7A29' },
    { key: 'outreach', label: 'Sales Outreach', color: '#4BE77F' },
    { key: 'business', label: 'Business Ops', color: '#7A9FFF' },
    { key: 'fitness', label: 'Health & Focus', color: '#A78BFA' },
] as const;
type Focus = typeof FOCUS_OPTIONS[number]['key'];

// ─── Regenerate Modal ─────────────────────────────────────────────────────────
const RegenModal: React.FC<{ current: Focus; onSelect: (f: Focus) => void; onClose: () => void }> = ({ current, onSelect, onClose }) => {
    React.useEffect(() => {
        const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', fn);
        return () => window.removeEventListener('keydown', fn);
    }, [onClose]);

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(10px)', padding: 24 }}
            onClick={onClose}>
            <motion.div initial={{ scale: 0.94, y: 18 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.94, y: 18 }}
                transition={{ type: 'spring', stiffness: 340, damping: 30 }}
                onClick={e => e.stopPropagation()}
                style={{ width: '100%', maxWidth: 480, borderRadius: 20, background: 'linear-gradient(145deg,#181A1D,#1E2023)', border: '1px solid rgba(255,255,255,0.07)', boxShadow: '0 0 60px rgba(255,122,41,0.12),0 30px 80px rgba(0,0,0,0.7)', overflow: 'hidden' }}>
                <div style={{ height: 2, background: 'linear-gradient(90deg,transparent,rgba(255,122,41,0.7),transparent)' }} />
                <div style={{ padding: '24px 28px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 30, height: 30, borderRadius: 9, background: 'rgba(255,122,41,0.1)', border: '1px solid rgba(255,122,41,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <RefreshCw size={13} style={{ color: '#FF7A29' }} />
                            </div>
                            <p style={{ fontFamily: H, fontSize: 12, fontWeight: 700, color: '#E2E4E9', letterSpacing: '-0.2px' }}>Regenerate Plan</p>
                        </div>
                        <motion.button whileHover={{ background: 'rgba(255,255,255,0.08)' }} whileTap={{ scale: 0.9 }}
                            onClick={onClose} style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7A7F8A' }}>
                            <X size={13} />
                        </motion.button>
                    </div>
                    <p style={{ fontFamily: BD, fontSize: 13, color: '#7A7F8A', marginBottom: 18 }}>Select your primary focus for today and a new optimised schedule will be generated.</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {FOCUS_OPTIONS.map(f => (
                            <motion.button key={f.key} whileHover={{ borderColor: `${f.color}55` }} whileTap={{ scale: 0.97 }}
                                onClick={() => { onSelect(f.key); onClose(); }}
                                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 12, background: current === f.key ? `${f.color}0F` : 'rgba(255,255,255,0.02)', border: `1px solid ${current === f.key ? `${f.color}44` : 'rgba(255,255,255,0.06)'}`, cursor: 'pointer', transition: 'all 0.18s' }}>
                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: f.color, boxShadow: `0 0 8px ${f.color}88` }} />
                                <span style={{ fontFamily: BD, fontSize: 13, fontWeight: 500, color: '#E2E4E9', flex: 1, textAlign: 'left' }}>{f.label}</span>
                                {current === f.key && <Check size={13} style={{ color: f.color }} />}
                            </motion.button>
                        ))}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

// ─── PLANNER PAGE ─────────────────────────────────────────────────────────────
export const Planner: React.FC = () => {
    const toast = useToast();
    const { plan: storePlan, notes: storeNotes, isGenerating, setPlan, setNotes, setIsGenerating } = usePlannerStore();
    const { statuses } = useAgentStatusStore();
    const [focus, setFocus] = useState<Focus>('editing');
    const [modal, setModal] = useState(false);
    const [showDiscordToast, setShowDiscordToast] = useState(false);
    const [livePlan, setLivePlan] = useState<TimeBlock[] | null>(null);
    const [liveCrons, setLiveCrons] = useState<typeof CRON_TRIGGERS | null>(null);
    const [loading, setLoading] = useState(false);
    const [prompt, setPrompt] = useState('');

    const fetchTasks = useCallback(async (currentFocus: Focus) => {
        setLoading(true);
        const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

        // Try to fetch by date + focus
        const { data: byDateFocus } = await supabase
            .from('tasks')
            .select('*')
            .eq('focus', currentFocus)
            .eq('date', today)
            .order('time', { ascending: true });

        // Fallback: fetch by focus only (any date)
        const { data: byFocus } = (byDateFocus && byDateFocus.length > 0)
            ? { data: byDateFocus }
            : await supabase.from('tasks').select('*').eq('focus', currentFocus).order('time', { ascending: true });

        if (byFocus && byFocus.length > 0) {
            const blocks: TimeBlock[] = byFocus.map((t: any) => ({
                time: t.time ?? '–',
                label: t.label ?? 'Task',
                description: t.description ?? '',
                type: t.type ?? 'target',
                color: t.color ?? '#FF7A29',
                tag: t.tag ?? 'TASK',
            }));
            setLivePlan(blocks);
        } else {
            setLivePlan(null); // triggers static fallback
        }

        // Fetch recent operations from agent_operations_log (monitor_logs 404s)
        const { data: logData } = await supabase
            .from('agent_operations_log')
            .select('sender, recipient, message_summary, created_at')
            .order('created_at', { ascending: false })
            .limit(4);

        if (logData && logData.length > 0) {
            const CRON_COLORS = ['#FF7A29', '#4BE77F', '#7A9FFF', '#A78BFA'];
            setLiveCrons(logData.map((r: any, i: number) => ({
                name: r.message_summary || 'Operation',
                next: r.created_at ? new Date(r.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : '–',
                agent: r.recipient || '–',
                color: CRON_COLORS[i % CRON_COLORS.length],
            })));
        } else {
            setLiveCrons(null); // triggers static fallback
        }

        setLoading(false);
    }, []);

    useEffect(() => { fetchTasks(focus); }, [focus, fetchTasks]);

    const handleGenerate = async () => {
        if (!prompt) return;
        setIsGenerating(true);
        try {
            const luffySession = useAgentStatusStore.getState().luffySessionKey;
            if (!luffySession) {
                toast.error('Luffy session not ready');
                setIsGenerating(false);
                return;
            }

            console.log(`[Planner] Triggering Luffy via RPC...`, { luffySession, prompt, focus });

            const { invokeAgentRpc } = await import('../lib/openclawRpc');
            const data = await invokeAgentRpc(luffySession, `Generate a structured daily plan in JSON format for the focus "${focus}" based on this prompt: ${prompt}`);

            console.log('[Planner] Agent response data:', data);
            const rawOutput = data.output || data;
            let finalData = rawOutput;

            if (typeof rawOutput === 'string') {
                try {
                    finalData = JSON.parse(rawOutput);
                } catch (e) {
                    console.warn('Failed to parse agent output as JSON string', e);
                }
            }

            const planItems = finalData.plan || finalData;
            const notes = finalData.notes || '';

            if (Array.isArray(planItems)) {
                const blocks: TimeBlock[] = planItems.map((t: any) => ({
                    time: t.time ?? '–',
                    label: t.label ?? 'Task',
                    description: t.description ?? '',
                    type: t.type ?? 'target',
                    color: t.color ?? '#FF7A29',
                    tag: t.tag ?? 'TASK',
                }));
                setPlan(blocks);
                setNotes(notes);
                setLivePlan(blocks);
                toast.success('Schedule generated by Luffy');
            } else {
                toast.error('Agent returned an invalid plan format');
            }
        } catch (err) {
            console.error('[Planner] Generation error:', err);
            toast.error('Failed to reach agent');
        } finally {
            setIsGenerating(false);
        }
    };

    const plan = storePlan.length > 0 ? storePlan : (livePlan ?? FOCUS_PLANS[focus] ?? []);
    const crons = liveCrons ?? CRON_TRIGGERS;
    const notes = storeNotes;
    const focusMeta = FOCUS_OPTIONS.find(f => f.key === focus)!;

    const sendDiscord = () => {
        setShowDiscordToast(true);
        setTimeout(() => setShowDiscordToast(false), 2800);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
                <div>
                    <p style={{ fontFamily: MN, fontSize: 9, letterSpacing: '0.3em', color: '#7A7F8A', textTransform: 'uppercase', marginBottom: 10 }}>// Workflow · {new Date().toLocaleDateString('en-GB', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                    <h1 style={{ fontFamily: H, fontSize: 'clamp(28px,4vw,40px)', fontWeight: 800, color: '#FFF', letterSpacing: '-0.5px', textTransform: 'uppercase', lineHeight: 1 }}>Daily Planner</h1>
                    <p style={{ fontFamily: BD, fontSize: 14, color: '#7A7F8A', marginTop: 8 }}>Your structured workflow for today.</p>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                    <div style={{ position: 'relative', width: 340 }}>
                        <input
                            value={prompt}
                            onChange={e => setPrompt(e.target.value)}
                            placeholder="Describe your day and I'll generate a schedule"
                            style={{ width: '100%', padding: '10px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: '#E2E4E9', fontFamily: BD, fontSize: 12, outline: 'none' }}
                        />
                    </div>
                    <motion.button whileHover={{ boxShadow: '0 0 22px rgba(255,122,41,0.28)', borderColor: 'rgba(255,122,41,0.65)' }} whileTap={{ scale: 0.97 }}
                        onClick={handleGenerate}
                        disabled={isGenerating || !prompt}
                        style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 12, background: 'linear-gradient(145deg,#1E2024,#151719)', border: '1px solid rgba(255,122,41,0.48)', color: '#FF7A29', fontFamily: H, fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', cursor: (isGenerating || !prompt) ? 'default' : 'pointer', boxShadow: '0 0 12px rgba(255,122,41,0.1)', opacity: isGenerating ? 0.6 : 1 }}>
                        {isGenerating ? <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} /> : <RefreshCw size={12} />}
                        GENERATE PLAN
                    </motion.button>
                </div>
            </div>

            {/* Focus badge & Notes */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignSelf: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 99, background: `${focusMeta.color}0C`, border: `1px solid ${focusMeta.color}33` }}>
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: focusMeta.color, boxShadow: `0 0 8px ${focusMeta.color}` }} />
                    <span style={{ fontFamily: MN, fontSize: 9, color: focusMeta.color, letterSpacing: '0.16em', textTransform: 'uppercase' }}>Focus Mode · {focusMeta.label}</span>
                </div>

                <AnimatePresence>
                    {notes && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                            style={{ padding: '12px 18px', borderRadius: 12, background: 'rgba(255,122,41,0.05)', border: '1px solid rgba(255,122,41,0.15)', maxWidth: 600 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                <MessageSquare size={12} style={{ color: '#FF7A29' }} />
                                <span style={{ fontFamily: MN, fontSize: 9, color: '#FF7A29', letterSpacing: '0.1em', fontWeight: 700 }}>ZORO'S NOTES</span>
                            </div>
                            <p style={{ fontFamily: BD, fontSize: 13, color: '#D0D3DA', lineHeight: 1.5 }}>{notes}</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Main two-column layout */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20, alignItems: 'start' }}>

                {/* Timeline */}
                <div style={{ borderRadius: 20, background: 'linear-gradient(145deg,#14161A,#1A1C20)', border: '1px solid rgba(255,255,255,0.06)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04), 0 10px 50px rgba(0,0,0,0.5)', overflow: 'hidden' }}>
                    <div style={{ height: 2, background: 'linear-gradient(90deg,transparent,rgba(255,122,41,0.5),transparent)' }} />
                    <div style={{ padding: '20px 24px 6px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Clock size={14} style={{ color: '#FF7A29' }} />
                        <p style={{ fontFamily: H, fontSize: 11, fontWeight: 700, color: '#E2E4E9', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Today's Schedule</p>
                    </div>
                    <div style={{ padding: '16px 24px 24px', position: 'relative' }}>
                        {/* Vertical line */}
                        <div style={{ position: 'absolute', left: 56, top: 16, bottom: 24, width: 1, background: 'linear-gradient(180deg,rgba(255,122,41,0.3),rgba(255,122,41,0.05))' }} />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            {loading ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '18px 0' }}>
                                    <Loader2 size={16} style={{ color: '#FF7A29', animation: 'spin 1s linear infinite' }} />
                                    <span style={{ fontFamily: MN, fontSize: 10, color: '#3A3F4A', letterSpacing: '0.14em' }}>LOADING SCHEDULE…</span>
                                </div>
                            ) : (
                                <AnimatePresence>
                                    {plan.map((block, i) => (
                                        <motion.div key={`${focus}-${i}`}
                                            initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }}
                                            transition={{ delay: i * 0.07, duration: 0.35 }}
                                            style={{ display: 'flex', gap: 16, alignItems: 'flex-start', padding: '14px 0' }}>
                                            {/* Time */}
                                            <p style={{ fontFamily: MN, fontSize: 10, color: '#4A4F5A', letterSpacing: '0.08em', flexShrink: 0, width: 36, paddingTop: 2 }}>{block.time}</p>
                                            {/* Node dot */}
                                            <div style={{ flexShrink: 0, marginTop: 4, position: 'relative', zIndex: 1 }}>
                                                <div style={{ width: 12, height: 12, borderRadius: '50%', background: block.color, boxShadow: `0 0 10px ${block.color}88` }} />
                                            </div>
                                            {/* Content */}
                                            <div style={{ flex: 1, borderRadius: 14, padding: '12px 16px', background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.05)', marginLeft: 4 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                                                    <div style={{ color: block.color }}>{PLANNER_ICON_MAP[block.type ?? ''] ?? <Target size={14} />}</div>
                                                    <p style={{ fontFamily: BD, fontSize: 13, fontWeight: 600, color: '#E2E4E9' }}>{block.label}</p>
                                                    <span style={{ marginLeft: 'auto', fontFamily: MN, fontSize: 8, letterSpacing: '0.14em', color: block.color, padding: '3px 8px', borderRadius: 99, background: `${block.color}10`, border: `1px solid ${block.color}28` }}>{block.tag}</span>
                                                </div>
                                                <p style={{ fontFamily: BD, fontSize: 12, color: '#6A6F7A', lineHeight: 1.65 }}>{block.description}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div style={{ borderRadius: 18, background: 'linear-gradient(145deg,#181A1D,#1E2022)', border: '1px solid rgba(255,255,255,0.06)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)', overflow: 'hidden' }}>
                        <div style={{ height: 2, background: 'linear-gradient(90deg,transparent,rgba(255,122,41,0.4),transparent)' }} />
                        <div style={{ padding: '16px 18px 8px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Cpu size={13} style={{ color: '#FF7A29' }} />
                            <p style={{ fontFamily: H, fontSize: 10, fontWeight: 700, color: '#E2E4E9', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Upcoming Crons</p>
                        </div>
                        <div style={{ padding: '10px 14px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {crons.map((c, i) => (
                                <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 12, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: c.color, boxShadow: `0 0 6px ${c.color}88`, flexShrink: 0 }} />
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p style={{ fontFamily: BD, fontSize: 12, fontWeight: 500, color: '#D0D3DA', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</p>
                                        <p style={{ fontFamily: MN, fontSize: 9, color: '#4A4F5A', letterSpacing: '0.08em' }}>{c.agent} · {c.next}</p>
                                    </div>
                                    <ChevronRight size={11} style={{ color: '#3A3F4A', flexShrink: 0 }} />
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Quick stats */}
                    <div style={{ borderRadius: 18, background: 'linear-gradient(145deg,#181A1D,#1E2022)', border: '1px solid rgba(255,255,255,0.06)', padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Zap size={13} style={{ color: '#FF7A29' }} />
                            <p style={{ fontFamily: H, fontSize: 10, fontWeight: 700, color: '#E2E4E9', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Day Stats</p>
                        </div>
                        {[
                            { label: 'Tasks Planned', val: String(plan.length), color: '#FF7A29' },
                            { label: 'Hours Blocked', val: `${plan.length * 2}h`, color: '#4BE77F' },
                            { label: 'Focus Mode', val: focusMeta.label.split(' ')[0], color: focusMeta.color },
                        ].map((s, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontFamily: BD, fontSize: 12, color: '#6A6F7A' }}>{s.label}</span>
                                <span style={{ fontFamily: H, fontSize: 12, fontWeight: 700, color: s.color }}>{s.val}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Toast */}
            <AnimatePresence>
                {showDiscordToast && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
                        style={{ position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: 10, padding: '12px 22px', borderRadius: 14, background: 'linear-gradient(145deg,#1A1C20,#1E2024)', border: '1px solid rgba(75,231,127,0.28)', boxShadow: '0 0 24px rgba(75,231,127,0.12)', zIndex: 9995 }}>
                        <Check size={13} style={{ color: '#4BE77F' }} />
                        <span style={{ fontFamily: H, fontSize: 10, color: '#4BE77F', letterSpacing: '0.14em' }}>SENT TO DISCORD</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Regen modal */}
            <AnimatePresence>{modal && <RegenModal current={focus} onSelect={f => setFocus(f)} onClose={() => setModal(false)} />}</AnimatePresence>
        </div>
    );
};
