# Future Food Landing

A futuristic landing page built with **Next.js + TypeScript + Tailwind CSS**.

## Key messaging
- Hero includes: **"The future of not paying for food is here"**
- Primary CTA: **"Launch Mission"**

## Tech stack
- Next.js App Router
- TypeScript
- Tailwind CSS (v4)

## Launch Mission telemetry
When users click **Launch Mission**, the app sends a server-side telemetry event to:

- `POST /api/telemetry/launch-mission`

Captured fields (bounded/sanitized):
- `timestamp`
- `ip` (`x-forwarded-for` first, then fallback headers)
- `userAgent`
- `acceptLanguage`
- `referer`
- `method` / `path`
- `queryParams` (bounded)
- allowlisted id/session-like cookies only (bounded)

### Persistence mode
1. **Primary (production): Supabase/Postgres**
   - Requires:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `SUPABASE_SERVICE_ROLE_KEY`
     - Optional `TELEMETRY_TABLE_NAME` (default: `launch_mission_telemetry`)
2. **Fallback (local dev): JSONL file**
   - Used automatically when Supabase env vars are missing
   - File location: `.telemetry/launch-mission.jsonl`

## Database setup
SQL schema is included at:
- `docs/db/launch_mission_telemetry.sql`

Apply it in Supabase SQL Editor (or your migration system).

## Getting started
```bash
npm install
npm run dev
```
Open http://localhost:3000

## Test / build
```bash
npm test
npm run build
```

## Where to view telemetry data
- **Supabase mode:** query the configured telemetry table (default `public.launch_mission_telemetry`)
- **Local fallback mode:** inspect `.telemetry/launch-mission.jsonl`

## Design process
Design inspiration references and adaptation plan are documented in:
- `docs/DESIGN_SCOUT.md`
