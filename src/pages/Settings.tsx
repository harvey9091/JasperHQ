import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Key, Database, Bell, Moon, Upload, Eye, EyeOff, ToggleLeft, ToggleRight, Download, Trash2, FileUp, Save, Loader2, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const H = 'JetBrains Mono, monospace';
const BD = 'Inter, sans-serif';
const MN = 'JetBrains Mono, monospace';

// ─── Reusable sub-components ──────────────────────────────────────────────────
const Card: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
    <div style={{ borderRadius: 16, background: 'linear-gradient(145deg,#181A1D,#202226)', border: '1px solid rgba(255,255,255,0.06)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)', ...style }}>
        {children}
    </div>
);

const SectionHeader: React.FC<{ icon: React.ElementType; title: string; sub?: string }> = ({ icon: Icon, title, sub }) => (
    <div style={{ padding: '22px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,122,41,0.08)', border: '1px solid rgba(255,122,41,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon size={14} style={{ color: '#FF7A29' }} />
        </div>
        <div>
            <p style={{ fontFamily: H, fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', color: '#FFF', textTransform: 'uppercase' }}>{title}</p>
            {sub && <p style={{ fontFamily: BD, fontSize: 11, color: '#5A5F69', marginTop: 3 }}>{sub}</p>}
        </div>
    </div>
);

const FieldInput: React.FC<{ label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }> = ({ label, value, onChange, type = 'text', placeholder }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <label style={{ fontFamily: MN, fontSize: 8, letterSpacing: '0.22em', color: '#7A7F8A', textTransform: 'uppercase' }}>{label}</label>
        <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
            style={{ padding: '10px 14px', borderRadius: 10, background: 'linear-gradient(145deg,#131416,#181A1D)', border: '1px solid rgba(255,255,255,0.07)', color: '#E2E4E9', fontFamily: BD, fontSize: 13, caretColor: '#FF7A29', outline: 'none', boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.3)' }} />
    </div>
);

const Toggle: React.FC<{ on: boolean; onToggle: () => void; label: string; sub?: string }> = ({ on, onToggle, label, sub }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <div>
            <p style={{ fontFamily: BD, fontSize: 13, fontWeight: 500, color: '#E2E4E9' }}>{label}</p>
            {sub && <p style={{ fontFamily: BD, fontSize: 11, color: '#5A5F69', marginTop: 2 }}>{sub}</p>}
        </div>
        <motion.button onClick={onToggle} whileTap={{ scale: 0.93 }} style={{ cursor: 'pointer', background: 'none', border: 'none', color: on ? '#FF7A29' : '#3A3F4A' }}>
            {on ? <ToggleRight size={28} style={{ filter: 'drop-shadow(0 0 6px rgba(255,122,41,0.5))' }} /> : <ToggleLeft size={28} />}
        </motion.button>
    </div>
);

interface ApiKey { label: string; value: string; show: boolean }

export const Settings: React.FC = () => {
    const [name, setName] = useState('Jasper Admin');
    const [email, setEmail] = useState('admin@jasperhq.io');
    const [phone, setPhone] = useState('+1 555 0000');
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    // Load profile from Supabase settings table
    useEffect(() => {
        supabase.from('settings').select('value').eq('key', 'profile').eq('user_id', 'default')
            .maybeSingle().then(({ data }) => {
                if (data?.value) {
                    const v = data.value as Record<string, string>;
                    if (v.name) setName(v.name);
                    if (v.email) setEmail(v.email);
                    if (v.phone) setPhone(v.phone);
                }
            });
    }, []);

    const saveProfile = async () => {
        setSaving(true); setSaved(false);
        await supabase.from('settings').upsert(
            { user_id: 'default', key: 'profile', value: { name, email, phone } },
            { onConflict: 'user_id,key' }
        );
        setSaving(false); setSaved(true);
        setTimeout(() => setSaved(false), 2200);
    };

    const [animOn, setAnimOn] = useState(true);
    const [notifOn, setNotifOn] = useState(true);
    const [soundOn, setSoundOn] = useState(false);

    const [keys, setKeys] = useState<ApiKey[]>([
        { label: 'OpenAI API Key', value: 'sk-••••••••••••••••••••••', show: false },
        { label: 'Supabase API Key', value: 'sb-••••••••••••••••••••••', show: false },
        { label: 'Webhook Secret', value: 'wh-••••••••••••••••••••••', show: false },
        { label: 'AI Model Endpoint', value: 'https://api.jasperhq.io/v1', show: false },
    ]);
    const toggleShow = (i: number) => setKeys(k => k.map((ki, idx) => idx === i ? { ...ki, show: !ki.show } : ki));

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {/* Header */}
            <div>
                <p style={{ fontFamily: MN, fontSize: 9, letterSpacing: '0.3em', color: '#7A7F8A', textTransform: 'uppercase', marginBottom: 10 }}>// System · Config</p>
                <h1 style={{ fontFamily: H, fontSize: 'clamp(28px,4vw,40px)', fontWeight: 800, color: '#FFF', letterSpacing: '-0.5px', textTransform: 'uppercase', lineHeight: 1, marginBottom: 8 }}>Settings</h1>
                <p style={{ fontFamily: BD, fontSize: 14, color: '#7A7F8A' }}>Manage profile, preferences, integrations, and data.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

                {/* ── PROFILE ── */}
                <Card>
                    <SectionHeader icon={User} title="Profile" sub="Your identity in the system" />
                    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 18 }}>
                        {/* Avatar */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                            <div style={{ width: 68, height: 68, borderRadius: '50%', background: 'linear-gradient(145deg,#1E2023,#252830)', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.4),0 0 14px rgba(255,122,41,0.08)', flexShrink: 0 }}>
                                <span style={{ fontFamily: H, fontSize: 22, fontWeight: 900, color: '#FF7A29' }}>JA</span>
                            </div>
                            <motion.button whileHover={{ borderColor: 'rgba(255,122,41,0.4)' }} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 16px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', color: '#7A7F8A', fontFamily: BD, fontSize: 12, cursor: 'pointer' }}>
                                <Upload size={12} /> Change Avatar
                            </motion.button>
                        </div>
                        <FieldInput label="Full Name" value={name} onChange={setName} placeholder="Your Name" />
                        <FieldInput label="Email" value={email} onChange={setEmail} placeholder="you@example.com" type="email" />
                        <FieldInput label="Phone" value={phone} onChange={setPhone} placeholder="+1 555 0000" />
                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            onClick={saveProfile}
                            disabled={saving}
                            style={{ padding: '12px', borderRadius: 12, background: saved ? 'rgba(75,231,127,0.08)' : 'linear-gradient(145deg,#1E2024,#151719)', border: `1px solid ${saved ? 'rgba(75,231,127,0.48)' : 'rgba(255,122,41,0.48)'}`, color: saved ? '#4BE77F' : '#FF7A29', fontFamily: H, fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', cursor: saving ? 'wait' : 'pointer', boxShadow: '0 0 14px rgba(255,122,41,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.3s' }}>
                            {saving ? <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} /> : saved ? <CheckCircle size={12} /> : <Save size={12} />}
                            {saving ? 'SAVING…' : saved ? 'SAVED!' : 'SAVE PROFILE'}
                        </motion.button>
                    </div>
                </Card>

                {/* ── PREFERENCES ── */}
                <Card>
                    <SectionHeader icon={Moon} title="System Preferences" />
                    <div style={{ padding: '8px 24px 24px' }}>
                        {/* Theme pill */}
                        <div style={{ padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                            <p style={{ fontFamily: BD, fontSize: 13, fontWeight: 500, color: '#E2E4E9', marginBottom: 10 }}>Theme</p>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 16px', borderRadius: 99, background: 'rgba(255,122,41,0.08)', border: '1px solid rgba(255,122,41,0.25)' }}>
                                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#FF7A29', boxShadow: '0 0 6px rgba(255,122,41,0.7)' }} />
                                <span style={{ fontFamily: H, fontSize: 9, fontWeight: 700, color: '#FF7A29', letterSpacing: '0.14em' }}>DARK PHOENIX</span>
                            </div>
                            <p style={{ fontFamily: BD, fontSize: 11, color: '#4A4F5A', marginTop: 8 }}>More themes coming in v3.</p>
                        </div>
                        <Toggle on={animOn} onToggle={() => setAnimOn(p => !p)} label="Animations" sub="Enable motion & transitions" />
                        <Toggle on={notifOn} onToggle={() => setNotifOn(p => !p)} label="Notifications" sub="In-app alerts and signals" />
                        <Toggle on={soundOn} onToggle={() => setSoundOn(p => !p)} label="Sound Effects" sub="Subtle UI audio feedback" />
                        <div style={{ marginTop: 8 }}>
                            <p style={{ fontFamily: BD, fontSize: 13, fontWeight: 500, color: '#E2E4E9', marginBottom: 10 }}>AI Model</p>
                            <select style={{ width: '100%', padding: '10px 14px', borderRadius: 10, background: 'linear-gradient(145deg,#131416,#181A1D)', border: '1px solid rgba(255,255,255,0.07)', color: '#E2E4E9', fontFamily: BD, fontSize: 13, outline: 'none', cursor: 'pointer' }}>
                                <option>GPT-4o (Default)</option>
                                <option>Claude 3.5 Sonnet</option>
                                <option>Gemini 1.5 Pro</option>
                            </select>
                        </div>
                    </div>
                </Card>

                {/* ── INTEGRATION KEYS ── */}
                <Card>
                    <SectionHeader icon={Key} title="Integration Keys" sub="API credentials & webhooks" />
                    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {keys.map((k, i) => (
                            <div key={k.label} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                <label style={{ fontFamily: MN, fontSize: 8, letterSpacing: '0.22em', color: '#7A7F8A', textTransform: 'uppercase' }}>{k.label}</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <input readOnly type={k.show ? 'text' : 'password'} value={k.value}
                                        style={{ flex: 1, padding: '9px 12px', borderRadius: 10, background: 'linear-gradient(145deg,#131416,#181A1D)', border: '1px solid rgba(255,255,255,0.06)', color: '#C0C4CC', fontFamily: MN, fontSize: 11, outline: 'none' }} />
                                    <motion.button whileTap={{ scale: 0.9 }} onClick={() => toggleShow(i)} style={{ width: 34, height: 34, borderRadius: 9, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', color: '#7A7F8A', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        {k.show ? <EyeOff size={13} /> : <Eye size={13} />}
                                    </motion.button>
                                </div>
                            </div>
                        ))}
                        <motion.button whileHover={{ scale: 1.01 }} style={{ padding: '11px', borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', color: '#7A7F8A', fontFamily: H, fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', cursor: 'pointer', marginTop: 4 }}>
                            + ADD NEW KEY
                        </motion.button>
                    </div>
                </Card>

                {/* ── DATA ── */}
                <Card>
                    <SectionHeader icon={Database} title="Data Maintenance" sub="Export, import, and clear data" />
                    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {[
                            { Icon: Download, label: 'Export All Data', sub: 'Download as JSON', border: 'rgba(255,255,255,0.06)', color: '#7A7F8A' },
                            { Icon: FileUp, label: 'Import Data', sub: 'Restore from backup', border: 'rgba(255,255,255,0.06)', color: '#7A7F8A' },
                            { Icon: Trash2, label: 'Clear Research Memory', sub: 'Reset all agent memory', border: 'rgba(217,91,22,0.25)', color: '#D95B16' },
                        ].map(({ Icon, label, sub, border, color }) => (
                            <motion.button key={label} whileHover={{ borderColor: border, scale: 1.01 }} whileTap={{ scale: 0.98 }}
                                style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', borderRadius: 12, background: 'rgba(255,255,255,0.02)', border: `1px solid ${border}`, cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left' }}>
                                <Icon size={15} style={{ color, flexShrink: 0 }} />
                                <div>
                                    <p style={{ fontFamily: BD, fontSize: 13, fontWeight: 500, color: '#E2E4E9' }}>{label}</p>
                                    <p style={{ fontFamily: BD, fontSize: 11, color: '#5A5F69' }}>{sub}</p>
                                </div>
                            </motion.button>
                        ))}

                        <div style={{ borderRadius: 12, padding: '14px 16px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', marginTop: 8 }}>
                            <p style={{ fontFamily: MN, fontSize: 8, letterSpacing: '0.22em', color: '#7A7F8A', textTransform: 'uppercase', marginBottom: 8 }}>System Info</p>
                            {[['Version', 'JasperHQ v2.1.0'], ['Environment', 'Production'], ['DB Size', '42.8 MB'], ['Last Sync', '2 min ago']].map(([l, v]) => (
                                <div key={String(l)} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                    <span style={{ fontFamily: BD, fontSize: 11, color: '#4A4F5A' }}>{l}</span>
                                    <span style={{ fontFamily: MN, fontSize: 10, color: '#7A7F8A' }}>{v}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};
