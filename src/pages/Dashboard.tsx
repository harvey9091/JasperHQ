import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Users, BarChart2, Terminal, Zap, Command, TrendingUp, Shield } from 'lucide-react';
import { PhoenixCard } from '../components/ui/PhoenixCard';

const H = 'JetBrains Mono, monospace';
const BD = 'Inter, sans-serif';
const MN = 'JetBrains Mono, monospace';

const PhBtn: React.FC<{ children: React.ReactNode; primary?: boolean; icon?: React.ElementType }> = ({ children, primary, icon: Icon }) => (
    <motion.button whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.975 }}
        style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '10px 22px', borderRadius: 12, fontFamily: H, fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', cursor: 'pointer',
            background: primary ? 'linear-gradient(145deg,#1E2024,#151719)' : 'rgba(255,255,255,0.04)',
            border: primary ? '1px solid rgba(255,122,41,0.48)' : '1px solid rgba(255,255,255,0.07)',
            color: primary ? '#FF7A29' : '#7A7F8A',
            boxShadow: primary ? '0 0 18px rgba(255,122,41,0.18),inset 0 1px 0 rgba(255,255,255,0.04)' : 'inset 0 1px 0 rgba(255,255,255,0.03)',
        }}>
        {Icon && <Icon size={13} />}<span>{children}</span>
    </motion.button>
);

const MetricCard: React.FC<{ label: string; value: string; delta: string; up: boolean; icon: React.ElementType; live?: boolean }> = ({ label, value, delta, up, icon: Icon, live }) => (
    <PhoenixCard variant="charcoal" glow={live} className="p-8 flex flex-col justify-between" style={{ minHeight: 180 }}>
        <div className="flex justify-between items-start mb-6">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <Icon size={15} style={{ color: '#7A7F8A' }} />
            </div>
            <div className="flex items-center gap-2">
                {live && <span style={{ fontFamily: MN, fontSize: 9, color: '#FF7A29', letterSpacing: '0.2em' }}>LIVE</span>}
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: up ? '#FF7A29' : '#2A2D32', boxShadow: up ? '0 0 7px rgba(255,122,41,0.7)' : undefined }} />
            </div>
        </div>
        <h3 style={{ fontFamily: H, fontSize: 'clamp(28px,3vw,38px)', fontWeight: 800, color: '#FFF', letterSpacing: '-0.5px', lineHeight: 1, marginBottom: 10 }}>{value}</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ padding: '2px 8px', borderRadius: 6, fontFamily: BD, fontSize: 10, fontWeight: 700, background: up ? 'rgba(255,122,41,0.1)' : 'rgba(255,255,255,0.04)', color: up ? '#FF7A29' : '#7A7F8A', border: up ? '1px solid rgba(255,122,41,0.22)' : '1px solid rgba(255,255,255,0.06)' }}>{delta}</span>
            <span style={{ fontFamily: BD, fontSize: 11, color: '#5A5F69' }}>{label}</span>
        </div>
    </PhoenixCard>
);

type LL = 'INFO' | 'WARN' | 'SUCCESS' | 'ALERT';
const LC: Record<LL, string> = { INFO: '#7A7F8A', WARN: '#D4A017', SUCCESS: '#E2E4E9', ALERT: '#D95B16' };
const LOGS: { time: string; level: LL; msg: string }[] = [
    { time: '10:42:05', level: 'INFO', msg: 'Core system integrity check complete.' },
    { time: '10:41:58', level: 'WARN', msg: 'Latency spike detected in Sector 7.' },
    { time: '10:40:12', level: 'SUCCESS', msg: 'Agent [Spectre-01] optimised route.' },
    { time: '10:38:45', level: 'INFO', msg: 'Database sync initiated.' },
    { time: '10:36:22', level: 'ALERT', msg: 'Unauthorised access attempt blocked.' },
    { time: '10:35:10', level: 'INFO', msg: 'New lead data ingested from CRM.' },
];

const BAR_H = [42, 62, 38, 80, 55, 72, 48, 90, 64, 52, 76, 60, 85];

const Waveform: React.FC = () => (
    <svg width="100%" height="34" viewBox="0 0 280 34" preserveAspectRatio="none">
        <defs>
            <linearGradient id="wg" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="rgba(255,122,41,0)" />
                <stop offset="20%" stopColor="rgba(255,122,41,0.65)" />
                <stop offset="80%" stopColor="rgba(255,122,41,0.65)" />
                <stop offset="100%" stopColor="rgba(255,122,41,0)" />
            </linearGradient>
        </defs>
        <motion.polyline fill="none" stroke="url(#wg)" strokeWidth="1.5"
            points="0,17 18,9 36,22 54,11 72,24 90,8 108,20 126,13 144,25 162,7 180,21 198,14 216,26 234,6 252,19 270,12 288,17"
            animate={{ x: [0, -36] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }} />
    </svg>
);

export const Dashboard: React.FC = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 52 }}>

        {/* HERO */}
        <PhoenixCard variant="deep" dotted className="relative overflow-hidden" style={{ minHeight: 330, padding: '52px 64px 0' }}>
            <motion.div className="relative pb-14" style={{ zIndex: 2, maxWidth: 560 }}
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}>
                <p style={{ fontFamily: MN, fontSize: 9, letterSpacing: '0.3em', color: '#7A7F8A', textTransform: 'uppercase', marginBottom: 14 }}>// System Online · Alpha-1 · 85% Load</p>
                <h1 style={{ fontFamily: H, fontSize: 'clamp(40px,5vw,60px)', fontWeight: 800, color: '#FFF', letterSpacing: '-0.5px', lineHeight: 1, marginBottom: 18, whiteSpace: 'nowrap', textTransform: 'uppercase', textShadow: '0 2px 32px rgba(0,0,0,0.5)' }}>
                    WELCOME BACK
                </h1>
                <p style={{ fontFamily: BD, fontSize: 14, lineHeight: 1.65, color: '#9CA0A8', marginBottom: 28, maxWidth: 420 }}>
                    Command Center operational. Your pipeline has{' '}<span style={{ color: '#FF7A29', fontWeight: 600 }}>48 active leads</span>{' '}and{' '}<span style={{ color: '#FFA057', fontWeight: 600 }}>14 agents</span> running at peak efficiency.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
                    <PhBtn primary icon={Command}>Initialize</PhBtn>
                    <PhBtn icon={Terminal}>Diagnostics</PhBtn>
                </div>
            </motion.div>

            {/* ARC — bottom 46%, lowered so it never overlaps buttons */}
            <div className="absolute inset-x-0 bottom-0 pointer-events-none" style={{ height: '46%', zIndex: 1 }}>
                <svg width="100%" height="100%" viewBox="0 0 1300 200" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="ag1" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="rgba(255,122,41,0)" />
                            <stop offset="30%" stopColor="rgba(255,122,41,0.6)" />
                            <stop offset="75%" stopColor="rgba(255,160,87,0.45)" />
                            <stop offset="100%" stopColor="rgba(255,122,41,0.1)" />
                        </linearGradient>
                        <linearGradient id="ag2" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="rgba(217,91,22,0)" />
                            <stop offset="50%" stopColor="rgba(217,91,22,0.4)" />
                            <stop offset="100%" stopColor="rgba(217,91,22,0.08)" />
                        </linearGradient>
                        <filter id="af1"><feGaussianBlur stdDeviation="1.2" /></filter>
                    </defs>
                    <motion.path d="M-50,185 C200,185 400,110 680,105 C960,100 1100,148 1350,165" fill="none" stroke="url(#ag1)" strokeWidth="2"
                        initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1, x: [0, 5, 0] }}
                        transition={{ pathLength: { duration: 2.2, ease: [0.4, 0, 0.2, 1] }, opacity: { duration: 1 }, x: { duration: 9, repeat: Infinity, ease: 'easeInOut' } }} />
                    <motion.path d="M-80,193 C250,193 450,122 730,117 C1010,112 1130,155 1360,178" fill="none" stroke="url(#ag2)" strokeWidth="1" filter="url(#af1)"
                        initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.5 }}
                        transition={{ duration: 2.8, ease: 'easeOut', delay: 0.3 }} />
                    <motion.path d="M-120,198 C180,198 380,130 650,125 C920,120 1060,162 1360,188" fill="none" stroke="url(#ag2)" strokeWidth="0.6"
                        initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.28 }}
                        transition={{ duration: 3.4, ease: 'easeOut', delay: 0.6 }} />
                </svg>
            </div>
        </PhoenixCard>

        {/* METRICS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MetricCard label="Monthly Revenue" value="$124.5k" delta="+12.5%" up icon={BarChart2} />
            <MetricCard label="Active Agents" value="14 / 20" delta="+2 Deployed" up icon={Users} live />
            <MetricCard label="Lead Pipeline" value="48" delta="Stable" up={false} icon={Activity} />
        </div>

        {/* BENTO */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <PhoenixCard variant="slate" dotted className="lg:col-span-8 overflow-hidden">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 28px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Terminal size={13} style={{ color: '#FF7A29' }} />
                        <span style={{ fontFamily: H, fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', color: '#FFF', textTransform: 'uppercase' }}>System Activity Log</span>
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>{['#C0392B', '#D4A017', '#27AE60'].map((c, i) => <div key={i} style={{ width: 9, height: 9, borderRadius: '50%', background: c, boxShadow: `0 0 5px ${c}80` }} />)}</div>
                </div>
                <div style={{ padding: '8px 28px 16px' }}>
                    {LOGS.map((log, i) => (
                        <React.Fragment key={i}>
                            <motion.div style={{ display: 'grid', gridTemplateColumns: '5.5rem 4.5rem 1fr', gap: 16, padding: '10px 8px', borderRadius: 8 }}
                                initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05, duration: 0.35 }}>
                                <span style={{ fontFamily: MN, fontSize: 10, color: '#3A3F4A' }}>{log.time}</span>
                                <span style={{ fontFamily: MN, fontSize: 9, fontWeight: 700, color: LC[log.level], letterSpacing: '0.12em' }}>{log.level}</span>
                                <span style={{ fontFamily: BD, fontSize: 12, color: '#9CA0A8' }}>{log.msg}</span>
                            </motion.div>
                            {i < LOGS.length - 1 && <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,rgba(255,122,41,0.07),transparent)' }} />}
                        </React.Fragment>
                    ))}
                </div>
            </PhoenixCard>

            {/* VOLTAGE */}
            <PhoenixCard variant="deep" className="lg:col-span-4 p-7 flex flex-col">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                    <span style={{ fontFamily: H, fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', color: '#FFF', textTransform: 'uppercase' }}>Voltage Load</span>
                    <Zap size={13} style={{ color: '#FF7A29', filter: 'drop-shadow(0 0 6px rgba(255,122,41,0.6))' }} />
                </div>
                <div style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 10, padding: '8px 12px', marginBottom: 14 }}>
                    <Waveform />
                </div>
                <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 4, padding: 12, borderRadius: 10, background: 'rgba(0,0,0,0.28)', border: '1px solid rgba(255,255,255,0.05)', boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.4)', minHeight: 100, marginBottom: 14 }}>
                    {BAR_H.map((h, i) => (
                        <motion.div key={i} style={{ flex: 1, borderRadius: 2, background: 'linear-gradient(180deg,#FFA057 0%,#FF7A29 55%,#D95B16 100%)', boxShadow: '0 0 6px rgba(255,122,41,0.28)', height: `${h}%` }}
                            initial={{ scaleY: 0.3, opacity: 0.6 }} animate={{ scaleY: 1, opacity: 1 }}
                            transition={{ duration: 0.5, delay: i * 0.04, repeat: Infinity, repeatType: 'mirror', repeatDelay: 2.8 }} />
                    ))}
                </div>
                {[['Uptime', '99.94%'], ['Requests', '12.4k'], ['Avg Resp', '48 ms']].map(([l, v]) => (
                    <div key={l} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                        <span style={{ fontFamily: BD, fontSize: 11, color: '#5A5F69' }}>{l}</span>
                        <span style={{ fontFamily: BD, fontSize: 12, fontWeight: 700, color: '#D0D3DA' }}>{v}</span>
                    </div>
                ))}
            </PhoenixCard>
        </div>

        {/* SECONDARY */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PhoenixCard variant="slate" className="p-7">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
                    <Shield size={13} style={{ color: '#FF7A29' }} />
                    <span style={{ fontFamily: H, fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', color: '#FFF', textTransform: 'uppercase' }}>Security Status</span>
                </div>
                {[{ label: 'Threat Level', val: 'LOW', bar: 15, color: '#4BE77F' }, { label: 'Active Sessions', val: '14', bar: 58, color: '#FF7A29' }, { label: 'Blocked Attacks', val: '1,204', bar: 88, color: '#FF7A29' }, { label: 'Firewall Health', val: 'OPTIMAL', bar: 97, color: '#FF7A29' }].map(({ label, val, bar, color }) => (
                    <div key={label} style={{ marginBottom: 18 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                            <span style={{ fontFamily: BD, fontSize: 11, color: '#5A5F69' }}>{label}</span>
                            <span style={{ fontFamily: BD, fontSize: 11, fontWeight: 700, color }}>{val}</span>
                        </div>
                        <div style={{ height: 3, borderRadius: 99, background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
                            <motion.div style={{ height: '100%', borderRadius: 99, background: `linear-gradient(90deg,${color}77,${color})` }} initial={{ width: 0 }} animate={{ width: `${bar}%` }} transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }} />
                        </div>
                    </div>
                ))}
            </PhoenixCard>

            <PhoenixCard variant="deep" dotted className="p-7">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
                    <TrendingUp size={13} style={{ color: '#FF7A29' }} />
                    <span style={{ fontFamily: H, fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', color: '#FFF', textTransform: 'uppercase' }}>Pipeline Overview</span>
                </div>
                {[{ stage: 'New Leads', count: 12, pct: 25 }, { stage: 'Contacted', count: 19, pct: 40 }, { stage: 'Qualifying', count: 8, pct: 17 }, { stage: 'Proposal', count: 5, pct: 10 }, { stage: 'Closed Won', count: 4, pct: 8 }].map(({ stage, count, pct }, i) => (
                    <div key={stage} style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                        <span style={{ fontFamily: BD, fontSize: 11, color: '#5A5F69', minWidth: 80 }}>{stage}</span>
                        <div style={{ flex: 1, height: 4, borderRadius: 99, background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
                            <motion.div style={{ height: '100%', borderRadius: 99, background: 'linear-gradient(90deg,#D95B16,#FF7A29,#FFA057)' }} initial={{ width: 0 }} animate={{ width: `${pct * 3.5}%` }} transition={{ duration: 1, ease: 'easeOut', delay: 0.15 * i }} />
                        </div>
                        <span style={{ fontFamily: BD, fontSize: 12, fontWeight: 700, color: '#D0D3DA', minWidth: 20, textAlign: 'right' }}>{count}</span>
                    </div>
                ))}
            </PhoenixCard>
        </div>
    </div>
);
