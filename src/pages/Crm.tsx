import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus, X, ChevronRight, GripVertical, Building2, DollarSign,
    Calendar, Tag, Loader2, AlertCircle, StickyNote
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Lead } from '../../lib/supabase';
import { useToast } from '../components/ui/Toast';
import { Trash2 } from 'lucide-react';

const H = 'JetBrains Mono, monospace';
const BD = 'Inter, sans-serif';
const MN = 'JetBrains Mono, monospace';

// ─── Board config ──────────────────────────────────────────────────────────────
const COLUMNS = [
    { id: 'new', title: 'New Leads', color: '#7A9FFF' },
    { id: 'qualifying', title: 'Qualifying', color: '#FF7A29' },
    { id: 'proposal', title: 'Proposal', color: '#A78BFA' },
    { id: 'negotiation', title: 'Negotiation', color: '#F59E0B' },
    { id: 'won', title: 'Closed Won', color: '#4BE77F' },
];

const TAG_COLORS: Record<string, { bg: string; border: string; text: string }> = {
    High: { bg: 'rgba(217,91,22,0.1)', border: 'rgba(217,91,22,0.35)', text: '#D95B16' },
    Medium: { bg: 'rgba(255,122,41,0.08)', border: 'rgba(255,122,41,0.3)', text: '#FF7A29' },
    Low: { bg: 'rgba(120,120,130,0.08)', border: 'rgba(120,120,130,0.25)', text: '#7A7F8A' },
};

// ─── Deal Card ─────────────────────────────────────────────────────────────────
const DealCard: React.FC<{
    deal: Lead;
    columnColor: string;
    onDragStart: (e: React.DragEvent, deal: Lead) => void;
    onClick: () => void;
    onDelete: (e: React.MouseEvent, id: string) => void;
    isDragging: boolean;
}> = ({ deal, columnColor, onDragStart, onClick, onDelete, isDragging }) => {
    const scoreTag = deal.score && deal.score > 80 ? 'High' : deal.score && deal.score > 40 ? 'Medium' : 'Low';
    const tagC = TAG_COLORS[scoreTag] ?? TAG_COLORS.Medium;
    return (
        <motion.div
            layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2, boxShadow: `0 8px 30px rgba(0,0,0,0.4), 0 0 0 1px ${columnColor}22` }}
            draggable
            onDragStart={e => onDragStart(e, deal)}
            onClick={onClick}
            style={{ borderRadius: 14, padding: '14px 16px', background: isDragging ? `${columnColor}1A` : 'linear-gradient(145deg,#1C1E22,#23262B)', border: `1px solid ${isDragging ? columnColor + '55' : 'rgba(255,255,255,0.06)'}`, cursor: 'grab', position: 'relative', overflow: 'hidden', userSelect: 'none' }}>
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: columnColor, borderRadius: '14px 0 0 14px', opacity: 0.6 }} />
            <div style={{ paddingLeft: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
                    <p style={{ fontFamily: BD, fontSize: 13, fontWeight: 600, color: 'var(--text-primary,#E2E4E9)', lineHeight: 1.4 }}>{deal.name}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontFamily: MN, fontSize: 8, letterSpacing: '0.14em', padding: '3px 8px', borderRadius: 99, flexShrink: 0, background: tagC.bg, border: `1px solid ${tagC.border}`, color: tagC.text }}>{scoreTag}</span>
                        <motion.button
                            whileHover={{ color: '#FF4B4B', background: 'rgba(255,75,75,0.1)' }}
                            onClick={(e) => onDelete(e, deal.id)}
                            style={{ padding: 4, borderRadius: 6, background: 'none', border: 'none', color: '#4A4F5A', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Trash2 size={12} />
                        </motion.button>
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Building2 size={10} style={{ color: '#4A4F5A', flexShrink: 0 }} />
                        <span style={{ fontFamily: BD, fontSize: 11, color: '#6A6F7A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{deal.company}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                            <DollarSign size={10} style={{ color: '#4BE77F' }} />
                            <span style={{ fontFamily: H, fontSize: 11, fontWeight: 700, color: '#4BE77F' }}>{deal.value}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                            <Calendar size={9} style={{ color: '#3A3F4A' }} />
                            <span style={{ fontFamily: MN, fontSize: 9, color: '#3A3F4A', letterSpacing: '0.06em' }}>{deal.created_at ? new Date(deal.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : ''}</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// ─── Deal Modal (Create / Edit) ────────────────────────────────────────────────
const DealModal: React.FC<{
    deal?: Partial<Lead>;
    columnId?: string;
    onClose: () => void;
    onSaved: () => void;
}> = ({ deal, columnId, onClose, onSaved }) => {
    const toast = useToast();
    const isEdit = !!deal?.id;
    const [f, setF] = useState<Partial<Lead>>(deal ?? {
        name: '', company: '', value: '', score: 50,
        status: 'New', notes: '', crm_stage: columnId ?? 'new',
    });
    const [saving, setSaving] = useState(false);
    const [err, setErr] = useState('');

    const inputSt: React.CSSProperties = {
        padding: '10px 14px', borderRadius: 10, width: '100%', boxSizing: 'border-box',
        background: 'linear-gradient(145deg,#131416,#181A1D)',
        border: '1px solid rgba(255,255,255,0.07)',
        color: 'var(--text-primary,#E2E4E9)', fontFamily: BD, fontSize: 13, outline: 'none'
    };
    const labelSt: React.CSSProperties = { fontFamily: MN, fontSize: 8, letterSpacing: '0.22em', color: '#7A7F8A', textTransform: 'uppercase', display: 'block', marginBottom: 5 };

    const handleSave = async () => {
        if (!f.name || !f.company) { setErr('Name and company are required.'); return; }
        setSaving(true); setErr('');
        const payload = { ...f };
        let error;
        if (isEdit) {
            ({ error } = await supabase.from('leads').update(payload).eq('id', deal!.id!));
        } else {
            const initials = f.name?.split(' ').map(w => w[0] || '').join('').slice(0, 2).toUpperCase() || '??';
            ({ error } = await supabase.from('leads').insert([{ ...payload, initials, last_action: 'Created from CRM' }]));
        }
        setSaving(false);
        if (error) { setErr(error.message); return; }
        toast.success(isEdit ? 'Deal updated!' : 'Deal created!');
        onSaved(); onClose();
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(10px)', padding: 24 }}
            onClick={onClose}>
            <motion.div initial={{ scale: 0.94, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.94, y: 20 }}
                transition={{ type: 'spring', stiffness: 340, damping: 30 }}
                onClick={e => e.stopPropagation()}
                style={{ width: '100%', maxWidth: 480, borderRadius: 20, background: 'linear-gradient(145deg,#181A1D,#1E2023)', border: '1px solid rgba(255,255,255,0.07)', boxShadow: '0 0 60px rgba(255,122,41,0.1),0 30px 80px rgba(0,0,0,0.7)', overflow: 'hidden' }}>
                <div style={{ height: 2, background: 'linear-gradient(90deg,transparent,rgba(255,122,41,0.7),transparent)' }} />
                <div style={{ padding: '24px 28px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
                        <p style={{ fontFamily: H, fontSize: 12, fontWeight: 700, color: '#E2E4E9' }}>{isEdit ? 'EDIT DEAL' : 'NEW DEAL'}</p>
                        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#7A7F8A', cursor: 'pointer' }}><X size={16} /></button>
                    </div>
                    {err && <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 10, background: 'rgba(217,91,22,0.1)', border: '1px solid rgba(217,91,22,0.3)', marginBottom: 16 }}><AlertCircle size={13} style={{ color: '#D95B16' }} /><span style={{ fontFamily: BD, fontSize: 12, color: '#D95B16' }}>{err}</span></div>}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                            <div style={{ gridColumn: '1/-1' }}>
                                <label style={labelSt}>Lead Name *</label>
                                <input value={f.name ?? ''} onChange={e => setF(p => ({ ...p, name: e.target.value }))} style={inputSt} />
                            </div>
                            <div>
                                <label style={labelSt}>Company *</label>
                                <input value={f.company ?? ''} onChange={e => setF(p => ({ ...p, company: e.target.value }))} style={inputSt} />
                            </div>
                            <div>
                                <label style={labelSt}>Deal Value</label>
                                <input value={f.value ?? ''} onChange={e => setF(p => ({ ...p, value: e.target.value }))} placeholder="$50k" style={inputSt} />
                            </div>
                            <div>
                                <label style={labelSt}>Priority</label>
                                <select value={f.score && f.score > 80 ? 'High' : f.score && f.score > 40 ? 'Medium' : 'Low'} onChange={e => setF(p => ({ ...p, score: e.target.value === 'High' ? 100 : e.target.value === 'Medium' ? 50 : 20 }))} style={inputSt}>
                                    {['High', 'Medium', 'Low'].map(t => <option key={t}>{t}</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={labelSt}>Stage</label>
                                <select value={(f as any).crm_stage ?? 'new'} onChange={e => setF(p => ({ ...p, crm_stage: e.target.value }))} style={inputSt}>
                                    {COLUMNS.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label style={labelSt}>Notes</label>
                            <textarea value={f.notes ?? ''} onChange={e => setF(p => ({ ...p, notes: e.target.value }))} rows={3}
                                style={{ ...inputSt, resize: 'vertical' }} />
                        </div>
                        <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.97 }}
                            onClick={handleSave} disabled={saving}
                            style={{ padding: '13px', borderRadius: 12, background: 'linear-gradient(145deg,#1E2024,#151719)', border: '1px solid rgba(255,122,41,0.48)', color: saving ? '#7A7F8A' : '#FF7A29', fontFamily: H, fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', cursor: saving ? 'default' : 'pointer', boxShadow: '0 0 14px rgba(255,122,41,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                            {saving ? <><Loader2 size={12} style={{ animation: 'spin 0.8s linear infinite' }} />SAVING…</> : isEdit ? 'SAVE CHANGES' : 'CREATE DEAL'}
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

// ─── Deal Detail Drawer ────────────────────────────────────────────────────────
const DealDetailDrawer: React.FC<{
    deal: Lead;
    colTitle: string;
    onClose: () => void;
    onEdit: () => void;
}> = ({ deal, colTitle, onClose, onEdit }) => {
    const col = COLUMNS.find(c => c.id === deal.crm_stage);
    const scoreTag = deal.score && deal.score > 80 ? 'High' : deal.score && deal.score > 40 ? 'Medium' : 'Low';
    const tagC = TAG_COLORS[scoreTag] ?? TAG_COLORS.Medium;
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 9990, display: 'flex', alignItems: 'stretch', justifyContent: 'flex-end' }}
            onClick={onClose}>
            <motion.div initial={{ x: 400 }} animate={{ x: 0 }} exit={{ x: 400 }}
                transition={{ type: 'spring', stiffness: 320, damping: 32 }}
                onClick={e => e.stopPropagation()}
                style={{ width: 380, background: 'linear-gradient(160deg,#16181C,#1C1E24)', borderLeft: '1px solid rgba(255,255,255,0.07)', boxShadow: '-12px 0 60px rgba(0,0,0,0.6)', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
                <div style={{ height: 2, background: `linear-gradient(90deg,transparent,${col?.color ?? '#FF7A29'}88,transparent)` }} />
                <div style={{ padding: '24px 24px 32px', flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                        <span style={{ fontFamily: MN, fontSize: 8, letterSpacing: '0.2em', color: col?.color ?? '#FF7A29', textTransform: 'uppercase' }}>{colTitle}</span>
                        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#7A7F8A', cursor: 'pointer' }}><X size={15} /></button>
                    </div>
                    <h2 style={{ fontFamily: H, fontSize: 18, fontWeight: 800, color: 'var(--text-primary,#FFF)', letterSpacing: '-0.3px', marginBottom: 8, lineHeight: 1.3 }}>{deal.name}</h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
                        <Building2 size={12} style={{ color: '#4A4F5A' }} />
                        <span style={{ fontFamily: BD, fontSize: 13, color: '#7A7F8A' }}>{deal.company}</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
                        {[
                            { label: 'Deal Value', val: deal.value, color: '#4BE77F' },
                            { label: 'Priority', val: scoreTag, color: tagC.text },
                            { label: 'Stage', val: colTitle, color: col?.color ?? '#FF7A29' },
                            { label: 'Added', val: deal.created_at ? new Date(deal.created_at).toLocaleDateString() : 'N/A', color: '#7A7F8A' },
                        ].map(({ label, val, color }) => (
                            <div key={label} style={{ padding: '12px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <p style={{ fontFamily: MN, fontSize: 8, letterSpacing: '0.18em', color: '#3A3F4A', textTransform: 'uppercase', marginBottom: 5 }}>{label}</p>
                                <p style={{ fontFamily: H, fontSize: 13, fontWeight: 700, color }}>{val}</p>
                            </div>
                        ))}
                    </div>
                    {deal.notes && (
                        <div style={{ padding: '14px 16px', borderRadius: 12, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', marginBottom: 20 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
                                <StickyNote size={11} style={{ color: '#4A4F5A' }} />
                                <p style={{ fontFamily: MN, fontSize: 8, letterSpacing: '0.18em', color: '#3A3F4A', textTransform: 'uppercase' }}>Notes</p>
                            </div>
                            <p style={{ fontFamily: BD, fontSize: 13, color: '#8A8F9A', lineHeight: 1.7 }}>{deal.notes}</p>
                        </div>
                    )}
                    <motion.button whileHover={{ borderColor: 'rgba(255,122,41,0.5)' }} whileTap={{ scale: 0.97 }}
                        onClick={onEdit}
                        style={{ width: '100%', padding: '12px 18px', borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', color: '#E2E4E9', fontFamily: BD, fontSize: 13, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                        Edit Deal <ChevronRight size={13} />
                    </motion.button>
                </div>
            </motion.div>
        </motion.div>
    );
};

// ─── CRM Page ─────────────────────────────────────────────────────────────────
export const Crm: React.FC = () => {
    const toast = useToast();
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [newDealCol, setNewDealCol] = useState<string | null>(null);
    const [editingDeal, setEditingDeal] = useState<Lead | null>(null);
    const [viewingDeal, setViewingDeal] = useState<Lead | null>(null);
    const [draggingDeal, setDraggingDeal] = useState<Lead | null>(null);
    const [dragOverCol, setDragOverCol] = useState<string | null>(null);

    const fetchLeads = useCallback(async () => {
        setLoading(true); setError('');
        const { data, error: err } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
        setLoading(false);
        if (err) { setError(err.message); return; }
        setLeads(data ?? []);
    }, []);

    useEffect(() => { fetchLeads(); }, [fetchLeads]);

    // ─── Realtime: refresh board on any leads change ───────────────────────
    useEffect(() => {
        const channel = supabase
            .channel('crm_realtime')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, () => {
                fetchLeads();
            })
            .subscribe();
        return () => { supabase.removeChannel(channel); };
    }, [fetchLeads]);

    const dealsInCol = (colId: string) => leads.filter(l => (l as any).crm_stage === colId || (colId === 'new' && !(l as any).crm_stage));

    const handleDrop = async (colId: string) => {
        if (!draggingDeal || (draggingDeal as any).crm_stage === colId) { setDraggingDeal(null); setDragOverCol(null); return; }
        const updated = { ...draggingDeal, crm_stage: colId };
        setLeads(prev => prev.map(l => l.id === draggingDeal.id ? updated : l));
        await supabase.from('leads').update({ crm_stage: colId }).eq('id', draggingDeal.id);
        setDraggingDeal(null); setDragOverCol(null);
    };

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (!confirm('Delete this lead?')) return;
        const { error } = await supabase.from('leads').delete().eq('id', id);
        if (error) { toast.error(error.message); return; }
        toast.success('Lead removed');
        fetchLeads();
    };

    const totalValue = leads.reduce((sum, l) => {
        const n = parseFloat(String(l.value ?? '').replace(/[^0-9.]/g, ''));
        return sum + (isNaN(n) ? 0 : n);
    }, 0);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
                <div>
                    <p style={{ fontFamily: MN, fontSize: 9, letterSpacing: '0.3em', color: '#7A7F8A', textTransform: 'uppercase', marginBottom: 10 }}>// Sales · Pipeline</p>
                    <h1 style={{ fontFamily: H, fontSize: 'clamp(28px,4vw,40px)', fontWeight: 800, color: 'var(--text-primary,#FFF)', letterSpacing: '-0.5px', textTransform: 'uppercase', lineHeight: 1 }}>CRM Board</h1>
                    <p style={{ fontFamily: BD, fontSize: 14, color: '#7A7F8A', marginTop: 8 }}>
                        {leads.length} lead{leads.length !== 1 ? 's' : ''} · ${totalValue.toLocaleString()} pipeline · Live from Supabase
                    </p>
                </div>
                <motion.button whileHover={{ scale: 1.015, boxShadow: '0 0 22px rgba(255,122,41,0.22)' }} whileTap={{ scale: 0.97 }}
                    onClick={() => setNewDealCol('new')}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 12, background: 'linear-gradient(145deg,#1E2024,#151719)', border: '1px solid rgba(255,122,41,0.48)', color: '#FF7A29', fontFamily: H, fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', cursor: 'pointer', boxShadow: '0 0 12px rgba(255,122,41,0.1)', alignSelf: 'flex-start' }}>
                    <Plus size={12} />NEW DEAL
                </motion.button>
            </div>

            {error && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 18px', borderRadius: 12, background: 'rgba(217,91,22,0.08)', border: '1px solid rgba(217,91,22,0.3)' }}>
                    <AlertCircle size={14} style={{ color: '#D95B16' }} />
                    <span style={{ fontFamily: BD, fontSize: 13, color: '#D95B16' }}>Failed to load leads: {error}</span>
                    <button onClick={fetchLeads} style={{ marginLeft: 'auto', fontFamily: H, fontSize: 9, color: '#FF7A29', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.1em' }}>RETRY</button>
                </div>
            )}

            {/* Kanban Board */}
            {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
                    <Loader2 size={22} style={{ color: '#FF7A29', animation: 'spin 1s linear infinite' }} />
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, alignItems: 'start', overflowX: 'auto', minWidth: 0 }}>
                    {COLUMNS.map(col => {
                        const colDeals = dealsInCol(col.id);
                        const colValue = colDeals.reduce((s, d) => {
                            const n = parseFloat(String(d.value ?? '').replace(/[^0-9.]/g, ''));
                            return s + (isNaN(n) ? 0 : n);
                        }, 0);
                        return (
                            <div key={col.id}
                                onDragOver={e => { e.preventDefault(); setDragOverCol(col.id); }}
                                onDrop={() => handleDrop(col.id)}
                                onDragLeave={() => setDragOverCol(null)}
                                style={{ borderRadius: 18, background: dragOverCol === col.id ? `${col.color}0A` : 'linear-gradient(145deg,#14161A,#1A1C20)', border: `1px solid ${dragOverCol === col.id ? col.color + '33' : 'rgba(255,255,255,0.05)'}`, overflow: 'hidden', transition: 'all 0.2s', minWidth: 200 }}>
                                {/* Column header */}
                                <div style={{ height: 2, background: `linear-gradient(90deg,transparent,${col.color}88,transparent)` }} />
                                <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <p style={{ fontFamily: H, fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', color: col.color, textTransform: 'uppercase' }}>{col.title}</p>
                                        <p style={{ fontFamily: MN, fontSize: 8, color: '#3A3F4A', marginTop: 3 }}>{colDeals.length} deal{colDeals.length !== 1 ? 's' : ''} {colValue > 0 ? `· $${colValue.toLocaleString()}` : ''}</p>
                                    </div>
                                    <motion.button whileHover={{ background: `${col.color}20` }} whileTap={{ scale: 0.9 }}
                                        onClick={() => setNewDealCol(col.id)}
                                        style={{ width: 26, height: 26, borderRadius: 8, background: 'rgba(255,255,255,0.03)', border: `1px solid rgba(255,255,255,0.06)`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4A4F5A' }}>
                                        <Plus size={12} />
                                    </motion.button>
                                </div>
                                {/* Cards */}
                                <div style={{ padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 8, minHeight: 120 }}>
                                    {colDeals.length === 0 && (
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 80 }}>
                                            <p style={{ fontFamily: MN, fontSize: 8, color: '#2A2F3A', letterSpacing: '0.14em' }}>DRAG HERE</p>
                                        </div>
                                    )}
                                    {colDeals.map(deal => (
                                        <DealCard key={deal.id} deal={deal} columnColor={col.color}
                                            isDragging={draggingDeal?.id === deal.id}
                                            onDragStart={(_, d) => setDraggingDeal(d)}
                                            onClick={() => setViewingDeal(deal)}
                                            onDelete={handleDelete} />
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Modals */}
            <AnimatePresence>
                {newDealCol && (
                    <DealModal columnId={newDealCol} onClose={() => setNewDealCol(null)} onSaved={fetchLeads} />
                )}
                {editingDeal && (
                    <DealModal deal={editingDeal} columnId={(editingDeal as any).crm_stage}
                        onClose={() => setEditingDeal(null)} onSaved={() => { fetchLeads(); setViewingDeal(null); }} />
                )}
                {viewingDeal && !editingDeal && (
                    <DealDetailDrawer
                        deal={viewingDeal}
                        colTitle={COLUMNS.find(c => c.id === viewingDeal.crm_stage)?.title ?? ''}
                        onClose={() => setViewingDeal(null)}
                        onEdit={() => { setEditingDeal(viewingDeal); setViewingDeal(null); }} />
                )}
            </AnimatePresence>
        </div>
    );
};
