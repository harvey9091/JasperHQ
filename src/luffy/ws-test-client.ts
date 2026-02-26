
import { WebSocket } from 'ws';

const VITE_OPENCLAW_BASE_URL = 'http://127.0.0.1:18789';
const VITE_OPENCLAW_TOKEN = 'd19f11ac135b1ad0ae283abd2188a7ca04f5878929a9514a';

const wsUrl = `ws://127.0.0.1:18789/_openclaw/ws?auth=${VITE_OPENCLAW_TOKEN}&session=agent:main:default`;

console.log('--- OpenClaw WS Test Client ---');
console.log('Connecting to:', wsUrl);

const ws = new WebSocket(wsUrl);

let authResolved = false;

ws.on('open', () => {
    console.log('[WS] Connected to server.');
});

ws.on('message', (data) => {
    const messageStr = data.toString();
    console.log('[WS] Received:', messageStr);

    try {
        const payload = JSON.parse(messageStr);

        // Challenge handling
        if (payload.type === 'event' && payload.event === 'connect.challenge') {
            const nonce = payload.payload?.nonce;
            console.log('[WS] Challenge received, nonce:', nonce);
            if (nonce) {
                const authMsg = JSON.stringify({
                    type: 'connect.auth',
                    nonce: nonce
                });
                console.log('[WS] Sending auth:', authMsg);
                ws.send(authMsg);
            }
        }

        // Auth success (if any)
        if (payload.type === 'auth_ok' || (payload.type === 'event' && payload.event === 'connect.success')) {
            console.log('[WS] Auth successful!');
            authResolved = true;

            // Send a test message
            setTimeout(() => {
                const testMsg = JSON.stringify({
                    type: "message",
                    role: "user",
                    content: "Hello Luffy, respond with 'TEST_SUCCESS' if you hear me."
                });
                console.log('[WS] Sending test message:', testMsg);
                ws.send(testMsg);
            }, 1000);
        }

        // Other events
        if (payload.type === 'reply-start') console.log('[LUFFY] Reply starting...');
        if (payload.type === 'reply-chunk') console.log('[LUFFY] Chunk:', payload.text);
        if (payload.type === 'reply') console.log('[LUFFY] Full Reply:', payload.text);
        if (payload.type === 'reply-end') {
            console.log('[LUFFY] Reply ended.');
            console.log('--- Test Success! ---');
            // Keep open for a bit then exit
            setTimeout(() => {
                ws.close();
                process.exit(0);
            }, 2000);
        }

    } catch (e) {
        console.error('[WS] Error parsing message:', e);
    }
});

ws.on('close', (code, reason) => {
    console.log('[WS] Connection closed:', code, reason.toString());
    if (!authResolved) {
        console.error('[WS] Failed to authenticate before closure.');
        process.exit(1);
    }
});

ws.on('error', (err) => {
    console.error('[WS] Connection error:', err);
    process.exit(1);
});

// Timeout after 30 seconds
setTimeout(() => {
    console.error('[WS] Test timed out.');
    ws.close();
    process.exit(1);
}, 30000);
