import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, Cpu, Shield, Activity, Power, Play, Pause, Settings } from 'lucide-react';
import { PhoenixCard } from '../components/ui/PhoenixCard';
import { IndustrialButton } from '../components/ui/IndustrialButton';
import { StatusBadge } from '../components/ui/StatusBadge';

const AGENTS = [
    { id: 'AGT-001', name: 'Spectre', role: 'Lead Scraper', status: 'active', efficiency: 98, tasks: 1245 },
    { id: 'AGT-002', name: 'Phantom', role: 'Outreach', status: 'busy', efficiency: 85, tasks: 450 },
    { id: 'AGT-003', name: 'Wraith', role: 'Data Miner', status: 'offline', efficiency: 0, tasks: 0 },
    { id: 'AGT-004', name: 'Ghost', role: 'Sentiment', status: 'active', efficiency: 92, tasks: 890 },
    { id: 'AGT-005', name: 'Shadow', role: 'Closer', status: 'deploying', efficiency: 12, tasks: 5 },
    { id: 'AGT-006', name: 'Mirage', role: 'Support', status: 'online', efficiency: 100, tasks: 220 },
];

export const Agents = () => {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-display font-bold text-white mb-1 tracking-tight">Deployed Agents</h1>
                    <p className="text-phoenix-muted font-light">Monitor and control autonomous units.</p>
                </div>
                <div className="flex gap-3">
                    <IndustrialButton icon={Power} variant="secondary">System Reboot</IndustrialButton>
                    <IndustrialButton icon={Play}>Deploy New Unit</IndustrialButton>
                </div>
            </div>

            {/* Agent Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {AGENTS.map((agent, i) => (
                    <motion.div
                        key={agent.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <PhoenixCard
                            className="p-6 relative group"
                            variant={agent.status === 'active' ? 'active' : 'default'}
                            glow={agent.status === 'active'}
                        >
                            {/* Header */}
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded bg-phoenix-surface border border-white/5 flex items-center justify-center group-hover:border-ember-primary/50 transition-colors shadow-inner">
                                        <Cpu className={`w-6 h-6 ${agent.status === 'active' ? 'text-ember-primary' : 'text-phoenix-muted'}`} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white tracking-wide">{agent.name}</h3>
                                        <span className="text-xs font-mono text-phoenix-muted">{agent.id}</span>
                                    </div>
                                </div>
                                <StatusBadge status={agent.status as any} />
                            </div>

                            {/* Metrics */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-white/5 rounded p-2 border border-white/5">
                                    <div className="text-xs text-phoenix-muted mb-1 flex items-center gap-1">
                                        <Activity className="w-3 h-3" /> Efficiency
                                    </div>
                                    <div className="text-xl font-mono font-bold text-white">
                                        {agent.efficiency}%
                                    </div>
                                </div>
                                <div className="bg-white/5 rounded p-2 border border-white/5">
                                    <div className="text-xs text-phoenix-muted mb-1 flex items-center gap-1">
                                        <Terminal className="w-3 h-3" /> Tasks
                                    </div>
                                    <div className="text-xl font-mono font-bold text-white">
                                        {agent.tasks}
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                                <button className="flex-1 bg-phoenix-surface hover:bg-white/5 border border-white/5 text-xs font-bold text-white py-2 rounded transition-colors uppercase tracking-wider flex items-center justify-center gap-2 shadow-stone-bevel">
                                    <Terminal className="w-3 h-3" /> Logs
                                </button>
                                <button className="flex-1 bg-phoenix-surface hover:bg-white/5 border border-white/5 text-xs font-bold text-white py-2 rounded transition-colors uppercase tracking-wider flex items-center justify-center gap-2 shadow-stone-bevel">
                                    <Settings className="w-3 h-3" /> Config
                                </button>
                            </div>

                            {/* Active Scan Line */}
                            {agent.status === 'active' && (
                                <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden rounded-xl">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-ember-primary/20 shadow-orange-glow animate-scan-y opacity-50" />
                                </div>
                            )}
                        </PhoenixCard>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
