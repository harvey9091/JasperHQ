import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, User, Globe, ArrowRight, Sparkles, Lock } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AuthFormProps {
    onAuthSuccess: (userId: string) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onAuthSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [website, setWebsite] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isLoginMode, setIsLoginMode] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            if (isLoginMode) {
                // LOGIN MODE - Check email and password
                const { data: user, error: loginError } = await supabase
                    .from('users')
                    .select('*')
                    .eq('email', email)
                    .eq('password', password)
                    .single();

                if (loginError || !user) {
                    throw new Error('Invalid email or password');
                }

                // Store user ID in localStorage
                localStorage.setItem('userId', user.id);
                onAuthSuccess(user.id);
            } else {
                // SIGNUP MODE - Check if user exists
                const { data: existingUser } = await supabase
                    .from('users')
                    .select('*')
                    .eq('email', email)
                    .single();

                if (existingUser) {
                    throw new Error('An account with this email already exists. Please login instead.');
                }

                // Create new user
                const { data: newUser, error: insertError } = await supabase
                    .from('users')
                    .insert([{ email, password, name, website }])
                    .select()
                    .single();

                if (insertError) throw insertError;

                // Create empty dashboard entry
                await supabase
                    .from('user_dashboard')
                    .insert([{ user_id: newUser.id }]);

                // Store user ID in localStorage
                localStorage.setItem('userId', newUser.id);
                onAuthSuccess(newUser.id);
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="relative bg-black px-6 py-32">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{ opacity: [0.1, 0.2, 0.1], scale: [1, 1.1, 1] }}
                    transition={{ duration: 8, repeat: Infinity }}
                    className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-[#BFF549] rounded-full blur-[150px]"
                />
                <motion.div
                    animate={{ opacity: [0.1, 0.15, 0.1], scale: [1, 1.2, 1] }}
                    transition={{ duration: 10, repeat: Infinity, delay: 1 }}
                    className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-purple-600 rounded-full blur-[150px]"
                />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative z-10 w-full max-w-md mx-auto"
            >
                {/* Header */}
                <div className="text-center mb-10">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-gradient-to-br from-[#BFF549] to-[#FACC15] shadow-[0_0_60px_rgba(191,245,73,0.4)]"
                    >
                        <Sparkles className="w-10 h-10 text-black" />
                    </motion.div>

                    <h2 className="text-5xl font-black mb-4 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                        {isLoginMode ? 'Welcome Back' : 'Get Started Today'}
                    </h2>
                    <p className="text-xl text-gray-400">
                        {isLoginMode ? 'Enter your credentials to access your dashboard' : 'Create your account and unlock your personalized dashboard'}
                    </p>
                </div>

                {/* Form */}
                <motion.form
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    onSubmit={handleSubmit}
                    className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl"
                >
                    {/* Glow Effect */}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#BFF549]/10 to-purple-600/10 blur-xl -z-10" />

                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Email Input */}
                    <div className="mb-6">
                        <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider">
                            Email Address
                        </label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#BFF549] transition-colors" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#BFF549] focus:ring-2 focus:ring-[#BFF549]/20 transition-all"
                                placeholder="you@example.com"
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div className="mb-6">
                        <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider">
                            Password
                        </label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#BFF549] transition-colors" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#BFF549] focus:ring-2 focus:ring-[#BFF549]/20 transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {/* Name Input - Only show in signup mode */}
                    {!isLoginMode && (
                        <div className="mb-6">
                            <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider">
                                Full Name
                            </label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#BFF549] transition-colors" />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#BFF549] focus:ring-2 focus:ring-[#BFF549]/20 transition-all"
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>
                    )}

                    {/* Website Input - Only show in signup mode */}
                    {!isLoginMode && (
                        <div className="mb-8">
                            <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider">
                                Website <span className="text-gray-500 font-normal">(Optional)</span>
                            </label>
                            <div className="relative group">
                                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#BFF549] transition-colors" />
                                <input
                                    type="url"
                                    value={website}
                                    onChange={(e) => setWebsite(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#BFF549] focus:ring-2 focus:ring-[#BFF549]/20 transition-all"
                                    placeholder="https://yourwebsite.com"
                                />
                            </div>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="group relative w-full py-5 bg-gradient-to-r from-[#BFF549] to-[#FACC15] text-black font-black text-lg rounded-xl overflow-hidden transition-all hover:shadow-[0_0_60px_rgba(191,245,73,0.5)] hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-3">
                            {isLoading ? 'Loading...' : (isLoginMode ? 'Login' : 'Access Dashboard')}
                            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-white to-[#BFF549] transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    </button>

                    {/* Login/Signup Toggle */}
                    <p className="mt-6 text-center text-sm text-gray-400">
                        {isLoginMode ? (
                            <>
                                New here?{' '}
                                <button
                                    type="button"
                                    onClick={() => setIsLoginMode(false)}
                                    className="text-[#BFF549] font-bold hover:underline"
                                >
                                    Create an account
                                </button>
                            </>
                        ) : (
                            <>
                                Already have an account?{' '}
                                <button
                                    type="button"
                                    onClick={() => setIsLoginMode(true)}
                                    className="text-[#BFF549] font-bold hover:underline"
                                >
                                    Login
                                </button>
                            </>
                        )}
                    </p>
                </motion.form>
            </motion.div>
        </section>
    );
};

export default AuthForm;
