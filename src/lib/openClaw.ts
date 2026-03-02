// ─── OpenClaw Agent Gateway ────────────────────────────────────────────────────
// Posts payloads to the local OpenClaw gateway.
// Base URL is configured via VITE_OPENCLAW_BASE_URL in .env

const OPENCLAW_BASE =
    import.meta.env.VITE_OPENCLAW_BASE_URL ?? 'http://127.0.0.1:18789';

export interface AgentPayload {
    leadId?: string;
    userId?: string;
    url?: string;
    instructions?: string;
    [key: string]: unknown;
}

export interface AgentResponse {
    status: 'queued' | 'error';
    message?: string;
}

// ─── Core runner ───────────────────────────────────────────────────────────────
export async function runAgent(
    type: string,
    payload: AgentPayload
): Promise<AgentResponse> {
    const token = import.meta.env.VITE_OPENCLAW_TOKEN;
    try {
        const res = await fetch(`/agent/${type}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload),
        });
        if (!res.ok) {
            console.warn(`[OpenClaw] Agent "${type}" responded ${res.status}`);
            return { status: 'error', message: `Agent responded with ${res.status}` };
        }
        return (await res.json()) as AgentResponse;
    } catch (err) {
        // OpenClaw may not be running locally — log but don't crash the UI
        console.warn(`[OpenClaw] Could not reach agent "${type}":`, err);
        return { status: 'error', message: 'OpenClaw gateway unreachable' };
    }
}

// ─── Named helpers (kept for backwards compatibility) ──────────────────────────
export const triggerDFY = (p: AgentPayload) => runAgent('dfy', p);
export const triggerAPV = (p: AgentPayload) => runAgent('apv', p);
export const triggerEmail = (p: AgentPayload) => runAgent('email', p);
export const triggerResearch = (p: AgentPayload) => runAgent('research', p);
export const triggerMonitor = (p: AgentPayload) => runAgent('monitor', p);
