import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Users, BarChart2, Terminal, Zap, Command, TrendingUp, Shield } from 'lucide-react';
import { PhoenixCard } from '../components/ui/PhoenixCard';

// ─── Typography helpers ───────────────────────────────────────────────────────
// Heading font  → Orbitron (futuristic tech)
// Numbers/body  → Inter (clean, sharp, readable)

const MonoLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <p className="text-[9px] uppercase tracking-[0.32em] mb-2" style={{ fontFamily: 'JetBrains Mono, monospace', color: '#7A7F8A' }}>
        {children}
    </p>
);

// ─── InlinePh Button ─────────────────────────────────────────────────────────

const PhBtn: React.FC<{
    children: React.ReactNode;
    primary?: boolean;
    icon?: React.ElementType;
}> = ({ children, primary, icon: Icon }) => (
    <motion.button
        whileHover={{ scale: 1.015 }}
        whileTap={{ scale: 0.975 }}
        className="relative flex items-center gap-2 rounded-xl overflow-hidden cursor-pointer"
        style={{
            padding: '10px 22px',
            fontFamily: 'Orbitron, sans-serif',
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.12em',
            background: primary ? 'linear-gradient(145deg, #1E2024, #151719)' : 'rgba(255,255,255,0.04)',
            border: primary ? '1px solid rgba(255,122,41,0.48)' : '1px solid rgba(255,255,255,0.07)',
            color: primary ? '#FF7A29' : '#7A7F8A',
            boxShadow: primary ? '0 0 18px rgba(255,122,41,0.18), inset 0 1px 0 rgba(255,255,255,0.04)' : 'inset 0 1px 0 rgba(255,255,255,0.03)',
        }}
    >
        <span className="absolute inset-x-0 top-0 h-px pointer-events-none" style={{ background: primary ? 'rgba(255,122,41,0.42)' : 'rgba(255,255,255,0.06)' }} />
        {Icon && <Icon size={13} />}
        <span>{children}</span>
    </motion.button>
);

// ─── Metric Card ─────────────────────────────────────────────────────────────

interface MetricProps { label: string; value: string; delta: string; up: boolean; icon: React.ElementType; live?: boolean; }
const MetricCard: React.FC<MetricProps> = ({ label, value, delta, up, icon: Icon, live }) => (
    <PhoenixCard
        variant="charcoal"
        glow={live}
        className="p-8 flex flex-col justify-between"
        style={{ minHeight: 190 }}
    >
        {/* Top row */}
        <div className="flex justify-between items-start mb-4">
            <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
                <Icon size={16} style={{ color: '#7A7F8A' }} />
            </div>
            <div className="flex items-center gap-2">
                {live && (
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: '#FF7A29', letterSpacing: '0.2em' }}>LIVE</span>
                )}
                <div
                    className="rounded-full"
                    style={{
                        width: 7, height: 7,
                        background: up ? '#FF7A29' : '#2A2D32',
                        boxShadow: up ? '0 0 7px rgba(255,122,41,0.7)' : undefined,
                        animation: live ? 'pulse 1.6s ease-in-out infinite' : undefined,
                    }}
                />
            </div>
        </div>

        {/* Value — Inter (clean, sharp number) */}
        <h3
            style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 'clamp(32px, 4vw, 44px)',
                fontWeight: 800,
                color: '#FFFFFF',
                letterSpacing: '-0.03em',
                lineHeight: 1,
                marginBottom: 10,
            }}
        >
            {value}
        </h3>

        {/* Delta + Label */}
        <div className="flex items-center gap-3">
            <span
                className="px-2 py-0.5 rounded"
                style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 10,
                    fontWeight: 700,
                    background: up ? 'rgba(255,122,41,0.1)' : 'rgba(255,255,255,0.04)',
                    color: up ? '#FF7A29' : '#7A7F8A',
                    border: up ? '1px solid rgba(255,122,41,0.22)' : '1px solid rgba(255,255,255,0.06)',
                }}
            >
                {delta}
            </span>
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: '#5A5F69', letterSpacing: '0.01em' }}>{label}</span>
        </div>
    </PhoenixCard>
);

// ─── Log config ───────────────────────────────────────────────────────────────

type LogLevel = 'INFO' | 'WARN' | 'SUCCESS' | 'ALERT';
const LOG_COLORS: Record<LogLevel, string> = {
    INFO: '#7A7F8A',
    WARN: '#D4A017',
    SUCCESS: '#E2E4E9',
    ALERT: '#D95B16',
};
const LOGS: { time: string; level: LogLevel; msg: string }[] = [
    { time: '10:42:05', level: 'INFO', msg: 'Core system integrity check complete.' },
    { time: '10:41:58', level: 'WARN', msg: 'Latency spike detected in Sector 7.' },
    { time: '10:40:12', level: 'SUCCESS', msg: 'Agent [Spectre-01] optimised route.' },
    { time: '10:38:45', level: 'INFO', msg: 'Database sync initiated.' },
    { time: '10:36:22', level: 'ALERT', msg: 'Unauthorised access attempt blocked.' },
    { time: '10:35:10', level: 'INFO', msg: 'New lead data ingested from CRM.' },
    { time: '10:33:04', level: 'SUCCESS', msg: 'Email campaign dispatched — 312 recipients.' },
];

const BAR_HEIGHTS = [42, 62, 38, 80, 55, 72, 48, 90, 64, 52, 76, 60, 85];

// ─── Dashboard ────────────────────────────────────────────────────────────────

export const Dashboard: React.FC = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

        {/* ══════════════════════════════════════════════════
             HERO — deep stone + dotted + arc BELOW text
        ══════════════════════════════════════════════════ */}
        <PhoenixCard
            variant="deep"
            dotted
            className="relative overflow-hidden"
            style={{ minHeight: 340, padding: '52px 64px 48px' }}
        >
            {/* ── Text content (NO arc behind it) ── */}
            <motion.div
                className="relative"
                style={{ zIndex: 2, maxWidth: 560 }}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, ease: 'easeOut' }}
            >
                <MonoLabel>// System Online · Alpha-1 · 85% Load</MonoLabel>

                {/* Main heading — Orbitron (futuristic condensed) */}
                <h1
                    style={{
                        fontFamily: 'Orbitron, sans-serif',
                        fontSize: 'clamp(44px, 6vw, 70px)',
                        fontWeight: 900,
                        color: '#FFFFFF',
                        letterSpacing: '-0.02em',
                        lineHeight: 1,
                        marginBottom: 18,
                        textShadow: '0 2px 32px rgba(0,0,0,0.5)',
                    }}
                >
                    WELCOME BACK
                </h1>

                {/* Sub text — Inter (body) */}
                <p
                    style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: 14,
                        lineHeight: 1.65,
                        color: '#9CA0A8',
                        marginBottom: 28,
                        maxWidth: 440,
                    }}
                >
                    Command Center operational. Your pipeline has{' '}
                    <span style={{ color: '#FF7A29', fontWeight: 600 }}>48 active leads</span>{' '}
                    and <span style={{ color: '#FFA057', fontWeight: 600 }}>14 agents</span> running at peak efficiency.
                </p>

                <div className="flex flex-wrap gap-4">
                    <PhBtn primary icon={Command}>Initialize</PhBtn>
                    <PhBtn icon={Terminal}>Diagnostics</PhBtn>
                </div>
            </motion.div>

            {/* ── ENERGY ARCS — positioned in bottom 40% of card ── */}
            {/* They are absolutely positioned with bottom anchor, so always below text */}
            <div
                className="absolute inset-x-0 pointer-events-none"
                style={{ bottom: 0, height: '45%', zIndex: 1 }}
                aria-hidden
            >
                <svg
                    className="w-full h-full"
                    preserveAspectRatio="none"
                    viewBox="0 0 1200 200"
                >
                    <defs>
                        <linearGradient id="hg1" x1="0" y1="0" x2="1" y2="0" gradientUnits="objectBoundingBox">
                            <stop offset="0%" stopColor="rgba(255,122,41,0)" />
                            <stop offset="35%" stopColor="rgba(255,122,41,0.55)" />
                            <stop offset="70%" stopColor="rgba(255,160,87,0.45)" />
                            <stop offset="100%" stopColor="rgba(255,122,41,0)" />
                        </linearGradient>
                        <linearGradient id="hg2" x1="0" y1="0" x2="1" y2="0" gradientUnits="objectBoundingBox">
                            <stop offset="0%" stopColor="rgba(217,91,22,0)" />
                            <stop offset="50%" stopColor="rgba(217,91,22,0.35)" />
                            <stop offset="100%" stopColor="rgba(217,91,22,0)" />
                        </linearGradient>
                        <filter id="arcBlur">
                            <feGaussianBlur stdDeviation="1.5" />
                        </filter>
                    </defs>

                    {/* Main arc — primary orange */}
                    <motion.path
                        d="M-50,180 C200,180 380,80 650,75 C920,70 1050,130 1250,150"
                        fill="none"
                        stroke="url(#hg1)"
                        strokeWidth="2"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{
                            pathLength: 1,
                            opacity: 1,
                            x: [0, 4, 0],
                        }}
                        transition={{
                            pathLength: { duration: 2.2, ease: [0.4, 0, 0.2, 1] },
                            opacity: { duration: 1 },
                            x: { duration: 9, repeat: Infinity, ease: 'easeInOut' },
                        }}
                    />

                    {/* Secondary arc — softer, slightly higher */}
                    <motion.path
                        d="M-80,195 C250,195 430,105 700,100 C970,95 1080,150 1270,168"
                        fill="none"
                        stroke="url(#hg2)"
                        strokeWidth="1"
                        filter="url(#arcBlur)"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 0.55 }}
                        transition={{ duration: 2.8, ease: 'easeOut', delay: 0.3 }}
                    />

                    {/* Tertiary micro-arc */}
                    <motion.path
                        d="M-120,200 C180,200 350,120 620,115 C890,110 1000,160 1300,180"
                        fill="none"
                        stroke="url(#hg2)"
                        strokeWidth="0.6"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 0.3 }}
                        transition={{ duration: 3.4, ease: 'easeOut', delay: 0.6 }}
                    />
                </svg>

                {/* Ambient radial glow at arc center */}
                <div
                    className="absolute pointer-events-none"
                    style={{
                        bottom: '10%',
                        left: '40%',
                        width: 360, height: 180,
                        background: 'radial-gradient(ellipse, rgba(255,122,41,0.07) 0%, transparent 70%)',
                        filter: 'blur(30px)',
                        transform: 'translateX(-50%)',
                    }}
                />
            </div>
        </PhoenixCard>

        {/* ══════════════════════════════════════════════════
             METRICS ROW — Charcoal · Inter numbers
        ══════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MetricCard label="Monthly Revenue" value="$124.5k" delta="+12.5%" up icon={BarChart2} />
            <MetricCard label="Active Agents" value="14 / 20" delta="+2 Deployed" up icon={Users} live />
            <MetricCard label="Lead Pipeline" value="48" delta="Stable" up={false} icon={Activity} />
        </div>

        {/* ══════════════════════════════════════════════════
             BENTO GRID — System Log + Voltage Chart
        ══════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* System Activity Log — Slate */}
            <PhoenixCard variant="slate" dotted className="lg:col-span-8 overflow-hidden">
                {/* Header */}
                <div
                    className="flex items-center justify-between px-7 py-5"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                >
                    <div className="flex items-center gap-3">
                        <Terminal size={14} style={{ color: '#FF7A29' }} />
                        <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', color: '#FFFFFF', textTransform: 'uppercase' }}>
                            System Activity Log
                        </span>
                    </div>
                    {/* LED tray */}
                    <div className="flex gap-2">
                        {['#C0392B', '#D4A017', '#27AE60'].map((c, i) => (
                            <div key={i} className="rounded-full" style={{ width: 9, height: 9, background: c, boxShadow: `0 0 5px ${c}80` }} />
                        ))}
                    </div>
                </div>

                {/* Entries */}
                <div className="px-7 py-4 space-y-0">
                    {LOGS.map((log, i) => (
                        <React.Fragment key={i}>
                            <motion.div
                                className="grid items-center py-2.5 px-2 -mx-2 rounded-lg hover:bg-white/[0.025] transition-colors"
                                style={{ gridTemplateColumns: '5.5rem 4.5rem 1fr', gap: 16, cursor: 'default' }}
                                initial={{ opacity: 0, x: -6 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05, duration: 0.35 }}
                            >
                                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: '#3A3F4A' }}>{log.time}</span>
                                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, fontWeight: 700, color: LOG_COLORS[log.level], letterSpacing: '0.12em' }}>
                                    {log.level}
                                </span>
                                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#9CA0A8' }}>{log.msg}</span>
                            </motion.div>
                            {i < LOGS.length - 1 && (
                                <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,122,41,0.08), transparent)' }} />
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </PhoenixCard>

            {/* Voltage / Load Chart — Deep */}
            <PhoenixCard variant="deep" className="lg:col-span-4 p-7 flex flex-col">
                <div className="flex items-center justify-between mb-6">
                    <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', color: '#FFFFFF' }}>
                        VOLTAGE LOAD
                    </span>
                    <Zap size={13} style={{ color: '#FF7A29', filter: 'drop-shadow(0 0 6px rgba(255,122,41,0.6))' }} />
                </div>

                {/* Bar chart */}
                <div
                    className="relative flex-1 flex items-end justify-between gap-1.5 p-4 rounded-xl overflow-hidden mb-5"
                    style={{
                        background: 'rgba(0,0,0,0.3)',
                        border: '1px solid rgba(255,255,255,0.05)',
                        boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.4)',
                        minHeight: 130,
                    }}
                >
                    {/* Grid lines */}
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px)',
                            backgroundSize: '100% 25%',
                        }}
                    />
                    {BAR_HEIGHTS.map((h, i) => (
                        <motion.div
                            key={i}
                            className="flex-1 rounded-sm"
                            style={{
                                background: 'linear-gradient(180deg, #FFA057 0%, #FF7A29 55%, #D95B16 100%)',
                                boxShadow: '0 0 7px rgba(255,122,41,0.3)',
                                height: `${h}%`,
                            }}
                            initial={{ scaleY: 0.35, opacity: 0.6 }}
                            animate={{ scaleY: 1, opacity: 1 }}
                            transition={{ duration: 0.5, delay: i * 0.04, repeat: Infinity, repeatType: 'mirror', repeatDelay: 2.8 }}
                        />
                    ))}
                </div>

                {/* Legend */}
                <div
                    className="flex justify-between mb-5"
                    style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, color: '#7A7F8A' }}
                >
                    <span>Min 24V</span>
                    <span style={{ color: '#FF7A29', fontWeight: 600 }}>Now 230V</span>
                    <span>Max 240V</span>
                </div>

                {/* Quick stats — Inter numbers */}
                <div className="space-y-3">
                    {[['Uptime', '99.94%'], ['Requests', '12.4k'], ['Avg Resp', '48 ms']].map(([l, v]) => (
                        <div key={l} className="flex justify-between items-center">
                            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: '#5A5F69' }}>{l}</span>
                            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 700, color: '#D0D3DA' }}>{v}</span>
                        </div>
                    ))}
                </div>
            </PhoenixCard>
        </div>

        {/* ══════════════════════════════════════════════════
             SECONDARY ROW — Security + Pipeline
        ══════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Security — Slate */}
            <PhoenixCard variant="slate" className="p-7">
                <div className="flex items-center gap-3 mb-6">
                    <Shield size={13} style={{ color: '#FF7A29' }} />
                    <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', color: '#FFFFFF' }}>
                        SECURITY STATUS
                    </span>
                </div>
                <div className="space-y-5">
                    {[
                        { label: 'Threat Level', val: 'LOW', bar: 15, color: '#4BE77F' },
                        { label: 'Active Sessions', val: '14', bar: 58, color: '#FF7A29' },
                        { label: 'Blocked Attacks', val: '1,204', bar: 88, color: '#FF7A29' },
                        { label: 'Firewall Health', val: 'OPTIMAL', bar: 97, color: '#FF7A29' },
                    ].map(({ label, val, bar, color }) => (
                        <div key={label}>
                            <div className="flex justify-between items-center mb-2">
                                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: '#5A5F69' }}>{label}</span>
                                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 700, color }}>{val}</span>
                            </div>
                            <div className="rounded-full overflow-hidden" style={{ height: 3, background: 'rgba(255,255,255,0.07)' }}>
                                <motion.div
                                    className="h-full rounded-full"
                                    style={{ background: `linear-gradient(90deg, ${color}77, ${color})` }}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${bar}%` }}
                                    transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </PhoenixCard>

            {/* Pipeline — Deep, Dotted */}
            <PhoenixCard variant="deep" dotted className="p-7">
                <div className="flex items-center gap-3 mb-6">
                    <TrendingUp size={13} style={{ color: '#FF7A29' }} />
                    <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', color: '#FFFFFF' }}>
                        PIPELINE OVERVIEW
                    </span>
                </div>
                <div className="space-y-4">
                    {[
                        { stage: 'New Leads', count: 12, pct: 25 },
                        { stage: 'Contacted', count: 19, pct: 40 },
                        { stage: 'Qualifying', count: 8, pct: 17 },
                        { stage: 'Proposal', count: 5, pct: 10 },
                        { stage: 'Closed Won', count: 4, pct: 8 },
                    ].map(({ stage, count, pct }, i) => (
                        <div key={stage} className="flex items-center gap-4">
                            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: '#5A5F69', minWidth: 80 }}>{stage}</span>
                            <div className="flex-1 rounded-full overflow-hidden" style={{ height: 4, background: 'rgba(255,255,255,0.07)' }}>
                                <motion.div
                                    className="h-full rounded-full"
                                    style={{ background: 'linear-gradient(90deg, #D95B16, #FF7A29, #FFA057)' }}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${pct * 3.5}%` }}
                                    transition={{ duration: 1, ease: 'easeOut', delay: 0.15 * i }}
                                />
                            </div>
                            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 700, color: '#D0D3DA', minWidth: 20, textAlign: 'right' }}>
                                {count}
                            </span>
                        </div>
                    ))}
                </div>
            </PhoenixCard>
        </div>
    </div>
);
