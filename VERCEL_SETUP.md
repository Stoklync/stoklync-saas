# Vercel: saas.stoklync.com must use this folder

**If saas.stoklync.com shows the marketplace instead of the SaaS app**, the Root Directory is wrong.

1. Vercel → **stoklync-saas** project
2. **Settings** → **Build and Deployment**
3. **Root Directory** → set to `stoklync-saas`
4. Save and **Redeploy**

Without this, Vercel builds the repo root (Enterprise/marketplace) instead of this SaaS app.
