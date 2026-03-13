# Fix: Sign-in Redirects to Marketplace Instead of SaaS Dashboard

## 1. Vercel: Add NEXT_PUBLIC_APP_URL

In **stoklync-saas** Vercel project → Settings → Environment Variables:
- **Key:** `NEXT_PUBLIC_APP_URL`
- **Value:** `https://saas.stoklync.com`
Redeploy after adding.

## 2. Supabase: Add Redirect URLs

Authentication → URL Configuration → Redirect URLs:
- `https://saas.stoklync.com/**`
- `https://saas.stoklync.com/auth/callback`
- `https://saas.stoklync.com/dashboard`
