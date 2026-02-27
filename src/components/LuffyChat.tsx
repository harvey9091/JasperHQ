import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send } from 'lucide-react';
import { useLuffyChat } from '../luffy/useLuffyChat';
import LuffyImg from "@/Assets/luffy.png";
import { AgentAvatar } from './common/AgentAvatar';

export const LuffyChat: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const { messages, isThinking, isConnected, sendMessage } = useLuffyChat();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isThinking]);

    const handleSend = async () => {
        if (!inputValue.trim() || isThinking) return;
        const msg = inputValue;
        setInputValue('');
        await sendMessage(msg);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <>
            {/* Floating Action Button */}
            <motion.button
                onClick={() => setIsOpen(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-gradient-to-br from-[#FF7A29] to-[#D95B16] flex items-center justify-center shadow-[0_8px_32px_rgba(255,122,41,0.3)] z-[9998] border border-white/10 overflow-hidden"
            >
                <motion.div
                    animate={isOpen ? { rotate: 90, opacity: 0 } : { rotate: 0, opacity: 1 }}
                    className="absolute inset-0 flex items-center justify-center bg-[#1A1C20]"
                >
                    <img src={LuffyImg} alt="Luffy" className="w-full h-full object-cover" />
                </motion.div>
                <motion.div
                    animate={isOpen ? { rotate: 0, opacity: 1 } : { rotate: -90, opacity: 0 }}
                >
                    <MessageCircle className="text-white w-8 h-8" />
                </motion.div>
            </motion.button>

            {/* Modal Interface */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[9999]"
                        />

                        {/* Chat Modal */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="fixed inset-0 m-auto w-full max-w-[720px] h-[600px] bg-[#111215]/80 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-[0_24px_64px_rgba(0,0,0,0.4)] z-[10000] flex flex-col overflow-hidden"
                        >
                            {/* Header */}
                            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                                <div className="flex items-center gap-4">
                                    <AgentAvatar src={LuffyImg} alt="Luffy" size={48} />
                                    <div>
                                        <h3 className="text-white font-semibold text-lg leading-tight">Luffy</h3>
                                        <div className="flex items-center gap-2">
                                            <span className="text-white/40 text-xs font-mono tracking-wider">CAPTAIN — BUILD MODE</span>
                                            <div className="flex items-center gap-1.5 ml-1">
                                                <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]'}`} />
                                                <span className={`${isConnected ? 'text-green-500/80' : 'text-red-500/80'} text-[10px] font-bold uppercase tracking-tighter`}>
                                                    {isConnected ? 'Connected' : 'Disconnected'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/40 hover:text-white"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Status Bar */}
                            <AnimatePresence>
                                {isThinking && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="bg-white/[0.02] px-6 py-2 border-b border-white/5"
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="text-[#FF7A29] text-xs font-mono italic">Luffy is thinking...</span>
                                            <div className="flex gap-1">
                                                {[0, 1, 2].map((i) => (
                                                    <motion.div
                                                        key={i}
                                                        animate={{ opacity: [0.3, 1, 0.3] }}
                                                        transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                                                        className="w-1 h-1 rounded-full bg-[#FF7A29]"
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Body */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
                                {messages.length === 0 && (
                                    <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-[#FF7A29]/10 blur-xl rounded-full" />
                                            <AgentAvatar src={LuffyImg} alt="Luffy" size={64} />
                                        </div>
                                        <div>
                                            <p className="text-white font-medium">Yooo, Ready for construction, Harvey.</p>
                                            <p className="text-white/60 text-sm">How can I assist with JasperHQ today?</p>
                                        </div>
                                    </div>
                                )}
                                {messages.map((msg) => (
                                    <motion.div
                                        key={msg.id}
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} items-end gap-3`}
                                    >
                                        {msg.role !== 'user' && (
                                            <AgentAvatar src={LuffyImg} alt="Luffy" size={24} className="mb-1" />
                                        )}
                                        <div
                                            className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-lg ${msg.role === 'user'
                                                ? 'bg-[#FF7A29] text-white rounded-tr-none shadow-[#FF7A29]/10'
                                                : 'bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 text-white/90 rounded-tl-none backdrop-blur-sm'
                                                }`}
                                        >
                                            {msg.content}
                                        </div>
                                    </motion.div>
                                ))}
                                {isThinking && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex justify-start items-end gap-3"
                                    >
                                        <AgentAvatar src={LuffyImg} alt="Luffy" size={24} className="mb-1" />
                                        <div className="bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 p-4 rounded-2xl rounded-tl-none flex gap-1.5 items-center backdrop-blur-sm shadow-xl">
                                            <motion.div
                                                animate={{
                                                    scale: [1, 1.2, 1],
                                                    opacity: [0.5, 1, 0.5],
                                                    backgroundColor: ['#FF7A29', '#FFA970', '#FF7A29']
                                                }}
                                                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                                                className="w-2 h-2 rounded-full shadow-[0_0_12px_rgba(255,122,41,0.6)]"
                                            />
                                            <motion.div
                                                animate={{
                                                    scale: [1, 1.2, 1],
                                                    opacity: [0.5, 1, 0.5],
                                                    backgroundColor: ['#FF7A29', '#FFA970', '#FF7A29']
                                                }}
                                                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut", delay: 0.2 }}
                                                className="w-2 h-2 rounded-full shadow-[0_0_12px_rgba(255,122,41,0.6)]"
                                            />
                                            <motion.div
                                                animate={{
                                                    scale: [1, 1.2, 1],
                                                    opacity: [0.5, 1, 0.5],
                                                    backgroundColor: ['#FF7A29', '#FFA970', '#FF7A29']
                                                }}
                                                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut", delay: 0.4 }}
                                                className="w-2 h-2 rounded-full shadow-[0_0_12px_rgba(255,122,41,0.6)]"
                                            />
                                        </div>
                                    </motion.div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Area */}
                            <div className="p-6 bg-white/[0.02] border-t border-white/5 mx-6 mb-6 rounded-xl border border-white/10">
                                <div className="relative flex items-center gap-4">
                                    <textarea
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder="Type a command or question..."
                                        rows={1}
                                        className="flex-1 bg-transparent text-white placeholder-white/20 outline-none resize-none py-2 text-sm"
                                    />
                                    <button
                                        onClick={handleSend}
                                        disabled={!inputValue.trim() || isThinking}
                                        className={`p-2 rounded-lg transition-all ${inputValue.trim() && !isThinking
                                            ? 'bg-[#FF7A29] text-white shadow-[0_0_12px_rgba(255,122,41,0.4)]'
                                            : 'bg-white/5 text-white/20'
                                            }`}
                                    >
                                        <Send className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};
