# DealWala — Coupons & Deals Website

Full-stack Next.js 15 app — PostgreSQL, Firebase Google Auth, file uploads, media library, admin panel.

---

## Quick Start

### Option A — Docker (recommended for local dev)

```bash
# 1. Start PostgreSQL
docker-compose up -d

# 2. Install deps
npm install

# 3. Copy env and edit JWT_SECRET
cp .env.example .env.local

# 4. Push schema + seed
npm run db:push
npm run db:seed

# 5. Run
npm run dev
```

# to see db in browser run

npm run db:studio

Database URL for Docker: `postgresql://dealwala:dealwala@localhost:5432/dealwala`

---

### Option B — Cloud PostgreSQL (Neon / Supabase / Railway)

**Neon** (free tier, recommended):

1. https://neon.tech → New project → copy the connection string
2. Paste into `DATABASE_URL` in `.env.local`

**Supabase** (free tier):

1. https://supabase.com → New project → Settings → Database → Connection string (URI mode)

**Railway**:

1. New project → Add PostgreSQL → Variables → `DATABASE_URL`

```bash
npm install
cp .env.example .env.local
# paste DATABASE_URL into .env.local
npm run db:push
npm run db:seed
npm run dev
```

---

## Environment Variables

```env
# PostgreSQL
DATABASE_URL="postgresql://user:pass@host:5432/dbname"

# App
JWT_SECRET="min-32-char-random-string"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
NEXT_PUBLIC_SITE_NAME="DealWala"

# Firebase client (from Firebase console → Project settings → Web app)
NEXT_PUBLIC_FIREBASE_API_KEY="..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_APP_ID="..."

# Firebase Admin (from Service Account JSON)
FIREBASE_PROJECT_ID="..."
FIREBASE_CLIENT_EMAIL="firebase-adminsdk@..."
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Uploads
UPLOAD_DIR="./uploads"
MAX_FILE_SIZE_MB="5"
```

---

## Admin Login

- URL: `http://localhost:3000/login`
- Email: `admin@dealwala.in`
- Password: `admin123`

---

## Database Schema (PostgreSQL)

```
User         — email, password (nullable for Google), firebaseUid, role, avatarUrl
Category     — name, slug, icon, order
Store        — name, slug, logo (emoji), logoUrl (uploaded image), shortDesc, longDesc, affLink
Deal         — title, discount, affLink, storeId, verified, featured, expiresAt, clicks
Coupon       — title, code, discount, affLink, storeId, verified, featured, expiresAt, clicks
Media        — filename (UUID), originalName, mimeType, size, width, height, url
Favorite     — userId, dealId | couponId
Rating       — userId, value (1-5), dealId | couponId
```

All text searches use `mode: 'insensitive'` for PostgreSQL case-insensitive ILIKE queries.

---

## Scripts

```bash
npm run dev           # Dev server (http://localhost:3000)
npm run build         # Production build
npm run start         # Production server

npm run db:push       # Apply schema to DB (no migration history)
npm run db:migrate    # Apply schema with migration history (for production)
npm run db:seed       # Seed sample data
npm run db:studio     # Prisma Studio GUI (http://localhost:5555)
```

---

## Production Deployment

### Vercel + Neon (zero-config)

```bash
# 1. Push code to GitHub
# 2. Import to Vercel
# 3. Add all env vars in Vercel dashboard
# 4. npm run db:migrate (from local, pointing at prod DB)
# 5. npm run db:seed    (optional)
```

> **Note:** Vercel filesystem is ephemeral — uploaded files will disappear on redeploy.
> Use `UPLOAD_DIR` pointing to a persistent disk (Railway/Render) or swap
> `lib/upload.js` to write to Cloudflare R2 / AWS S3.

### Railway (persistent disk)

```bash
# Add PostgreSQL service → copy DATABASE_URL
# Add volume mount at /app/uploads
# Set UPLOAD_DIR="/app/uploads"
```

### Environment hardening for production

```env
DATABASE_URL="postgresql://...?sslmode=require"
JWT_SECRET="<generate with: openssl rand -hex 32>"
MAX_FILE_SIZE_MB="10"
```

---

## Firebase Google Auth Setup

1. https://console.firebase.google.com → New project
2. Authentication → Sign-in method → Enable **Google**
3. Add your domain to **Authorized domains**
4. Project settings → Your apps → Add web app → copy config into `NEXT_PUBLIC_FIREBASE_*`
5. Project settings → Service accounts → **Generate new private key** → copy into `FIREBASE_*`

> Without Firebase configured the Google button shows an error; email/password login always works.
