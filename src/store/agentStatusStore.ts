import { create } from 'zustand';

export type AgentStatus = {
    active: boolean;
    status: 'IDLE' | 'RUNNING' | 'OFFLINE';
    lastSeen: string;
};

import { ChatMessage } from '../types';

interface AgentStatusState {
    statuses: Record<string, AgentStatus>;
    luffySessionKey: string; // The persistent session key
    isLuffyChatOpen: boolean;
    luffyMessages: ChatMessage[];
    setStatuses: (statuses: Record<string, AgentStatus>) => void;
    setLuffySessionKey: (key: string) => void;
    setLuffyChatOpen: (open: boolean) => void;
    addLuffyMessage: (msg: ChatMessage) => void;
    clearLuffyMessages: () => void;
    isAgentActive: (name: string) => boolean;
}

export const useAgentStatusStore = create<AgentStatusState>((set, get) => ({
    statuses: {},
    luffySessionKey: localStorage.getItem('luffySessionKey') || '',
    isLuffyChatOpen: false,
    luffyMessages: JSON.parse(localStorage.getItem('luffyMessages') || '[]'),
    setStatuses: (statuses) => set({ statuses }),
    setLuffySessionKey: (key: string) => {
        localStorage.setItem('luffySessionKey', key);
        set({ luffySessionKey: key });
    },
    setLuffyChatOpen: (open: boolean) => set({ isLuffyChatOpen: open }),
    addLuffyMessage: (msg: ChatMessage) => {
        set((state) => {
            const newMessages = [...state.luffyMessages, msg];
            localStorage.setItem('luffyMessages', JSON.stringify(newMessages));
            return { luffyMessages: newMessages };
        });
    },
    clearLuffyMessages: () => {
        localStorage.removeItem('luffyMessages');
        set({ luffyMessages: [] });
    },
    isAgentActive: (name) => {
        const status = get().statuses[name];
        return status ? status.active : false;
    },
}));

import { listSessionsRpc } from '../lib/openclawRpc';

export const startAgentStatusPolling = () => {
    const fetchStatuses = async () => {
        // Skip polling if the tab is hidden to reduce terminal noise
        if (document.visibilityState !== 'visible') return;

        try {
            const newStatuses: Record<string, AgentStatus> = {};

            // Poll only the 'main' gateway - it usually sees all sessions
            // This prevents opening 4-8 connections at once
            try {
                const sessions = await listSessionsRpc('main');
                if (Array.isArray(sessions)) {
                    for (const s of sessions) {
                        const name = (s.identityName || s.name || '').toLowerCase();
                        const key = (s.sessionKey || s.key || s.id || '').toLowerCase();
                        const agentId = (s.agentId || '').toLowerCase();

                        let uiName = '';
                        // Identify agent by name or key prefix
                        if (agentId === 'luffy' || name === 'luffy' || key.includes('luffy')) uiName = 'Luffy';
                        else if (agentId === 'zoro' || name === 'zoro' || key.includes('zoro')) uiName = 'Zoro';
                        else if (agentId === 'nami' || name === 'nami' || key.includes('nami')) uiName = 'Nami';
                        else if (agentId === 'sanji' || name === 'sanji' || key.includes('sanji')) uiName = 'Sanji';
                        else if (agentId === 'main') uiName = 'System';

                        if (uiName) {
                            newStatuses[uiName] = {
                                active: true,
                                status: s.thinking ? 'RUNNING' : 'IDLE',
                                lastSeen: new Date().toISOString()
                            };
                        }
                    }
                }
            } catch (err) {
                // Silently ignore poll failure
            }

            useAgentStatusStore.getState().setStatuses(newStatuses);
        } catch (e) {
            console.warn('[AgentStatusStore] Poll failed:', e);
        }
    };

    const interval = setInterval(fetchStatuses, 300000); // 5 minutes to effectively stop terminal spam
    fetchStatuses();
    return () => clearInterval(interval);
};
