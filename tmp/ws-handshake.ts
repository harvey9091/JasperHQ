import WebSocket from 'ws';

const wsUrl = 'ws://127.0.0.1:18789/_openclaw/ws?auth=d19f11ac135b1ad0ae283abd2188a7ca04f5878929a9514a&session=agent:main:default';
const ws = new WebSocket(wsUrl, {
    headers: {
        'Origin': 'http://127.0.0.1'
    }
});

ws.on('open', () => {
    console.log('[WS] Connected');
});

ws.on('message', (data) => {
    const msg = JSON.parse(data.toString());
    console.log('[WS] Received type:', msg.type, msg.event || msg.method || '');
    if (msg.type === 'res' && msg.id === 'handshake') {
        console.log('[WS] Handshake response:', JSON.stringify(msg, null, 2));
    }

    if (msg.type === 'event' && msg.event === 'connect.challenge') {
        const nonce = msg.payload.nonce;
        console.log('[WS] Sending connect request with nonce:', nonce);
        ws.send(JSON.stringify({
            type: "req",
            id: "handshake",
            method: "connect",
            params: {
                minProtocol: 3,
                maxProtocol: 3,
                client: {
                    id: "openclaw-control-ui",
                    version: "1.0.0",
                    platform: "web",
                    mode: "webchat"
                },
                scopes: ["operator.read", "operator.write"],
                auth: {
                    token: "d19f11ac135b1ad0ae283abd2188a7ca04f5878929a9514a"
                }
            }
        }));
    }

    if (msg.type === 'res' && msg.id === 'handshake' && msg.ok) {
        console.log('[WS] Handshake successful, sending message...');
        ws.send(JSON.stringify({
            type: "req",
            id: "msg1",
            method: "chat.send",
            params: {
                sessionKey: "agent:main:main",
                message: "Hello Luffy",
                idempotencyKey: "test-idempotency-key-1"
            }
        }));
    }

    if (msg.type === 'event' && msg.event === 'chat') {
        console.log('[WS] Chat event:', JSON.stringify(msg.payload, null, 2));
        if (msg.payload.state === 'final') {
            console.log('[WS] Chat finalized, closing.');
            ws.close();
        }
    }

    if (msg.type === 'res' && !msg.ok) {
        console.error('[WS] Error response:', JSON.stringify(msg.error, null, 2));
    }
});

ws.on('close', (code, reason) => {
    console.log('[WS] Closed:', code, reason.toString());
});

ws.on('error', (err) => {
    console.log('[WS] Error:', err);
});
