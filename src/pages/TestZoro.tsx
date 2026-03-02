import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAgentStatusStore } from '../store/agentStatusStore';
import { useToast } from '../components/ui/Toast';
import { MessageSquare, RefreshCw, CheckCircle, XCircle } from 'lucide-react';

const MN = 'JetBrains Mono, monospace';

export const TestZoro: React.FC = () => {
    const toast = useToast();
    const { statuses } = useAgentStatusStore();
    const [results, setResults] = useState<string[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);

    const log = (msg: string) => {
        setResults(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
    };

    const runStandaloneTest = async () => {
        setIsGenerating(true);
        setResults([]);
        log('Starting Zoro Connection Test (RPC Mode)...');

        try {
            const { listSessionsRpc, invokeAgentRpc } = await import('../lib/openclawRpc');

            // 1. Check Sessions
            log(`Phase 1: Fetching sessions via WebSocket RPC...`);
            const data = await listSessionsRpc();
            log(`SUCCESS: Found ${data.length} sessions`);

            // 2. Identify Zoro
            log('Phase 2: Identifying Zoro Agent...');
            let detectedZoroKey = null;
            data.forEach((s: any) => {
                const isZoro = s.kind === "direct" ||
                    (s.label && s.label.includes("Zoro")) ||
                    (s.identityName === "Zoro") ||
                    (s.name && s.name.includes("Zoro"));

                if (isZoro && (s.sessionKey || s.id) !== 'agent:main:main') {
                    detectedZoroKey = s.sessionKey || s.id;
                    log(`MATCH FOUND! Name: ${s.name}, Key: ${detectedZoroKey}, Kind: ${s.kind}`);
                }
            });

            if (!detectedZoroKey) {
                log('CRITICAL: Zoro agent not detected in session list.');
                log('HINT: Make sure direct subagents are enabled in OpenClaw.');
                setIsGenerating(false);
                return;
            }

            // 3. Test Invoke
            log(`Phase 3: Testing Zoro Invoke (${detectedZoroKey}) via RPC...`);
            const invokeData = await invokeAgentRpc(detectedZoroKey, "ping");

            log(`SUCCESS! Zoro responded.`);
            log(`Data: ${JSON.stringify(invokeData).substring(0, 200)}...`);
            toast.success('Zoro Connection Verified!');

        } catch (e: any) {
            log(`ERROR: ${e.message}`);
            log(`Hint: Check if OpenClaw is running on 18789 and the token is valid.`);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div style={{ padding: 40, color: 'white' }}>
            <h1 style={{ fontFamily: MN, color: '#FF7A29' }}>ZORO CONNECTION TEST</h1>
            <p style={{ opacity: 0.6, marginBottom: 20 }}>Debug pipeline for JasperHQ Agent connectivity.</p>

            <button
                onClick={runStandaloneTest}
                disabled={isGenerating}
                style={{
                    padding: '12px 24px',
                    background: '#FF7A29',
                    border: 'none',
                    borderRadius: 8,
                    color: 'white',
                    fontFamily: MN,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    opacity: isGenerating ? 0.6 : 1
                }}
            >
                {isGenerating ? <RefreshCw size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <RefreshCw size={16} />}
                RUN DIAGNOSTIC
            </button>

            <div style={{
                marginTop: 30,
                padding: 20,
                background: '#151719',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 12,
                fontFamily: MN,
                fontSize: 12,
                lineHeight: 1.6,
                maxHeight: '60vh',
                overflowY: 'auto'
            }}>
                {results.map((r, i) => {
                    const isSuccess = r.includes('SUCCESS');
                    const isError = r.includes('ERROR') || r.includes('FAILED');
                    return (
                        <div key={i} style={{ color: isSuccess ? '#4BE77F' : isError ? '#FF5C5C' : '#D0D3DA', marginBottom: 4 }}>
                            {r}
                        </div>
                    );
                })}
                {results.length === 0 && <div style={{ opacity: 0.3 }}>No test results yet. Click RUN DIAGNOSTIC.</div>}
            </div>

            <div style={{ marginTop: 20, padding: 20, background: 'rgba(255,122,41,0.05)', borderRadius: 12, border: '1px solid rgba(255,122,41,0.2)' }}>
                <h3 style={{ fontSize: 13, color: '#FF7A29', marginBottom: 10 }}>TROUBLESHOOTING GUIDE</h3>
                <ul style={{ fontSize: 12, opacity: 0.8, marginLeft: 20 }}>
                    <li>Ensure OpenClaw is running on port 18789.</li>
                    <li>Verify VITE_OPENCLAW_TOKEN in .env matches OpenClaw Control.</li>
                    <li><b>Vite Proxy is ACTIVE:</b> All calls use /api or /agent relative paths.</li>
                    <li>If you see "Proxy path incorrect", double check <code>vite.config.ts</code>.</li>
                </ul>
            </div>
        </div>
    );
};
