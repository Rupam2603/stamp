# BHAAR MOSHAI (ভাঁড় মশাই) · Digital Loyalty & Tea Club

Authentic Kolkata-style earthen-pot chai, steaming snacks, and digital loyalty stamp pass powered by Next.js 16, Clerk Authentication, and Supabase.

## Features

- **🍵 Digital Loyalty Stamp Pass**:
  - 3 stamps per reward cycle (3rd Bhar tea / special snack treat free!).
  - Automatic card reset upon collecting all 3 stamps.
  - 10-minute cooldown pause between stamps with persistent tracking.
  - Minimum ₹50 spend validation per stamp.
- **⚡ Seamless Direct Member Login**:
  - Instant login for existing members with zero email verification links required.
  - 1-Click Google OAuth and direct password authentication.
- **🍵 Brand Aesthetic**:
  - Clay terracotta, chai amber, and warm heritage Kolkata theme.
  - Digital interactive counter simulator on `/admin`.
- **⏰ Cafe Timings**:
  - Sunday to Saturday: 5:00 PM – 11:00 PM.

## Included Routes

- `/` — Homepage with brand story, perks, and adda showcase
- `/activate` — Customer activation and direct card login flow
- `/loyalty` — Digital loyalty card with stamps progress, cooldown timer, and completed cycles
- `/offers` — Exclusive adda deals, happy hours, and combos
- `/admin` — Counter cashier desk simulator for stamping and rewards
- `/sign-in` — Clerk authentication sign-in page
- `/sign-up` — Clerk authentication join club page

## Run Locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Configure `.env.local` using the template provided in `.env.example`:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
