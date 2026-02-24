import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileDown, CheckCircle2, Loader2, Microscope, Brain, Globe, Target, Shield, TrendingUp, AlertTriangle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Lead } from '../../lib/supabase';

const H = 'JetBrains Mono, monospace';
const BD = 'Inter, sans-serif';
const MN = 'JetBrains Mono, monospace';

// ─── Analysis Stages ──────────────────────────────────────────────────────────
const STAGES = [
    { label: 'Initializing research agent', detail: 'Spinning up Spectre-Research v3.1', ms: 900 },
    { label: 'Profiling LinkedIn presence', detail: 'Scanning 847 profile signals', ms: 1400 },
    { label: 'Analyzing social sentiment', detail: 'Processing 3,200 data points', ms: 1800 },
    { label: 'Extracting buying signals', detail: 'Matching 14 intent patterns', ms: 1600 },
    { label: 'Detecting network graph', detail: 'Mapping 2nd-degree connections', ms: 1200 },
    { label: 'Scoring engagement depth', detail: 'Calibrating propensity model', ms: 1000 },
    { label: 'Compiling research report', detail: 'Generating structured output', ms: 1100 },
];

// ─── Mini Arc Canvas ──────────────────────────────────────────────────────────
const MiniArcCanvas: React.FC<{ progress: number }> = ({ progress }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animRef = useRef<number>(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const W = 320, H_C = 220;

        const draw = (t: number) => {
            ctx.clearRect(0, 0, W, H_C);
            const cx = 40, cy = H_C / 2, r = 80;
            const pulse = 0.55 + 0.45 * Math.sin(t * 0.0016);

            // Bg glow
            const rg = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 1.5);
            rg.addColorStop(0, 'rgba(255,122,41,0.08)');
            rg.addColorStop(1, 'transparent');
            ctx.fillStyle = rg; ctx.beginPath(); ctx.arc(cx, cy, r * 1.5, 0, Math.PI * 2); ctx.fill();

            // Orbit ring
            ctx.save(); ctx.strokeStyle = 'rgba(255,122,41,0.07)'; ctx.lineWidth = 1; ctx.setLineDash([3, 9]);
            ctx.beginPath(); ctx.arc(cx, cy, r * 0.7, 0, Math.PI * 2); ctx.stroke(); ctx.restore();

            // Outer glow arc
            ctx.save(); ctx.shadowColor = '#FF7A29'; ctx.shadowBlur = 22 * pulse;
            ctx.strokeStyle = `rgba(255,122,41,${0.15 * pulse})`; ctx.lineWidth = 18;
            ctx.beginPath(); ctx.arc(cx, cy, r, -Math.PI / 2, Math.PI / 2); ctx.stroke(); ctx.restore();

            // Mid arc
            ctx.save(); ctx.shadowColor = '#FF7A29'; ctx.shadowBlur = 10 * pulse;
            ctx.strokeStyle = `rgba(255,122,41,${0.4 * pulse})`; ctx.lineWidth = 5;
            ctx.beginPath(); ctx.arc(cx, cy, r, -Math.PI / 2, Math.PI / 2); ctx.stroke(); ctx.restore();

            // Core arc gradient
            const grad = ctx.createLinearGradient(cx, cy - r, cx, cy + r);
            grad.addColorStop(0, 'rgba(255,122,41,0)');
            grad.addColorStop(0.3, `rgba(255,122,41,${0.9 * pulse})`);
            grad.addColorStop(0.7, `rgba(255,200,80,${0.9 * pulse})`);
            grad.addColorStop(1, 'rgba(255,122,41,0)');
            ctx.save(); ctx.strokeStyle = grad; ctx.lineWidth = 2; ctx.lineCap = 'round';
            ctx.beginPath(); ctx.arc(cx, cy, r, -Math.PI / 2, Math.PI / 2); ctx.stroke(); ctx.restore();

            // Particles
            for (let i = 0; i < 6; i++) {
                const angle = (t * 0.0005 + i * 1.05) % (Math.PI * 2);
                const pr = 28 + (i % 3) * 26;
                const px = cx + Math.cos(angle) * pr;
                const py = cy + Math.sin(angle) * pr;
                const a = 0.1 + 0.25 * Math.sin(t * 0.002 + i * 1.3);
                ctx.beginPath(); ctx.arc(px, py, 1.5, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255,122,41,${a})`; ctx.fill();
            }

            // Signal waves (progress-dependent quantity)
            const waveCount = Math.max(1, Math.round((progress / 100) * 5));
            for (let w = 0; w < waveCount; w++) {
                const phase = ((t * 0.0003 + w * 0.2) % 1);
                const wAlpha = 0.55 * Math.sin(phase * Math.PI);
                const emitY = cy + (w - (waveCount - 1) / 2) * 30;
                const emitAngle = Math.asin(Math.max(-1, Math.min(1, (emitY - cy) / r)));
                const emitX = cx + Math.cos(emitAngle) * r;
                const tx = W - 20;
                const tay = emitY;
                const steps = 20;
                ctx.beginPath();
                for (let s = 0; s <= steps; s++) {
                    const tt = s / steps;
                    const sx2 = emitX + (tx - emitX) * tt;
                    const sy2 = emitY + (tay - emitY) * tt;
                    s === 0 ? ctx.moveTo(sx2, sy2) : ctx.lineTo(sx2, sy2);
                }
                ctx.strokeStyle = `rgba(255,122,41,${wAlpha * 0.5})`;
                ctx.lineWidth = 1; ctx.stroke();

                // Pulse dot
                const pdx = emitX + (tx - emitX) * phase;
                const pdy = emitY;
                const grd = ctx.createRadialGradient(pdx, pdy, 0, pdx, pdy, 5);
                grd.addColorStop(0, `rgba(255,122,41,${wAlpha})`);
                grd.addColorStop(1, 'transparent');
                ctx.beginPath(); ctx.arc(pdx, pdy, 5, 0, Math.PI * 2);
                ctx.fillStyle = grd; ctx.fill();
            }

            animRef.current = requestAnimationFrame(draw);
        };

        animRef.current = requestAnimationFrame(draw);
        return () => cancelAnimationFrame(animRef.current);
    }, [progress]);

    return <canvas ref={canvasRef} width={320} height={220} style={{ width: 320, height: 220, display: 'block' }} />;
};

// ─── Report Section ───────────────────────────────────────────────────────────
interface ReportSection { icon: React.ReactNode; title: string; score?: number; scoreColor?: string; body: string }
const REPORT_SECTIONS = (name: string, company: string): ReportSection[] => [
    {
        icon: <Brain size={14} />, title: 'Executive Overview',
        body: `${name} at ${company} represents a high-priority engagement opportunity. Initial profiling surfaces strong alignment with our ICP across multiple vectors. Decision-making authority is confirmed via LinkedIn title analysis and network triangulation.`,
    },
    {
        icon: <Globe size={14} />, title: 'Digital Footprint & Sentiment', score: 78, scoreColor: '#FF7A29',
        body: `Social sentiment index: 78/100. Twitter engagement rate above industry average (4.2% vs 1.8%). LinkedIn posts skew toward operational efficiency and tech adoption themes — strong alignment with our value proposition. No negative press signals detected.`,
    },
    {
        icon: <Target size={14} />, title: 'Buying Intent Signals', score: 91, scoreColor: '#4BE77F',
        body: `HIGH INTENT DETECTED. Signals: (1) Viewed competitor pricing pages 3× in last 14 days. (2) Downloaded two industry reports on automation ROI. (3) Company posted a role for "Head of RevOps" — signal of scaling phase. (4) Engaged with our LinkedIn content twice this week.`,
    },
    {
        icon: <TrendingUp size={14} />, title: 'Network & Influence Graph', score: 65, scoreColor: '#7A9FFF',
        body: `2nd-degree connections: 14 mutual contacts across target accounts. Influencer reach score: 65. Key broker nodes identified within Series B SaaS ecosystem. Warm intro paths available via 3 existing clients.`,
    },
    {
        icon: <Shield size={14} />, title: 'Risk Analysis', score: 22, scoreColor: '#4BE77F',
        body: `Risk score: LOW (22/100). No churn signals, no competitor lock-in detected. Company financials stable — recent Series B funding confirmed ($12M, Q3 last year). Decision timeline estimated at 3–6 weeks based on engagement cadence.`,
    },
    {
        icon: <AlertTriangle size={14} />, title: 'Recommended Action',
        body: `Immediate action recommended. Suggested next step: Send a personalised video loom referencing their recent "RevOps scaling" LinkedIn post + invite to a live demo tailored to their automation gap. Assign to senior AE. Target close date: within 30 days.`,
    },
];

// ─── RESEARCH PAGE ─────────────────────────────────────────────────────────────
export const Research: React.FC = () => {
    const { leadId } = useParams<{ leadId: string }>();
    const navigate = useNavigate();
    const [lead, setLead] = useState<Lead | null>(null);
    const [realResearch, setRealResearch] = useState<any>(null);
    const [stage, setStage] = useState(0);
    const [done, setDone] = useState(false);
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [logs, setLogs] = useState<string[]>([]);
    const logRef = useRef<HTMLDivElement>(null);

    // Fetch lead and research from Supabase by ID
    useEffect(() => {
        if (!leadId) return;
        setLoading(true);
        Promise.all([
            supabase.from('leads').select('*').eq('id', leadId).maybeSingle(),
            supabase.from('research').select('*').eq('lead_id', leadId).maybeSingle()
        ]).then(([{ data: l }, { data: r }]) => {
            setLead(l);
            setRealResearch(r);
            setLoading(false);

            // If research already exists, skip animation and show it
            if (r) {
                setDone(true);
                setProgress(100);
                setLogs([`[${new Date().toLocaleTimeString()}] Analysis loaded from database.`, `  → Verified report found.`]);
            }
        });
    }, [leadId]);

    useEffect(() => {
        let cancelled = false;
        let s = 0, prog = 0;

        const run = async () => {
            if (s >= STAGES.length || cancelled) { if (!cancelled) setDone(true); return; }
            const st = STAGES[s];
            const nextProg = ((s + 1) / STAGES.length) * 100;
            setStage(s);
            setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${st.label}...`]);

            const t0 = performance.now();
            const anim = () => {
                if (cancelled) return;
                const elapsed = performance.now() - t0;
                const t = Math.min(elapsed / st.ms, 1);
                setProgress(prog + (nextProg - prog) * t);
                if (t < 1) requestAnimationFrame(anim);
            };
            requestAnimationFrame(anim);
            await new Promise(r => setTimeout(r, st.ms));
            if (cancelled) return;

            setLogs(prev => [...prev, `  → ${st.detail}`]);
            await new Promise(r => setTimeout(r, 200));
            if (cancelled) return;

            prog = nextProg; s++; run();
        };

        // Short delay before starting
        const tid = setTimeout(run, 400);
        return () => { cancelled = true; clearTimeout(tid); };
    }, []);

    useEffect(() => {
        if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
    }, [logs]);

    const name = lead?.name ?? `Lead ${leadId}`;
    const company = lead?.company ?? 'Unknown Company';

    // Map real research to UI sections if available, else use placeholder logic
    const report = realResearch
        ? [
            { icon: <Brain size={14} />, title: 'Executive Overview', body: realResearch.summary || 'Summary not available.' },
            { icon: <Brain size={14} />, title: 'Deep Intelligence', body: realResearch.research_text || 'No detailed research text found.' },
            { icon: <AlertTriangle size={14} />, title: 'Recommended Action', body: 'Strategic engagement recommended based on profile signals.' }
        ]
        : REPORT_SECTIONS(name, company);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
                <div>
                    <motion.button whileHover={{ color: '#FF7A29', borderColor: 'rgba(255,122,41,0.35)' }} whileTap={{ scale: 0.96 }}
                        onClick={() => navigate('/leads')}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 16px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: '#7A7F8A', fontFamily: H, fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', cursor: 'pointer', marginBottom: 18, transition: 'all 0.2s' }}>
                        <ArrowLeft size={11} />BACK TO LEADS
                    </motion.button>
                    <p style={{ fontFamily: MN, fontSize: 9, letterSpacing: '0.3em', color: '#7A7F8A', textTransform: 'uppercase', marginBottom: 10 }}>// Deep Intelligence · {lead?.id ?? leadId}</p>
                    <h1 style={{ fontFamily: H, fontSize: 'clamp(28px,4vw,40px)', fontWeight: 800, color: '#FFF', letterSpacing: '-0.5px', textTransform: 'uppercase', lineHeight: 1 }}>Research Operations</h1>
                    <p style={{ fontFamily: BD, fontSize: 14, color: '#7A7F8A', marginTop: 8 }}>Deep intelligence analysis for <strong style={{ color: '#D0D3DA' }}>{name}</strong> · {company}</p>
                </div>
                {done && (
                    <motion.button initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        whileHover={{ boxShadow: '0 0 26px rgba(255,122,41,0.32)' }} whileTap={{ scale: 0.97 }}
                        style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 22px', borderRadius: 12, background: 'linear-gradient(145deg,#1E2024,#151719)', border: '1px solid rgba(255,122,41,0.48)', color: '#FF7A29', fontFamily: H, fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', cursor: 'pointer', boxShadow: '0 0 14px rgba(255,122,41,0.12)' }}>
                        <FileDown size={13} />DOWNLOAD REPORT
                    </motion.button>
                )}
            </div>

            {/* Analysis card */}
            <div style={{ borderRadius: 20, background: 'linear-gradient(145deg,#14161A,#1A1C20)', border: '1px solid rgba(255,255,255,0.06)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04), 0 10px 50px rgba(0,0,0,0.6)', overflow: 'hidden' }}>
                {/* Top accent */}
                <div style={{ height: 2, background: 'linear-gradient(90deg,transparent,rgba(255,122,41,0.6),transparent)' }} />

                <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', minHeight: 220 }}>
                    {/* Left: mini arc canvas */}
                    <div style={{ position: 'relative', borderRight: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center' }}>
                        <MiniArcCanvas progress={progress} />
                        {/* Status badge */}
                        <div style={{ position: 'absolute', bottom: 16, left: 16, right: 16, display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 10, background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(8px)' }}>
                            {done
                                ? <CheckCircle2 size={12} style={{ color: '#4BE77F', flexShrink: 0 }} />
                                : <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}><Loader2 size={12} style={{ color: '#FF7A29', flexShrink: 0 }} /></motion.div>}
                            <span style={{ fontFamily: MN, fontSize: 9, color: done ? '#4BE77F' : '#FF7A29', letterSpacing: '0.14em', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {done ? 'ANALYSIS COMPLETE' : STAGES[Math.min(stage, STAGES.length - 1)].label.toUpperCase()}
                            </span>
                        </div>
                    </div>

                    {/* Right: log + progress */}
                    <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {/* Progress */}
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                <span style={{ fontFamily: MN, fontSize: 9, letterSpacing: '0.22em', color: '#7A7F8A', textTransform: 'uppercase' }}>Analysis Progress</span>
                                <span style={{ fontFamily: MN, fontSize: 9, color: done ? '#4BE77F' : '#FF7A29', letterSpacing: '0.1em' }}>{Math.round(progress)}%</span>
                            </div>
                            <div style={{ height: 5, borderRadius: 99, background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
                                <motion.div animate={{ width: `${progress}%` }} transition={{ ease: 'easeOut', duration: 0.4 }}
                                    style={{ height: '100%', borderRadius: 99, background: done ? 'linear-gradient(90deg,#4BE77F,#2EC77F)' : 'linear-gradient(90deg,#D95B16,#FF7A29,#FFAA60)', boxShadow: done ? '0 0 8px rgba(75,231,127,0.5)' : '0 0 10px rgba(255,122,41,0.5)' }} />
                            </div>
                        </div>

                        {/* Stage pills */}
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                            {STAGES.map((s, i) => {
                                const state = done ? 'done' : i < stage ? 'done' : i === stage ? 'active' : 'pending';
                                return (
                                    <div key={i} style={{
                                        display: 'flex', alignItems: 'center', gap: 6, padding: '5px 10px', borderRadius: 99,
                                        background: state === 'active' ? 'rgba(255,122,41,0.1)' : state === 'done' ? 'rgba(75,231,127,0.06)' : 'rgba(255,255,255,0.03)',
                                        border: `1px solid ${state === 'active' ? 'rgba(255,122,41,0.3)' : state === 'done' ? 'rgba(75,231,127,0.2)' : 'rgba(255,255,255,0.05)'}`
                                    }}>
                                        {state === 'done'
                                            ? <CheckCircle2 size={9} style={{ color: '#4BE77F' }} />
                                            : state === 'active'
                                                ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}><Loader2 size={9} style={{ color: '#FF7A29' }} /></motion.div>
                                                : <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />}
                                        <span style={{ fontFamily: MN, fontSize: 8, letterSpacing: '0.1em', color: state === 'active' ? '#FF7A29' : state === 'done' ? '#4BE77F' : '#3A3F4A' }}>{s.label}</span>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Live log */}
                        <div ref={logRef}
                            style={{ flex: 1, minHeight: 90, maxHeight: 130, overflowY: 'auto', borderRadius: 10, background: '#0D0E10', border: '1px solid rgba(255,255,255,0.05)', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <AnimatePresence initial={false}>
                                {logs.map((line, i) => (
                                    <motion.p key={i} initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.15 }}
                                        style={{ fontFamily: MN, fontSize: 9, color: line.startsWith('  →') ? '#4BE77F' : '#FF7A29', letterSpacing: '0.08em', lineHeight: 1.7, whiteSpace: 'pre' }}>
                                        {line}
                                    </motion.p>
                                ))}
                            </AnimatePresence>
                            {!done && (
                                <motion.span animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 1, repeat: Infinity }}
                                    style={{ fontFamily: MN, fontSize: 9, color: '#4A4F5A' }}>█</motion.span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Research Report — revealed after completion */}
            <AnimatePresence>
                {done && (
                    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,122,41,0.1)', border: '1px solid rgba(255,122,41,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Microscope size={16} style={{ color: '#FF7A29' }} />
                            </div>
                            <div>
                                <p style={{ fontFamily: MN, fontSize: 9, letterSpacing: '0.22em', color: '#7A7F8A', textTransform: 'uppercase' }}>// Output · Research Document</p>
                                <p style={{ fontFamily: H, fontSize: 16, fontWeight: 800, color: '#FFF', letterSpacing: '-0.3px' }}>Intelligence Report · {name}</p>
                            </div>
                            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 99, background: 'rgba(75,231,127,0.08)', border: '1px solid rgba(75,231,127,0.22)' }}>
                                <CheckCircle2 size={11} style={{ color: '#4BE77F' }} />
                                <span style={{ fontFamily: MN, fontSize: 9, color: '#4BE77F', letterSpacing: '0.14em' }}>VERIFIED</span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            {report.map((sec, i) => (
                                <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08, duration: 0.35 }}
                                    style={{ borderRadius: 16, padding: '22px 26px', background: 'linear-gradient(145deg,#181A1D,#1E2022)', border: '1px solid rgba(255,255,255,0.06)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <div style={{ color: '#FF7A29' }}>{sec.icon}</div>
                                            <p style={{ fontFamily: H, fontSize: 11, fontWeight: 700, color: '#E2E4E9', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{sec.title}</p>
                                        </div>
                                        {sec.score !== undefined && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <div style={{ width: 80, height: 4, borderRadius: 99, background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
                                                    <motion.div initial={{ width: 0 }} animate={{ width: `${sec.score}%` }} transition={{ delay: i * 0.08 + 0.2, duration: 0.6 }}
                                                        style={{ height: '100%', borderRadius: 99, background: sec.scoreColor }} />
                                                </div>
                                                <span style={{ fontFamily: BD, fontSize: 11, fontWeight: 700, color: sec.scoreColor }}>{sec.score}</span>
                                            </div>
                                        )}
                                    </div>
                                    <p style={{ fontFamily: BD, fontSize: 13, color: '#9CA0A8', lineHeight: 1.75 }}>{sec.body}</p>
                                </motion.div>
                            ))}
                        </div>

                        {/* Footer action */}
                        <div style={{ display: 'flex', justifyContent: 'center', gap: 14, marginTop: 28 }}>
                            <motion.button whileHover={{ borderColor: 'rgba(255,255,255,0.14)' }} whileTap={{ scale: 0.96 }}
                                onClick={() => navigate('/leads')}
                                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 24px', borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', color: '#7A7F8A', fontFamily: H, fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', cursor: 'pointer' }}>
                                <ArrowLeft size={11} />BACK TO LEADS
                            </motion.button>
                            <motion.button whileHover={{ boxShadow: '0 0 28px rgba(255,122,41,0.35)' }} whileTap={{ scale: 0.97 }}
                                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 24px', borderRadius: 12, background: 'linear-gradient(145deg,#1E2024,#151719)', border: '1px solid rgba(255,122,41,0.5)', color: '#FF7A29', fontFamily: H, fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', cursor: 'pointer', boxShadow: '0 0 14px rgba(255,122,41,0.12)' }}>
                                <FileDown size={12} />DOWNLOAD REPORT
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
