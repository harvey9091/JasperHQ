import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import clsx from 'clsx';
import { LayoutDashboard, Users, UserCog, LineChart, Settings, Bell, Search, Hexagon, Calendar, Mail, FlaskConical } from 'lucide-react';

const NavItem = ({ to, icon: Icon, label }: { to: string; icon: any; label: string }) => (
    <NavLink
        to={to}
        className={({ isActive }) =>
            clsx(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group',
                isActive
                    ? 'bg-gradient-to-r from-neon-green/10 to-transparent border-l-2 border-neon-green text-neon-green'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
            )
        }
    >
        <Icon className="w-5 h-5" />
        <span className="font-medium tracking-wide">{label}</span>
    </NavLink>
);

export const AppLayout: React.FC = () => {
    return (
        <div className="flex h-screen bg-jasper-dark text-gray-100 font-sans overflow-hidden">
            {/* Sidebar - Industrial Command Center Style */}
            <aside className="w-72 bg-jasper-panel border-r border-white/5 flex flex-col relative z-20">
                <div className="p-6 border-b border-white/5 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-neon-green/10 border border-neon-green/20 flex items-center justify-center animate-pulse-slow">
                        <Hexagon className="w-6 h-6 text-neon-green" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold font-display tracking-wider text-white">JASPER HQ</h1>
                        <p className="text-xs text-neon-green/60 uppercase tracking-[0.2em]">Operating System</p>
                    </div>
                </div>

                <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto custom-scrollbar">
                    <NavItem to="/" icon={LayoutDashboard} label="Dashboard" />
                    <NavItem to="/planner" icon={Calendar} label="Planner" />
                    <NavItem to="/leads" icon={Search} label="Leads" />
                    <NavItem to="/research" icon={FlaskConical} label="Research" />
                    <NavItem to="/crm" icon={Users} label="CRM" />
                    <NavItem to="/email-generator" icon={Mail} label="Email Gen" />
                    <NavItem to="/agents" icon={UserCog} label="Agents" />
                    <NavItem to="/analytics" icon={LineChart} label="Analytics" />
                    <NavItem to="/settings" icon={Settings} label="Settings" />
                </nav>

                <div className="p-4 border-t border-white/5">
                    <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-jasper-surface/50 border border-white/5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-neon-green to-emerald-800" />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">Admin User</p>
                            <p className="text-xs text-neon-green truncate">System Online</p>
                        </div>
                        <Bell className="w-4 h-4 text-gray-400 hover:text-white cursor-pointer" />
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 relative overflow-hidden flex flex-col">
                {/* Top Header / Status Bar */}
                <header className="h-16 border-b border-white/5 bg-jasper-dark/50 backdrop-blur-xl flex items-center justify-between px-8 z-10">
                    <div className="flex items-center gap-4">
                        <span className="text-xs text-gray-500 uppercase tracking-widest font-mono">System Status: Nominal</span>
                        <div className="flex gap-1">
                            <div className="w-1 h-4 bg-neon-green/20 rounded-full" />
                            <div className="w-1 h-4 bg-neon-green/40 rounded-full" />
                            <div className="w-1 h-4 bg-neon-green/60 rounded-full" />
                            <div className="w-1 h-4 bg-neon-green rounded-full shadow-[0_0_10px_#4BFF88]" />
                        </div>
                    </div>
                    {/* Additional header controls can go here */}
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-auto p-8 relative">
                    {/* Background Grid & Noise */}
                    <div className="absolute inset-0 z-0 pointer-events-none opacity-20"
                        style={{
                            backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
                            backgroundSize: '40px 40px'
                        }}
                    />
                    <div className="absolute inset-0 z-0 pointer-events-none mix-blend-overlay opacity-5 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

                    <div className="relative z-10 max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};
