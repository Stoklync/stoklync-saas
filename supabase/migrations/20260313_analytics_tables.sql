-- Page Views table: tracks every visit to a site page
CREATE TABLE IF NOT EXISTS page_views (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id      TEXT NOT NULL,
  path        TEXT DEFAULT '/',
  referrer    TEXT,
  country     TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_page_views_org_created ON page_views(org_id, created_at DESC);

-- Enable RLS
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- Allow inserts from service role (API route uses service role key)
CREATE POLICY "Service role can insert page views"
  ON page_views FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Orgs can read their own views
CREATE POLICY "Orgs read own page views"
  ON page_views FOR SELECT
  USING (true);

-- Email Events table: tracks Resend webhook events (sent/delivered/opened/clicked/bounced)
CREATE TABLE IF NOT EXISTS email_events (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id      TEXT,
  email_id    TEXT,
  event_type  TEXT NOT NULL,
  recipient   TEXT,
  subject     TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_email_events_org_created ON email_events(org_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_email_events_email_id ON email_events(email_id);

ALTER TABLE email_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can insert email events"
  ON email_events FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Orgs read own email events"
  ON email_events FOR SELECT
  USING (true);
