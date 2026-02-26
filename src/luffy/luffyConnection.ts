export type LuffyUnifiedEvent =
    | { type: 'reply'; text: string }
    | { type: 'reply-start' }
    | { type: 'reply-chunk'; text: string }
    | { type: 'reply-end' }
    | { type: 'error'; message: string }
    | { type: 'pong' };

export class LuffyConnection {
    private ws: WebSocket | null = null;
    private token: string;
    private baseUrl: string;
    private reconnectTimer: any = null;
    private heartbeatTimer: any = null;
    private isManuallyClosed: boolean = false;
    private lastReplyText: string = '';
    private streamingBuffer: string = '';
    private activeRunId: string | null = null;

    onMessage: (event: LuffyUnifiedEvent) => void = () => { };
    onStatusChange: (status: 'connecting' | 'connected' | 'disconnected') => void = () => { };

    constructor() {
        this.token = import.meta.env.VITE_OPENCLAW_TOKEN;
        // The user provided ws://127.0.0.1:18789/_openclaw/ws as the base
        const apiBase = import.meta.env.VITE_OPENCLAW_BASE_URL || 'http://127.0.0.1:18789';
        this.baseUrl = apiBase.replace('http', 'ws').replace(/\/$/, '');
    }

    connect() {
        if (this.ws?.readyState === WebSocket.OPEN || this.ws?.readyState === WebSocket.CONNECTING) return;

        this.isManuallyClosed = false;
        this.onStatusChange('connecting');

        // Note: We use the established working URL pattern from our tests
        // But we handle the handshake via req messages after open.
        const wsUrl = `${this.baseUrl}/_openclaw/ws?auth=${this.token}&session=agent:main:default`;

        console.log('[Luffy] Connecting to:', wsUrl);
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
            console.log('[Luffy] WebSocket Connection Opened');
            this.startHeartbeat();
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
            console.log(`[Luffy] WebSocket Closed (code: ${event.code}, reason: ${event.reason || 'none'})`);
            this.onStatusChange('disconnected');
            this.stopHeartbeat();
            if (!this.isManuallyClosed) {
                this.scheduleReconnect();
            }
        };

        this.ws.onerror = (err) => {
            console.error('[Luffy] WebSocket Error:', err);
            // Error event doesn't carry much info in browser, onclose will trigger next
        };
    }

    private handleIncomingEvent(data: any) {
        // Handle Handshake Challenge
        if (data.type === 'event' && data.event === 'connect.challenge') {
            const nonce = data.payload?.nonce;
            if (nonce) {
                console.log('[Luffy] Handshake challenge received, performing auth...');
                this.send({
                    type: "req",
                    id: "handshake",
                    method: "connect",
                    params: {
                        minProtocol: 3,
                        maxProtocol: 3,
                        client: {
                            id: "openclaw-control-ui", // Required for scopes when bypass is on
                            version: "1.0.0",
                            platform: "web",
                            mode: "webchat"
                        },
                        scopes: ["operator.read", "operator.write"],
                        auth: {
                            token: this.token
                        }
                    }
                });
            }
            return;
        }

        // Handle Handshake Result
        if (data.type === 'res' && data.id === 'handshake') {
            if (data.ok) {
                console.log('[Luffy] Handshake Successful');
                this.onStatusChange('connected');
            } else {
                console.error('[Luffy] Handshake Failed:', data.error);
                this.onMessage({ type: 'error', message: data.error?.message || 'Handshake failed' });
            }
            return;
        }

        // Handle Heartbeat
        if (data.type === 'event' && data.event === 'pong') {
            return;
        }

        // Handle Chat Events (Streaming)
        if (data.type === 'event' && data.event === 'chat') {
            const payload = data.payload;
            const state = payload.state;
            const contentArray = payload.message?.content;
            let fullText = (contentArray && Array.isArray(contentArray) && contentArray[0]?.text) || '';

            // 1. Strip internal tags immediately
            fullText = this.cleanAgentOutput(fullText);

            if (state === 'delta' || state === 'final') {
                if (!this.activeRunId || this.activeRunId !== payload.runId) {
                    this.activeRunId = payload.runId;
                    this.lastReplyText = '';
                    this.streamingBuffer = '';
                    this.onMessage({ type: 'reply-start' });
                }

                // Append new content to buffer
                const newChunk = fullText.slice(this.lastReplyText.length);
                if (newChunk) {
                    this.streamingBuffer += newChunk;
                    this.lastReplyText = fullText;
                    // We DO NOT send reply-chunk to the UI anymore per requirements
                }

                if (state === 'final') {
                    // Only send the fully collected message now
                    const finalMsg = this.streamingBuffer.trim();

                    // If the message is just NO_REPLY (after stripping), we treat it as empty or don't show
                    if (finalMsg && finalMsg !== 'NO_REPLY') {
                        this.onMessage({ type: 'reply', text: finalMsg });
                    }

                    this.onMessage({ type: 'reply-end' });
                    this.activeRunId = null;
                    this.streamingBuffer = '';
                    this.lastReplyText = '';
                }
            } else if (state === 'error') {
                this.onMessage({ type: 'error', message: payload.errorMessage || 'Chat error' });
                this.activeRunId = null;
                this.streamingBuffer = '';
            }
            return;
        }

        // Handle Generic Response Errors
        if (data.type === 'res' && !data.ok) {
            console.error('[Luffy] Request error:', data.error);
            this.onMessage({ type: 'error', message: data.error?.message || 'Request failed' });
        }
    }

    private startHeartbeat() {
        this.stopHeartbeat();
        this.heartbeatTimer = setInterval(() => {
            this.send({ type: 'req', id: 'ping-' + Date.now(), method: 'health' });
        }, 30000); // 30s heartbeat
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
        }, 1500);
    }

    sendMessage(text: string) {
        if (this.ws?.readyState === WebSocket.OPEN) {
            // Reset tracking for new message
            this.lastReplyText = '';
            this.activeRunId = null;

            this.send({
                type: "req",
                id: "msg-" + Date.now(),
                method: "chat.send",
                params: {
                    sessionKey: "agent:main:main",
                    message: text,
                    idempotencyKey: "run-" + Date.now()
                }
            });
        } else {
            console.error("[Luffy] Cannot send message: WebSocket not connected");
            this.onMessage({ type: 'error', message: 'WebSocket not connected' });
        }
    }

    private send(data: any) {
        if (this.ws?.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(data));
        }
    }

    private cleanAgentOutput(text: string): string {
        if (!text) return '';
        // Handles <begin_of_box>, <|begin_of_box|>, NO_REPLY, etc.
        return text
            .replace(/<\|?begin_of_box\|?>/gi, '')
            .replace(/<\|?end_of_box\|?>/gi, '')
            .replace(/\bNO_REPLY\b/gi, '')
            .replace(/\[\[\s*audio_as_voice\s*\]\]/gi, '')
            .trim();
    }

    disconnect() {
        this.isManuallyClosed = true;
        this.stopHeartbeat();
        if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
        this.ws?.close();
    }
}
