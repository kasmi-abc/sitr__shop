# Sitr Shop

Algerian e-commerce store for religious books and gloves (fustaan): multilingual storefront (AR/FR/EN), cart, COD checkout with OTP verification, order tracking, wishlist, and a full admin dashboard with stock alerts, delivery pricing, printable invoices/labels, and sales reports.

**Version:** 0.1.0

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Drizzle ORM + Neon PostgreSQL
- NextAuth (credentials) + Zod
- Tailwind CSS 4

## Getting Started

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run db:push              # apply the schema to Neon
npm run dev
```

Open http://localhost:3000 (storefront) and http://localhost:3000/admin (dashboard).

## Environment Variables

| Variable | Description |
| --- | --- |
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `NEXTAUTH_URL` | App base URL (e.g. `http://localhost:3000`) |
| `NEXTAUTH_SECRET` | Random secret for Auth.js sessions (`openssl rand -base64 32`) |
| `ADMIN_EMAIL` | Admin login email |
| `ADMIN_PASSWORD_HASH` | Admin password as scrypt hash (never store plaintext) |
| `ADMIN_TOTP_SECRET` | Base32 secret for the 6-digit login (TOTP). **Leave empty or delete the line to disable 2FA** |
| `NEXT_PUBLIC_META_PIXEL_ID` | Optional Meta pixel ID |
| `NEXT_PUBLIC_TIKTOK_PIXEL_ID` | Optional TikTok pixel ID |

### Generate a password hash

```bash
node -e "const{randomBytes,scryptSync}=require('crypto');const s=randomBytes(16).toString('hex');console.log('scrypt$'+s+'$'+scryptSync(process.argv[1],s,64).toString('hex'))" YOUR_PASSWORD
```

### Enable / disable 2FA

- **Enable:** set `ADMIN_TOTP_SECRET` in `.env.local` (any base32 secret, e.g. 32 chars), restart, then scan the otpauth URI or secret with Google Authenticator / Authy.
- **Disable:** remove or empty `ADMIN_TOTP_SECRET` — the OTP step is skipped and only email+password are required.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | ESLint |
| `npm run db:push` | Push Drizzle schema to Neon |
| `npm run db:studio` | Open Drizzle Studio |
| `npm run db:generate` | Generate migrations |
