import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Users, TrendingUp, Terminal, Zap, Command, BarChart2, Shield } from 'lucide-react';
import { PhoenixCard } from '../components/ui/PhoenixCard';

// ─── Inline sub-components ──────────────────────────────────────────────────

const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <p
        className="text-[10px] uppercase tracking-[0.3em] mb-3"
        style={{ fontFamily: 'JetBrains Mono, monospace', color: '#7A7F8A' }}
    >
        {children}
    </p>
);

// Shared button style (Phoenix dark-matte with orange glow)
const PhBtn: React.FC<{ children: React.ReactNode; primary?: boolean; icon?: React.ElementType; onClick?: () => void }> = ({
    children, primary = false, icon: Icon, onClick,
}) => (
    <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={onClick}
        className="relative flex items-center gap-2 px-6 py-3 rounded-xl overflow-hidden text-sm font-bold tracking-wide cursor-pointer"
        style={{
            fontFamily: 'Orbitron, sans-serif',
            fontSize: 11,
            letterSpacing: '0.12em',
            background: primary ? 'linear-gradient(145deg, #1C1E22, #131416)' : 'rgba(255,255,255,0.04)',
            border: primary ? '1px solid rgba(255,122,41,0.5)' : '1px solid rgba(255,255,255,0.07)',
            color: primary ? '#FF7A29' : '#7A7F8A',
            boxShadow: primary ? '0 0 18px rgba(255,122,41,0.2), inset 0 1px 0 rgba(255,255,255,0.04)' : 'inset 0 1px 0 rgba(255,255,255,0.03)',
        }}
    >
        {/* Orange trail hover layer */}
        <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            style={{ background: 'linear-gradient(90deg, transparent, rgba(255,122,41,0.08), transparent)' }}
        />
        {/* Top metallic edge */}
        <div className="absolute inset-x-0 top-0 h-px" style={{ background: primary ? 'rgba(255,122,41,0.4)' : 'rgba(255,255,255,0.06)' }} />
        {Icon && <Icon size={14} />}
        <span className="relative">{children}</span>
    </motion.button>
);

// Metric card (Charcoal – Group 1)
interface MetricProps {
    label: string;
    value: string;
    delta: string;
    up: boolean;
    icon: React.ElementType;
    live?: boolean;
}
const MetricCard: React.FC<MetricProps> = ({ label, value, delta, up, icon: Icon, live }) => (
    <PhoenixCard variant="charcoal" glow={live} className="p-8 flex flex-col justify-between min-h-[180px]">
        <div className="flex justify-between items-start mb-5">
            <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
                <Icon size={18} style={{ color: '#7A7F8A' }} />
            </div>
            <div className="flex items-center gap-2">
                {live && (
                    <span
                        className="text-[9px] uppercase tracking-widest"
                        style={{ fontFamily: 'JetBrains Mono, monospace', color: '#FF7A29' }}
                    >
                        Live
                    </span>
                )}
                <div
                    className="w-2 h-2 rounded-full"
                    style={{
                        background: live ? '#FF7A29' : up ? '#FF7A29' : '#2A2D32',
                        boxShadow: (live || up) ? '0 0 6px rgba(255,122,41,0.7)' : undefined,
                        animation: live ? 'pulse 1.5s ease-in-out infinite' : undefined,
                    }}
                />
            </div>
        </div>
        <div>
            <h3
                className="text-[38px] font-black text-white mb-1.5 leading-none"
                style={{ fontFamily: 'Orbitron, sans-serif', letterSpacing: '-0.02em' }}
            >
                {value}
            </h3>
            <div className="flex items-center gap-3">
                <span
                    className="px-2 py-0.5 rounded text-[10px] font-bold"
                    style={{
                        background: up ? 'rgba(255,122,41,0.1)' : 'rgba(255,255,255,0.04)',
                        color: up ? '#FF7A29' : '#7A7F8A',
                        border: up ? '1px solid rgba(255,122,41,0.2)' : '1px solid rgba(255,255,255,0.06)',
                        fontFamily: 'JetBrains Mono, monospace',
                    }}
                >
                    {delta}
                </span>
                <span className="text-[10px] uppercase tracking-widest" style={{ color: '#7A7F8A', fontFamily: 'JetBrains Mono, monospace' }}>
                    {label}
                </span>
            </div>
        </div>
    </PhoenixCard>
);

// Log entry
interface LogEntry { time: string; level: 'INFO' | 'WARN' | 'SUCCESS' | 'ALERT'; msg: string; }
const LOG_COLORS: Record<LogEntry['level'], string> = {
    INFO: '#7A7F8A',
    WARN: '#D4A017',
    SUCCESS: '#E2E4E9',
    ALERT: '#D95B16',
};

// ─── Dashboard ───────────────────────────────────────────────────────────────

const LOGS: LogEntry[] = [
    { time: '10:42:05', level: 'INFO', msg: 'Core system integrity check complete.' },
    { time: '10:41:58', level: 'WARN', msg: 'Latency spike detected in Sector 7.' },
    { time: '10:40:12', level: 'SUCCESS', msg: 'Agent [Spectre-01] optimised route.' },
    { time: '10:38:45', level: 'INFO', msg: 'Database sync initiated.' },
    { time: '10:36:22', level: 'ALERT', msg: 'Unauthorised access attempt blocked.' },
    { time: '10:35:10', level: 'INFO', msg: 'New lead data ingested from CRM.' },
    { time: '10:33:04', level: 'SUCCESS', msg: 'Email campaign dispatched — 312 recipients.' },
];

const BAR_HEIGHTS = [42, 62, 38, 80, 55, 72, 48, 90, 64, 52, 76, 60, 85];

export const Dashboard: React.FC = () => (
    <div className="space-y-8">

        {/* ═══════════════════════════════════════════════════════════
            HERO PANEL — Deep Stone + Dotted + Orange Arc Energy Flow
        ═══════════════════════════════════════════════════════════ */}
        <PhoenixCard
            variant="deep"
            dotted
            className="relative min-h-[360px] flex items-center overflow-hidden px-12 lg:px-20 py-14"
        >
            {/* Orange energy arc paths */}
            <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                preserveAspectRatio="none"
                viewBox="0 0 1200 360"
                aria-hidden
            >
                {/* Primary arc */}
                <motion.path
                    d="M-100,320 C250,320 450,160 750,160 C1050,160 1150,240 1300,260"
                    fill="none"
                    stroke="url(#arcGrad1)"
                    strokeWidth="2.5"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1, x: [0, 3, 0] }}
                    transition={{ pathLength: { duration: 2.5, ease: 'easeOut' }, x: { duration: 9, repeat: Infinity, ease: 'easeInOut' } }}
                />
                {/* Secondary arc */}
                <motion.path
                    d="M-100,355 C300,355 500,200 800,195 C1100,190 1150,275 1300,295"
                    fill="none"
                    stroke="url(#arcGrad2)"
                    strokeWidth="1"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.4 }}
                    transition={{ duration: 3, ease: 'easeOut', delay: 0.2 }}
                />
                {/* Tertiary micro arc */}
                <motion.path
                    d="M-200,290 C200,290 400,140 700,130 C1000,120 1100,220 1400,240"
                    fill="none"
                    stroke="url(#arcGrad2)"
                    strokeWidth="0.7"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.25 }}
                    transition={{ duration: 3.5, ease: 'easeOut', delay: 0.4 }}
                />
                <defs>
                    <linearGradient id="arcGrad1" x1="0" y1="0" x2="1" y2="0" gradientUnits="objectBoundingBox">
                        <stop offset="0%" stopColor="rgba(255,122,41,0)" />
                        <stop offset="40%" stopColor="rgba(255,122,41,0.65)" />
                        <stop offset="70%" stopColor="rgba(255,160,87,0.5)" />
                        <stop offset="100%" stopColor="rgba(255,122,41,0)" />
                    </linearGradient>
                    <linearGradient id="arcGrad2" x1="0" y1="0" x2="1" y2="0" gradientUnits="objectBoundingBox">
                        <stop offset="0%" stopColor="rgba(217,91,22,0)" />
                        <stop offset="50%" stopColor="rgba(217,91,22,0.5)" />
                        <stop offset="100%" stopColor="rgba(217,91,22,0)" />
                    </linearGradient>
                </defs>
            </svg>

            {/* Radial center glow */}
            <div
                className="absolute pointer-events-none"
                style={{
                    top: '20%', left: '30%',
                    width: 400, height: 300,
                    background: 'radial-gradient(ellipse, rgba(255,122,41,0.06) 0%, transparent 70%)',
                    filter: 'blur(40px)',
                }}
            />

            {/* Text content */}
            <motion.div
                className="relative z-10 max-w-2xl"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
            >
                <SectionLabel>// System Online · Alpha-1 · 85% Load Capacity</SectionLabel>

                <h1
                    className="text-white font-black leading-none mb-5"
                    style={{
                        fontFamily: 'Orbitron, sans-serif',
                        fontSize: 'clamp(42px, 6vw, 72px)',
                        letterSpacing: '-0.02em',
                        textShadow: '0 2px 40px rgba(0,0,0,0.6)',
                    }}
                >
                    WELCOME BACK
                </h1>

                <p className="text-base mb-8 leading-relaxed max-w-lg" style={{ color: '#9CA0A8' }}>
                    Command Center operational. Your pipeline has{' '}
                    <span style={{ color: '#FF7A29', fontWeight: 600 }}>48 active leads</span>{' '}
                    and <span style={{ color: '#FFA057' }}>14 agents</span> running at peak efficiency.
                </p>

                <div className="flex flex-wrap gap-4">
                    <PhBtn primary icon={Command}>Initialize</PhBtn>
                    <PhBtn icon={Terminal}>Diagnostics</PhBtn>
                </div>
            </motion.div>
        </PhoenixCard>

        {/* ═══════════════════════════════════════════════════════════
            METRICS ROW — Charcoal Group 1
        ═══════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MetricCard label="Monthly Revenue" value="$124.5k" delta="+12.5%" up icon={BarChart2} />
            <MetricCard label="Active Agents" value="14/20" delta="+2 Deployed" up icon={Users} live />
            <MetricCard label="Lead Pipeline" value="48" delta="Stable" up={false} icon={Activity} />
        </div>

        {/* ═══════════════════════════════════════════════════════════
            BENTO GRID — System Log (Slate) + Voltage (Deep)
        ═══════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* System Activity Log — Slate, Dotted, Group 2 */}
            <PhoenixCard variant="slate" dotted className="lg:col-span-8 overflow-hidden">
                {/* Header strip */}
                <div
                    className="flex items-center justify-between px-7 py-5"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                >
                    <div className="flex items-center gap-3">
                        <Terminal size={15} style={{ color: '#FF7A29' }} />
                        <span
                            className="text-[10px] font-bold uppercase tracking-[0.25em] text-white"
                            style={{ fontFamily: 'Orbitron, sans-serif' }}
                        >
                            System Activity Log
                        </span>
                    </div>
                    {/* LED indicators */}
                    <div className="flex gap-2.5">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#C0392B', boxShadow: '0 0 5px rgba(192,57,43,0.5)' }} />
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#D4A017', boxShadow: '0 0 5px rgba(212,160,23,0.5)' }} />
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#27AE60', boxShadow: '0 0 6px rgba(39,174,96,0.6)' }} />
                    </div>
                </div>

                {/* Log entries */}
                <div className="px-7 py-4 font-mono text-xs space-y-0.5">
                    {LOGS.map((log, i) => (
                        <React.Fragment key={i}>
                            <motion.div
                                className="flex items-center gap-5 py-2.5 group cursor-default rounded-lg px-2 -mx-2 transition-colors"
                                style={{ ':hover': { background: 'rgba(255,255,255,0.02)' } } as React.CSSProperties}
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05, duration: 0.4 }}
                            >
                                <span style={{ color: '#4A4F5A', minWidth: '5rem' }}>{log.time}</span>
                                <span
                                    style={{ color: LOG_COLORS[log.level], minWidth: '4.5rem', fontWeight: 700 }}
                                >
                                    {log.level}
                                </span>
                                <span style={{ color: '#B0B4BC', flex: 1 }}>{log.msg}</span>
                            </motion.div>
                            {/* Orange micro-divider between entries */}
                            {i < LOGS.length - 1 && (
                                <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,122,41,0.1), transparent)' }} />
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </PhoenixCard>

            {/* Voltage / Activity Chart — Deep, Group 3 */}
            <PhoenixCard variant="deep" className="lg:col-span-4 p-7 flex flex-col">
                <div className="flex items-center justify-between mb-6">
                    <span
                        className="text-[10px] font-bold uppercase tracking-[0.25em] text-white"
                        style={{ fontFamily: 'Orbitron, sans-serif' }}
                    >
                        Voltage Load
                    </span>
                    <Zap size={14} style={{ color: '#FF7A29', filter: 'drop-shadow(0 0 6px rgba(255,122,41,0.6))' }} />
                </div>

                {/* Bar chart */}
                <div
                    className="relative flex-1 flex items-end justify-between gap-1.5 p-4 rounded-xl overflow-hidden mb-5"
                    style={{
                        background: 'rgba(0,0,0,0.35)',
                        border: '1px solid rgba(255,255,255,0.05)',
                        boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.4)',
                        minHeight: 140,
                    }}
                >
                    {/* Grid lines */}
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
                            backgroundSize: '1px 25%, 25% 1px',
                        }}
                    />
                    {BAR_HEIGHTS.map((h, i) => (
                        <motion.div
                            key={i}
                            className="flex-1 rounded-sm relative"
                            style={{
                                background: 'linear-gradient(180deg, #FFA057 0%, #FF7A29 50%, #D95B16 100%)',
                                boxShadow: '0 0 8px rgba(255,122,41,0.35)',
                                height: `${h}%`,
                            }}
                            initial={{ scaleY: 0.3, opacity: 0.5 }}
                            animate={{ scaleY: 1, opacity: 1 }}
                            transition={{ duration: 0.5, delay: i * 0.04, repeat: Infinity, repeatType: 'mirror', repeatDelay: 2.5 }}
                        />
                    ))}
                </div>

                {/* Legend */}
                <div
                    className="flex justify-between text-[9px] uppercase tracking-[0.15em]"
                    style={{ fontFamily: 'JetBrains Mono, monospace', color: '#7A7F8A' }}
                >
                    <span>Min: 24 V</span>
                    <span style={{ color: '#FF7A29' }}>Now: 230 V</span>
                    <span>Max: 240 V</span>
                </div>

                {/* Quick stats */}
                <div className="mt-5 space-y-3">
                    {[
                        { label: 'Uptime', val: '99.94%' },
                        { label: 'Requests', val: '12.4k' },
                        { label: 'Avg Resp', val: '48 ms' },
                    ].map(({ label, val }) => (
                        <div key={label} className="flex justify-between items-center">
                            <span className="text-[10px] uppercase tracking-widest" style={{ color: '#7A7F8A', fontFamily: 'JetBrains Mono, monospace' }}>
                                {label}
                            </span>
                            <span className="text-[11px] font-bold" style={{ color: '#E2E4E9', fontFamily: 'JetBrains Mono, monospace' }}>
                                {val}
                            </span>
                        </div>
                    ))}
                </div>
            </PhoenixCard>
        </div>

        {/* ═══════════════════════════════════════════════════════════
            SECONDARY ROW — Security + Pipeline Overview (Slate + Deep)
        ═══════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Security Status — Slate */}
            <PhoenixCard variant="slate" className="p-7">
                <div className="flex items-center gap-3 mb-6">
                    <Shield size={15} style={{ color: '#FF7A29' }} />
                    <span
                        className="text-[10px] font-bold uppercase tracking-[0.25em] text-white"
                        style={{ fontFamily: 'Orbitron, sans-serif' }}
                    >
                        Security Status
                    </span>
                </div>
                <div className="space-y-4">
                    {[
                        { label: 'Threat Level', val: 'LOW', bar: 15, color: '#27AE60' },
                        { label: 'Active Sessions', val: '14', bar: 58, color: '#FF7A29' },
                        { label: 'Blocked Attacks', val: '1,204', bar: 88, color: '#FF7A29' },
                        { label: 'Firewall Health', val: 'OPTIMAL', bar: 97, color: '#FF7A29' },
                    ].map(({ label, val, bar, color }) => (
                        <div key={label}>
                            <div className="flex justify-between items-center mb-1.5">
                                <span className="text-[10px] uppercase tracking-widest" style={{ color: '#7A7F8A', fontFamily: 'JetBrains Mono, monospace' }}>{label}</span>
                                <span className="text-[10px] font-bold" style={{ color, fontFamily: 'JetBrains Mono, monospace' }}>{val}</span>
                            </div>
                            <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                                <motion.div
                                    className="h-full rounded-full"
                                    style={{ background: `linear-gradient(90deg, ${color}88, ${color})` }}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${bar}%` }}
                                    transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </PhoenixCard>

            {/* Pipeline Overview — Deep, Dotted */}
            <PhoenixCard variant="deep" dotted className="p-7">
                <div className="flex items-center gap-3 mb-6">
                    <TrendingUp size={15} style={{ color: '#FF7A29' }} />
                    <span
                        className="text-[10px] font-bold uppercase tracking-[0.25em] text-white"
                        style={{ fontFamily: 'Orbitron, sans-serif' }}
                    >
                        Pipeline Overview
                    </span>
                </div>
                <div className="space-y-3">
                    {[
                        { stage: 'New Leads', count: 12, pct: 25 },
                        { stage: 'Contacted', count: 19, pct: 40 },
                        { stage: 'Qualifying', count: 8, pct: 17 },
                        { stage: 'Proposal', count: 5, pct: 10 },
                        { stage: 'Closed Won', count: 4, pct: 8 },
                    ].map(({ stage, count, pct }, i) => (
                        <div key={stage} className="flex items-center gap-4 group">
                            <span
                                className="text-[10px] uppercase tracking-widest w-24 shrink-0"
                                style={{ color: '#7A7F8A', fontFamily: 'JetBrains Mono, monospace' }}
                            >
                                {stage}
                            </span>
                            <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                                <motion.div
                                    className="h-full rounded-full"
                                    style={{ background: 'linear-gradient(90deg, #D95B16, #FF7A29, #FFA057)' }}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${pct * 4}%` }}
                                    transition={{ duration: 1, ease: 'easeOut', delay: 0.15 * i }}
                                />
                            </div>
                            <span
                                className="text-[11px] font-bold w-6 text-right"
                                style={{ color: '#E2E4E9', fontFamily: 'JetBrains Mono, monospace' }}
                            >
                                {count}
                            </span>
                        </div>
                    ))}
                </div>
            </PhoenixCard>
        </div>
    </div>
);
