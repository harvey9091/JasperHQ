import { useState, useEffect, useCallback, useRef } from 'react';
import { LuffyConnection, LuffyUnifiedEvent } from './luffyConnection';

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
}

export const useLuffyChat = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const [isThinking, setIsThinking] = useState(false);
    const connectionRef = useRef<LuffyConnection | null>(null);

    useEffect(() => {
        const conn = new LuffyConnection();
        connectionRef.current = conn;

        conn.onStatusChange = (status) => {
            setIsConnected(status === 'connected');
        };

        conn.onMessage = (event: LuffyUnifiedEvent) => {
            switch (event.type) {
                case 'reply-start':
                    setIsThinking(true);
                    setMessages(prev => [
                        ...prev,
                        { id: crypto.randomUUID(), role: 'assistant', content: '' }
                    ]);
                    break;

                case 'reply-chunk':
                    setMessages(prev => {
                        const newMessages = [...prev];
                        const last = newMessages[newMessages.length - 1];
                        if (last && last.role === 'assistant') {
                            last.content += event.text;
                            return newMessages;
                        }
                        return prev;
                    });
                    break;

                case 'reply':
                    setIsThinking(false);
                    setMessages(prev => {
                        const newMessages = [...prev];
                        const last = newMessages[newMessages.length - 1];
                        if (last && last.role === 'assistant') {
                            last.content = event.text;
                            return newMessages;
                        } else {
                            return [
                                ...prev,
                                { id: crypto.randomUUID(), role: 'assistant', content: event.text }
                            ];
                        }
                    });
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

        conn.connect();

        return () => {
            conn.disconnect();
        };
    }, []);

    const sendMessage = useCallback((text: string) => {
        if (!text.trim() || !connectionRef.current) return;

        // Optimistic UI for user message
        const userMsg: ChatMessage = {
            id: crypto.randomUUID(),
            role: 'user',
            content: text
        };
        setMessages(prev => [...prev, userMsg]);

        // Send to WebSocket
        connectionRef.current.sendMessage(text);
        setIsThinking(true);
    }, []);

    return {
        messages,
        isThinking,
        isConnected,
        sendMessage
    };
};
