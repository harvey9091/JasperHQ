import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, DollarSign, Users, LogOut, Save, TrendingUp } from 'lucide-react';
import { supabase, User, UserDashboard } from '../lib/supabase';

interface DashboardProps {
    userId: string;
    onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ userId, onLogout }) => {
    const [user, setUser] = useState<User | null>(null);
    const [dashboard, setDashboard] = useState<UserDashboard | null>(null);
    const [goal, setGoal] = useState('');
    const [income, setIncome] = useState('');
    const [clients, setClients] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');

    useEffect(() => {
        loadUserData();
    }, [userId]);

    const loadUserData = async () => {
        try {
            // Load user info
            const { data: userData } = await supabase
                .from('users')
                .select('*')
                .eq('id', userId)
                .single();

            setUser(userData);

            // Load dashboard data
            const { data: dashboardData } = await supabase
                .from('user_dashboard')
                .select('*')
                .eq('user_id', userId)
                .single();

            if (dashboardData) {
                setDashboard(dashboardData);
                setGoal(dashboardData.goal || '');
                setIncome(dashboardData.income?.toString() || '');
                setClients(dashboardData.clients?.toString() || '');
            }
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        setSaveMessage('');

        try {
            const { error } = await supabase
                .from('user_dashboard')
                .update({
                    goal,
                    income: income ? parseFloat(income) : null,
                    clients: clients ? parseInt(clients) : null,
                    updated_at: new Date().toISOString()
                })
                .eq('user_id', userId);

            if (error) throw error;

            setSaveMessage('✓ Saved successfully!');
            setTimeout(() => setSaveMessage(''), 3000);
        } catch (error: any) {
            setSaveMessage('✗ Error saving: ' + error.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('userId');
        onLogout();
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-2xl text-white">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black px-6 py-20">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{ opacity: [0.05, 0.1, 0.05], scale: [1, 1.1, 1] }}
                    transition={{ duration: 8, repeat: Infinity }}
                    className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-[#BFF549] rounded-full blur-[200px]"
                />
                <motion.div
                    animate={{ opacity: [0.05, 0.08, 0.05], scale: [1, 1.2, 1] }}
                    transition={{ duration: 10, repeat: Infinity, delay: 2 }}
                    className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-600 rounded-full blur-[200px]"
                />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12 flex items-center justify-between"
                >
                    <div>
                        <h1 className="text-6xl font-black mb-2 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                            Dashboard
                        </h1>
                        <p className="text-xl text-gray-400">
                            Welcome back, <span className="text-[#BFF549] font-bold">{user?.name}</span>
                        </p>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-all"
                    >
                        <LogOut className="w-5 h-5" />
                        Logout
                    </button>
                </motion.div>

                {/* User Info Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-8 p-6 backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-2xl"
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <p className="text-sm text-gray-400 mb-1">Email</p>
                            <p className="text-white font-semibold">{user?.email}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-400 mb-1">Name</p>
                            <p className="text-white font-semibold">{user?.name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-400 mb-1">Website</p>
                            <p className="text-white font-semibold">{user?.website || 'Not provided'}</p>
                        </div>
                    </div>
                </motion.div>

                {/* Dashboard Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Goal Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="relative group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-[#BFF549]/20 to-[#FACC15]/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-[#BFF549]/50 transition-all">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 bg-gradient-to-br from-[#BFF549] to-[#FACC15] rounded-xl">
                                    <Target className="w-6 h-6 text-black" />
                                </div>
                                <h3 className="text-lg font-bold text-white">Goal</h3>
                            </div>
                            <textarea
                                value={goal}
                                onChange={(e) => setGoal(e.target.value)}
                                placeholder="What's your main goal?"
                                className="w-full h-24 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#BFF549] focus:ring-2 focus:ring-[#BFF549]/20 transition-all resize-none"
                            />
                        </div>
                    </motion.div>

                    {/* Income Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="relative group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-green-500/50 transition-all">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl">
                                    <DollarSign className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-white">Monthly Income</h3>
                            </div>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">$</span>
                                <input
                                    type="number"
                                    value={income}
                                    onChange={(e) => setIncome(e.target.value)}
                                    placeholder="0"
                                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-2xl font-bold placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Clients Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="relative group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-purple-500/50 transition-all">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                                    <Users className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-white">Active Clients</h3>
                            </div>
                            <input
                                type="number"
                                value={clients}
                                onChange={(e) => setClients(e.target.value)}
                                placeholder="0"
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-2xl font-bold placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                            />
                        </div>
                    </motion.div>
                </div>

                {/* Save Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-center justify-center gap-4"
                >
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="group relative px-12 py-5 bg-gradient-to-r from-[#BFF549] to-[#FACC15] text-black font-black text-xl rounded-xl overflow-hidden transition-all hover:shadow-[0_0_60px_rgba(191,245,73,0.5)] hover:scale-[1.05] active:scale-95 disabled:opacity-50"
                    >
                        <span className="relative z-10 flex items-center gap-3">
                            <Save className="w-6 h-6" />
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-white to-[#BFF549] transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    </button>

                    {saveMessage && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`px-6 py-3 rounded-xl font-semibold ${saveMessage.includes('✓')
                                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                                }`}
                        >
                            {saveMessage}
                        </motion.div>
                    )}
                </motion.div>

                {/* Stats Preview */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mt-12 p-8 backdrop-blur-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <TrendingUp className="w-6 h-6 text-[#BFF549]" />
                        <h3 className="text-2xl font-black text-white">Your Progress</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <p className="text-4xl font-black text-[#BFF549] mb-2">{clients || '0'}</p>
                            <p className="text-gray-400">Active Clients</p>
                        </div>
                        <div className="text-center">
                            <p className="text-4xl font-black text-green-400 mb-2">
                                ${income ? parseFloat(income).toLocaleString() : '0'}
                            </p>
                            <p className="text-gray-400">Monthly Revenue</p>
                        </div>
                        <div className="text-center">
                            <p className="text-4xl font-black text-purple-400 mb-2">
                                {goal ? '🎯' : '—'}
                            </p>
                            <p className="text-gray-400">Goal Set</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Dashboard;
