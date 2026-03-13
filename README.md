# Sokoni Africa 🛒
### AI-Powered E-Commerce for Nigerian Traders

**Free forever. Works on 2G. WhatsApp-native. Built for Lagos.**

---

## Quick Setup (15 minutes)

### Step 1 — Run locally
```bash
git clone https://github.com/oidavid/sokoni-africa
cd sokoni-africa
npm install
cp .env.example .env.local
npm run dev
```
Open http://localhost:3000

### Step 2 — Set up Supabase (free database)
1. Go to https://supabase.com → New Project
2. Copy your URL and anon key into `.env.local`
3. Go to SQL Editor → paste contents of `supabase-schema.sql` → Run

### Step 3 — Set up Anthropic AI (free credits available)
1. Go to https://console.anthropic.com
2. Create API key → paste into `.env.local` as `ANTHROPIC_API_KEY`

### Step 4 — Deploy to Vercel
1. Push to GitHub: `git push origin main`
2. Go to https://vercel.com → Import your GitHub repo
3. Add all environment variables from `.env.local`
4. Deploy — live in 60 seconds ✅

### Step 5 — Connect WhatsApp (after deployment)
See WHATSAPP_SETUP.md for full guide

---

## Project Structure

```
src/
  app/
    page.tsx                    ← Marketing homepage (EN + Pidgin)
    onboarding/page.tsx         ← AI store builder wizard  
    dashboard/page.tsx          ← Merchant dashboard
    dashboard/products/new/     ← Add product + AI description
    store/[slug]/page.tsx       ← Public storefront (ultra-lightweight)
    api/
      whatsapp/webhook/         ← WhatsApp bot
      ai/describe-product/      ← AI product description generator
```

---

## Tech Stack (all free tier)
- **Next.js 14** — Framework
- **Vercel** — Hosting (free)
- **Supabase** — Database + Auth (free)
- **Claude Haiku** — AI (cheap: ~$0.001/store)
- **Meta WhatsApp Cloud API** — WhatsApp (free tier)
- **Tailwind CSS** — Styling

---

Built with ❤️ for Nigerian traders.
