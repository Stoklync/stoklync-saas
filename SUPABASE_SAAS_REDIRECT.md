# Fix: Sign-in Redirects to Marketplace Instead of SaaS Dashboard

If users sign in at **saas.stoklync.com** but land on the **marketplace** (stoklync.com), follow these steps.

## 1. Vercel environment variable (required)

In **stoklync-saas** Vercel project → Settings → Environment Variables:

- **Key:** `NEXT_PUBLIC_APP_URL`
- **Value:** `https://saas.stoklync.com`

Redeploy after adding. This forces auth redirects to the SaaS domain.

## 2. Supabase redirect URLs (required)

1. Go to [Supabase Dashboard](https://supabase.com/dashboard) → your project
2. **Authentication** → **URL Configuration**
3. Under **Redirect URLs**, add (exact strings):
   - `https://saas.stoklync.com/**`
   - `https://saas.stoklync.com/auth/callback`
   - `https://saas.stoklync.com/dashboard`
4. If you use Vercel preview: `https://stoklync-saas*.vercel.app/**`
5. Click **Save**

## 3. Site URL (if still wrong)

If both Enterprise (stoklync.com) and SaaS (saas.stoklync.com) share one Supabase project, **Site URL** can cause conflicts. Supabase may favor Site URL over `redirectTo` in some cases.

- If Site URL is `https://stoklync.com`, redirects may default to the marketplace.
- Try setting **Site URL** to `https://saas.stoklync.com` if the SaaS app is primary for this project. (This may affect Enterprise auth if they share the same project.)
- For separate flows, consider using separate Supabase projects.
