import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Zap, Activity, BarChart2, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { AnalyticsEvent } from '../../lib/supabase';

const H = 'JetBrains Mono, monospace';
const BD = 'Inter, sans-serif';
const MN = 'JetBrains Mono, monospace';

// ─── Reusable Phoenix card shell ──────────────────────────────────────────────
const Card: React.FC<{ children: React.ReactNode; style?: React.CSSProperties; className?: string }> = ({ children, style, className }) => (
    <div className={className} style={{ borderRadius: 16, background: 'linear-gradient(145deg,#181A1D,#202226)', border: '1px solid rgba(255,255,255,0.06)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04),0 4px 20px rgba(0,0,0,0.4)', ...style }}>
        {children}
    </div>
);

// ─── KPI strip shape ──────────────────────────────────────────────────────────
const KPI_SHAPE = [
    { label: 'Total Leads', sub: 'All time', icon: Users, color: '#FF7A29', key: 'leads' },
    { label: 'Active Deals', sub: 'In pipeline', icon: Zap, color: '#FF7A29', key: 'deals' },
    { label: 'Avg Lead Score', sub: 'Quality Index', icon: TrendingUp, color: '#FF7A29', key: 'score' },
    { label: 'Closed Won', sub: 'Deals closed', icon: Activity, color: '#4BE77F', key: 'won' },
];

// ─── Line chart (revenue) ─────────────────────────────────────────────────────
const REV = [42, 58, 51, 70, 65, 83, 78, 91, 87, 95, 88, 101];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const W = 480; const CH = 120;
const pts = REV.map((v, i) => ({ x: (i / (REV.length - 1)) * (W - 32) + 16, y: CH - 16 - ((v - 40) / (101 - 40)) * (CH - 32) }));
const pStr = pts.map(p => `${p.x},${p.y}`).join(' ');
const aStr = `${pts[0].x},${CH} ${pStr} ${pts[pts.length - 1].x},${CH}`;

// ─── Bar chart (pipeline) ─────────────────────────────────────────────────────
const PIPELINE = [{ l: 'New', v: 12 }, { l: 'Contacted', v: 19 }, { l: 'Qualifying', v: 8 }, { l: 'Proposal', v: 5 }, { l: 'Closed', v: 4 }];
const maxPipe = 19;

// ─── Radial chart (efficiency) ────────────────────────────────────────────────
const AGENTS_EFF = [{ name: 'Spectre', pct: 98 }, { name: 'Ghost', pct: 92 }, { name: 'Phantom', pct: 85 }, { name: 'Mirage', pct: 100 }, { name: 'Shadow', pct: 12 }, { name: 'Wraith', pct: 0 }];
const polarPath = (pct: number, r: number, cx: number, cy: number) => {
    const a = (pct / 100) * Math.PI * 2 - Math.PI / 2;
    const x = cx + r * Math.cos(a); const y = cy + r * Math.sin(a);
    const large = pct > 50 ? 1 : 0;
    if (pct >= 100) return `M${cx},${cy - r} A${r},${r} 0 1 1 ${cx - 0.01},${cy - r} Z`;
    return `M${cx},${cy - r} A${r},${r} 0 ${large} 1 ${x},${y}`;
};

// ─── Heatmap ──────────────────────────────────────────────────────────────────
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const HOURS = ['6am', '9am', '12pm', '3pm', '6pm', '9pm'];
const heatData = Array.from({ length: 7 }, () => Array.from({ length: 6 }, () => Math.floor(Math.random() * 100)));

// ─── Time helper ──────────────────────────────────────────────────────────────
function timeAgo(ts: string): string {
    const diff = Date.now() - new Date(ts).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return 'Just now';
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
}

// ─── ANALYTICS PAGE ───────────────────────────────────────────────────────────
export const Analytics: React.FC = () => {
    const [kpiValues, setKpiValues] = useState<Record<string, string>>({});
    const [signals, setSignals] = useState<AnalyticsEvent[]>([]);
    const [pipeline, setPipeline] = useState<{ l: string; v: number }[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            const [leadsRes, dealsRes, signalsRes] = await Promise.all([
                supabase.from('leads').select('score, status'),
                supabase.from('crm_deals').select('column_id'),
                supabase.from('analytics_events').select('*').order('created_at', { ascending: false }).limit(6),
            ]);
            const leads = leadsRes.data ?? [];
            const deals = dealsRes.data ?? [];
            const avgScore = leads.length > 0
                ? Math.round(leads.reduce((s, l) => s + (l.score ?? 0), 0) / leads.length)
                : 0;
            const wonCount = deals.filter(d => d.column_id === 'won').length;
            setKpiValues({
                leads: String(leads.length),
                deals: String(deals.length),
                score: `${avgScore} / 100`,
                won: String(wonCount),
            });
            // Build pipeline bar data from crm_deals
            const stageCounts: Record<string, number> = {};
            deals.forEach(d => { stageCounts[d.column_id] = (stageCounts[d.column_id] ?? 0) + 1; });
            const STAGE_LABELS: Record<string, string> = { new: 'New', qualifying: 'Qualifying', proposal: 'Proposal', negotiation: 'Negotiation', won: 'Won' };
            setPipeline(Object.entries(stageCounts).map(([k, v]) => ({ l: STAGE_LABELS[k] ?? k, v })));
            setSignals(signalsRes.data ?? []);
            setLoading(false);
        };
        load();
    }, []);

    const maxPipe = Math.max(...pipeline.map(p => p.v), 1);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

            {/* Header */}
            <div>
                <p style={{ fontFamily: MN, fontSize: 9, letterSpacing: '0.3em', color: '#7A7F8A', textTransform: 'uppercase', marginBottom: 10 }}>// Intelligence Suite · Real-time</p>
                <h1 style={{ fontFamily: H, fontSize: 'clamp(28px,4vw,40px)', fontWeight: 800, color: '#FFF', letterSpacing: '-0.5px', textTransform: 'uppercase', lineHeight: 1, marginBottom: 8 }}>Analytics Suite</h1>
                <p style={{ fontFamily: BD, fontSize: 14, color: '#7A7F8A' }}>Performance, revenue, agents & pipeline intelligence.</p>
            </div>

            {/* KPI strip */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                {KPI_SHAPE.map((k, i) => (
                    <motion.div key={k.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06, duration: 0.35 }}>
                        <Card style={{ padding: 22 }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                                <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <k.icon size={14} style={{ color: '#7A7F8A' }} />
                                </div>
                                <div style={{ width: 7, height: 7, borderRadius: '50%', background: k.color, boxShadow: `0 0 7px ${k.color}` }} />
                            </div>
                            {loading
                                ? <Loader2 size={16} style={{ color: '#3A3F4A', animation: 'spin 1s linear infinite', marginBottom: 10 }} />
                                : <p style={{ fontFamily: BD, fontSize: 'clamp(22px,3vw,30px)', fontWeight: 800, color: '#FFF', letterSpacing: '-0.03em', marginBottom: 6 }}>{kpiValues[k.key] ?? '—'}</p>
                            }
                            <p style={{ fontFamily: BD, fontSize: 11, color: '#5A5F69' }}>{k.label}</p>
                            <p style={{ fontFamily: MN, fontSize: 9, letterSpacing: '0.14em', color: '#7A7F8A', marginTop: 2 }}>{k.sub}</p>
                        </Card>
                    </motion.div>
                ))}
            </div>
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>

            {/* Charts row 1: Line + Bar */}
            <div className="grid grid-cols-1 lg:grid-cols-7 gap-5">
                {/* Revenue line chart */}
                <Card className="lg:col-span-4" style={{ padding: 28 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <TrendingUp size={13} style={{ color: '#FF7A29' }} />
                            <span style={{ fontFamily: H, fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', color: '#FFF', textTransform: 'uppercase' }}>Revenue Trend</span>
                        </div>
                        <span style={{ fontFamily: MN, fontSize: 9, color: '#7A7F8A', letterSpacing: '0.14em' }}>YTD 2026</span>
                    </div>
                    <svg viewBox={`0 0 ${W} ${CH}`} width="100%" style={{ overflow: 'visible' }}>
                        <defs>
                            <linearGradient id="rev-grad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="rgba(255,122,41,0.3)" />
                                <stop offset="100%" stopColor="rgba(255,122,41,0)" />
                            </linearGradient>
                            <filter id="line-glow"><feGaussianBlur stdDeviation="1.5" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
                        </defs>
                        {/* Grid lines */}
                        {[0, 25, 50, 75, 100].map((_, i) => <line key={i} x1="16" x2={W - 16} y1={CH - 16 - i * (CH - 32) / 4} y2={CH - 16 - i * (CH - 32) / 4} stroke="rgba(255,255,255,0.045)" strokeWidth="1" />)}
                        {/* Area fill */}
                        <motion.polygon points={aStr} fill="url(#rev-grad)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2 }} />
                        {/* Line */}
                        <motion.polyline points={pStr} fill="none" stroke="rgba(255,122,41,0.9)" strokeWidth="2" filter="url(#line-glow)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.6, ease: 'easeOut' }} />
                        {/* Dots */}
                        {pts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={3} fill="#FF7A29" stroke="#1A1C1F" strokeWidth="1.5" />)}
                        {/* X labels */}
                        {MONTHS.map((m, i) => <text key={m} x={pts[i].x} y={CH + 4} textAnchor="middle" style={{ fontFamily: MN, fontSize: 8, fill: '#5A5F69' }}>{m}</text>)}
                    </svg>
                </Card>

                {/* Pipeline bar chart */}
                <Card className="lg:col-span-3" style={{ padding: 28 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
                        <BarChart2 size={13} style={{ color: '#FF7A29' }} />
                        <span style={{ fontFamily: H, fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', color: '#FFF', textTransform: 'uppercase' }}>Pipeline Distribution</span>
                    </div>
                    {pipeline.length === 0 && !loading && (
                        <p style={{ fontFamily: BD, fontSize: 12, color: '#3A3F4A', marginTop: 8 }}>No deal data yet.</p>
                    )}
                    {pipeline.map((p, i) => (
                        <div key={p.l} style={{ marginBottom: 14 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                                <span style={{ fontFamily: BD, fontSize: 11, color: '#9CA0A8' }}>{p.l}</span>
                                <span style={{ fontFamily: BD, fontSize: 11, fontWeight: 700, color: '#E2E4E9' }}>{p.v}</span>
                            </div>
                            <div style={{ height: 6, borderRadius: 99, background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
                                <motion.div style={{ height: '100%', borderRadius: 99, background: 'linear-gradient(90deg,#D95B16,#FF7A29,#FFA057)' }} initial={{ width: 0 }} animate={{ width: `${(p.v / maxPipe) * 100}%` }} transition={{ duration: 0.9, ease: 'easeOut', delay: i * 0.08 }} />
                            </div>
                        </div>
                    ))}
                </Card>
            </div>

            {/* Charts row 2: Radial + Heatmap */}
            <div className="grid grid-cols-1 lg:grid-cols-7 gap-5">
                {/* Radial agent efficiency */}
                <Card className="lg:col-span-3" style={{ padding: 28, maxHeight: 300, overflow: 'hidden' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                        <Activity size={13} style={{ color: '#FF7A29' }} />
                        <span style={{ fontFamily: H, fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', color: '#FFF', textTransform: 'uppercase' }}>Agent Efficiency</span>
                    </div>
                    <svg viewBox="0 0 220 180" width="100%">
                        {AGENTS_EFF.map((a, i) => {
                            const r = 22 + i * 14; const cx = 110; const cy = 90;
                            return (
                                <g key={a.name}>
                                    <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
                                    <motion.path d={polarPath(a.pct, r, cx, cy)} fill="none" stroke={`rgba(255,${100 + i * 20},${41 + i * 10},${0.7 - i * 0.08})`} strokeWidth="4" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, delay: i * 0.12, ease: 'easeOut' }} />
                                    <text x={cx + r + 6} y={cy - i * 16.5 + i * 16.5} style={{ fontFamily: MN, fontSize: 7, fill: '#7A7F8A' }}>{a.name} {a.pct}%</text>
                                </g>
                            );
                        })}
                        <text x={110} y={94} textAnchor="middle" style={{ fontFamily: H, fontSize: 8, fill: '#FF7A29' }}>EFFICIENCY</text>
                    </svg>
                </Card>

                {/* Activity heatmap */}
                <Card className="lg:col-span-4" style={{ padding: 28, maxHeight: 300, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                        <Activity size={13} style={{ color: '#FF7A29' }} />
                        <span style={{ fontFamily: H, fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', color: '#FFF', textTransform: 'uppercase' }}>Activity Heatmap</span>
                    </div>
                    <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: `auto repeat(${HOURS.length},1fr)`, gap: 3, flex: 1, overflow: 'hidden' }}>
                            <div />
                            {HOURS.map(h => <span key={h} style={{ fontFamily: MN, fontSize: 7, color: '#5A5F69', textAlign: 'center' }}>{h}</span>)}
                            {DAYS.map((d, di) => (
                                <React.Fragment key={d}>
                                    <span style={{ fontFamily: MN, fontSize: 7, color: '#5A5F69', alignSelf: 'center', paddingRight: 6 }}>{d}</span>
                                    {heatData[di].map((v, hi) => (
                                        <motion.div key={hi} title={`${v}%`} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: (di * 6 + hi) * 0.01 }}
                                            style={{ aspectRatio: '1', borderRadius: 3, background: `rgba(255,122,41,${(v / 100) * 0.75 + 0.02})`, border: '1px solid rgba(255,122,41,0.06)' }} />
                                    ))}
                                </React.Fragment>
                            ))}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10 }}>
                            <span style={{ fontFamily: MN, fontSize: 7, color: '#5A5F69' }}>Low</span>
                            {[0.1, 0.2, 0.35, 0.5, 0.7, 0.9].map(o => <div key={o} style={{ flex: 1, height: 5, borderRadius: 2, background: `rgba(255,122,41,${o})` }} />)}
                            <span style={{ fontFamily: MN, fontSize: 7, color: '#5A5F69' }}>High</span>
                        </div>
                    </div>
                </Card>
            </div>

            {/* System Signals */}
            <div className="grid grid-cols-1 lg:grid-cols-7 gap-5">
                <Card className="lg:col-span-4" style={{ padding: 0, overflow: 'hidden', maxHeight: 340, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 10 }}>
                        <AlertTriangle size={13} style={{ color: '#FF7A29' }} />
                        <span style={{ fontFamily: H, fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', color: '#FFF', textTransform: 'uppercase' }}>System Signals</span>
                    </div>
                    {loading && <div style={{ display: 'flex', justifyContent: 'center', padding: 32 }}><Loader2 size={18} style={{ color: '#3A3F4A', animation: 'spin 1s linear infinite' }} /></div>}
                    {!loading && signals.length === 0 && <p style={{ fontFamily: BD, fontSize: 12, color: '#3A3F4A', padding: '20px 24px' }}>No signals yet. Add rows to analytics_events in Supabase.</p>}
                    {signals.map((s, i) => {
                        const isAlert = s.type === 'alert';
                        const Icon = isAlert ? AlertTriangle : CheckCircle;
                        const color = isAlert ? '#D95B16' : s.type === 'ok' ? '#4BE77F' : '#FF7A29';
                        return (
                            <React.Fragment key={s.id}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '14px 24px' }}>
                                    <Icon size={13} style={{ color, flexShrink: 0, marginTop: 2 }} />
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontFamily: BD, fontSize: 12, color: '#E2E4E9', lineHeight: 1.5 }}>{s.message}</p>
                                    </div>
                                    <span style={{ fontFamily: MN, fontSize: 9, color: '#4A4F5A', whiteSpace: 'nowrap' }}>{timeAgo(s.created_at)}</span>
                                </div>
                                {i < signals.length - 1 && <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.04),transparent)', margin: '0 24px' }} />}
                            </React.Fragment>
                        );
                    })}
                </Card>

                {/* Forecast panel */}
                <Card className="lg:col-span-3" style={{ padding: 28, height: 380, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
                        <TrendingUp size={13} style={{ color: '#FF7A29' }} />
                        <span style={{ fontFamily: H, fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', color: '#FFF', textTransform: 'uppercase' }}>Forecast</span>
                    </div>
                    {[{ l: 'Projected Revenue', v: '$148k', note: 'Next 30d', c: '#FF7A29' }, { l: 'Projected Lead Volume', v: '62 leads', note: 'Next 14d', c: '#FF7A29' }, { l: 'Agent Saturation', v: '78%', note: 'Est. Q2', c: '#D4A017' }, { l: 'Churn Risk Score', v: 'LOW', note: '0.8%', c: '#4BE77F' }].map(({ l, v, note, c }) => (
                        <div key={l} style={{ marginBottom: 20 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                                <span style={{ fontFamily: BD, fontSize: 11, color: '#5A5F69' }}>{l}</span>
                                <span style={{ fontFamily: MN, fontSize: 8, color: '#3A3F4A' }}>{note}</span>
                            </div>
                            <p style={{ fontFamily: BD, fontSize: 22, fontWeight: 800, color: c, letterSpacing: '-0.02em' }}>{v}</p>
                            <div style={{ height: 2, borderRadius: 99, background: 'rgba(255,255,255,0.06)', marginTop: 8 }}>
                                <div style={{ height: '100%', width: '72%', borderRadius: 99, background: `linear-gradient(90deg,${c}44,${c})` }} />
                            </div>
                        </div>
                    ))}
                </Card>
            </div>
        </div>
    );
};
