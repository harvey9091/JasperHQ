import { useAgentStatusStore } from '../store/agentStatusStore';
import { logAgentOp } from './agentOps';
import { listSessionsRpc, invokeAgentRpc } from './openclawRpc';
import { LuffyConnection } from '../luffy/luffyConnection';

/**
 * Ensures a single, persistent Luffy session exists.
 * Rules:
 * 1. Only Luffy.
 * 2. Save session key to localStorage.
 * 3. Never recreate unless missing.
 */
let isInitializing = false;

export const ensureLuffySession = async () => {
    if (isInitializing) return;

    const store = useAgentStatusStore.getState();
    const existingKey = store.luffySessionKey;

    // RULE: If we have a key, reuse it. Don't ping, don't list, don't handshake.
    if (existingKey) {
        console.log('[ensureLuffySession] Reusing existing Luffy session:', existingKey);
        // Ensure the global connection is aware of this key
        LuffyConnection.getInstance().connect(existingKey);
        return;
    }

    isInitializing = true;
    try {
        console.log('[ensureLuffySession] No session key found, searching...');
        // Only fetch sessions if we are completely fresh
        const sessions = await listSessionsRpc('luffy');

        // Try to find a luffy session by name or key
        let luffySession = sessions.find((s: any) => {
            const key = (s.sessionKey || s.key || s.id || '').toLowerCase();
            const name = (s.identityName || s.name || s.label || '').toLowerCase();
            const agentId = (s.agentId || '').toLowerCase();
            return name === 'luffy' || key.includes('luffy') || agentId === 'luffy';
        });

        if (luffySession) {
            const finalKey = luffySession.sessionKey || luffySession.key || luffySession.id;
            console.log('[ensureLuffySession] Found and locking Luffy Session:', finalKey);
            store.setLuffySessionKey(finalKey);
            LuffyConnection.getInstance().connect(finalKey);
        } else {
            console.warn('[ensureLuffySession] No existing Luffy session found in backend. It will be created on the first user message.');
            // We use a stable key default but don't 'invoke' it yet to keep it quiet
            const DEFAULT_KEY = 'agent:luffy:main';
            store.setLuffySessionKey(DEFAULT_KEY);
            LuffyConnection.getInstance().connect(DEFAULT_KEY);
        }
    } catch (err) {
        console.error('[ensureLuffySession] Error:', err);
    } finally {
        isInitializing = false;
    }
};
