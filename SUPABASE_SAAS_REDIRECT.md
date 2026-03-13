# Fix: Sign-in Redirects to Marketplace Instead of SaaS Dashboard

If users sign in at **saas.stoklync.com** but land on the **marketplace** (stoklync.com), Supabase is redirecting to the wrong URL.

## Fix in Supabase (required)

1. Go to [Supabase Dashboard](https://supabase.com/dashboard) → your project
2. **Authentication** → **URL Configuration**
3. Under **Redirect URLs**, add:
   - `https://saas.stoklync.com/**`
   - `https://saas.stoklync.com/dashboard`
   - `https://saas.stoklync.com/auth/callback`
4. If you use Vercel preview: `https://stoklync-saas*.vercel.app/**`
5. Click **Save**

Supabase only allows redirects to URLs in this list. Without them, it falls back to **Site URL** (likely stoklync.com), which sends users to the Enterprise marketplace.

## Vercel environment variable (recommended)

In **stoklync-saas** Vercel project → Settings → Environment Variables:

- **Key:** `NEXT_PUBLIC_APP_URL`
- **Value:** `https://saas.stoklync.com`

This ensures auth redirects always target the SaaS app.
