-- ============================================================
-- STOKLYNC SaaS — Full Database Schema
-- Run this entire file in Supabase SQL Editor (one shot)
-- Safe to re-run: uses IF NOT EXISTS / IF NOT EXISTS guards
-- ============================================================

-- ─── EXTENSIONS ──────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── 1. ORGANIZATIONS ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS organizations (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "team members can read own org" ON organizations;
CREATE POLICY "team members can read own org"
  ON organizations FOR SELECT
  USING (id IN (SELECT org_id FROM team_members WHERE user_id = auth.uid()));

-- ─── 2. TEAM MEMBERS ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS team_members (
  id         TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  org_id     TEXT NOT NULL,
  user_id    TEXT NOT NULL,
  name       TEXT NOT NULL DEFAULT '',
  email      TEXT NOT NULL DEFAULT '',
  role       TEXT NOT NULL DEFAULT 'OWNER',
  status     TEXT NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_team_org        ON team_members(org_id);
CREATE INDEX IF NOT EXISTS idx_team_user       ON team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_team_org_user   ON team_members(org_id, user_id);

ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "auth users manage own team" ON team_members;
CREATE POLICY "auth users manage own team"
  ON team_members FOR ALL
  USING (user_id = auth.uid() OR org_id IN (
    SELECT org_id FROM team_members tm WHERE tm.user_id = auth.uid()
  ));

-- ─── 3. ROLE PERMISSIONS ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS role_permissions (
  org_id                TEXT NOT NULL,
  role                  TEXT NOT NULL,
  invite_team           BOOLEAN DEFAULT false,
  manage_billing        BOOLEAN DEFAULT false,
  manage_finance        BOOLEAN DEFAULT false,
  edit_branding         BOOLEAN DEFAULT false,
  delete_leads          BOOLEAN DEFAULT false,
  delete_orders         BOOLEAN DEFAULT false,
  add_pipeline_stages   BOOLEAN DEFAULT false,
  edit_quotes           BOOLEAN DEFAULT false,
  edit_templates        BOOLEAN DEFAULT false,
  PRIMARY KEY (org_id, role)
);

ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "team members read own org perms" ON role_permissions;
CREATE POLICY "team members read own org perms"
  ON role_permissions FOR SELECT
  USING (org_id IN (SELECT org_id FROM team_members WHERE user_id = auth.uid()));
DROP POLICY IF EXISTS "owners manage perms" ON role_permissions;
CREATE POLICY "owners manage perms"
  ON role_permissions FOR ALL
  USING (org_id IN (SELECT org_id FROM team_members WHERE user_id = auth.uid() AND role = 'OWNER'));

-- ─── 4. BRANDING ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS branding (
  org_id              TEXT PRIMARY KEY,
  company_name        TEXT NOT NULL DEFAULT '',
  logo_url            TEXT,
  primary_color       TEXT DEFAULT '#163A63',
  phone               TEXT,
  whatsapp            TEXT,
  address             TEXT,
  info_email          TEXT,
  support_email       TEXT,
  sales_email         TEXT,
  contact_email       TEXT,
  instagram_url       TEXT,
  facebook_url        TEXT,
  business_type       TEXT DEFAULT 'service',
  facebook_pixel_id   TEXT,
  ga_id               TEXT,
  auto_welcome_email  BOOLEAN DEFAULT false,
  usd_to_jmd_rate     NUMERIC DEFAULT 157,
  default_tax_rate    NUMERIC DEFAULT 0,
  updated_at          TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE branding ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anyone can read branding" ON branding;
CREATE POLICY "anyone can read branding"
  ON branding FOR SELECT USING (true);
DROP POLICY IF EXISTS "owners update branding" ON branding;
CREATE POLICY "owners update branding"
  ON branding FOR ALL
  USING (org_id IN (SELECT org_id FROM team_members WHERE user_id = auth.uid()));

-- ─── 5. WEBSITE CMS ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS website_cms (
  org_id               TEXT PRIMARY KEY,
  hero_title           TEXT,
  hero_subtitle        TEXT,
  value_line           TEXT,
  process_title        TEXT,
  process_subtitle     TEXT,
  about_title          TEXT,
  about_body1          TEXT,
  about_body2          TEXT,
  stock_quote_title    TEXT,
  stock_quote_subtitle TEXT,
  custom_html          TEXT,
  custom_css           TEXT,
  updated_at           TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE website_cms ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anyone reads cms" ON website_cms;
CREATE POLICY "anyone reads cms"
  ON website_cms FOR SELECT USING (true);
DROP POLICY IF EXISTS "owners manage cms" ON website_cms;
CREATE POLICY "owners manage cms"
  ON website_cms FOR ALL
  USING (org_id IN (SELECT org_id FROM team_members WHERE user_id = auth.uid()));

-- ─── 6. LEADS ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS leads (
  id           TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  org_id       TEXT NOT NULL,
  name         TEXT NOT NULL DEFAULT '',
  email        TEXT NOT NULL DEFAULT '',
  company      TEXT,
  phone        TEXT,
  stage        TEXT NOT NULL DEFAULT 'NEW',
  source       TEXT DEFAULT 'WEBSITE',
  next_action  TEXT,
  assignee     TEXT,
  created_at   TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_leads_org         ON leads(org_id);
CREATE INDEX IF NOT EXISTS idx_leads_org_created ON leads(org_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_stage       ON leads(stage);
CREATE INDEX IF NOT EXISTS idx_leads_source      ON leads(source);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon can insert leads" ON leads;
CREATE POLICY "anon can insert leads"
  ON leads FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "team members manage leads" ON leads;
CREATE POLICY "team members manage leads"
  ON leads FOR ALL
  USING (org_id IN (SELECT org_id FROM team_members WHERE user_id = auth.uid()));

-- ─── 7. ACTIVITY LOG ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS activity_log (
  id           TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  org_id       TEXT NOT NULL,
  action       TEXT NOT NULL DEFAULT 'NOTE',
  entity_type  TEXT NOT NULL DEFAULT 'LEAD',
  entity_id    TEXT NOT NULL DEFAULT '',
  details      JSONB,
  performed_by TEXT,
  created_at   TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_activity_org_entity  ON activity_log(org_id, entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_activity_org_created ON activity_log(org_id, created_at DESC);

ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "team members manage activity" ON activity_log;
CREATE POLICY "team members manage activity"
  ON activity_log FOR ALL
  USING (org_id IN (SELECT org_id FROM team_members WHERE user_id = auth.uid()));

-- ─── 8. TICKETS ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tickets (
  id            TEXT PRIMARY KEY,
  org_id        TEXT NOT NULL,
  subject       TEXT NOT NULL DEFAULT '',
  customer      TEXT NOT NULL DEFAULT '',
  contact_email TEXT,
  message       TEXT,
  status        TEXT NOT NULL DEFAULT 'OPEN',
  priority      TEXT NOT NULL DEFAULT 'MEDIUM',
  assignee      TEXT,
  source        TEXT DEFAULT 'MANUAL',
  created_at    TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tickets_org         ON tickets(org_id);
CREATE INDEX IF NOT EXISTS idx_tickets_org_created ON tickets(org_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tickets_org_status  ON tickets(org_id, status);

ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon can insert tickets" ON tickets;
CREATE POLICY "anon can insert tickets"
  ON tickets FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "team members manage tickets" ON tickets;
CREATE POLICY "team members manage tickets"
  ON tickets FOR ALL
  USING (org_id IN (SELECT org_id FROM team_members WHERE user_id = auth.uid()));

-- ─── 9. QUOTES ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS quotes (
  id               TEXT PRIMARY KEY,
  org_id           TEXT NOT NULL,
  lead_id          TEXT,
  customer_name    TEXT,
  customer_company TEXT,
  customer_email   TEXT,
  customer_phone   TEXT,
  total            NUMERIC DEFAULT 0,
  status           TEXT DEFAULT 'DRAFT',
  items_json       JSONB,
  created_by       TEXT,
  created_at       TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_quotes_org  ON quotes(org_id);
CREATE INDEX IF NOT EXISTS idx_quotes_lead ON quotes(lead_id);

ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "team members manage quotes" ON quotes;
CREATE POLICY "team members manage quotes"
  ON quotes FOR ALL
  USING (org_id IN (SELECT org_id FROM team_members WHERE user_id = auth.uid()));

-- ─── 10. SERVICE PROJECTS ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS service_projects (
  id            TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  org_id        TEXT NOT NULL,
  lead_id       TEXT,
  name          TEXT NOT NULL DEFAULT '',
  status        TEXT DEFAULT 'ACTIVE',
  credits_total INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_projects_org    ON service_projects(org_id);
CREATE INDEX IF NOT EXISTS idx_projects_lead   ON service_projects(lead_id);

ALTER TABLE service_projects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "team members manage projects" ON service_projects;
CREATE POLICY "team members manage projects"
  ON service_projects FOR ALL
  USING (org_id IN (SELECT org_id FROM team_members WHERE user_id = auth.uid()));

-- ─── 11. ORDERS ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  id         TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  org_id     TEXT NOT NULL,
  total      NUMERIC DEFAULT 0,
  status     TEXT DEFAULT 'DRAFT',
  items      JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_orders_org         ON orders(org_id);
CREATE INDEX IF NOT EXISTS idx_orders_org_created ON orders(org_id, created_at DESC);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "team members manage orders" ON orders;
CREATE POLICY "team members manage orders"
  ON orders FOR ALL
  USING (org_id IN (SELECT org_id FROM team_members WHERE user_id = auth.uid()));

-- ─── 12. INVITES ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS invites (
  id         TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  org_id     TEXT NOT NULL,
  email      TEXT NOT NULL,
  name       TEXT,
  role       TEXT DEFAULT 'SALES_AGENT',
  status     TEXT DEFAULT 'INVITED',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_invites_org   ON invites(org_id);
CREATE INDEX IF NOT EXISTS idx_invites_email ON invites(email);

ALTER TABLE invites ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "team members manage invites" ON invites;
CREATE POLICY "team members manage invites"
  ON invites FOR ALL
  USING (org_id IN (SELECT org_id FROM team_members WHERE user_id = auth.uid()));

-- ─── 13. USER ORGANIZATIONS (auth helper) ────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_organizations (
  user_id    TEXT NOT NULL,
  org_id     TEXT NOT NULL,
  role       TEXT DEFAULT 'MEMBER',
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, org_id)
);

CREATE INDEX IF NOT EXISTS idx_user_org_user ON user_organizations(user_id);
CREATE INDEX IF NOT EXISTS idx_user_org_org  ON user_organizations(org_id);

ALTER TABLE user_organizations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "users read own orgs" ON user_organizations;
CREATE POLICY "users read own orgs"
  ON user_organizations FOR ALL
  USING (user_id = auth.uid());

-- ─── STORAGE: site-images bucket ─────────────────────────────────────────────
-- Run this in Supabase Dashboard → Storage → New Bucket → "site-images" → Public
-- OR uncomment and run via SQL (requires storage extension):
-- INSERT INTO storage.buckets (id, name, public) VALUES ('site-images', 'site-images', true)
-- ON CONFLICT (id) DO NOTHING;

-- ─── REALTIME ────────────────────────────────────────────────────────────────
-- Enable realtime for leads (required for live CRM updates in dashboard)
-- In Supabase Dashboard → Database → Replication → enable for: leads, tickets

-- Done! All tables, indexes, and RLS policies created.
