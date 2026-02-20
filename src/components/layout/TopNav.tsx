import React from 'react';
import { NavLink } from 'react-router-dom';
import { Bell, Grid, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

// ── REAL JasperHQ Navigation Items ────────────────────────────────────────────
// DO NOT add new tabs. DO NOT rename existing routes.
const NAV_ITEMS = [
    { name: 'Dashboard', path: '/' },
    { name: 'Leads', path: '/leads' },
    { name: 'CRM', path: '/crm' },
    { name: 'Agents', path: '/agents' },
    { name: 'Analytics', path: '/analytics' },
    { name: 'Email Gen', path: '/email-gen' },
    { name: 'Settings', path: '/settings' },
];

export const TopNav: React.FC = () => (
    <header
        className="fixed top-0 left-0 right-0 z-50 h-[68px] flex items-center justify-between px-8"
        style={{
            background: 'linear-gradient(180deg, #1E2024 0%, #181A1D 100%)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            // Bottom bevel glow
            boxShadow: 'inset 0 -1px 0 rgba(255,255,255,0.03), 0 4px 24px rgba(0,0,0,0.55)',
        }}
    >
        {/* ── Logo ── */}
        <div className="flex items-center gap-3 shrink-0">
            <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #FF7A29 0%, #D95B16 100%)', boxShadow: '0 0 14px rgba(255,122,41,0.45)' }}
            >
                <Zap size={16} className="text-white" fill="white" />
            </div>
            <span
                className="text-white font-bold text-[17px] tracking-wide select-none"
                style={{ fontFamily: 'Orbitron, sans-serif', letterSpacing: '0.05em' }}
            >
                JASPER<span style={{ color: '#FF7A29' }}>HQ</span>
            </span>
        </div>

        {/* ── Centered Navigation ── */}
        <nav className="absolute left-1/2 -translate-x-1/2 flex items-center gap-8">
            {NAV_ITEMS.map(({ name, path }) => (
                <NavLink
                    key={path}
                    to={path}
                    end={path === '/'}
                    className={({ isActive }) =>
                        clsx(
                            'relative pb-0.5 text-[11px] font-bold tracking-[0.16em] uppercase transition-colors duration-200',
                            isActive ? 'text-white' : 'text-[#7A7F8A] hover:text-[#C8CAD0]'
                        )
                    }
                    style={{ fontFamily: 'Orbitron, sans-serif' }}
                >
                    {({ isActive }) => (
                        <>
                            {name}
                            {isActive && (
                                <motion.span
                                    layoutId="nav-pill"
                                    className="absolute -bottom-[18px] left-0 right-0 h-[2px] rounded-full"
                                    style={{ background: 'linear-gradient(90deg, #D95B16, #FF7A29, #FFA057)', boxShadow: '0 0 8px rgba(255,122,41,0.7)' }}
                                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                />
                            )}
                        </>
                    )}
                </NavLink>
            ))}
        </nav>

        {/* ── Right Icons ── */}
        <div className="flex items-center gap-3 shrink-0">
            <button
                className="w-9 h-9 rounded-full flex items-center justify-center text-[#7A7F8A] hover:text-[#E2E4E9] transition-colors"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
                aria-label="Apps"
            >
                <Grid size={15} />
            </button>
            <button
                className="relative w-9 h-9 rounded-full flex items-center justify-center text-[#7A7F8A] hover:text-[#E2E4E9] transition-colors"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
                aria-label="Notifications"
            >
                <Bell size={15} />
                <span
                    className="absolute top-1.5 right-1.5 w-[7px] h-[7px] rounded-full"
                    style={{ background: '#FF7A29', boxShadow: '0 0 6px rgba(255,122,41,0.7)' }}
                />
            </button>

            <div className="h-5 w-px mx-1" style={{ background: 'rgba(255,255,255,0.08)' }} />

            {/* Avatar */}
            <div
                className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer select-none hover:border-[rgba(255,122,41,0.45)] transition-colors"
                style={{
                    background: 'linear-gradient(135deg, #2A2D32, #1E2023)',
                    border: '1px solid rgba(255,255,255,0.1)',
                }}
            >
                <span className="text-[11px] font-bold text-white" style={{ fontFamily: 'Orbitron, sans-serif' }}>HS</span>
            </div>
        </div>
    </header>
);
