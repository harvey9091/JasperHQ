import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Download, MoreVertical, Star, Trash2 } from 'lucide-react';
import { PhoenixCard } from '../components/ui/PhoenixCard';
import { IndustrialButton } from '../components/ui/IndustrialButton';
import { StatusBadge } from '../components/ui/StatusBadge';

// Mock Data
const MOCK_LEADS = [
    { id: 'LD-001', name: 'CyberDyne Systems', contact: 'Miles Dyson', value: '$125,000', status: 'active', score: 98, lastAction: 'Contract Sent' },
    { id: 'LD-002', name: 'Tyrell Corp', contact: 'Eldon Tyrell', value: '$850,000', status: 'negotiating', score: 95, lastAction: 'Meeting Scheduled' },
    { id: 'LD-003', name: 'Weyland-Yutani', contact: 'Carter Burke', value: '$2,500,000', status: 'new', score: 88, lastAction: 'Inbound Inquiry' },
    { id: 'LD-004', name: 'Massive Dynamic', contact: 'Nina Sharp', value: '$450,000', status: 'active', score: 92, lastAction: 'Demo Completed' },
    { id: 'LD-005', name: 'InGen', contact: 'John Hammond', value: '$12,000,000', status: 'hold', score: 45, lastAction: 'Budget Review' },
    { id: 'LD-006', name: 'Aperture Science', contact: 'Cave Johnson', value: '$85,000', status: 'archived', score: 12, lastAction: 'No Response' },
];

export const Leads = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredLeads = MOCK_LEADS.filter(lead =>
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.contact.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header / Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold text-white mb-2 tracking-tight">Lead Intelligence</h1>
                    <p className="text-phoenix-muted font-light">Manage and track potential high-value targets.</p>
                </div>
                <div className="flex items-center gap-3">
                    <IndustrialButton variant="secondary" icon={Download}>Export Data</IndustrialButton>
                    <IndustrialButton icon={Filter}>Add Lead</IndustrialButton>
                </div>
            </div>

            {/* Filters & Search */}
            <PhoenixCard className="p-4 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-phoenix-muted" />
                    <input
                        type="text"
                        placeholder="Search targets..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-phoenix-dark/50 border border-phoenix-border rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-ember-primary/50 focus:bg-phoenix-surface transition-all placeholder:text-phoenix-muted/50 shadow-inner"
                    />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                    {['All', 'Active', 'New', 'Negotiating', 'Archived'].map((filter) => (
                        <button
                            key={filter}
                            className="px-4 py-1.5 rounded text-xs font-mono border border-phoenix-border hover:border-ember-primary/50 hover:bg-ember-primary/10 transition-all whitespace-nowrap text-phoenix-muted hover:text-ember-primary uppercase tracking-wider"
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            </PhoenixCard>

            {/* Data Table */}
            <PhoenixCard className="overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-phoenix-border text-phoenix-muted text-xs uppercase tracking-wider font-mono bg-white/5">
                            <th className="p-4 font-semibold">Target ID</th>
                            <th className="p-4 font-semibold">Entity Name</th>
                            <th className="p-4 font-semibold">Contact</th>
                            <th className="p-4 font-semibold">Value</th>
                            <th className="p-4 font-semibold">Status</th>
                            <th className="p-4 font-semibold">Score</th>
                            <th className="p-4 font-semibold">Last Action</th>
                            <th className="p-4 text-right font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-phoenix-border">
                        {filteredLeads.map((lead, index) => (
                            <motion.tr
                                key={lead.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="group hover:bg-white/5 transition-colors"
                            >
                                <td className="p-4 font-mono text-ember-primary text-sm">{lead.id}</td>
                                <td className="p-4 font-bold text-white max-w-[200px] truncate">{lead.name}</td>
                                <td className="p-4 text-phoenix-muted">{lead.contact}</td>
                                <td className="p-4 font-mono text-white tracking-wider font-medium">{lead.value}</td>
                                <td className="p-4">
                                    <StatusBadge status={lead.status as any} />
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-16 h-1.5 bg-phoenix-dark rounded-full overflow-hidden border border-phoenix-border">
                                            <div
                                                className={`h-full rounded-full ${lead.score > 80 ? 'bg-ember-primary' : lead.score > 50 ? 'bg-ember-light' : 'bg-red-500'}`}
                                                style={{ width: `${lead.score}%` }}
                                            />
                                        </div>
                                        <span className="text-xs font-mono text-phoenix-muted">{lead.score}</span>
                                    </div>
                                </td>
                                <td className="p-4 text-phoenix-muted text-sm">{lead.lastAction}</td>
                                <td className="p-4 text-right">
                                    <button className="text-phoenix-muted hover:text-white p-2 hover:bg-white/10 rounded-lg transition-colors">
                                        <MoreVertical className="w-4 h-4" />
                                    </button>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </PhoenixCard>
        </div>
    );
};
