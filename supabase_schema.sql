-- Run this entire script in your Supabase dashboard:
-- https://supabase.com/dashboard/project/dtanveyzwanayijwhytc/sql/new

-- leads
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  initials text, name text not null, company text,
  email text, phone text, value text, score int default 50,
  status text default 'New', notes text,
  twitter text, linkedin text, website text,
  instagram text, facebook text, tiktok text,
  last_action text, created_at timestamptz default now()
);

-- crm_deals
create table if not exists crm_deals (
  id uuid primary key default gen_random_uuid(),
  title text not null, company text, value text,
  tag text default 'Medium', status text default 'New',
  notes text, column_id text default 'new', date text,
  created_at timestamptz default now()
);

-- research_tasks
create table if not exists research_tasks (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid, content text, status text default 'pending',
  created_at timestamptz default now()
);

-- emails
create table if not exists emails (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid, tone text, cta text, body text,
  created_at timestamptz default now()
);

-- settings
create table if not exists settings (
  id uuid primary key default gen_random_uuid(),
  key text unique not null, value text,
  updated_at timestamptz default now()
);

-- analytics_events (used for the Signals feed in Analytics page)
create table if not exists analytics_events (
  id uuid primary key default gen_random_uuid(),
  type text default 'info', message text,
  created_at timestamptz default now()
);

-- seed default settings
insert into settings (key, value) values
  ('name', 'Jasper Admin'),
  ('email', 'admin@jasperhq.io'),
  ('phone', '+1 555 0000')
on conflict (key) do nothing;

-- seed two starter signals
insert into analytics_events (type, message) values
  ('ok', 'Supabase integration active — system connected.'),
  ('ok', 'All tables initialised successfully.')
on conflict do nothing;
