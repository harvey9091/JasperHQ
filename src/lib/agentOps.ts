import { supabase } from '../../lib/supabase';

export interface AgentOp {
    sender: string;
    recipient: string;
    message_summary: string;
}

const VALID_AGENTS = ['Luffy', 'Zoro', 'Nami', 'Sanji', 'Robin', 'Brook', 'Usopp', 'Main'];

/**
 * Logs an inter-agent operation to the database.
 * Filters out system, user, and RPC noise at the data-level.
 */
export const logAgentOp = async (op: AgentOp) => {
    // 1. Data-level filtering: Only allow Agent-to-Agent communication
    const isSenderAgent = VALID_AGENTS.includes(op.sender);
    const isRecipientAgent = VALID_AGENTS.includes(op.recipient);

    if (!isSenderAgent || !isRecipientAgent) {
        // Silently drop non-agent messages (system logs, user messages, etc.)
        return;
    }

    // 2. Filter out internal noise like RPC, Init, Handshake
    const noise = ['rpc', 'init', 'handshake', 'heartbeat', 'setup', 'orchestrat'];
    const summaryLower = (op.message_summary || '').toLowerCase();
    if (noise.some(n => summaryLower.includes(n))) {
        return;
    }

    try {
        const { error } = await supabase.from('agent_operations_log').insert({
            sender: op.sender,
            recipient: op.recipient,
            message_summary: op.message_summary
        });
        if (error) throw error;
    } catch (e) {
        console.error('[AgentOps] Failed to log inter-agent operation:', e);
    }
};
