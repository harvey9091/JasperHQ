export const AGENT_MAPPING = {
    Luffy: 'luffy.png',
    Zoro: 'zoro.png',
    Nami: 'nami.png',
    Sanji: 'sanji.png',
    Robin: 'robin.png',
    Brook: 'brook.png',
    Usopp: 'usopp.png',
    Main: 'luffy.png',
} as const;

export type AgentName = keyof typeof AGENT_MAPPING;

export const getAgentAvatar = (name: string): string => {
    const filename = AGENT_MAPPING[name as AgentName] || 'luffy.png';
    return `/src/Assets/${filename}`;
};
