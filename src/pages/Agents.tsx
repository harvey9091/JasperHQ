import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Activity, Terminal, Play, RotateCcw, Clock, CheckCircle, XCircle } from 'lucide-react';

const H = 'JetBrains Mono, monospace';
const BD = 'Inter, sans-serif';
const MN = 'JetBrains Mono, monospace';

// ─── Data ─────────────────────────────────────────────────────────────────────
interface Agent { id: string; name: string; role: string; status: 'ACTIVE' | 'IDLE' | 'RUNNING' | 'OFFLINE'; efficiency: number; tasks: number; lastRun: string; success: number; failures: number }
const AGENTS: Agent[] = [
    { id: 'AGT-001', name: 'Spectre', role: 'Lead Scraper', status: 'ACTIVE', efficiency: 98, tasks: 1245, lastRun: '2m ago', success: 1240, failures: 5 },
    { id: 'AGT-002', name: 'Phantom', role: 'Outreach Engine', status: 'RUNNING', efficiency: 85, tasks: 450, lastRun: 'Now', success: 420, failures: 30 },
    { id: 'AGT-003', name: 'Wraith', role: 'Data Miner', status: 'OFFLINE', efficiency: 0, tasks: 0, lastRun: '3d ago', success: 890, failures: 12 },
    { id: 'AGT-004', name: 'Ghost', role: 'Sentiment', status: 'ACTIVE', efficiency: 92, tasks: 890, lastRun: '8m ago', success: 880, failures: 10 },
    { id: 'AGT-005', name: 'Shadow', role: 'Deal Closer', status: 'RUNNING', efficiency: 12, tasks: 5, lastRun: 'Now', success: 3, failures: 2 },
    { id: 'AGT-006', name: 'Mirage', role: 'Support AI', status: 'IDLE', efficiency: 100, tasks: 220, lastRun: '15m ago', success: 220, failures: 0 },
];

const ST: Record<Agent['status'], { color: string; glow: string; pulse: boolean }> = {
    ACTIVE: { color: '#FF7A29', glow: 'rgba(255,122,41,0.5)', pulse: false },
    RUNNING: { color: '#FF7A29', glow: 'rgba(255,122,41,0.7)', pulse: true },
    IDLE: { color: '#4A4F5A', glow: 'rgba(74,79,90,0.4)', pulse: false },
    OFFLINE: { color: '#2A2D32', glow: 'rgba(42,45,50,0.2)', pulse: false },
};

const CRONS = [
    { name: 'Lead Harvest', schedule: '0 */2 * * *', next: 'in 38m', agent: 'Spectre', status: 'Scheduled' },
    { name: 'Outreach Blast', schedule: '0 9 * * 1-5', next: 'Tomorrow', agent: 'Phantom', status: 'Scheduled' },
    { name: 'CRM Sync', schedule: '*/15 * * * *', next: 'in 12m', agent: 'Ghost', status: 'Running' },
    { name: 'Report Compile', schedule: '0 20 * * *', next: 'in 6h', agent: 'Mirage', status: 'Scheduled' },
    { name: 'Data Cleanup', schedule: '0 3 * * 0', next: 'in 5d', agent: 'Wraith', status: 'Paused' },
    { name: 'Deal Follow-up', schedule: '0 10 * * 1,3,5', next: 'in 22h', agent: 'Shadow', status: 'Scheduled' },
];

// ─── Orbital Map ─────────────────────────────────────────────────────────────
const OrbitalMap: React.FC = () => {
    // Positions for 6 nodes in a hex pattern
    const nodes = AGENTS.map((a, i) => {
        const angle = (i / AGENTS.length) * Math.PI * 2 - Math.PI / 2;
        const r = 100;
        return { ...a, cx: 220 + Math.cos(angle) * r, cy: 170 + Math.sin(angle) * r };
    });
    return (
        <svg width="100%" height="340" viewBox="0 0 400 340" style={{ overflow: 'visible' }}>
            <defs>
                <radialGradient id="orbit-bg" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="rgba(255,122,41,0.04)" />
                    <stop offset="100%" stopColor="transparent" />
                </radialGradient>
                <filter id="glow-f"><feGaussianBlur stdDeviation="2.5" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
            </defs>

            {/* Central glow */}
            <circle cx={200} cy={170} r={120} fill="url(#orbit-bg)" />
            <circle cx={200} cy={170} r={110} fill="none" stroke="rgba(255,122,41,0.06)" strokeWidth="1" strokeDasharray="4 8" />
            <circle cx={200} cy={170} r={68} fill="none" stroke="rgba(255,122,41,0.04)" strokeWidth="1" strokeDasharray="2 6" />

            {/* Connector lines (underlying) */}
            {nodes.map((n, i) => (
                <line key={i} x1={220} y1={170} x2={n.cx} y2={n.cy}
                    stroke={n.status === 'OFFLINE' ? 'rgba(255,255,255,0.02)' : 'rgba(255,122,41,0.08)'} strokeWidth="1" />
            ))}

            {/* LARGE GLOWING ARC (Left side) */}
            <defs>
                <linearGradient id="arc-grad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#FF7A29" stopOpacity="0" />
                    <stop offset="50%" stopColor="#FF7A29" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#FF7A29" stopOpacity="0" />
                </linearGradient>
            </defs>
            <motion.path
                d="M10,40 Q60,170 10,300"
                fill="none"
                stroke="#FF7A29"
                strokeWidth="2"
                style={{ filter: 'drop-shadow(0 0 12px rgba(255,122,41,0.6))' }}
                initial={{ opacity: 0 }} animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />
            <path d="M5,20 Q80,170 5,320" fill="none" stroke="rgba(255,122,41,0.1)" strokeWidth="1" />

            {/* WAVE PROPAGATION */}
            {nodes.map((n, i) => {
                const isActive = n.status === 'RUNNING' || n.status === 'ACTIVE';
                const waveColor = isActive ? '#FF7A29' : 'rgba(255,255,255,0.1)';
                return (
                    <motion.path
                        key={`wave-${n.id}`}
                        d={`M30,${170 + (n.cy - 170) * 0.2} Q120,${170 + (n.cy - 170) * 0.6} ${n.cx},${n.cy}`}
                        fill="none"
                        stroke={waveColor}
                        strokeWidth="1"
                        strokeDasharray="4 12"
                        initial={{ strokeDashoffset: 100, opacity: 0 }}
                        animate={{ strokeDashoffset: [100, 0], opacity: isActive ? [0, 0.4, 0] : [0, 0.1, 0] }}
                        transition={{
                            duration: isActive ? 3 : 5,
                            repeat: Infinity,
                            delay: i * 0.4,
                            ease: "linear"
                        }}
                    />
                );
            })}

            {/* Center hub */}
            <circle cx={220} cy={170} r={24} fill="#161819" stroke="rgba(255,122,41,0.35)" strokeWidth="1.5" filter="url(#glow-f)" />
            <text x={220} y={166} textAnchor="middle" style={{ fontFamily: H, fontSize: 7, fontWeight: 800, fill: '#FF7A29', letterSpacing: '0.1em' }}>JASPER</text>
            <text x={220} y={176} textAnchor="middle" style={{ fontFamily: MN, fontSize: 5.5, fill: '#7A7F8A' }}>HQ CORE</text>

            {/* Nodes */}
            {nodes.map((n, i) => {
                const cfg = ST[n.status];
                return (
                    <g key={n.id}>
                        {n.status === 'RUNNING' && (
                            <motion.circle cx={n.cx} cy={n.cy} r={16} fill="none" stroke={cfg.color} strokeWidth="1"
                                animate={{ r: [16, 26], opacity: [0.5, 0] }} transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut' }} />
                        )}
                        <circle cx={n.cx} cy={n.cy} r={15} fill="#1A1C1F" stroke={cfg.color} strokeWidth="1.5" filter={n.status !== 'OFFLINE' ? 'url(#glow-f)' : undefined} />
                        <text x={n.cx} y={n.cy + 2} textAnchor="middle" style={{ fontFamily: H, fontSize: 5.5, fontWeight: 700, fill: cfg.color, letterSpacing: '0.06em' }}>{n.name.slice(0, 4).toUpperCase()}</text>
                        <text x={n.cx} y={n.cy + 24} textAnchor="middle" style={{ fontFamily: BD, fontSize: 7, fill: '#7A7F8A' }}>{n.role}</text>
                        <circle cx={n.cx + 12} cy={n.cy - 12} r={4} fill={cfg.color} style={{ filter: `drop-shadow(0 0 4px ${cfg.glow})` }} />
                    </g>
                );
            })}
        </svg>
    );
};

// ─── Agent Card ───────────────────────────────────────────────────────────────
const AgentCard: React.FC<{ agent: Agent; i: number }> = ({ agent, i }) => {
    const cfg = ST[agent.status];
    const running = agent.status === 'RUNNING';
    return (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07, duration: 0.4 }}
            style={{ borderRadius: 16, padding: 24, background: 'linear-gradient(145deg,#181A1D,#202226)', border: `1px solid ${running ? 'rgba(255,122,41,0.25)' : 'rgba(255,255,255,0.06)'}`, boxShadow: running ? '0 0 20px rgba(255,122,41,0.1),inset 0 1px 0 rgba(255,255,255,0.05)' : 'inset 0 1px 0 rgba(255,255,255,0.04)', position: 'relative', overflow: 'hidden' }}>
            {running && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,transparent,rgba(255,122,41,0.7),transparent)', borderRadius: '16px 16px 0 0' }} />}

            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Cpu size={18} style={{ color: cfg.color }} />
                    </div>
                    <div>
                        <p style={{ fontFamily: H, fontSize: 14, fontWeight: 900, color: '#FFF', letterSpacing: '0.04em', marginBottom: 4 }}>{agent.name}</p>
                        <p style={{ fontFamily: MN, fontSize: 9, color: '#7A7F8A', letterSpacing: '0.16em' }}>{agent.id} · {agent.role}</p>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 99, background: `${cfg.color}11`, border: `1px solid ${cfg.color}22` }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: cfg.color, boxShadow: `0 0 7px ${cfg.glow}`, animation: running ? 'pulse 1s ease-in-out infinite' : undefined }} />
                    <span style={{ fontFamily: MN, fontSize: 9, fontWeight: 700, color: cfg.color, letterSpacing: '0.16em' }}>{agent.status}</span>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 20 }}>
                {[['Efficiency', `${agent.efficiency}%',agent.efficiency>70?'#FF7A29':'#7A7F8A`], ['Tasks', agent.tasks, '#E2E4E9'], ['Last Run', agent.lastRun, '#9CA0A8']].map(([l, v, c]) => (
                    <div key={String(l)} style={{ borderRadius: 10, padding: '10px 12px', background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <p style={{ fontFamily: MN, fontSize: 8, letterSpacing: '0.18em', color: '#5A5F69', marginBottom: 6, textTransform: 'uppercase' }}>{l}</p>
                        <p style={{ fontFamily: BD, fontSize: 13, fontWeight: 700, color: String(c) }}>{v}</p>
                    </div>
                ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
                <span style={{ fontFamily: BD, fontSize: 11, color: '#4BE77F', fontWeight: 600 }}>✓ {agent.success}</span>
                <span style={{ fontFamily: BD, fontSize: 11, color: '#D95B16', fontWeight: 600 }}>✕ {agent.failures}</span>
                <div style={{ flex: 1, height: 3, borderRadius: 99, background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(agent.success / (agent.success + agent.failures || 1)) * 100}%`, background: 'linear-gradient(90deg,#D95B16,#FF7A29)', borderRadius: 99 }} />
                </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
                <motion.button whileHover={{ borderColor: 'rgba(255,122,41,0.45)', color: '#FF7A29' }} whileTap={{ scale: 0.96 }}
                    style={{ flex: 1, padding: '9px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', color: '#7A7F8A', fontFamily: H, fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'all 0.2s' }}>
                    <Play size={11} />RUN NOW
                </motion.button>
                <motion.button whileHover={{ borderColor: 'rgba(255,255,255,0.12)' }} whileTap={{ scale: 0.96 }}
                    style={{ padding: '9px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', color: '#7A7F8A', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
                    <Terminal size={12} />
                </motion.button>
            </div>
        </motion.div>
    );
};

// ─── AGENTS PAGE ─────────────────────────────────────────────────────────────
export const Agents: React.FC = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
                <p style={{ fontFamily: MN, fontSize: 9, letterSpacing: '0.3em', color: '#7A7F8A', textTransform: 'uppercase', marginBottom: 10 }}>// Autonomous Systems · {AGENTS.filter(a => a.status !== 'OFFLINE').length} Active</p>
                <h1 style={{ fontFamily: H, fontSize: 'clamp(28px,4vw,40px)', fontWeight: 900, color: '#FFF', letterSpacing: '0.08em', textTransform: 'uppercase', lineHeight: 1 }}>Agent Operations</h1>
                <p style={{ fontFamily: BD, fontSize: 14, color: '#7A7F8A', marginTop: 8 }}>Monitor autonomous modules and cron jobs.</p>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
                <motion.button whileHover={{ borderColor: 'rgba(255,122,41,0.45)', color: '#FF7A29' }} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: '#7A7F8A', fontFamily: H, fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', cursor: 'pointer', transition: 'all 0.2s' }}>
                    <RotateCcw size={12} />REBOOT ALL
                </motion.button>
                <motion.button whileTap={{ scale: 0.97 }} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 12, background: 'linear-gradient(145deg,#1E2024,#151719)', border: '1px solid rgba(255,122,41,0.48)', color: '#FF7A29', fontFamily: H, fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', cursor: 'pointer', boxShadow: '0 0 16px rgba(255,122,41,0.14)' }}>
                    <Play size={12} />DEPLOY UNIT
                </motion.button>
            </div>
        </div>

        {/* Orbital Map */}
        <div style={{ borderRadius: 20, background: 'linear-gradient(145deg,#16181B,#1E2023)', border: '1px solid rgba(255,255,255,0.05)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04),0 8px 40px rgba(0,0,0,0.5)', overflow: 'hidden', position: 'relative' }}>
            <div style={{ position: 'absolute', top: -80, left: '50%', transform: 'translateX(-50%)', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(255,122,41,0.04) 0%,transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ padding: '8px 0' }}><OrbitalMap /></div>
        </div>

        {/* Agent grid */}
        <div>
            <p style={{ fontFamily: H, fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', color: '#E2E4E9', textTransform: 'uppercase', marginBottom: 18 }}>Deployed Modules</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {AGENTS.map((a, i) => <AgentCard key={a.id} agent={a} i={i} />)}
            </div>
        </div>

        {/* Cron table */}
        <div>
            <p style={{ fontFamily: H, fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', color: '#E2E4E9', textTransform: 'uppercase', marginBottom: 18 }}>Upcoming Task Queue</p>
            <div style={{ borderRadius: 16, background: 'linear-gradient(145deg,#181A1D,#1E2022)', border: '1px solid rgba(255,255,255,0.06)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            {['Cron Job', 'Schedule', 'Next Run', 'Agent', 'Status'].map((h, i) => (
                                <th key={i} style={{ padding: '14px 20px', textAlign: 'left', fontFamily: MN, fontSize: 9, fontWeight: 700, letterSpacing: '0.22em', color: '#7A7F8A', textTransform: 'uppercase' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {CRONS.map((c, i) => {
                            const sc = c.status === 'Running' ? '#FF7A29' : c.status === 'Paused' ? '#4A4F5A' : '#4BE77F';
                            return (
                                <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                                    <td style={{ padding: '14px 20px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <Clock size={11} style={{ color: '#FF7A29', flexShrink: 0 }} />
                                            <span style={{ fontFamily: BD, fontSize: 12, fontWeight: 600, color: '#E2E4E9' }}>{c.name}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '14px 20px' }}><code style={{ fontFamily: MN, fontSize: 10, color: '#7A7F8A', background: 'rgba(255,255,255,0.04)', padding: '3px 8px', borderRadius: 6 }}>{c.schedule}</code></td>
                                    <td style={{ padding: '14px 20px' }}><span style={{ fontFamily: BD, fontSize: 12, color: '#FF7A29' }}>{c.next}</span></td>
                                    <td style={{ padding: '14px 20px' }}><span style={{ fontFamily: BD, fontSize: 12, color: '#9CA0A8' }}>{c.agent}</span></td>
                                    <td style={{ padding: '14px 20px' }}>
                                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 99, background: `${sc}11`, border: `1px solid ${sc}22` }}>
                                            {c.status === 'Running' ? <Activity size={10} style={{ color: sc }} /> : c.status === 'Paused' ? <XCircle size={10} style={{ color: sc }} /> : <CheckCircle size={10} style={{ color: sc }} />}
                                            <span style={{ fontFamily: MN, fontSize: 9, color: sc, letterSpacing: '0.12em' }}>{c.status.toUpperCase()}</span>
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
);
