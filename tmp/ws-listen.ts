import WebSocket from 'ws';

const wsUrl = 'ws://127.0.0.1:18789/_openclaw/ws?auth=d19f11ac135b1ad0ae283abd2188a7ca04f5878929a9514a&session=agent:main:default';
const ws = new WebSocket(wsUrl);

ws.on('open', () => {
    console.log('[WS] Connected');
});

ws.on('message', (data) => {
    console.log('[WS] Received:', data.toString());
});

ws.on('close', (code, reason) => {
    console.log('[WS] Closed:', code, reason.toString());
});

ws.on('error', (err) => {
    console.log('[WS] Error:', err);
});
