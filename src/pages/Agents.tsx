import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Cpu, Activity, Terminal, Play, RotateCcw, Clock, CheckCircle, XCircle, Loader2, MessageSquare, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import type { MonitorLog } from '../../lib/supabase';

const H = 'JetBrains Mono, monospace';
const BD = 'Inter, sans-serif';
const MN = 'JetBrains Mono, monospace';

// ─── Static agent definitions (names / roles are fixed system agents) ─────────
const AGENT_DEFS = [
    { id: 'AGT-001', name: 'Nami', role: 'Navigation & Intel' },
    { id: 'AGT-002', name: 'Robin', role: 'History & Research' },
    { id: 'AGT-003', name: 'Sanji', role: 'Strategic Logistics' },
    { id: 'AGT-004', name: 'Zoro', role: 'Security & Enforcement' },
    { id: 'AGT-005', name: 'Brook', role: 'Pipeline Logic' },
    { id: 'AGT-006', name: 'Usopp', role: 'Outreach & Comms' },
    { id: 'AGT-007', name: 'Luffy', role: 'System Orchestrator' },
];

interface AgentLive {
    id: string; name: string; role: string;
    status: 'ACTIVE' | 'IDLE' | 'RUNNING' | 'OFFLINE';
    mode: 'AUTONOMOUS' | 'MANUAL';
    efficiency: number; tasks: number; lastRun: string;
    success: number; failures: number;
}

interface OpsLogEntry {
    id: string;
    sender: string;
    recipient: string;
    message_summary: string;
    created_at: string;
}

interface CronRow {
    name: string; schedule: string; next: string;
    agent: string; status: string;
}

const ST: Record<AgentLive['status'], { color: string; glow: string; pulse: boolean }> = {
    ACTIVE: { color: '#FF7A29', glow: 'rgba(255,122,41,0.5)', pulse: false },
    RUNNING: { color: '#FF7A29', glow: 'rgba(255,122,41,0.7)', pulse: true },
    IDLE: { color: '#4A4F5A', glow: 'rgba(74,79,90,0.4)', pulse: false },
    OFFLINE: { color: '#2A2D32', glow: 'rgba(42,45,50,0.2)', pulse: false },
};

// Derive a display status from raw log status string
const resolveStatus = (s: string | null | undefined): AgentLive['status'] => {
    const v = (s ?? '').toLowerCase();
    if (v === 'running') return 'RUNNING';
    if (v === 'active') return 'ACTIVE';
    if (v === 'idle') return 'IDLE';
    return 'OFFLINE';
};

// Relative time helper
const relTime = (iso: string) => {
    const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
};

// ─── AgentNetworkCanvas ────────────────────────────────────────────────────────
const AgentNetworkCanvas: React.FC<{ agents: AgentLive[] }> = ({ agents }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animRef = useRef<number>(0);
    const timeRef = useRef<number>(0);
    const isActive = (s: AgentLive['status']) => s === 'ACTIVE' || s === 'RUNNING';

    const W = 900, H_CVS = 320;
    const ARC_X = 30, ARC_CY = H_CVS / 2, ARC_R = 98;
    const BOX_W = 82, BOX_H = 34;
    const COLS = 2;

    const particles = useRef(
        Array.from({ length: 14 }, () => ({
            angle: Math.random() * Math.PI,
            r: 20 + Math.random() * 85,
            speed: 0.003 + Math.random() * 0.006,
            size: 1 + Math.random() * 2,
            alpha: 0.15 + Math.random() * 0.3,
        }))
    );

    const wavesRef = useRef(
        AGENT_DEFS.map((_, i) => ({
            offset: i * (1 / AGENT_DEFS.length),
            speed: 0.32,
        }))
    );

    // Update wave speed when agents change
    useEffect(() => {
        AGENT_DEFS.forEach((def, i) => {
            const a = agents.find(a => a.name === def.name);
            wavesRef.current[i].speed = a && isActive(a.status) ? 0.32 : 0.15;
        });
    }, [agents]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const draw = (t: number) => {
            const dt = t - timeRef.current;
            timeRef.current = t;
            ctx.clearRect(0, 0, W, H_CVS);

            const rg = ctx.createRadialGradient(ARC_X, ARC_CY, 0, ARC_X, ARC_CY, ARC_R * 1.6);
            rg.addColorStop(0, 'rgba(255,122,41,0.07)');
            rg.addColorStop(0.6, 'rgba(255,122,41,0.02)');
            rg.addColorStop(1, 'transparent');
            ctx.fillStyle = rg;
            ctx.beginPath(); ctx.arc(ARC_X, ARC_CY, ARC_R * 1.6, 0, Math.PI * 2); ctx.fill();

            [ARC_R * 0.55, ARC_R * 0.85].forEach(r => {
                ctx.save(); ctx.strokeStyle = 'rgba(255,122,41,0.06)'; ctx.lineWidth = 1;
                ctx.setLineDash([3, 9]); ctx.beginPath(); ctx.arc(ARC_X, ARC_CY, r, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
            });

            particles.current.forEach(p => {
                p.angle = (p.angle + p.speed * (dt / 16)) % (Math.PI * 2);
                const px = ARC_X + Math.cos(p.angle) * p.r;
                const py = ARC_CY + Math.sin(p.angle) * p.r;
                const pulse = 0.5 + 0.5 * Math.sin(t * 0.002 + p.angle * 3);
                ctx.beginPath(); ctx.arc(px, py, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255,122,41,${p.alpha * pulse})`; ctx.fill();
            });

            const arcPulse = 0.55 + 0.45 * Math.sin(t * 0.0014);
            ctx.save(); ctx.shadowColor = '#FF7A29'; ctx.shadowBlur = 28 * arcPulse;
            ctx.strokeStyle = `rgba(255,122,41,${0.18 * arcPulse})`; ctx.lineWidth = 22;
            ctx.beginPath(); ctx.arc(ARC_X, ARC_CY, ARC_R, -Math.PI / 2, Math.PI / 2); ctx.stroke(); ctx.restore();
            ctx.save(); ctx.shadowColor = '#FF7A29'; ctx.shadowBlur = 14 * arcPulse;
            ctx.strokeStyle = `rgba(255,122,41,${0.35 * arcPulse})`; ctx.lineWidth = 6;
            ctx.beginPath(); ctx.arc(ARC_X, ARC_CY, ARC_R, -Math.PI / 2, Math.PI / 2); ctx.stroke(); ctx.restore();
            const arcGrad = ctx.createLinearGradient(ARC_X, ARC_CY - ARC_R, ARC_X, ARC_CY + ARC_R);
            arcGrad.addColorStop(0, 'rgba(255,122,41,0)');
            arcGrad.addColorStop(0.3, `rgba(255,122,41,${0.85 * arcPulse})`);
            arcGrad.addColorStop(0.7, `rgba(255,200,80,${0.9 * arcPulse})`);
            arcGrad.addColorStop(1, 'rgba(255,122,41,0)');
            ctx.save(); ctx.strokeStyle = arcGrad; ctx.lineWidth = 2.5; ctx.lineCap = 'round';
            ctx.beginPath(); ctx.arc(ARC_X, ARC_CY, ARC_R, -Math.PI / 2, Math.PI / 2); ctx.stroke(); ctx.restore();

            const SCATTER = [
                { bx: 540, by: 10 }, { bx: 680, by: 40 }, { bx: 555, by: 90 },
                { bx: 700, by: 130 }, { bx: 545, by: 180 }, { bx: 690, by: 220 },
                { bx: 550, by: 270 },
            ];

            AGENT_DEFS.forEach((def, i) => {
                const agent = agents.find(a => a.name === def.name);
                const active = agent ? isActive(agent.status) : false;
                const { bx, by } = SCATTER[i] ?? { bx: 520 + (i % COLS) * 160, by: 40 + Math.floor(i / COLS) * 80 };
                const targetY = by + BOX_H / 2;
                const emitAngle = -Math.PI / 2 + (Math.PI * (i + 0.5)) / AGENT_DEFS.length;
                const emitX = ARC_X + Math.cos(emitAngle) * ARC_R;
                const emitY = ARC_CY + Math.sin(emitAngle) * ARC_R;
                const baseColor = active ? [255, 122, 41] : [58, 58, 58];
                const wv = wavesRef.current[i];
                wv.offset = (wv.offset + wv.speed * (dt / 1000)) % 1;

                for (let copy = 0; copy < 3; copy++) {
                    const phase = (wv.offset + copy / 3) % 1;
                    const alpha = active ? 0.6 * Math.sin(phase * Math.PI) : 0.18 * Math.sin(phase * Math.PI);
                    const cp1x = emitX + (bx - emitX) * 0.35, cp1y = emitY;
                    const cp2x = emitX + (bx - emitX) * 0.65, cp2y = targetY;
                    const bt = phase;
                    const px = Math.pow(1 - bt, 3) * emitX + 3 * Math.pow(1 - bt, 2) * bt * cp1x + 3 * (1 - bt) * bt * bt * cp2x + bt * bt * bt * bx;
                    const py = Math.pow(1 - bt, 3) * emitY + 3 * Math.pow(1 - bt, 2) * bt * cp1y + 3 * (1 - bt) * bt * bt * cp2y + bt * bt * bt * targetY;
                    if (active) {
                        const grd = ctx.createRadialGradient(px, py, 0, px, py, 6);
                        grd.addColorStop(0, `rgba(${baseColor.join(',')},${alpha})`);
                        grd.addColorStop(1, 'transparent');
                        ctx.beginPath(); ctx.arc(px, py, 6, 0, Math.PI * 2);
                        ctx.fillStyle = grd; ctx.fill();
                    }
                    const segLen = 0.28, t0 = Math.max(0, phase - segLen / 2), t1 = Math.min(1, phase + segLen / 2), steps = 24;
                    ctx.beginPath();
                    for (let s = 0; s <= steps; s++) {
                        const tt = t0 + (t1 - t0) * (s / steps);
                        const sx = Math.pow(1 - tt, 3) * emitX + 3 * Math.pow(1 - tt, 2) * tt * cp1x + 3 * (1 - tt) * tt * tt * cp2x + tt * tt * tt * bx;
                        const sy = Math.pow(1 - tt, 3) * emitY + 3 * Math.pow(1 - tt, 2) * tt * cp1y + 3 * (1 - tt) * tt * tt * cp2y + tt * tt * tt * targetY;
                        s === 0 ? ctx.moveTo(sx, sy) : ctx.lineTo(sx, sy);
                    }
                    ctx.strokeStyle = `rgba(${baseColor.join(',')},${alpha * 0.8})`;
                    ctx.lineWidth = active ? 1.8 : 0.9;
                    if (active) { ctx.shadowColor = '#FF7A29'; ctx.shadowBlur = 8; }
                    ctx.stroke(); ctx.shadowBlur = 0;
                }
                ctx.beginPath(); ctx.moveTo(emitX, emitY);
                ctx.bezierCurveTo(emitX + (bx - emitX) * 0.35, emitY, emitX + (bx - emitX) * 0.65, targetY, bx, targetY);
                ctx.strokeStyle = active ? 'rgba(255,122,41,0.08)' : 'rgba(58,58,58,0.15)';
                ctx.lineWidth = 1; ctx.stroke();
            });

            animRef.current = requestAnimationFrame(draw);
        };
        animRef.current = requestAnimationFrame(draw);
        return () => cancelAnimationFrame(animRef.current);
    }, [agents]);

    return (
        <canvas ref={canvasRef} width={W} height={H_CVS}
            style={{ width: '100%', height: H_CVS, display: 'block' }} />
    );
};

// ─── Agent Box Overlay ────────────────────────────────────────────────────────
const SCATTER_POS = [
    { lPct: '60%', top: 12 }, { lPct: '76%', top: 40 }, { lPct: '61%', top: 90 },
    { lPct: '78%', top: 130 }, { lPct: '60%', top: 180 }, { lPct: '76%', top: 220 },
    { lPct: '61%', top: 270 },
];

const AgentBoxes: React.FC<{ agents: AgentLive[] }> = ({ agents }) => (
    <>
        {AGENT_DEFS.map((def, i) => {
            const agent = agents.find(a => a.name === def.name);
            const status = agent?.status ?? 'OFFLINE';
            const cfg = ST[status];
            const active = status === 'ACTIVE' || status === 'RUNNING';
            const pos = SCATTER_POS[i] ?? { lPct: '60%', top: 40 + i * 46 };
            const floatAmp = 2.5 + (i % 3) * 0.8;
            const floatDur = 2.8 + (i % 4) * 0.5;
            return (
                <motion.div key={def.id}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0, y: [0, -floatAmp, 0, floatAmp, 0] }}
                    transition={{
                        opacity: { delay: 0.15 + i * 0.07, duration: 0.4 },
                        x: { delay: 0.15 + i * 0.07, duration: 0.4 },
                        y: { delay: i * 0.1, duration: floatDur, repeat: Infinity, ease: 'easeInOut' },
                    }}
                    whileHover={{ boxShadow: active ? '0 0 22px rgba(255,122,41,0.28)' : '0 0 12px rgba(255,255,255,0.05)' }}
                    style={{
                        position: 'absolute', left: pos.lPct, top: pos.top, width: 120,
                        display: 'flex', alignItems: 'center', gap: 7, padding: '6px 10px', borderRadius: 9,
                        background: active ? 'linear-gradient(135deg,rgba(255,122,41,0.08),rgba(22,24,28,0.96))' : 'rgba(18,20,23,0.9)',
                        border: `1px solid ${active ? 'rgba(255,122,41,0.32)' : 'rgba(255,255,255,0.06)'}`,
                        boxShadow: active ? '0 0 12px rgba(255,122,41,0.10),inset 0 1px 0 rgba(255,255,255,0.04)' : 'inset 0 1px 0 rgba(255,255,255,0.03)',
                        backdropFilter: 'blur(10px)', overflow: 'hidden', cursor: 'default',
                    }}>
                    {active && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,rgba(255,122,41,0.7),rgba(255,122,41,0.2),transparent)' }} />}
                    <div style={{ width: 20, height: 20, borderRadius: 6, background: `${cfg.color}18`, border: `1px solid ${cfg.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Cpu size={10} style={{ color: cfg.color }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontFamily: H, fontSize: 9, fontWeight: 700, color: active ? '#FFF' : '#5A5F6A', letterSpacing: '0.04em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{def.name}</p>
                        <p style={{ fontFamily: BD, fontSize: 8, color: '#3A3F4A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: 1 }}>{def.role}</p>
                    </div>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: cfg.color, boxShadow: active ? `0 0 5px ${cfg.glow}` : undefined, flexShrink: 0 }} />
                </motion.div>
            );
        })}
    </>
);

// ─── Agent Card ───────────────────────────────────────────────────────────────
const AgentCard: React.FC<{ agent: AgentLive; i: number }> = ({ agent, i }) => {
    const cfg = ST[agent.status];
    const running = agent.status === 'RUNNING';
    return (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07, duration: 0.4 }}
            style={{ borderRadius: 14, padding: '16px 18px', background: 'linear-gradient(145deg,#181A1D,#202226)', border: `1px solid ${running ? 'rgba(255,122,41,0.25)' : 'rgba(255,255,255,0.06)'}`, boxShadow: running ? '0 0 20px rgba(255,122,41,0.1),inset 0 1px 0 rgba(255,255,255,0.05)' : 'inset 0 1px 0 rgba(255,255,255,0.04)', position: 'relative', overflow: 'hidden' }}>
            {running && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,transparent,rgba(255,122,41,0.7),transparent)', borderRadius: '14px 14px 0 0' }} />}

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Cpu size={14} style={{ color: cfg.color }} />
                    </div>
                    <div>
                        <p style={{ fontFamily: H, fontSize: 13, fontWeight: 900, color: '#FFF', letterSpacing: '0.02em', marginBottom: 1 }}>{agent.name}</p>
                        <p style={{ fontFamily: MN, fontSize: 8, color: '#4A4F5A', letterSpacing: '0.1em' }}>{agent.role}</p>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '3px 8px', borderRadius: 99, background: `${cfg.color}08`, border: `1px solid ${cfg.color}15` }}>
                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: cfg.color, boxShadow: `0 0 6px ${cfg.glow}`, animation: running ? 'pulse 1s ease-in-out infinite' : undefined }} />
                    <span style={{ fontFamily: MN, fontSize: 8, fontWeight: 700, color: cfg.color, letterSpacing: '0.1em' }}>{agent.status}</span>
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                <span style={{ fontFamily: MN, fontSize: 7, color: '#3A3F4A', letterSpacing: '1px', textTransform: 'uppercase' }}>MODE:</span>
                <span style={{ fontFamily: MN, fontSize: 8, fontWeight: 700, color: agent.mode === 'AUTONOMOUS' ? '#FF7A29' : '#5A5F6A', letterSpacing: '0.5px' }}>{agent.mode}</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 14 }}>
                {[
                    ['Efficiency', `${agent.efficiency}%`, agent.efficiency > 70 ? '#FF7A29' : '#5A5F6A'],
                    ['Tasks', agent.tasks, '#B4B7BD'],
                    ['Last Run', agent.lastRun, '#6A6F7A']
                ].map(([l, v, c]) => (
                    <div key={String(l)} style={{ borderRadius: 8, padding: '8px 10px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.04)' }}>
                        <p style={{ fontFamily: MN, fontSize: 7, letterSpacing: '0.1em', color: '#4A4F5A', marginBottom: 3, textTransform: 'uppercase' }}>{l}</p>
                        <p style={{ fontFamily: BD, fontSize: 12, fontWeight: 700, color: String(c) }}>{v}</p>
                    </div>
                ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <span style={{ fontFamily: BD, fontSize: 10, color: '#4BE77F', fontWeight: 600 }}>✓ {agent.success}</span>
                <span style={{ fontFamily: BD, fontSize: 10, color: '#D95B16', fontWeight: 600 }}>✕ {agent.failures}</span>
                <div style={{ flex: 1, height: 2, borderRadius: 99, background: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(agent.success / (agent.success + agent.failures || 1)) * 100}%`, background: 'linear-gradient(90deg,#D95B16,#FF7A29)', borderRadius: 99 }} />
                </div>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
                <motion.button whileHover={{ borderColor: 'rgba(255,122,41,0.4)', color: '#FF7A29', background: 'rgba(255,122,41,0.04)' }} whileTap={{ scale: 0.96 }}
                    style={{ flex: 1, padding: '7px', borderRadius: 8, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', color: '#6A6F7A', fontFamily: H, fontSize: 8, fontWeight: 700, letterSpacing: '0.12em', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, transition: 'all 0.2s' }}>
                    <Play size={10} />RUN NOW
                </motion.button>
                <motion.button whileHover={{ borderColor: 'rgba(255,255,255,0.1)', color: '#E2E4E9' }} whileTap={{ scale: 0.96 }}
                    style={{ padding: '7px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', color: '#4A4F5A', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
                    <Terminal size={11} />
                </motion.button>
            </div>
        </motion.div>
    );
};

// ─── AGENTS PAGE ──────────────────────────────────────────────────────────────
export const Agents: React.FC = () => {
    const [agents, setAgents] = useState<AgentLive[]>([]);
    const [crons, setCrons] = useState<CronRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [showComms, setShowComms] = useState(false);

    const fetchData = useCallback(async () => {
        setLoading(true);

        // 1. Fetch real agents from OpenClaw
        let apiAgents: any[] = [];
        try {
            const baseUrl = import.meta.env.VITE_OPENCLAW_BASE_URL || 'http://127.0.0.1:18789';
            const res = await fetch(`${baseUrl}/agent/list`);
            const data = await res.json();
            apiAgents = Array.isArray(data) ? data : (data.agents || []);
        } catch (err) {
            console.error('Failed to fetch agent list:', err);
        }

        // 2. Fetch latest monitor_logs per agent
        const { data: logData } = await supabase
            .from('monitor_logs')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(200);

        // Build agent map — latest row per agent name
        const agentMap = new Map<string, MonitorLog>();
        if (logData) {
            for (const row of logData as MonitorLog[]) {
                if (row.agent && !agentMap.has(row.agent)) {
                    agentMap.set(row.agent, row);
                }
            }
        }

        const builtAgents: AgentLive[] = AGENT_DEFS.map(def => {
            const apiAgent = apiAgents.find(a => a.name === def.name || a.id === def.id);
            const log = agentMap.get(def.name);

            return {
                ...def,
                status: resolveStatus(apiAgent?.status || log?.status),
                mode: (apiAgent?.mode || 'AUTONOMOUS').toUpperCase(),
                efficiency: apiAgent?.efficiency ?? log?.efficiency ?? 95,
                tasks: apiAgent?.tasks_completed ?? log?.tasks_count ?? 0,
                lastRun: apiAgent?.last_run ? relTime(apiAgent.last_run) : (log ? relTime(log.created_at) : 'Never'),
                success: apiAgent?.tasks_completed ?? log?.tasks_count ?? 0,
                failures: apiAgent?.failures ?? log?.failures ?? 0,
            };
        });
        setAgents(builtAgents);

        // --- Cron jobs from monitor_logs schedule rows ---
        const { data: cronData } = await supabase
            .from('monitor_logs')
            .select('agent, schedule, next_run, status')
            .not('schedule', 'is', null)
            .order('next_run', { ascending: true })
            .limit(6);

        if (cronData && cronData.length > 0) {
            setCrons(cronData.map((r: { agent?: string | null; schedule?: string | null; next_run?: string | null; status?: string | null }) => ({
                name: `${r.agent ?? '–'} Job`,
                schedule: r.schedule ?? '–',
                next: r.next_run ? relTime(r.next_run) : '–',
                agent: r.agent ?? '–',
                status: r.status ?? 'Scheduled',
            })));
        } else {
            // Fallback static cron data if table has no schedule rows yet
            setCrons([
                { name: 'Lead Harvest', schedule: '0 */2 * * *', next: 'in 38m', agent: 'Nami', status: 'Scheduled' },
                { name: 'Outreach Blast', schedule: '0 9 * * 1-5', next: 'Tomorrow', agent: 'Usopp', status: 'Scheduled' },
                { name: 'CRM Sync', schedule: '*/15 * * * *', next: 'in 12m', agent: 'Brook', status: 'Running' },
                { name: 'Report Compile', schedule: '0 20 * * *', next: 'in 6h', agent: 'Luffy', status: 'Scheduled' },
                { name: 'Data Cleanup', schedule: '0 3 * * 0', next: 'in 5d', agent: 'Zoro', status: 'Paused' },
                { name: 'Deal Follow-up', schedule: '0 10 * * 1,3,5', next: 'in 22h', agent: 'Sanji', status: 'Scheduled' },
            ]);
        }

        setLoading(false);
    }, []);

    useEffect(() => {
        fetchData();
        const channel = supabase
            .channel('agents_rt')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'monitor_logs' }, fetchData)
            .subscribe();
        return () => { supabase.removeChannel(channel); };
    }, [fetchData]);

    const activeCount = agents.filter(a => a.status !== 'OFFLINE').length;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <style>{`@keyframes pulse { 0%,100%{opacity:1}50%{opacity:0.4} }`}</style>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
                <div>
                    <p style={{ fontFamily: MN, fontSize: 9, letterSpacing: '0.3em', color: '#7A7F8A', textTransform: 'uppercase', marginBottom: 10 }}>// Autonomous Systems · {loading ? '–' : activeCount} Active</p>
                    <h1 style={{ fontFamily: H, fontSize: 'clamp(28px,4vw,40px)', fontWeight: 800, color: '#FFF', letterSpacing: '-0.5px', textTransform: 'uppercase', lineHeight: 1 }}>Agent Operations</h1>
                    <p style={{ fontFamily: BD, fontSize: 14, color: '#7A7F8A', marginTop: 8 }}>Monitor autonomous modules and cron jobs.</p>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                    <motion.button
                        whileHover={{ borderColor: 'rgba(255,122,41,0.45)', color: '#FF7A29', background: 'rgba(255,122,41,0.05)' }}
                        onClick={() => setShowComms(true)}
                        style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,122,41,0.2)', color: '#7A7F8A', fontFamily: H, fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 0 12px rgba(255,122,41,0.05)' }}>
                        <MessageSquare size={12} />AGENT COMMS
                    </motion.button>
                    <motion.button whileHover={{ borderColor: 'rgba(255,255,255,0.15)', color: '#FFF' }} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: '#7A7F8A', fontFamily: H, fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', cursor: 'pointer', transition: 'all 0.2s' }}>
                        <RotateCcw size={12} />REBOOT ALL
                    </motion.button>
                    <motion.button whileTap={{ scale: 0.97 }} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 12, background: 'linear-gradient(145deg,#1E2024,#151719)', border: '1px solid rgba(255,122,41,0.48)', color: '#FF7A29', fontFamily: H, fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', cursor: 'pointer', boxShadow: '0 0 16px rgba(255,122,41,0.14)' }}>
                        <Play size={12} />DEPLOY UNIT
                    </motion.button>
                </div>
            </div>

            {/* Agent Network Animation */}
            <div style={{ borderRadius: 20, background: 'linear-gradient(145deg,#14161A,#1A1C20)', border: '1px solid rgba(255,255,255,0.05)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04),0 8px 40px rgba(0,0,0,0.55)', overflow: 'hidden', position: 'relative' }}>
                <AgentNetworkCanvas agents={agents} />
                <AgentBoxes agents={agents} />
            </div>

            {/* Agent grid */}
            <div>
                <p style={{ fontFamily: H, fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', color: '#E2E4E9', textTransform: 'uppercase', marginBottom: 18 }}>Deployed Modules</p>
                {loading ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '20px 0' }}>
                        <Loader2 size={18} style={{ color: '#FF7A29', animation: 'spin 1s linear infinite' }} />
                        <span style={{ fontFamily: MN, fontSize: 10, color: '#3A3F4A', letterSpacing: '0.14em' }}>LOADING AGENT DATA…</span>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {agents.map((a, i) => <AgentCard key={a.id} agent={a} i={i} />)}
                    </div>
                )}
            </div>

            {/* Agent Comms Drawer */}
            <AgentCommsDrawer isOpen={showComms} onClose={() => setShowComms(false)} />
        </div>
    );
};

const AgentCommsDrawer: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const [logs, setLogs] = useState<OpsLogEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);

    const fetchLogs = async () => {
        const { data } = await supabase
            .from('agent_operations_log')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(30);
        if (data) {
            // Reverse logs for chat style (newest at bottom)
            setLogs([...data].reverse());
        }
        setLoading(false);
    };

    useEffect(() => {
        if (isOpen) {
            fetchLogs();
            const interval = setInterval(fetchLogs, 45000);
            const channel = supabase
                .channel('agent_ops_rt_drawer')
                .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'agent_operations_log' }, fetchLogs)
                .subscribe();
            return () => {
                clearInterval(interval);
                supabase.removeChannel(channel);
            };
        }
    }, [isOpen]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs, isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 10000 }}
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        style={{ position: 'fixed', top: 0, right: 0, width: 'min(35%, 500px)', height: '100%', background: '#0D0E10', borderLeft: '1px solid rgba(255,255,255,0.06)', boxShadow: '-20px 0 50px rgba(0,0,0,0.5)', zIndex: 10001, display: 'flex', flexDirection: 'column' }}
                    >
                        {/* Header */}
                        <div style={{ padding: '24px 28px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4BE77F', boxShadow: '0 0 10px #4BE77F' }} />
                                    <h2 style={{ fontFamily: H, fontSize: 13, fontWeight: 900, color: '#FFF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Inter-Agent Communications</h2>
                                </div>
                                <p style={{ fontFamily: MN, fontSize: 9, color: '#4A4F5A', letterSpacing: '0.1em' }}>LIVE MONITORING ACTIVE</p>
                            </div>
                            <motion.button
                                whileHover={{ background: 'rgba(255,255,255,0.05)', color: '#FFF' }}
                                whileTap={{ scale: 0.9 }}
                                onClick={onClose}
                                style={{ width: 32, height: 32, borderRadius: 8, background: 'transparent', border: '1px solid rgba(255,255,255,0.08)', color: '#7A7F8A', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                                <X size={16} />
                            </motion.button>
                        </div>

                        {/* Logs Content */}
                        <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                            {loading && logs.length === 0 ? (
                                <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <Loader2 size={18} style={{ color: '#FF7A29', animation: 'spin 1s linear infinite' }} />
                                </div>
                            ) : logs.length === 0 ? (
                                <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <p style={{ fontFamily: MN, fontSize: 10, color: '#3A3F4A', letterSpacing: '0.12em', textAlign: 'center' }}>NO RECENT AGENT COMMUNICATIONS</p>
                                </div>
                            ) : (
                                logs.map((log) => (
                                    <div key={log.id} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                <span style={{ fontFamily: BD, fontSize: 11, fontWeight: 700, color: '#FF7A29' }}>{log.sender}</span>
                                                <ArrowRight size={10} style={{ color: '#3A3F4A' }} />
                                                <span style={{ fontFamily: BD, fontSize: 11, fontWeight: 700, color: '#7A9FFF' }}>{log.recipient}</span>
                                            </div>
                                            <span style={{ fontFamily: MN, fontSize: 9, color: '#3A3F4A' }}>{new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        <div style={{ padding: '12px 14px', borderRadius: '4px 14px 14px 14px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', position: 'relative' }}>
                                            <p style={{ fontFamily: BD, fontSize: 12, color: '#B4B7BD', lineHeight: 1.5 }}>{log.message_summary}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer / Status */}
                        <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.1)' }}>
                            <p style={{ fontFamily: MN, fontSize: 8, color: '#3A3F4A', letterSpacing: '0.08em', textAlign: 'center' }}>ENCRYPTED AGENT LINK // CHANNEL: OPS_LOG_01</p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
