import React, { createContext, useCallback, useContext, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, XCircle, X } from 'lucide-react';

// ─── Types ─────────────────────────────────────────────────────────────────────
type ToastVariant = 'success' | 'warning' | 'error';

interface ToastItem {
    id: string;
    message: string;
    variant: ToastVariant;
}

interface ToastContextValue {
    success: (msg: string) => void;
    warning: (msg: string) => void;
    error: (msg: string) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────
const ToastContext = createContext<ToastContextValue | null>(null);

const MN = 'JetBrains Mono, monospace';

const STYLES: Record<ToastVariant, { border: string; glow: string; icon: React.ReactNode; label: string }> = {
    success: {
        border: 'rgba(75,231,127,0.35)',
        glow: '0 0 22px rgba(75,231,127,0.18)',
        icon: <CheckCircle2 size={14} style={{ color: '#4BE77F', flexShrink: 0 }} />,
        label: '#4BE77F',
    },
    warning: {
        border: 'rgba(255,122,41,0.42)',
        glow: '0 0 22px rgba(255,122,41,0.2)',
        icon: <AlertTriangle size={14} style={{ color: '#FF7A29', flexShrink: 0 }} />,
        label: '#FF7A29',
    },
    error: {
        border: 'rgba(217,91,22,0.42)',
        glow: '0 0 22px rgba(217,91,22,0.2)',
        icon: <XCircle size={14} style={{ color: '#D95B16', flexShrink: 0 }} />,
        label: '#D95B16',
    },
};

// ─── Provider ─────────────────────────────────────────────────────────────────
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    const push = useCallback((message: string, variant: ToastVariant) => {
        const id = `${Date.now()}-${Math.random()}`;
        setToasts(t => [...t, { id, message, variant }]);
        setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3200);
    }, []);

    const ctx: ToastContextValue = {
        success: (msg) => push(msg, 'success'),
        warning: (msg) => push(msg, 'warning'),
        error: (msg) => push(msg, 'error'),
    };

    return (
        <ToastContext.Provider value={ctx}>
            {children}

            {/* Toast portal — fixed bottom-right */}
            <div style={{
                position: 'fixed', bottom: 28, right: 28,
                zIndex: 99999, display: 'flex', flexDirection: 'column', gap: 10,
                pointerEvents: 'none',
            }}>
                <AnimatePresence initial={false}>
                    {toasts.map(t => {
                        const s = STYLES[t.variant];
                        return (
                            <motion.div
                                key={t.id}
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ type: 'spring', stiffness: 360, damping: 30 }}
                                style={{
                                    pointerEvents: 'auto',
                                    display: 'flex', alignItems: 'center', gap: 10,
                                    padding: '12px 16px',
                                    borderRadius: 14,
                                    background: 'linear-gradient(145deg,#181A1D,#1E2023)',
                                    border: `1px solid ${s.border}`,
                                    boxShadow: `${s.glow}, 0 8px 32px rgba(0,0,0,0.55)`,
                                    backdropFilter: 'blur(12px)',
                                    minWidth: 260, maxWidth: 360,
                                }}
                            >
                                {s.icon}
                                <span style={{
                                    fontFamily: MN, fontSize: 11, letterSpacing: '0.08em',
                                    color: s.label, flex: 1, lineHeight: 1.5,
                                }}>
                                    {t.message}
                                </span>
                                <button
                                    onClick={() => setToasts(x => x.filter(i => i.id !== t.id))}
                                    style={{ background: 'none', border: 'none', color: '#4A4F5A', cursor: 'pointer', padding: 0, display: 'flex' }}
                                >
                                    <X size={12} />
                                </button>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────
export const useToast = (): ToastContextValue => {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
    return ctx;
};
