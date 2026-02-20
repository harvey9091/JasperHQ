import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database
export interface User {
    id: string;
    email: string;
    name: string;
    website?: string;
    created_at: string;
    updated_at: string;
}

export interface UserDashboard {
    id: string;
    user_id: string;
    goal?: string;
    income?: number;
    clients?: number;
    created_at: string;
    updated_at: string;
}
