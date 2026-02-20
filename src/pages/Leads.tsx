import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Download, Plus, MoreVertical, ChevronRight, TrendingUp } from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

type Status = 'active' | 'negotiating' | 'archived' | 'new';

interface Lead {
    id: string;
    name: string;
    contact: string;
    initials: string;
    value: string;
    status: Status;
    score: number;
    lastAction: string;
    avatarColor: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_LEADS: Lead[] = [
    { id: 'LD-001', name: 'CyberDyne Systems', contact: 'Miles Dyson', initials: 'MD', value: '$125,000', status: 'active', score: 98, lastAction: 'Contract Sent', avatarColor: '#2A2C32' },
    { id: 'LD-002', name: 'Tyrell Corp', contact: 'Eldon Tyrell', initials: 'ET', value: '$850,000', status: 'negotiating', score: 95, lastAction: 'Meeting Scheduled', avatarColor: '#212529' },
    { id: 'LD-003', name: 'Weyland-Yutani', contact: 'Carter Burke', initials: 'CB', value: '$2,500,000', status: 'new', score: 88, lastAction: 'Inbound Inquiry', avatarColor: '#282A30' },
    { id: 'LD-004', name: 'Massive Dynamic', contact: 'Nina Sharp', initials: 'NS', value: '$450,000', status: 'active', score: 92, lastAction: 'Demo Completed', avatarColor: '#222427' },
    { id: 'LD-005', name: 'InGen', contact: 'John Hammond', initials: 'JH', value: '$12,000,000', status: 'negotiating', score: 45, lastAction: 'Budget Review', avatarColor: '#252729' },
    { id: 'LD-006', name: 'Aperture Science', contact: 'Cave Johnson', initials: 'CJ', value: '$85,000', status: 'archived', score: 12, lastAction: 'No Response', avatarColor: '#1E2024' },
];

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<Status, { label: string; color: string; glow: string; dot: string }> = {
    active: { label: 'ACTIVE', color: '#4BE77F', glow: 'rgba(75,231,127,0.35)', dot: '#4BE77F' },
    negotiating: { label: 'NEGOTIATING', color: '#FF7A29', glow: 'rgba(255,122,41,0.35)', dot: '#FF7A29' },
    new: { label: 'NEW', color: '#FFA057', glow: 'rgba(255,160,87,0.35)', dot: '#FFA057' },
    archived: { label: 'ARCHIVED', color: '#6F6F72', glow: 'rgba(111,111,114,0.2)', dot: '#6F6F72' },
};

const TABS = ['All', 'Active', 'Negotiating', 'Archived'];

// ─── Sub-components ───────────────────────────────────────────────────────────

const PhoenixInput: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { icon?: React.ElementType }> = ({ icon: Icon, ...props }) => (
    <div className="relative flex-1">
        {Icon && (
            <Icon
                size={14}
                style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#FF7A29' }}
            />
        )}
        <input
            {...props}
            style={{
                width: '100%',
                background: 'linear-gradient(145deg, #131416, #181A1D)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 10,
                paddingLeft: Icon ? 38 : 14,
                paddingRight: 14,
                paddingTop: 9,
                paddingBottom: 9,
                fontSize: 13,
                color: '#E2E4E9',
                outline: 'none',
                boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.03)',
                fontFamily: 'Inter, sans-serif',
                caretColor: '#FF7A29',
                ...(props.style ?? {}),
            }}
            className="transition-all duration-200 focus:ring-0 placeholder:text-[#4A4F5A]"
            onFocus={e => {
                e.target.style.border = '1px solid rgba(255,122,41,0.35)';
                e.target.style.boxShadow = 'inset 0 2px 8px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,122,41,0.15)';
            }}
            onBlur={e => {
                e.target.style.border = '1px solid rgba(255,255,255,0.06)';
                e.target.style.boxShadow = 'inset 0 2px 8px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.03)';
            }}
        />
    </div>
);

const StatusPill: React.FC<{ status: Status }> = ({ status }) => {
    const cfg = STATUS_CONFIG[status];
    return (
        <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md"
            style={{
                background: cfg.glow.replace('0.35', '0.08'),
                border: `1px solid ${cfg.color}28`,
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: '0.12em',
                color: cfg.color,
            }}
        >
            {/* LED dot */}
            <span
                className="rounded-full shrink-0"
                style={{
                    width: 5, height: 5,
                    background: cfg.dot,
                    boxShadow: `0 0 5px ${cfg.glow}`,
                    animation: status === 'active' || status === 'negotiating' ? 'pulse 1.8s ease-in-out infinite' : undefined,
                }}
            />
            {cfg.label}
        </span>
    );
};

const ScoreBar: React.FC<{ score: number }> = ({ score }) => {
    const color = score > 80 ? '#FF7A29' : score > 50 ? '#FFA057' : '#6F6F72';
    return (
        <div className="flex items-center gap-2.5">
            <div
                className="rounded-full overflow-hidden"
                style={{ width: 56, height: 4, background: 'rgba(255,255,255,0.07)' }}
            >
                <div
                    className="h-full rounded-full"
                    style={{
                        width: `${score}%`,
                        background: `linear-gradient(90deg, ${color}99, ${color})`,
                        boxShadow: `0 0 6px ${color}55`,
                    }}
                />
            </div>
            <span style={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace', color: '#7A7F8A', minWidth: 20 }}>
                {score}
            </span>
        </div>
    );
};

const Avatar: React.FC<{ initials: string; bg: string }> = ({ initials, bg }) => (
    <div
        className="shrink-0 flex items-center justify-center rounded-full select-none"
        style={{
            width: 38, height: 38,
            background: `linear-gradient(145deg, ${bg}ee, ${bg}cc)`,
            border: '1px solid rgba(255,255,255,0.07)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), 0 2px 8px rgba(0,0,0,0.5)',
            fontFamily: 'Orbitron, sans-serif',
            fontSize: 10,
            fontWeight: 700,
            color: '#C8CAD0',
            letterSpacing: '0.05em',
        }}
    >
        {initials}
    </div>
);

const PhBtn: React.FC<{
    children: React.ReactNode;
    primary?: boolean;
    icon?: React.ElementType;
    onClick?: () => void;
}> = ({ children, primary, icon: Icon, onClick }) => (
    <motion.button
        whileHover={{ scale: 1.015 }}
        whileTap={{ scale: 0.975 }}
        onClick={onClick}
        className="relative flex items-center gap-2 rounded-xl overflow-hidden cursor-pointer"
        style={{
            padding: '9px 20px',
            fontFamily: 'Orbitron, sans-serif',
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.12em',
            background: primary ? 'linear-gradient(145deg, #1C1E22, #131416)' : 'rgba(255,255,255,0.04)',
            border: primary ? '1px solid rgba(255,122,41,0.45)' : '1px solid rgba(255,255,255,0.07)',
            color: primary ? '#FF7A29' : '#7A7F8A',
            boxShadow: primary ? '0 0 16px rgba(255,122,41,0.15), inset 0 1px 0 rgba(255,255,255,0.04)' : 'inset 0 1px 0 rgba(255,255,255,0.03)',
        }}
    >
        <span className="absolute inset-x-0 top-0 h-px" style={{ background: primary ? 'rgba(255,122,41,0.4)' : 'rgba(255,255,255,0.05)' }} />
        {Icon && <Icon size={13} />}
        <span>{children}</span>
    </motion.button>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

export const Leads: React.FC = () => {
    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState('All');

    const filtered = MOCK_LEADS.filter(lead => {
        const matchSearch = lead.name.toLowerCase().includes(search.toLowerCase())
            || lead.contact.toLowerCase().includes(search.toLowerCase());
        const matchTab = activeTab === 'All' || lead.status === activeTab.toLowerCase();
        return matchSearch && matchTab;
    });

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

            {/* ── Page Header ── */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
                <div>
                    <p
                        style={{
                            fontFamily: 'JetBrains Mono, monospace',
                            fontSize: 9,
                            letterSpacing: '0.3em',
                            color: '#7A7F8A',
                            marginBottom: 8,
                            textTransform: 'uppercase',
                        }}
                    >
                        // Intelligence Layer · {MOCK_LEADS.length} Targets Tracked
                    </p>
                    <h1
                        style={{
                            fontFamily: 'Orbitron, sans-serif',
                            fontSize: 'clamp(28px, 4vw, 42px)',
                            fontWeight: 900,
                            color: '#FFFFFF',
                            letterSpacing: '-0.02em',
                            lineHeight: 1,
                            margin: 0,
                        }}
                    >
                        LEAD INTELLIGENCE
                    </h1>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#7A7F8A', marginTop: 8 }}>
                        Monitor and engage your highest-value acquisition targets.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <PhBtn icon={Download}>Export</PhBtn>
                    <PhBtn primary icon={Plus}>Add Lead</PhBtn>
                </div>
            </div>

            {/* ── Control Bar (Tabs + Search) ── */}
            <div
                className="flex flex-col md:flex-row items-start md:items-center gap-5"
                style={{
                    background: 'linear-gradient(145deg, #181A1D 0%, #1E2023 100%)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: 14,
                    padding: '14px 18px',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04), 0 4px 20px rgba(0,0,0,0.4)',
                }}
            >
                {/* Phoenix Tabs */}
                <div className="flex items-center gap-1">
                    {TABS.map(tab => {
                        const isActive = tab === activeTab;
                        return (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className="relative px-4 py-2 rounded-lg transition-colors duration-200"
                                style={{
                                    fontFamily: 'Orbitron, sans-serif',
                                    fontSize: 9,
                                    fontWeight: 700,
                                    letterSpacing: '0.15em',
                                    textTransform: 'uppercase',
                                    color: isActive ? '#FFFFFF' : '#4A4F5A',
                                    background: isActive ? 'rgba(255,255,255,0.05)' : 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    outline: 'none',
                                }}
                            >
                                {isActive && (
                                    <>
                                        {/* Orange underline */}
                                        <motion.span
                                            layoutId="tab-underline"
                                            className="absolute left-3 right-3 bottom-1 rounded-full"
                                            style={{
                                                height: 2,
                                                background: 'linear-gradient(90deg, #D95B16, #FF7A29, #FFA057)',
                                                boxShadow: '0 0 8px rgba(255,122,41,0.6)',
                                            }}
                                            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                        />
                                        {/* Micro LED dot */}
                                        <span
                                            className="absolute -top-0.5 right-2.5"
                                            style={{
                                                width: 4, height: 4,
                                                borderRadius: '50%',
                                                background: '#FF7A29',
                                                boxShadow: '0 0 6px rgba(255,122,41,0.8)',
                                            }}
                                        />
                                    </>
                                )}
                                {tab}
                            </button>
                        );
                    })}
                </div>

                <div style={{ flex: 1 }} />

                {/* Search */}
                <div style={{ minWidth: 260 }}>
                    <PhoenixInput
                        icon={Search}
                        type="text"
                        placeholder="Search targets..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* ── Lead Cards ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {/* Column Headers */}
                <div
                    className="hidden md:grid"
                    style={{
                        gridTemplateColumns: '38px 1fr 1fr 120px 130px 90px 1fr 36px',
                        gap: 12,
                        padding: '0 20px',
                        marginBottom: 4,
                    }}
                >
                    {['', 'ENTITY', 'CONTACT', 'VALUE', 'STATUS', 'SCORE', 'LAST ACTION', ''].map((h, i) => (
                        <span
                            key={i}
                            style={{
                                fontFamily: 'JetBrains Mono, monospace',
                                fontSize: 9,
                                fontWeight: 700,
                                letterSpacing: '0.2em',
                                color: '#4A4F5A',
                                textTransform: 'uppercase',
                            }}
                        >
                            {h}
                        </span>
                    ))}
                </div>

                <AnimatePresence mode="popLayout">
                    {filtered.map((lead, i) => (
                        <motion.div
                            key={lead.id}
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6, scale: 0.98 }}
                            transition={{ duration: 0.28, delay: i * 0.04 }}
                        >
                            <div
                                className="group relative"
                                style={{
                                    background: i % 2 === 0
                                        ? 'linear-gradient(145deg, #181A1D 0%, #1E2023 100%)'
                                        : 'linear-gradient(145deg, #1A1C1F 0%, #202327 100%)',
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    borderRadius: 12,
                                    padding: '14px 20px',
                                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04), 0 2px 10px rgba(0,0,0,0.35)',
                                    cursor: 'pointer',
                                    transition: 'border-color 0.2s, box-shadow 0.2s',
                                    display: 'grid',
                                    gridTemplateColumns: '38px 1fr 1fr 120px 130px 90px 1fr 36px',
                                    alignItems: 'center',
                                    gap: 12,
                                }}
                                onMouseEnter={e => {
                                    (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,122,41,0.18)';
                                    (e.currentTarget as HTMLDivElement).style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.04), 0 4px 18px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,122,41,0.08)';
                                }}
                                onMouseLeave={e => {
                                    (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.05)';
                                    (e.currentTarget as HTMLDivElement).style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.04), 0 2px 10px rgba(0,0,0,0.35)';
                                }}
                            >
                                {/* Top bevel edge */}
                                <span
                                    className="absolute inset-x-0 top-0 rounded-t-xl"
                                    style={{ height: 1, background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }}
                                />

                                {/* Avatar */}
                                <Avatar initials={lead.initials} bg={lead.avatarColor} />

                                {/* Entity */}
                                <div>
                                    <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 13, color: '#E2E4E9' }}>
                                        {lead.name}
                                    </div>
                                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: '#4A4F5A', letterSpacing: '0.08em', marginTop: 2 }}>
                                        {lead.id}
                                    </div>
                                </div>

                                {/* Contact */}
                                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#7A7F8A' }}>
                                    {lead.contact}
                                </div>

                                {/* Value */}
                                <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 13, color: '#E2E4E9', letterSpacing: '0.01em' }}>
                                    {lead.value}
                                </div>

                                {/* Status */}
                                <StatusPill status={lead.status} />

                                {/* Score */}
                                <ScoreBar score={lead.score} />

                                {/* Last Action */}
                                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#5A5F69' }}>
                                    {lead.lastAction}
                                </div>

                                {/* Actions */}
                                <button
                                    className="flex items-center justify-center rounded-lg transition-colors"
                                    style={{
                                        width: 30, height: 30,
                                        background: 'rgba(255,255,255,0.03)',
                                        border: '1px solid rgba(255,255,255,0.06)',
                                        color: '#4A4F5A',
                                        cursor: 'pointer',
                                        outline: 'none',
                                    }}
                                    onMouseEnter={e => {
                                        (e.currentTarget as HTMLButtonElement).style.color = '#E2E4E9';
                                        (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,122,41,0.3)';
                                    }}
                                    onMouseLeave={e => {
                                        (e.currentTarget as HTMLButtonElement).style.color = '#4A4F5A';
                                        (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.06)';
                                    }}
                                >
                                    <ChevronRight size={13} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {filtered.length === 0 && (
                    <div
                        className="flex flex-col items-center justify-center py-20 gap-3"
                        style={{ color: '#4A4F5A' }}
                    >
                        <TrendingUp size={32} style={{ opacity: 0.4 }} />
                        <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, letterSpacing: '0.2em' }}>
                            NO TARGETS MATCH FILTER
                        </p>
                    </div>
                )}
            </div>

            {/* ── Footer Strip ── */}
            <div
                className="flex items-center justify-between"
                style={{
                    padding: '10px 20px',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.04)',
                    borderRadius: 10,
                }}
            >
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: '#4A4F5A', letterSpacing: '0.2em' }}>
                    SHOWING {filtered.length} / {MOCK_LEADS.length} TARGETS
                </span>
                <div className="flex gap-2">
                    {(['active', 'negotiating', 'new', 'archived'] as Status[]).map(s => {
                        const count = MOCK_LEADS.filter(l => l.status === s).length;
                        const cfg = STATUS_CONFIG[s];
                        return (
                            <span
                                key={s}
                                className="inline-flex items-center gap-1.5 px-2 py-1 rounded"
                                style={{
                                    fontFamily: 'JetBrains Mono, monospace',
                                    fontSize: 9,
                                    color: cfg.color,
                                    background: cfg.glow.replace('0.35', '0.06'),
                                    letterSpacing: '0.1em',
                                }}
                            >
                                <span className="rounded-full" style={{ width: 4, height: 4, background: cfg.dot }} />
                                {count} {s.toUpperCase()}
                            </span>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
