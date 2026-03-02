export type LuffyUnifiedEvent =
    | { type: 'reply'; text: string }
    | { type: 'reply-start' }
    | { type: 'reply-chunk'; text: string }
    | { type: 'reply-end' }
    | { type: 'error'; message: string }
    | { type: 'pong' };

export class LuffyConnection {
    private static instance: LuffyConnection | null = null;
    private ws: WebSocket | null = null;
    private token: string;
    private reconnectTimer: any = null;
    private heartbeatTimer: any = null;
    private handshakeTimeout: any = null;
    private isManuallyClosed: boolean = false;
    private lastReplyText: string = '';
    private streamingBuffer: string = '';
    private activeRunId: string | null = null;
    private sessionKey: string = localStorage.getItem('luffySessionKey') || '';

    private listeners: Set<(event: LuffyUnifiedEvent) => void> = new Set();
    private statusListeners: Set<(status: 'connecting' | 'connected' | 'disconnected') => void> = new Set();

    private constructor() {
        this.token = import.meta.env.VITE_OPENCLAW_TOKEN;
    }

    public static getInstance(): LuffyConnection {
        if (!LuffyConnection.instance) {
            LuffyConnection.instance = new LuffyConnection();
        }
        return LuffyConnection.instance;
    }

    addListener(l: (event: LuffyUnifiedEvent) => void) {
        this.listeners.add(l);
    }

    removeListener(l: (event: LuffyUnifiedEvent) => void) {
        this.listeners.delete(l);
    }

    addStatusListener(l: (status: 'connecting' | 'connected' | 'disconnected') => void) {
        this.statusListeners.add(l);
    }

    removeStatusListener(l: (status: 'connecting' | 'connected' | 'disconnected') => void) {
        this.statusListeners.delete(l);
    }

    private emitMessage(event: LuffyUnifiedEvent) {
        this.listeners.forEach(l => l(event));
    }

    private emitStatus(status: 'connecting' | 'connected' | 'disconnected') {
        this.statusListeners.forEach(l => l(status));
    }

    private getClientId() {
        let id = localStorage.getItem('luffy_client_instance_id');
        if (!id) {
            id = `inst-${Math.random().toString(36).substring(2, 10)}`;
            localStorage.setItem('luffy_client_instance_id', id);
        }
        return id;
    }

    connect(sessionKey?: string) {
        if (sessionKey) {
            this.sessionKey = sessionKey;
            localStorage.setItem('luffySessionKey', sessionKey);
        }

        if (this.ws?.readyState === WebSocket.OPEN || this.ws?.readyState === WebSocket.CONNECTING) {
            // Already connected or connecting, but maybe status hasn't propagated
            if (this.ws?.readyState === WebSocket.OPEN) this.emitStatus('connected');
            return;
        }

        this.isManuallyClosed = false;
        this.emitStatus('connecting');

        // Connect DIRECTLY to 8081 to bypass the Vite proxy and stop terminal ECONNABORTED noise
        const wsUrl = `ws://127.0.0.1:8081/ws?auth=${this.token}&agent=luffy`;

        console.log('[Luffy] Connecting to:', wsUrl);
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
            console.log('[Luffy] WebSocket Opened, performing handshake...');
            this.startHeartbeat();

            // Wait for challenge or send connect immediately if server doesn't send challenge
            // In OpenClaw protocol 3, it usually sends a challenge.
        };

        this.ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                this.handleIncomingEvent(data);
            } catch (e) {
                console.error('[Luffy] Failed to parse message:', e);
            }
        };

        this.ws.onclose = (event) => {
            console.log(`[Luffy] WebSocket Closed (code: ${event.code})`);
            this.emitStatus('disconnected');
            this.stopHeartbeat();
            if (!this.isManuallyClosed) {
                this.scheduleReconnect();
            }
        };

        this.ws.onerror = (err) => {
            console.error('[Luffy] WebSocket Error:', err);
        };
    }

    private handleIncomingEvent(data: any) {
        if (data.type === 'event' && data.event === 'connect.challenge') {
            console.log('[Luffy] Handshake challenge received, performing auth...');
            this.send({
                type: "req",
                id: "handshake",
                method: "connect",
                params: {
                    minProtocol: 3,
                    maxProtocol: 3,
                    role: "operator",
                    scopes: ["operator.read", "operator.write"],
                    client: {
                        id: "webchat-ui",
                        version: "1.0.0",
                        platform: "web",
                        mode: "webchat",
                        instanceId: this.getClientId()
                    },
                    auth: {
                        token: this.token
                    }
                }
            });
            return;
        }

        if (data.id === 'handshake') {
            if (data.ok) {
                console.log('[Luffy] Handshake SUCCESSFUL');
                this.emitStatus('connected');
            } else {
                console.error('[Luffy] Handshake FAILED:', data.error);
                this.emitMessage({ type: 'error', message: data.error?.message || 'Handshake failed' });
                this.emitStatus('disconnected');
            }
            return;
        }

        if (data.type === 'event' && data.event === 'pong') return;

        if (data.type === 'event' && data.event === 'chat') {
            const payload = data.payload;
            const state = payload.state;
            const contentArray = payload.message?.content;
            let fullText = (contentArray && Array.isArray(contentArray) && contentArray[0]?.text) || '';

            fullText = this.cleanAgentOutput(fullText);

            if (state === 'delta' || state === 'final') {
                if (!this.activeRunId || this.activeRunId !== payload.runId) {
                    this.activeRunId = payload.runId;
                    this.lastReplyText = '';
                    this.streamingBuffer = '';
                    this.emitMessage({ type: 'reply-start' });
                }

                const newChunk = fullText.slice(this.lastReplyText.length);
                if (newChunk) {
                    this.streamingBuffer += newChunk;
                    this.lastReplyText = fullText;
                }

                if (state === 'final') {
                    const finalMsg = this.streamingBuffer.trim();
                    if (finalMsg && finalMsg !== 'NO_REPLY') {
                        this.emitMessage({ type: 'reply', text: finalMsg });
                    }
                    this.emitMessage({ type: 'reply-end' });
                    this.activeRunId = null;
                    this.streamingBuffer = '';
                    this.lastReplyText = '';
                }
            } else if (state === 'error') {
                this.emitMessage({ type: 'error', message: payload.errorMessage || 'Chat error' });
                this.activeRunId = null;
                this.streamingBuffer = '';
            }
            return;
        }
    }

    private startHeartbeat() {
        this.stopHeartbeat();
        this.heartbeatTimer = setInterval(() => {
            this.send({ type: 'req', id: 'ping-' + Date.now(), method: 'health' });
        }, 15000);
    }

    private stopHeartbeat() {
        if (this.heartbeatTimer) {
            clearInterval(this.heartbeatTimer);
            this.heartbeatTimer = null;
        }
    }

    private scheduleReconnect() {
        if (this.reconnectTimer) return;
        this.reconnectTimer = setTimeout(() => {
            this.reconnectTimer = null;
            this.connect();
        }, 2000);
    }

    sendMessage(text: string) {
        if (this.ws?.readyState === WebSocket.OPEN) {
            this.lastReplyText = '';
            this.activeRunId = null;
            this.send({
                type: "req",
                id: "msg-" + Date.now(),
                method: "chat.send",
                params: {
                    sessionKey: this.sessionKey,
                    message: text,
                    idempotencyKey: "run-" + Date.now()
                }
            });
        } else {
            console.error("[Luffy] WebSocket not connected");
            this.emitMessage({ type: 'error', message: 'Connection unavailable' });
        }
    }

    private send(data: any) {
        if (this.ws?.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(data));
        }
    }

    private cleanAgentOutput(text: string): string {
        if (!text) return '';
        return text
            .replace(/<\|?begin_of_box\|?>/gi, '')
            .replace(/<\|?end_of_box\|?>/gi, '')
            .replace(/<arg_key>.*?<\/arg_key>/gi, '')
            .replace(/<arg_value>.*?<\/arg_value>/gi, '')
            .replace(/<tool_call>.*?<\/tool_call>/gi, '')
            .replace(/<[^>]+>/g, '')
            .replace(/\bNO_REPLY\b/gi, '')
            .replace(/\n\s*\n/g, '\n\n')
            .trim();
    }

    disconnect() {
        this.isManuallyClosed = true;
        this.stopHeartbeat();
        if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
        this.ws?.close();
    }
}

