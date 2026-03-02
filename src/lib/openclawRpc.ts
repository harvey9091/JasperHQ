/**
 * OpenClaw WebSocket RPC helper
 * Bypasses missing REST API by using the WebSocket RPC protocol.
 */

const TOKEN = import.meta.env.VITE_OPENCLAW_TOKEN;


const WS_URL = (agentId: string = 'main') => {
    // Connect DIRECTLY to 8081 to bypass the Vite proxy and stop terminal ECONNABORTED noise
    return `ws://127.0.0.1:8081/ws?auth=${TOKEN}&agent=${agentId}`;
};

export interface OpenClawSession {
    sessionKey: string;
    key?: string; // Add this
    id?: string;
    agentId?: string;
    kind?: string;
    label?: string;
    identityName?: string;
    name?: string;
    updated?: string;
    thinking?: boolean;
}

/**
 * Lists sessions using WebSocket RPC.
 */
export async function listSessionsRpc(agentId: string = 'main'): Promise<OpenClawSession[]> {
    return new Promise((resolve, reject) => {
        const ws = new WebSocket(WS_URL(agentId));
        const timeout = setTimeout(() => {
            ws.close();
            console.error(`[OpenClawRpc] listSessions timeout for agent: ${agentId}`);
            reject(new Error(`RPC Timeout (listSessions for ${agentId})`));
        }, 15000);


        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);

                // 1. Handle Handshake Challenge
                if (data.type === 'event' && data.event === 'connect.challenge') {
                    ws.send(JSON.stringify({
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
                                instanceId: "rpc-client-stable"
                            },
                            auth: { token: TOKEN }
                        }
                    }));
                    return;
                }

                // 2. Handle Handshake Result
                if (data.id === 'handshake') {
                    if (data.ok) {
                        ws.send(JSON.stringify({
                            type: "req",
                            id: "list-sessions",
                            method: "sessions.list",
                            params: {}
                        }));
                    } else {
                        ws.close();
                        reject(new Error(`Handshake failed: ${data.error?.message || 'Check device identity'}`));
                    }
                }

                // 3. Handle Session List Result
                if (data.id === 'list-sessions') {
                    clearTimeout(timeout);
                    if (data.ok) {
                        const rawPayload = data.payload || {};
                        console.log('[OpenClawRpc] Raw Sessions Payload:', JSON.stringify(rawPayload));

                        let finalSessions: OpenClawSession[] = [];

                        // Handle standard { sessions: [...] }
                        if (rawPayload.sessions && Array.isArray(rawPayload.sessions)) {
                            finalSessions = rawPayload.sessions;
                        }
                        // Handle { sessions: { 'id': {...} } }
                        else if (rawPayload.sessions && typeof rawPayload.sessions === 'object') {
                            finalSessions = Object.values(rawPayload.sessions);
                        }
                        // Handle just [...]
                        else if (Array.isArray(rawPayload)) {
                            finalSessions = rawPayload;
                        }
                        // Handle { 'id': {...} }
                        else if (typeof rawPayload === 'object') {
                            finalSessions = Object.values(rawPayload);
                        }

                        // Filter out any potential nulls/undefineds
                        resolve(finalSessions.filter(s => s != null && s.sessionKey != null));
                    } else {
                        reject(new Error(`RPC Error: ${data.error?.message}`));
                    }
                    // Delay close slightly for the proxy
                    setTimeout(() => ws.close(), 100);
                }
            } catch (e) {
                console.error('[OpenClawRpc] Parse error:', e);
            }
        };

        ws.onerror = (err) => {
            clearTimeout(timeout);
            reject(err);
        };
    });
}

/**
 * Invokes an agent session via WebSocket (one-shot).
 */
export async function invokeAgentRpc(sessionKey: string, input: string, agentId: string = 'main'): Promise<any> {
    return new Promise((resolve, reject) => {
        const ws = new WebSocket(WS_URL(agentId));
        const timeout = setTimeout(() => {
            ws.close();
            console.error('[OpenClawRpc] invokeAgent timeout');
            reject(new Error('RPC Timeout (invokeAgent)'));
        }, 30000);


        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);

                if (data.type === 'event' && data.event === 'connect.challenge') {
                    ws.send(JSON.stringify({
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
                                instanceId: "rpc-invoke-stable"
                            },
                            auth: { token: TOKEN }
                        }
                    }));
                    return;
                }

                if (data.id === 'handshake' && data.ok) {
                    ws.send(JSON.stringify({
                        type: "req",
                        id: "invoke",
                        method: "chat.send",
                        params: {
                            sessionKey: sessionKey,
                            message: input,
                            idempotencyKey: `run-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`
                        }
                    }));
                }

                if (data.id === 'invoke') {
                    clearTimeout(timeout);
                    if (data.ok) resolve(data.payload);
                    else reject(new Error(data.error?.message));
                    // Delay close slightly for the proxy
                    setTimeout(() => ws.close(), 100);
                }
            } catch (e) {
                console.error('[OpenClawRpc] Parse error:', e);
            }
        };

        ws.onerror = (err) => {
            clearTimeout(timeout);
            reject(err);
        };
    });
}
