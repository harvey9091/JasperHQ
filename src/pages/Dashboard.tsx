import React from 'react';
import { NeonCard } from '../components/ui/NeonCard';
import { EnergyChart } from '../components/viz/EnergyChart';
import { Activity, TrendingUp, Users, DollarSign, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, change, icon: Icon, color }: { title: string; value: string; change: string; icon: any; color: 'green' | 'teal' | 'amber' }) => (
    <NeonCard glowColor={color} className="flex flex-col justify-between h-32">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-xs text-gray-400 uppercase tracking-widest">{title}</p>
                <h3 className="text-2xl font-bold font-mono mt-1 text-white">{value}</h3>
            </div>
            <div className={`p-2 rounded-lg bg-neon-${color}/10 text-neon-${color}`}>
                <Icon className="w-5 h-5" />
            </div>
        </div>
        <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-neon-green" />
            <span className="text-sm text-neon-green font-medium">{change}</span>
            <span className="text-xs text-gray-500">vs last month</span>
        </div>
    </NeonCard>
);

export const Dashboard: React.FC = () => {
    return (
        <div className="space-y-6">
            {/* Hero Section - Energy Flow */}
            <div className="relative h-64 rounded-2xl bg-jasper-panel/50 border border-white/5 overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-r from-jasper-dark to-transparent opacity-80 z-10" />

                {/* Energy Chart Background */}
                <div className="absolute inset-0 z-0 opacity-40">
                    <EnergyChart color="green" />
                </div>

                <h2 className="relative z-20 text-4xl font-display font-bold text-white tracking-widest">
                    SYSTEM OVERVIEW <span className="text-neon-green">CORE</span>
                </h2>

                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-neon-green via-neon-teal to-transparent opacity-50" />
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Revenue" value="$124,500" change="+12.5%" icon={DollarSign} color="green" />
                <StatCard title="Pipeline Value" value="$450,200" change="+5.2%" icon={Zap} color="teal" />
                <StatCard title="Active Agents" value="12 / 16" change="+2" icon={Users} color="green" />
                <StatCard title="System Health" value="98.2%" change="+0.4%" icon={Activity} color="amber" />
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-96">
                <NeonCard className="lg:col-span-2 relative">
                    <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-neon-green" />
                        Live Traffic Analysis
                    </h3>
                    <div className="absolute inset-0 flex items-center justify-center opacity-10">
                        <p className="text-6xl font-display font-bold text-white">CHART PLACEHOLDER</p>
                    </div>
                    {/* Visual placeholder for chart */}
                    <div className="w-full h-64 bg-jasper-dark/50 rounded-lg border border-white/5 relative overflow-hidden">
                        <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-neon-green/5 to-transparent" />
                        <motion.div
                            className="absolute bottom-0 left-0 w-full h-1 bg-neon-green shadow-[0_0_20px_#4BFF88]"
                            animate={{ height: ["10%", "40%", "20%", "60%", "30%"] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        />
                    </div>
                </NeonCard>

                <NeonCard className="flex flex-col">
                    <h3 className="text-lg font-medium text-white mb-4">Recent Activity</h3>
                    <div className="flex-1 space-y-4 overflow-auto custom-scrollbar pr-2">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors border-l-2 border-transparent hover:border-neon-teal">
                                <div className="w-2 h-2 mt-1.5 rounded-full bg-neon-teal" />
                                <div>
                                    <p className="text-sm text-gray-200">New lead acquired via LinkedIn</p>
                                    <p className="text-xs text-gray-500">2 mins ago</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </NeonCard>
            </div>
        </div>
    );
};
