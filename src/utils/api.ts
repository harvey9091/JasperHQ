
const OPENCLAW_BASE = import.meta.env.VITE_OPENCLAW_BASE_URL ?? 'http://127.0.0.1:18789';

export interface LuffyChatMessage {
    message: string;
    sessionId: string;
}

export interface LuffyChatResponse {
    reply: string;
}

export async function sendLuffyMessage(payload: LuffyChatMessage): Promise<LuffyChatResponse> {
    const response = await fetch(`${OPENCLAW_BASE}/chat`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error(`Luffy is unreachable.`);
    }

    return response.json();
}
