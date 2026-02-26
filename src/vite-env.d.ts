/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_SUPABASE_URL: string
    readonly VITE_SUPABASE_ANON_KEY: string
    readonly VITE_OPENCLAW_BASE_URL: string
    readonly VITE_OPENCLAW_TOKEN: string
    readonly GEMINI_API_KEY?: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
