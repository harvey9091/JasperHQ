import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ─── Domain Types ──────────────────────────────────────────────────────────────

export interface Lead {
  id: string;
  initials: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  value: string;
  score: number;
  status: 'Active' | 'Negotiating' | 'New' | 'Archived';
  twitter?: string;
  website?: string;
  linkedin?: string;
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  youtube?: string;
  blog?: string;
  notes?: string;
  last_action?: string;
  crm_stage?: string;
  title?: string;
  tag?: string;
  date?: string;
  created_at?: string;
}

export interface CrmDeal {
  id: string;
  title: string;
  company: string;
  value: string;
  tag: 'High' | 'Medium' | 'Low';
  status: string;
  notes?: string;
  column_id: string;
  date: string;
  created_at?: string;
}

export interface ResearchTask {
  id: string;
  lead_id?: string;
  content: string;
  status: 'pending' | 'running' | 'done' | 'error';
  created_at?: string;
}

export interface MonitorLog {
  id: string;
  agent?: string | null;
  event_type?: string | null;
  level: 'INFO' | 'WARN' | 'SUCCESS' | 'ALERT' | string;
  message: string;
  status?: string | null;
  efficiency?: number | null;
  tasks_count?: number | null;
  failures?: number | null;
  schedule?: string | null;
  next_run?: string | null;
  created_at: string;
}

export interface Task {
  id: string;
  time: string;
  label: string;
  description?: string | null;
  type?: string | null;
  color?: string | null;
  tag?: string | null;
  focus?: string | null;   // editing | outreach | business | fitness
  status?: 'pending' | 'done' | 'skipped' | string;
  date?: string | null;
  created_at?: string;
}


export interface Email {
  id: string;
  lead_id?: string;
  tone: string;
  cta: string;
  body: string;
  created_at?: string;
}

export interface AnalyticsEvent {
  id: string;
  type: 'alert' | 'ok' | 'info';
  message: string;
  created_at: string;
}

export interface Settings {
  id?: string;
  user_id: string;
  key: string;
  value: Record<string, string> | string;
  updated_at?: string;
}

// ─── Legacy types ──────────────────────────────────────────────────────────────
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
