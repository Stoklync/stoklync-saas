# Stoklync SaaS

Customer-facing SaaS for businesses: website, CRM, marketing, support, billing.

**Separate from Stoklync Enterprise (Trade OS).** This repo is for the SaaS product only.

## Setup

1. Copy `.env.example` to `.env.local`
2. Add your Supabase URL and anon key (use a separate Supabase project or the same one with different orgs)
3. `npm run dev`

## Move to its own repo

To push this as a standalone repo:

```bash
cd stoklync-saas
rm -rf .git   # if it inherited from parent
git init
git add .
git commit -m "Initial Stoklync SaaS"
git remote add origin https://github.com/your-org/stoklync-saas.git
git push -u origin main
```

## Structure

- `/` — Landing page
- `/auth/signin` — Sign in / Create account
- `/dashboard` — Customer dashboard (add modules here)
