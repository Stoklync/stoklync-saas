-- =============================================
-- STOKLYNC SAAS - Supabase Schema
-- Run this in your Supabase SQL Editor
-- Project: cqlnhazzvndacdzawysr
-- =============================================

-- ORGANIZATIONS
create table if not exists organizations (
  id text primary key,
  name text not null default '',
  created_at timestamptz not null default now()
);
alter table organizations enable row level security;
create policy "org members can read" on organizations for select using (
  id in (select org_id from team_members where user_id = auth.uid())
);
create policy "org owner can update" on organizations for update using (
  id in (select org_id from team_members where user_id = auth.uid() and role = 'OWNER')
);
create policy "insert own org" on organizations for insert with check (true);

-- TEAM MEMBERS
create table if not exists team_members (
  id uuid primary key default gen_random_uuid(),
  org_id text not null references organizations(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  name text not null default '',
  email text not null default '',
  role text not null default 'SALES_AGENT',
  status text not null default 'ACTIVE',
  created_at timestamptz not null default now()
);
alter table team_members enable row level security;
create policy "members can read own org" on team_members for select using (
  org_id in (select org_id from team_members tm2 where tm2.user_id = auth.uid())
);
create policy "owner can insert" on team_members for insert with check (true);
create policy "owner can update" on team_members for update using (true);

-- USER ORGANIZATIONS (for multi-org support)
create table if not exists user_organizations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  org_id text not null references organizations(id) on delete cascade,
  role text not null default 'MEMBER',
  created_at timestamptz not null default now(),
  unique(user_id, org_id)
);
alter table user_organizations enable row level security;
create policy "users can read own" on user_organizations for select using (user_id = auth.uid());
create policy "insert allowed" on user_organizations for insert with check (true);

-- ROLE PERMISSIONS
create table if not exists role_permissions (
  id uuid primary key default gen_random_uuid(),
  org_id text not null references organizations(id) on delete cascade,
  role text not null,
  invite_team boolean not null default false,
  manage_billing boolean not null default false,
  manage_finance boolean not null default false,
  edit_branding boolean not null default false,
  delete_leads boolean not null default false,
  delete_orders boolean not null default false,
  add_pipeline_stages boolean not null default false,
  edit_quotes boolean not null default false,
  edit_templates boolean not null default false,
  created_at timestamptz not null default now(),
  unique(org_id, role)
);
alter table role_permissions enable row level security;
create policy "members can read perms" on role_permissions for select using (
  org_id in (select org_id from team_members where user_id = auth.uid())
);
create policy "owner can manage perms" on role_permissions for all using (true);

-- INVITES
create table if not exists invites (
  id uuid primary key default gen_random_uuid(),
  org_id text not null references organizations(id) on delete cascade,
  email text not null,
  name text not null default '',
  role text not null default 'SALES_AGENT',
  status text not null default 'INVITED',
  created_at timestamptz not null default now()
);
alter table invites enable row level security;
create policy "members can read invites" on invites for select using (
  org_id in (select org_id from team_members where user_id = auth.uid())
);
create policy "members can invite" on invites for insert with check (
  org_id in (select org_id from team_members where user_id = auth.uid())
);

-- BRANDING
create table if not exists branding (
  id uuid primary key default gen_random_uuid(),
  org_id text not null unique references organizations(id) on delete cascade,
  company_name text not null default '',
  logo_url text not null default '',
  primary_color text not null default '#163A63',
  phone text not null default '',
  whatsapp text not null default '',
  address text not null default '',
  info_email text not null default '',
  support_email text not null default '',
  sales_email text not null default '',
  contact_email text not null default '',
  instagram_url text not null default '',
  facebook_url text not null default '',
  business_type text not null default 'product',
  updated_at timestamptz not null default now()
);
alter table branding enable row level security;
create policy "members can read branding" on branding for select using (
  org_id in (select org_id from team_members where user_id = auth.uid())
);
create policy "members can upsert branding" on branding for all using (true);

-- WEBSITE CMS
create table if not exists website_cms (
  id uuid primary key default gen_random_uuid(),
  org_id text not null unique references organizations(id) on delete cascade,
  hero_title text not null default '',
  hero_subtitle text not null default '',
  value_line text not null default '',
  process_title text not null default '',
  process_subtitle text not null default '',
  about_title text not null default '',
  about_body1 text not null default '',
  about_body2 text not null default '',
  stock_quote_title text not null default '',
  stock_quote_subtitle text not null default '',
  grapesjs_html text,
  grapesjs_css text,
  updated_at timestamptz not null default now()
);
alter table website_cms enable row level security;
create policy "members can read cms" on website_cms for select using (
  org_id in (select org_id from team_members where user_id = auth.uid())
);
create policy "members can upsert cms" on website_cms for all using (true);
-- Public read for the public site page
create policy "public can read cms" on website_cms for select using (true);

-- LEADS (CRM)
create table if not exists leads (
  id text primary key default 'LD-' || upper(substring(gen_random_uuid()::text, 1, 8)),
  org_id text not null references organizations(id) on delete cascade,
  name text not null default '',
  email text not null default '',
  company text not null default '',
  phone text not null default '',
  stage text not null default 'NEW',
  source text not null default 'WEBSITE',
  next_action text,
  created_at timestamptz not null default now()
);
alter table leads enable row level security;
create policy "members can read leads" on leads for select using (
  org_id in (select org_id from team_members where user_id = auth.uid())
);
create policy "members can manage leads" on leads for all using (true);
-- Enable realtime for new lead notifications
alter publication supabase_realtime add table leads;

-- QUOTES
create table if not exists quotes (
  id text primary key,
  org_id text not null references organizations(id) on delete cascade,
  lead_id text references leads(id) on delete set null,
  customer_name text not null default '',
  customer_company text not null default '',
  customer_email text not null default '',
  customer_phone text not null default '',
  total numeric not null default 0,
  status text not null default 'DRAFT',
  items_json jsonb not null default '[]',
  created_by text not null default '',
  created_at timestamptz not null default now()
);
alter table quotes enable row level security;
create policy "members can manage quotes" on quotes for all using (
  org_id in (select org_id from team_members where user_id = auth.uid())
);

-- TICKETS (Support)
create table if not exists tickets (
  id text primary key default 'TKT-' || to_char(now(), 'YYYYMMDD') || '-' || upper(substring(gen_random_uuid()::text, 1, 6)),
  org_id text not null references organizations(id) on delete cascade,
  subject text not null default '',
  customer text not null default '',
  contact_email text,
  message text,
  status text not null default 'OPEN',
  priority text not null default 'MEDIUM',
  assignee text,
  source text not null default 'MANUAL',
  created_at timestamptz not null default now()
);
alter table tickets enable row level security;
create policy "members can manage tickets" on tickets for all using (
  org_id in (select org_id from team_members where user_id = auth.uid())
);

-- ACTIVITY LOG (CRM notes & history)
create table if not exists activity_log (
  id uuid primary key default gen_random_uuid(),
  org_id text not null references organizations(id) on delete cascade,
  action text not null default 'NOTE',
  entity_type text not null default 'LEAD',
  entity_id text,
  details jsonb not null default '{}',
  performed_by text not null default '',
  created_at timestamptz not null default now()
);
alter table activity_log enable row level security;
create policy "members can manage activity" on activity_log for all using (
  org_id in (select org_id from team_members where user_id = auth.uid())
);

-- SERVICE PROJECTS (for consulting / service businesses)
create table if not exists service_projects (
  id text primary key default 'PRJ-' || upper(substring(gen_random_uuid()::text, 1, 8)),
  org_id text not null references organizations(id) on delete cascade,
  lead_id text references leads(id) on delete set null,
  name text not null default 'New Project',
  status text not null default 'ACTIVE',
  credits_total numeric not null default 0,
  created_at timestamptz not null default now()
);
alter table service_projects enable row level security;
create policy "members can manage projects" on service_projects for all using (
  org_id in (select org_id from team_members where user_id = auth.uid())
);

-- ORDERS (product / e-commerce)
create table if not exists orders (
  id text primary key,
  org_id text not null references organizations(id) on delete cascade,
  total numeric not null default 0,
  status text not null default 'PENDING',
  customer_name text,
  customer_email text,
  items_json jsonb not null default '[]',
  created_at timestamptz not null default now()
);
alter table orders enable row level security;
create policy "members can manage orders" on orders for all using (
  org_id in (select org_id from team_members where user_id = auth.uid())
);

-- =============================================
-- STORAGE BUCKET for branding logos
-- =============================================
-- Run in Supabase Dashboard > Storage:
-- Create bucket: "branding-assets" (public: true)
-- Or run:
-- insert into storage.buckets (id, name, public) values ('branding-assets', 'branding-assets', true) on conflict do nothing;
-- create policy "public read" on storage.objects for select using (bucket_id = 'branding-assets');
-- create policy "auth upload" on storage.objects for insert with check (bucket_id = 'branding-assets' and auth.role() = 'authenticated');
