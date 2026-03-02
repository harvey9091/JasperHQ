import { useState, useEffect, useCallback } from 'react';
import { LuffyConnection, LuffyUnifiedEvent } from './luffyConnection';
import { useAgentStatusStore } from '../store/agentStatusStore';
import { logAgentOp } from '../lib/agentOps';
import { ChatMessage } from '../types';

export const useLuffyChat = () => {
    const { luffySessionKey, luffyMessages: messages, addLuffyMessage } = useAgentStatusStore();
    const [isConnected, setIsConnected] = useState(false);
    const [isThinking, setIsThinking] = useState(false);

    useEffect(() => {
        const conn = LuffyConnection.getInstance();

        const handleStatus = (status: 'connecting' | 'connected' | 'disconnected') => {
            setIsConnected(status === 'connected');
        };

        const handleMessage = (event: LuffyUnifiedEvent) => {
            switch (event.type) {
                case 'reply-start':
                    setIsThinking(true);
                    break;
                case 'reply':
                    addLuffyMessage({ id: crypto.randomUUID(), role: 'assistant', content: event.text });
                    break;
                case 'reply-end':
                    setIsThinking(false);
                    break;
                case 'error':
                    setIsThinking(false);
                    console.error('[Luffy] Protocol Error:', event.message);
                    break;
            }
        };

        conn.addStatusListener(handleStatus);
        conn.addListener(handleMessage);

        if (luffySessionKey) {
            conn.connect(luffySessionKey);
        }

        return () => {
            conn.removeStatusListener(handleStatus);
            conn.removeListener(handleMessage);
        };
    }, [luffySessionKey]);

    const sendMessage = useCallback(async (text: string) => {
        if (!text.trim()) return;

        const userMsg: ChatMessage = {
            id: crypto.randomUUID(),
            role: 'user',
            content: text
        };
        addLuffyMessage(userMsg);
        setIsThinking(true);

        try {
            logAgentOp({ sender: 'User', recipient: 'Luffy', message_summary: text });
            LuffyConnection.getInstance().sendMessage(text);
        } catch (e) {
            console.error('[LuffyChat] Send error:', e);
            setIsThinking(false);
        }
    }, [addLuffyMessage]);

    return {
        messages,
        isThinking,
        isConnected,
        sendMessage
    };
};
