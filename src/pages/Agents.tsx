import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

// ─── AgentNetworkCanvas ────────────────────────────────────────────────────────
// Canvas-based animation: giant arc on left → flowing wave lines → agent boxes on right
const AgentNetworkCanvas: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animRef = useRef<number>(0);
    const timeRef = useRef<number>(0);

    const isActive = (s: Agent['status']) => s === 'ACTIVE' || s === 'RUNNING';

    // Layout constants (will scale via CSS)
    const W = 900, H_CVS = 320;
    const ARC_X = 30;            // flush-left arc centre
    const ARC_CY = H_CVS / 2;
    const ARC_R = 98;            // arc radius
    const BOX_X = 520;           // left boundary of agent boxes area
    const BOX_W = 82, BOX_H = 34;
    const BOX_GAP = 10;
    const COLS = 2;

    // Particle state (bubbles inside arc)
    const particles = useRef(
        Array.from({ length: 14 }, () => ({
            angle: Math.random() * Math.PI,   // 0..PI = left semicircle
            r: 20 + Math.random() * 85,
            speed: 0.003 + Math.random() * 0.006,
            size: 1 + Math.random() * 2,
            alpha: 0.15 + Math.random() * 0.3,
        }))
    );

    // Wave state (one per agent)
    const waves = useRef(
        AGENTS.map((_, i) => ({
            offset: i * (1 / AGENTS.length),   // stagger
            speed: isActive(AGENTS[i].status) ? 0.32 : 0.15,
        }))
    );

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const draw = (t: number) => {
            const dt = t - timeRef.current;
            timeRef.current = t;
            ctx.clearRect(0, 0, W, H_CVS);

            // ── 1. Background subtle radial glow behind arc ──
            const rg = ctx.createRadialGradient(ARC_X, ARC_CY, 0, ARC_X, ARC_CY, ARC_R * 1.6);
            rg.addColorStop(0, 'rgba(255,122,41,0.07)');
            rg.addColorStop(0.6, 'rgba(255,122,41,0.02)');
            rg.addColorStop(1, 'transparent');
            ctx.fillStyle = rg;
            ctx.beginPath();
            ctx.arc(ARC_X, ARC_CY, ARC_R * 1.6, 0, Math.PI * 2);
            ctx.fill();

            // ── 2. Dashed orbit rings inside arc ──
            [ARC_R * 0.55, ARC_R * 0.85].forEach(r => {
                ctx.save();
                ctx.strokeStyle = 'rgba(255,122,41,0.06)';
                ctx.lineWidth = 1;
                ctx.setLineDash([3, 9]);
                ctx.beginPath();
                ctx.arc(ARC_X, ARC_CY, r, 0, Math.PI * 2);
                ctx.stroke();
                ctx.restore();
            });

            // ── 3. Particles (bubbles floating inside arc) ──
            particles.current.forEach(p => {
                p.angle = (p.angle + p.speed * (dt / 16)) % (Math.PI * 2);
                const px = ARC_X + Math.cos(p.angle) * p.r;
                const py = ARC_CY + Math.sin(p.angle) * p.r;
                const pulse = 0.5 + 0.5 * Math.sin(t * 0.002 + p.angle * 3);
                ctx.beginPath();
                ctx.arc(px, py, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255,122,41,${p.alpha * pulse})`;
                ctx.fill();
            });

            // ── 4. Main arc glow (thick, layered) ──
            const arcPulse = 0.55 + 0.45 * Math.sin(t * 0.0014);
            // Outer soft glow
            ctx.save();
            ctx.shadowColor = '#FF7A29';
            ctx.shadowBlur = 28 * arcPulse;
            ctx.strokeStyle = `rgba(255,122,41,${0.18 * arcPulse})`;
            ctx.lineWidth = 22;
            ctx.beginPath();
            ctx.arc(ARC_X, ARC_CY, ARC_R, -Math.PI / 2, Math.PI / 2);
            ctx.stroke();
            ctx.restore();
            // Mid glow ring
            ctx.save();
            ctx.shadowColor = '#FF7A29';
            ctx.shadowBlur = 14 * arcPulse;
            ctx.strokeStyle = `rgba(255,122,41,${0.35 * arcPulse})`;
            ctx.lineWidth = 6;
            ctx.beginPath();
            ctx.arc(ARC_X, ARC_CY, ARC_R, -Math.PI / 2, Math.PI / 2);
            ctx.stroke();
            ctx.restore();
            // Sharp core line
            const arcGrad = ctx.createLinearGradient(ARC_X, ARC_CY - ARC_R, ARC_X, ARC_CY + ARC_R);
            arcGrad.addColorStop(0, 'rgba(255,122,41,0)');
            arcGrad.addColorStop(0.3, `rgba(255,122,41,${0.85 * arcPulse})`);
            arcGrad.addColorStop(0.7, `rgba(255,200,80,${0.9 * arcPulse})`);
            arcGrad.addColorStop(1, 'rgba(255,122,41,0)');
            ctx.save();
            ctx.strokeStyle = arcGrad;
            ctx.lineWidth = 2.5;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.arc(ARC_X, ARC_CY, ARC_R, -Math.PI / 2, Math.PI / 2);
            ctx.stroke();
            ctx.restore();

            // ── 5. Wave lines (arc → agent boxes) ──
            // Scattered box positions (fixed random layout seeded by index)
            const SCATTER: { bx: number; by: number }[] = [
                { bx: 540, by: 30 },
                { bx: 680, by: 55 },
                { bx: 555, by: 120 },
                { bx: 700, by: 140 },
                { bx: 545, by: 220 },
                { bx: 690, by: 240 },
            ];

            AGENTS.forEach((agent, i) => {
                const { bx, by } = SCATTER[i] ?? { bx: BOX_X + (i % COLS) * 160, by: 40 + Math.floor(i / COLS) * 80 };
                const targetY = by + BOX_H / 2;

                // Arc emission point (right side of arc)
                const emitAngle = -Math.PI / 2 + (Math.PI * (i + 0.5)) / AGENTS.length;
                const emitX = ARC_X + Math.cos(emitAngle) * ARC_R;
                const emitY = ARC_CY + Math.sin(emitAngle) * ARC_R;

                const active = isActive(agent.status);
                const baseColor = active ? [255, 122, 41] : [58, 58, 58];
                const wv = waves.current[i];

                // Advance wave offset
                wv.offset = (wv.offset + wv.speed * (dt / 1000)) % 1;

                // Draw 3 wave copies staggered by 1/3
                for (let copy = 0; copy < 3; copy++) {
                    const phase = (wv.offset + copy / 3) % 1;
                    const alpha = active
                        ? 0.6 * Math.sin(phase * Math.PI)   // bright for active
                        : 0.18 * Math.sin(phase * Math.PI); // dim for inactive

                    // Bezier: emit → midpoint → box target
                    const cp1x = emitX + (bx - emitX) * 0.35;
                    const cp1y = emitY;
                    const cp2x = emitX + (bx - emitX) * 0.65;
                    const cp2y = targetY;

                    // Sample a point along the cubic bezier at t = phase
                    const bt = phase;
                    const px = Math.pow(1 - bt, 3) * emitX + 3 * Math.pow(1 - bt, 2) * bt * cp1x + 3 * (1 - bt) * bt * bt * cp2x + bt * bt * bt * bx;
                    const py = Math.pow(1 - bt, 3) * emitY + 3 * Math.pow(1 - bt, 2) * bt * cp1y + 3 * (1 - bt) * bt * bt * cp2y + bt * bt * bt * targetY;

                    // Draw a glowing dot (signal pulse)
                    if (active) {
                        const grd = ctx.createRadialGradient(px, py, 0, px, py, 6);
                        grd.addColorStop(0, `rgba(${baseColor.join(',')},${alpha})`);
                        grd.addColorStop(1, 'transparent');
                        ctx.beginPath();
                        ctx.arc(px, py, 6, 0, Math.PI * 2);
                        ctx.fillStyle = grd;
                        ctx.fill();
                    }

                    // Draw the path segment around that point
                    const segLen = 0.28;
                    const t0 = Math.max(0, phase - segLen / 2);
                    const t1 = Math.min(1, phase + segLen / 2);
                    const steps = 24;
                    ctx.beginPath();
                    for (let s = 0; s <= steps; s++) {
                        const tt = t0 + (t1 - t0) * (s / steps);
                        const sx = Math.pow(1 - tt, 3) * emitX + 3 * Math.pow(1 - tt, 2) * tt * cp1x + 3 * (1 - tt) * tt * tt * cp2x + tt * tt * tt * bx;
                        const sy = Math.pow(1 - tt, 3) * emitY + 3 * Math.pow(1 - tt, 2) * tt * cp1y + 3 * (1 - tt) * tt * tt * cp2y + tt * tt * tt * targetY;
                        const localAlpha = alpha * Math.sin(((s / steps) * Math.PI));
                        if (s === 0) {
                            ctx.moveTo(sx, sy);
                        } else {
                            ctx.lineTo(sx, sy);
                        }
                    }
                    ctx.strokeStyle = `rgba(${baseColor.join(',')},${alpha * 0.8})`;
                    ctx.lineWidth = active ? 1.8 : 0.9;
                    if (active) {
                        ctx.shadowColor = '#FF7A29';
                        ctx.shadowBlur = 8;
                    }
                    ctx.stroke();
                    ctx.shadowBlur = 0;
                }

                // Static faint base line (always visible)
                ctx.beginPath();
                ctx.moveTo(emitX, emitY);
                ctx.bezierCurveTo(
                    emitX + (bx - emitX) * 0.35, emitY,
                    emitX + (bx - emitX) * 0.65, targetY,
                    bx, targetY
                );
                ctx.strokeStyle = active ? 'rgba(255,122,41,0.08)' : 'rgba(58,58,58,0.15)';
                ctx.lineWidth = 1;
                ctx.stroke();
            });

            animRef.current = requestAnimationFrame(draw);
        };

        animRef.current = requestAnimationFrame(draw);
        return () => cancelAnimationFrame(animRef.current);
    }, []);

    return (
        <canvas
            ref={canvasRef}
            width={W}
            height={H_CVS}
            style={{ width: '100%', height: H_CVS, display: 'block' }}
        />
    );
};

// ─── Agent Box Overlay — scattered floating boxes ─────────────────────────────
// Positions mirror the SCATTER array in the canvas draw function (900px coordinate space)
// Boxes are 82×34px canvas units → converted to % of container width
const SCATTER_POS = [
    { lPct: '60%', top: 22 },
    { lPct: '76%', top: 48 },
    { lPct: '61%', top: 114 },
    { lPct: '78%', top: 134 },
    { lPct: '60%', top: 210 },
    { lPct: '76%', top: 230 },
];

const AgentBoxes: React.FC = () => (
    <>
        {AGENTS.map((agent, i) => {
            const cfg = ST[agent.status];
            const active = agent.status === 'ACTIVE' || agent.status === 'RUNNING';
            const pos = SCATTER_POS[i] ?? { lPct: '60%', top: 40 + i * 46 };
            const floatAmp = 2.5 + (i % 3) * 0.8; // 2.5–4.5px
            const floatDur = 2.8 + (i % 4) * 0.5; // 2.8–4.3s
            return (
                <motion.div
                    key={agent.id}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{
                        opacity: 1,
                        x: 0,
                        y: [0, -floatAmp, 0, floatAmp, 0],
                    }}
                    transition={{
                        opacity: { delay: 0.15 + i * 0.07, duration: 0.4 },
                        x: { delay: 0.15 + i * 0.07, duration: 0.4 },
                        y: { delay: i * 0.1, duration: floatDur, repeat: Infinity, ease: 'easeInOut' },
                    }}
                    whileHover={{
                        boxShadow: active
                            ? '0 0 22px rgba(255,122,41,0.28)'
                            : '0 0 12px rgba(255,255,255,0.05)',
                    }}
                    style={{
                        position: 'absolute',
                        left: pos.lPct,
                        top: pos.top,
                        width: 120,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 7,
                        padding: '6px 10px',
                        borderRadius: 9,
                        background: active
                            ? 'linear-gradient(135deg,rgba(255,122,41,0.08),rgba(22,24,28,0.96))'
                            : 'rgba(18,20,23,0.9)',
                        border: `1px solid ${active ? 'rgba(255,122,41,0.32)' : 'rgba(255,255,255,0.06)'}`,
                        boxShadow: active
                            ? '0 0 12px rgba(255,122,41,0.10), inset 0 1px 0 rgba(255,255,255,0.04)'
                            : 'inset 0 1px 0 rgba(255,255,255,0.03)',
                        backdropFilter: 'blur(10px)',
                        overflow: 'hidden',
                        cursor: 'default',
                    }}
                >
                    {active && (
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,rgba(255,122,41,0.7),rgba(255,122,41,0.2),transparent)' }} />
                    )}
                    <div style={{ width: 20, height: 20, borderRadius: 6, background: `${cfg.color}18`, border: `1px solid ${cfg.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Cpu size={10} style={{ color: cfg.color }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontFamily: H, fontSize: 9, fontWeight: 700, color: active ? '#FFF' : '#5A5F6A', letterSpacing: '0.04em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{agent.name}</p>
                        <p style={{ fontFamily: BD, fontSize: 8, color: '#3A3F4A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: 1 }}>{agent.role}</p>
                    </div>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: cfg.color, boxShadow: active ? `0 0 5px ${cfg.glow}` : undefined, flexShrink: 0 }} />
                </motion.div>
            );
        })}
    </>
);

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
                {[['Efficiency', `${agent.efficiency}%`, agent.efficiency > 70 ? '#FF7A29' : '#7A7F8A'], ['Tasks', agent.tasks, '#E2E4E9'], ['Last Run', agent.lastRun, '#9CA0A8']].map(([l, v, c]) => (
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
                <h1 style={{ fontFamily: H, fontSize: 'clamp(28px,4vw,40px)', fontWeight: 800, color: '#FFF', letterSpacing: '-0.5px', textTransform: 'uppercase', lineHeight: 1 }}>Agent Operations</h1>
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

        {/* ── NEW: Agent Network Animation ── */}
        <div style={{
            borderRadius: 20,
            background: 'linear-gradient(145deg,#14161A,#1A1C20)',
            border: '1px solid rgba(255,255,255,0.05)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04), 0 8px 40px rgba(0,0,0,0.55)',
            overflow: 'hidden',
            position: 'relative',
        }}>
            {/* Canvas draws arc + wave lines */}
            <AgentNetworkCanvas />
            {/* HTML agent boxes overlaid on the right half */}
            <AgentBoxes />
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
