import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Plus, MoreHorizontal, Calendar, DollarSign, User, X, ChevronRight } from 'lucide-react';
import { PhoenixCard } from '../components/ui/PhoenixCard';
import { IndustrialButton } from '../components/ui/IndustrialButton';
import clsx from 'clsx';

// Type Definitions
interface Task {
    id: string;
    title: string;
    company: string;
    value: string;
    date: string;
    tag: 'High' | 'Medium' | 'Low';
    status?: string;
    notes?: string;
}

interface Column {
    id: string;
    title: string;
    tasks: Task[];
}

// Initial Data
const initialColumns: Column[] = [
    {
        id: 'new',
        title: 'New Leads',
        tasks: [
            { id: 't1', title: 'Enterprise License', company: 'Acme Corp', value: '$50k', date: '2d ago', tag: 'High', status: 'New', notes: 'Inbound via LinkedIn. Decision maker confirmed.' },
            { id: 't2', title: 'Q3 Consultation', company: 'Globex', value: '$12k', date: '1d ago', tag: 'Medium', status: 'New', notes: '' },
        ],
    },
    {
        id: 'qualifying',
        title: 'Qualifying',
        tasks: [
            { id: 't3', title: 'System Upgrade', company: 'Soylent Corp', value: '$120k', date: '4d ago', tag: 'High', status: 'Qualifying', notes: 'Needs technical review by CTO.' },
        ],
    },
    {
        id: 'proposal',
        title: 'Proposal Sent',
        tasks: [
            { id: 't4', title: 'Security Audit', company: 'Umbrella Corp', value: '$85k', date: '1w ago', tag: 'Medium', status: 'Proposal', notes: '' },
            { id: 't5', title: 'AI Integration', company: 'Cyberdyne', value: '$250k', date: '3d ago', tag: 'High', status: 'Proposal', notes: 'Follow up scheduled for Friday.' },
        ],
    },
    {
        id: 'negotiation',
        title: 'Negotiation',
        tasks: [
            { id: 't6', title: 'Fleet Management', company: 'Weyland-Yutani', value: '$1.2M', date: '2w ago', tag: 'High', status: 'Negotiation', notes: 'Legal reviewing contract. Expected close this month.' },
        ],
    },
    {
        id: 'closed',
        title: 'Closed Won',
        tasks: [],
    },
];

const H = 'JetBrains Mono, monospace';
const MN = 'JetBrains Mono, monospace';
const BD = 'Inter, sans-serif';

const STATUS_OPTIONS = ['New', 'Qualifying', 'Proposal', 'Negotiation', 'Closed Won'] as const;

// ─── DealModal ─────────────────────────────────────────────────────────────────
const DealModal: React.FC<{
    deal?: Task;
    onClose: () => void;
    onSave: (deal: Task) => void;
}> = ({ deal, onClose, onSave }) => {
    const [f, setF] = useState<Partial<Task>>(deal || { title: '', company: '', value: '', tag: 'Medium', date: 'Just now', status: 'New', notes: '' });

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)', padding: 24 }}>
            <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }}
                style={{ width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto', borderRadius: 20, background: 'linear-gradient(145deg,#181A1D,#1E2023)', border: '1px solid rgba(255,255,255,0.07)', boxShadow: '0 0 60px rgba(255,122,41,0.12),0 32px 80px rgba(0,0,0,0.7)', position: 'relative' }}>

                {/* Top accent bar */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,transparent,rgba(255,122,41,0.6),transparent)', borderRadius: '20px 20px 0 0' }} />

                <div style={{ padding: 32 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
                        <div>
                            <p style={{ fontFamily: MN, fontSize: 9, letterSpacing: '0.3em', color: '#7A7F8A', textTransform: 'uppercase', marginBottom: 8 }}>// {deal ? 'Edit Deal' : 'New Entry'}</p>
                            <h2 style={{ fontFamily: H, fontSize: 22, fontWeight: 900, color: '#FFF', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{deal ? 'Deal Intelligence' : 'Register Deal'}</h2>
                        </div>
                        <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: '#7A7F8A', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <X size={16} />
                        </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                        {/* Deal Title */}
                        <div>
                            <label style={{ fontFamily: MN, fontSize: 9, letterSpacing: '0.22em', color: '#7A7F8A', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Deal Title</label>
                            <input value={f.title} onChange={e => setF({ ...f, title: e.target.value })}
                                style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '12px 16px', color: '#FFF', fontFamily: BD, fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
                                placeholder="e.g. Enterprise Expansion" />
                        </div>

                        {/* Company + Value */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                            <div>
                                <label style={{ fontFamily: MN, fontSize: 9, letterSpacing: '0.22em', color: '#7A7F8A', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Company</label>
                                <input value={f.company} onChange={e => setF({ ...f, company: e.target.value })}
                                    style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '12px 16px', color: '#FFF', fontFamily: BD, fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
                                    placeholder="Acme Inc" />
                            </div>
                            <div>
                                <label style={{ fontFamily: MN, fontSize: 9, letterSpacing: '0.22em', color: '#7A7F8A', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Value</label>
                                <input value={f.value} onChange={e => setF({ ...f, value: e.target.value })}
                                    style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '12px 16px', color: '#FFF', fontFamily: BD, fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
                                    placeholder="$0.00" />
                            </div>
                        </div>

                        {/* Priority */}
                        <div>
                            <label style={{ fontFamily: MN, fontSize: 9, letterSpacing: '0.22em', color: '#7A7F8A', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Priority</label>
                            <div style={{ display: 'flex', gap: 10 }}>
                                {(['High', 'Medium', 'Low'] as const).map(p => (
                                    <button key={p} onClick={() => setF({ ...f, tag: p })}
                                        style={{ flex: 1, padding: '10px 0', borderRadius: 10, border: f.tag === p ? '1px solid rgba(255,122,41,0.5)' : '1px solid rgba(255,255,255,0.06)', background: f.tag === p ? 'rgba(255,122,41,0.1)' : 'rgba(255,255,255,0.03)', color: f.tag === p ? '#FF7A29' : '#7A7F8A', fontFamily: MN, fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', cursor: 'pointer' }}>
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Status */}
                        <div>
                            <label style={{ fontFamily: MN, fontSize: 9, letterSpacing: '0.22em', color: '#7A7F8A', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Status</label>
                            <select value={f.status || 'New'} onChange={e => setF({ ...f, status: e.target.value })}
                                style={{ width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '12px 16px', color: '#FFF', fontFamily: BD, fontSize: 13, outline: 'none', cursor: 'pointer' }}>
                                {STATUS_OPTIONS.map(s => <option key={s} value={s} style={{ background: '#1E2023' }}>{s}</option>)}
                            </select>
                        </div>

                        {/* Notes */}
                        <div>
                            <label style={{ fontFamily: MN, fontSize: 9, letterSpacing: '0.22em', color: '#7A7F8A', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Notes</label>
                            <textarea value={f.notes || ''} onChange={e => setF({ ...f, notes: e.target.value })} rows={3}
                                style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '12px 16px', color: '#FFF', fontFamily: BD, fontSize: 13, outline: 'none', resize: 'vertical', boxSizing: 'border-box', lineHeight: 1.6 }}
                                placeholder="Additional context, next steps..." />
                        </div>
                    </div>

                    <div style={{ marginTop: 28 }}>
                        <motion.button whileHover={{ brightness: 1.1 } as any} whileTap={{ scale: 0.97 }}
                            onClick={() => { if (f.title && f.company) onSave({ ...(f as Task), id: deal?.id || `t${Date.now()}` }); }}
                            style={{ width: '100%', padding: '14px 0', background: 'linear-gradient(135deg,#D95B16,#FF7A29)', borderRadius: 14, border: 'none', color: '#FFF', fontFamily: H, fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', cursor: 'pointer', boxShadow: '0 0 24px rgba(255,122,41,0.35)' }}>
                            {deal ? 'Update Pipeline' : 'Inject Deal'}
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

// ─── DealDetailDrawer ──────────────────────────────────────────────────────────
const DealDetailDrawer: React.FC<{
    deal: Task;
    colTitle: string;
    onClose: () => void;
    onEdit: () => void;
}> = ({ deal, colTitle, onClose, onEdit }) => {
    const tagColor = deal.tag === 'High' ? '#FF7A29' : deal.tag === 'Medium' ? '#D4A017' : '#7A7F8A';

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 9998, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)' }}
            onClick={onClose}>
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                transition={{ type: 'spring', stiffness: 340, damping: 34 }}
                onClick={e => e.stopPropagation()}
                style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '100%', maxWidth: 460, background: 'linear-gradient(160deg,#181A1D,#1C1E22)', borderLeft: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column', boxShadow: '-32px 0 80px rgba(0,0,0,0.6)' }}>

                {/* Top accent */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,rgba(255,122,41,0.6),rgba(255,122,41,0.2),transparent)' }} />

                {/* Header */}
                <div style={{ padding: '28px 28px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div style={{ flex: 1, minWidth: 0, paddingRight: 12 }}>
                        <p style={{ fontFamily: MN, fontSize: 9, letterSpacing: '0.28em', color: '#7A7F8A', textTransform: 'uppercase', marginBottom: 10 }}>// Deal Intelligence</p>
                        <h2 style={{ fontFamily: H, fontSize: 18, fontWeight: 900, color: '#FFF', textTransform: 'uppercase', letterSpacing: '0.06em', lineHeight: 1.2 }}>{deal.title}</h2>
                    </div>
                    <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: '#7A7F8A', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <X size={15} />
                    </button>
                </div>

                {/* Body */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
                    {/* Key metrics */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
                        {[
                            { label: 'Company', value: deal.company, icon: '🏢' },
                            { label: 'Deal Value', value: deal.value, icon: '💰', accent: true },
                            { label: 'Stage', value: colTitle, icon: '📍' },
                            { label: 'Added', value: deal.date, icon: '🕐' },
                        ].map(({ label, value, accent }) => (
                            <div key={label} style={{ padding: '14px 16px', borderRadius: 12, background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <p style={{ fontFamily: MN, fontSize: 8, letterSpacing: '0.2em', color: '#5A5F69', textTransform: 'uppercase', marginBottom: 6 }}>{label}</p>
                                <p style={{ fontFamily: BD, fontSize: 13, fontWeight: 700, color: accent ? '#FF7A29' : '#E2E4E9' }}>{value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Priority + Status */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                        <span style={{ padding: '5px 12px', borderRadius: 8, background: `${tagColor}18`, border: `1px solid ${tagColor}44`, color: tagColor, fontFamily: MN, fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                            {deal.tag} Priority
                        </span>
                        {deal.status && (
                            <span style={{ padding: '5px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: '#9CA0A8', fontFamily: MN, fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                                {deal.status}
                            </span>
                        )}
                    </div>

                    {/* Notes */}
                    {deal.notes ? (
                        <div style={{ padding: '16px 18px', borderRadius: 12, background: 'rgba(255,122,41,0.03)', border: '1px solid rgba(255,122,41,0.1)', marginBottom: 20 }}>
                            <p style={{ fontFamily: MN, fontSize: 8, letterSpacing: '0.22em', color: '#7A7F8A', textTransform: 'uppercase', marginBottom: 8 }}>Notes</p>
                            <p style={{ fontFamily: BD, fontSize: 13, color: '#C8CAD0', lineHeight: 1.7 }}>{deal.notes}</p>
                        </div>
                    ) : (
                        <div style={{ padding: '16px 18px', borderRadius: 12, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', marginBottom: 20 }}>
                            <p style={{ fontFamily: BD, fontSize: 12, color: '#4A4F5A', fontStyle: 'italic' }}>No notes added yet.</p>
                        </div>
                    )}
                </div>

                {/* Footer action */}
                <div style={{ padding: '20px 28px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <motion.button whileHover={{ boxShadow: '0 0 24px rgba(255,122,41,0.3)' }} whileTap={{ scale: 0.97 }}
                        onClick={onEdit}
                        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '13px 0', background: 'linear-gradient(135deg,#D95B16,#FF7A29)', borderRadius: 12, border: 'none', color: '#FFF', fontFamily: H, fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', cursor: 'pointer' }}>
                        Edit Deal <ChevronRight size={13} />
                    </motion.button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export const Crm = () => {
    const [columns, setColumns] = useState<Column[]>(initialColumns);
    const [selectedDeal, setSelectedDeal] = useState<{ deal?: Task; colId?: string } | null>(null);
    const [viewDeal, setViewDeal] = useState<{ deal: Task; colTitle: string } | null>(null);

    const onSaveDeal = (deal: Task) => {
        if (selectedDeal?.deal) {
            // Edit
            setColumns(cols => cols.map(c => ({
                ...c,
                tasks: c.tasks.map(t => t.id === deal.id ? deal : t)
            })));
        } else {
            // New
            setColumns(cols => cols.map((c, i) => i === 0 ? { ...c, tasks: [deal, ...c.tasks] } : c));
        }
        setSelectedDeal(null);
    };

    const onDragEnd = (result: DropResult) => {
        const { source, destination } = result;
        if (!destination) return;
        if (source.droppableId === destination.droppableId && source.index === destination.index) return;

        const sourceColIndex = columns.findIndex(col => col.id === source.droppableId);
        const destColIndex = columns.findIndex(col => col.id === destination.droppableId);
        const sourceCol = columns[sourceColIndex];
        const destCol = columns[destColIndex];
        const sourceTasks = Array.from(sourceCol.tasks);
        const destTasks = Array.from(destCol.tasks);
        const [removed] = sourceTasks.splice(source.index, 1);

        if (source.droppableId === destination.droppableId) {
            sourceTasks.splice(destination.index, 0, removed);
            const newColumns = [...columns];
            newColumns[sourceColIndex] = { ...sourceCol, tasks: sourceTasks };
            setColumns(newColumns);
        } else {
            destTasks.splice(destination.index, 0, removed);
            const newColumns = [...columns];
            newColumns[sourceColIndex] = { ...sourceCol, tasks: sourceTasks };
            newColumns[destColIndex] = { ...destCol, tasks: destTasks };
            setColumns(newColumns);
        }
    };

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col">
            {/* Deal Detail Drawer */}
            <AnimatePresence>
                {viewDeal && (
                    <DealDetailDrawer
                        deal={viewDeal.deal}
                        colTitle={viewDeal.colTitle}
                        onClose={() => setViewDeal(null)}
                        onEdit={() => {
                            setSelectedDeal({ deal: viewDeal.deal });
                            setViewDeal(null);
                        }}
                    />
                )}
            </AnimatePresence>

            {/* Deal Edit/Create Modal */}
            <AnimatePresence>
                {selectedDeal && <DealModal deal={selectedDeal.deal} onClose={() => setSelectedDeal(null)} onSave={onSaveDeal} />}
            </AnimatePresence>

            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <p style={{ fontFamily: MN, fontSize: 9, letterSpacing: '0.3em', color: '#7A7F8A', textTransform: 'uppercase', marginBottom: 10 }}>// Pipeline Manager · v2.1</p>
                    <h1 style={{ fontFamily: H, fontSize: 'clamp(28px,4vw,40px)', fontWeight: 800, color: '#FFF', letterSpacing: '-0.5px', textTransform: 'uppercase', lineHeight: 1 }}>Deal Pipeline</h1>
                </div>
                <IndustrialButton icon={Plus} onClick={() => setSelectedDeal({})}>New Deal</IndustrialButton>
            </div>

            {/* Kanban Board */}
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
                    <div className="flex gap-6 h-full min-w-max">
                        {columns.map((column) => (
                            <div key={column.id} className="w-80 flex flex-col">
                                {/* Column Header */}
                                <div className="flex items-center justify-between mb-4 p-3 bg-phoenix-surface/50 border border-white/5 rounded-lg border-l-4 border-l-ember-primary backdrop-blur-sm shadow-stone-bevel">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider">{column.title}</h3>
                                        <span className="text-xs font-mono text-phoenix-muted px-1.5 py-0.5 bg-white/5 rounded">
                                            {column.tasks.length}
                                        </span>
                                    </div>
                                    <button className="text-phoenix-muted hover:text-white transition-colors">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Droppable Area */}
                                <Droppable droppableId={column.id}>
                                    {(provided, snapshot) => (
                                        <div
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            className={clsx(
                                                "flex-1 rounded-xl transition-colors p-2 -mx-2",
                                                snapshot.isDraggingOver ? "bg-white/5" : "bg-transparent"
                                            )}
                                        >
                                            <div className="space-y-3">
                                                {column.tasks.map((task, index) => (
                                                    <Draggable draggableId={task.id} index={index}>
                                                        {(provided, snapshot) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                style={{ ...provided.draggableProps.style }}
                                                            >
                                                                <PhoenixCard
                                                                    className={clsx(
                                                                        "p-5 cursor-grab active:cursor-grabbing hover:border-ember-primary/50 transition-colors group relative overflow-hidden",
                                                                        snapshot.isDragging && "shadow-orange-glow rotate-2 scale-105"
                                                                    )}
                                                                    onClick={() => setViewDeal({ deal: task, colTitle: column.title })}
                                                                >
                                                                    {/* Side accent */}
                                                                    <div className={clsx(
                                                                        "absolute left-0 top-0 bottom-0 w-1",
                                                                        task.tag === 'High' ? "bg-ember-primary" :
                                                                            task.tag === 'Medium' ? "bg-amber-500/60" :
                                                                                "bg-phoenix-muted"
                                                                    )} />
                                                                    {/* Tag & Menu */}
                                                                    <div className="flex justify-between items-start mb-3">
                                                                        <span className={clsx(
                                                                            "text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded border",
                                                                            task.tag === 'High' ? "bg-ember-primary/10 text-ember-primary border-ember-primary/20" :
                                                                                task.tag === 'Medium' ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                                                                                    "bg-phoenix-muted/10 text-phoenix-muted border-phoenix-muted/20"
                                                                        )}>
                                                                            {task.tag} Priority
                                                                        </span>
                                                                        <button className="opacity-0 group-hover:opacity-100 transition-opacity text-phoenix-muted hover:text-white" onClick={e => { e.stopPropagation(); setSelectedDeal({ deal: task }); }}>
                                                                            <MoreHorizontal className="w-4 h-4" />
                                                                        </button>
                                                                    </div>

                                                                    <h4 className="text-white font-bold mb-1">{task.title}</h4>
                                                                    <div className="flex items-center gap-1 text-phoenix-muted text-xs mb-4">
                                                                        <User className="w-3 h-3" />
                                                                        {task.company}
                                                                    </div>

                                                                    <div className="flex items-center justify-between pt-3 border-t border-white/5">
                                                                        <div className="flex items-center gap-1 text-ember-primary font-mono font-bold text-xs">
                                                                            <DollarSign className="w-3 h-3" />
                                                                            {task.value}
                                                                        </div>
                                                                        <div className="flex items-center gap-1 text-phoenix-muted text-[10px]">
                                                                            <Calendar className="w-3 h-3" />
                                                                            {task.date}
                                                                        </div>
                                                                    </div>
                                                                </PhoenixCard>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </div>
                                        </div>
                                    )}
                                </Droppable>
                            </div>
                        ))}
                    </div>
                </div>
            </DragDropContext>
        </div>
    );
};
