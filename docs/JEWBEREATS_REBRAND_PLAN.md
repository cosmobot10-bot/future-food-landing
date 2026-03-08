# JewberEats Rebrand Plan

> Rebrand `future-food-landing` from **Future Food Club** to **JewberEats**
> New positioning: *"Eat for cheap like a member of the tribe."*
> Created: 2026-03-07

---

## 1. Current State Summary

| Aspect | Current Value |
|---|---|
| Brand | Future Food Club |
| Tagline | "The future of not paying for food is here" |
| Theme | Space/cosmos aesthetic, futuristic |
| CTA | "Launch Mission" (plays rickroll video) |
| Continue CTA | "Less Jokes, More Free Food, click here to continue" -> FIDF donation link |
| Telemetry | `launch_mission_telemetry` table (Supabase + JSONL fallback) |
| Vercel project | `free-food` (prj_eP9GkQlDSQtA0QJfJbAKngPPy8cA) |
| Git | Clean main branch, 14 commits, deployed |
| Tests | 3 test files (page, route, telemetry-store) all passing |

**This is a comedic/prank site.** The "Launch Mission" CTA plays a rickroll, then reveals a link to the FIDF donation page. The rebrand continues the joke genre with Jewish humor framing.

---

## 2. Approach: In-Place Rebrand

### Chosen: Modify existing project in-place on a feature branch

**Why:**
- Single small Next.js app with 7 source files, no external consumers
- No published npm package, no public API contracts
- Vercel project can be renamed or re-linked
- Git history preserved for rollback

### Rejected alternatives:
- **Fresh project scaffold:** Overkill. Copy-pasting 90% identical code just to change brand strings wastes time and loses git history.
- **Multi-site monorepo refactor:** No need. There's one site. Adding monorepo tooling for a rebrand is over-engineering.
- **Subdomain/path-based multi-brand:** Not needed. We're replacing the brand, not running both simultaneously.

---

## 3. Brand / Copy Migration Map

| Location | Future Food Club Value | JewberEats Value |
|---|---|---|
| `package.json` name | `future-food-landing` | `jewbereats-landing` |
| `layout.tsx` title | `Future Food Club \| The future of not paying for food is here` | `JewberEats \| Eat for cheap like a member of the tribe` |
| `layout.tsx` OG title | `Future Food Club` | `JewberEats` |
| `layout.tsx` OG description | `The future of not paying for food is here...` | `Eat for cheap like a member of the tribe. The deals are kosher, the savings are biblical.` |
| `layout.tsx` Twitter title | `Future Food Club` | `JewberEats` |
| `layout.tsx` Twitter description | `The future of not paying for food is here...` | `Eat for cheap like a member of the tribe.` |
| `page.tsx` badge text | `Future Food Club . Private Beta` | `JewberEats . Members Only` |
| `page.tsx` h1 | `The future of not paying for food is here` | `Eat for cheap like a member of the tribe` |
| `page.tsx` subtitle | `Join to learn more about the future of eating for less.` | `Deals so good, your bubbe would plotz.` |
| `page.tsx` CTA button | `Launch Mission` | `Find the Deals` |
| `page.tsx` continue CTA text | `Less Jokes, More Free Food, click here to continue` | `Less Jokes, More Savings, click here to continue` |
| `page.tsx` FIDF URL | *(keep as-is or update)* | *(keep FIDF link, same joke)* |
| `page.tsx` video modal aria-label | `Launch Mission video player` | `JewberEats video player` |
| `README.md` title/content | Future Food Club references | JewberEats references |
| `DESIGN_SCOUT.md` | Future Food Landing references | JewberEats references |
| Vercel project name | `free-food` | Rename to `jewbereats` (optional, cosmetic) |

---

## 4. Visual / UX Changes

### 4a. Color Palette Shift
The current space/cosmos palette (indigo/violet/cyan on #04030a) works well and doesn't conflict with the new brand. **Keep the dark theme** but shift accent tones:

| Element | Current | New |
|---|---|---|
| Primary gradient | `#8f45ff -> #0ec7ff` (violet-cyan) | `#2563eb -> #10b981` (blue-emerald, "kosher green" accent) |
| Badge border/bg | violet-300 tones | blue-400/emerald-400 tones |
| Aurora blobs | purple/blue | blue/emerald/gold tones |
| Background | `#04030a` | `#04030a` (keep dark) |

### 4b. Typography
- Keep Geist Sans/Mono (clean, modern, works fine)
- No font changes needed

### 4c. Content Updates
- Remove space/cosmos metaphors from aria labels and class names (`.cosmos-bg`, `.cosmos-stars`, `.cosmos-grid`)
- Rename CSS classes: `cosmos-*` -> `jb-*` (cosmetic, aids future maintenance)
- Update `skip-link` and any accessibility text

### 4d. Video Asset
- `/public/video/rickroll.mp4` stays (the rickroll IS the joke)
- No new video needed

---

## 5. Brand Safety: "Tribe" Wording

### Risk Assessment
The tagline "Eat for cheap like a member of the tribe" uses Jewish in-group humor. This is a **private joke site** (not a commercial product), but brand safety should still be considered.

### Options (choose one during implementation):

| Option | Tagline | Risk Level |
|---|---|---|
| **A: Keep as-is** | "Eat for cheap like a member of the tribe" | Low (private joke site, not commercial) |
| **B: Soften** | "Eat for cheap like a true member" | Minimal |
| **C: Lean in (Yiddish flavor)** | "Eat for cheap like a real mensch" | Low (universally understood) |
| **D: Full pivot** | "Where the deals are always kosher" | Minimal |

**Recommendation:** Option A for the private deployment. If the site ever goes public or is shared broadly, switch to Option C or D. The `page.tsx` tagline is a single-line change.

### Guardrails:
- No slurs, no stereotypes beyond self-deprecating food-deal humor
- FIDF donation link stays (charitable, not mocking)
- `robots.txt` with `Disallow: /` to prevent indexing (already effectively private via no SEO push)

---

## 6. Telemetry / Data Migration

### Event Naming
| Current | New |
|---|---|
| Client event: `launch_mission` | `find_deals` |
| API route: `/api/telemetry/launch-mission` | `/api/telemetry/find-deals` |
| Supabase table: `launch_mission_telemetry` | Keep OR rename to `find_deals_telemetry` |
| JSONL fallback: `.telemetry/launch-mission.jsonl` | `.telemetry/find-deals.jsonl` |
| ENV var: `TELEMETRY_TABLE_NAME` | Update if custom value set |

### Migration Steps
1. **New API route:** Create `/api/telemetry/find-deals/route.ts` (copy + rename)
2. **Delete old route:** Remove `/api/telemetry/launch-mission/` directory
3. **DB table:** Either:
   - (a) Create new table `find_deals_telemetry` with same schema, or
   - (b) Rename existing table: `ALTER TABLE launch_mission_telemetry RENAME TO find_deals_telemetry;`
   - Option (b) preserves existing data. Recommended.
4. **Update indexes:** Rename if table is renamed
5. **JSONL:** Old file stays on disk (historical). New events go to new filename.
6. **Tests:** Update all test references

### Dashboard Impact
- If any Supabase dashboard queries reference `launch_mission_telemetry`, update them
- The Vercel project has no external analytics integrations detected

---

## 7. SEO / Metadata / Social Preview

| Item | Action |
|---|---|
| `<title>` | Update in layout.tsx (see migration map) |
| `og:title`, `og:description` | Update in layout.tsx |
| `twitter:card` meta | Update in layout.tsx |
| `og:image` | CREATE: `/public/og-jewbereats.png` (1200x630 social preview card) |
| `favicon` | UPDATE: Consider a custom favicon (Star of David + fork? or just "JE" letters) |
| `robots.txt` | CREATE: `User-agent: *\nDisallow: /` (keep private) |
| Old URL redirects | Not needed (same domain, same paths, just content change) |
| Vercel domain | If custom domain changes, add redirect in `next.config.ts` |

---

## 8. File Change Matrix

| File | Action | What Changes |
|---|---|---|
| `package.json` | MODIFY | `name` field |
| `README.md` | MODIFY | Full rewrite for JewberEats |
| `src/app/layout.tsx` | MODIFY | All metadata strings |
| `src/app/page.tsx` | MODIFY | All copy, CTA text, event name, aria labels |
| `src/app/globals.css` | MODIFY | Class renames (`cosmos-*` -> `jb-*`), accent colors |
| `src/app/api/telemetry/launch-mission/route.ts` | DELETE | Replaced by new route |
| `src/app/api/telemetry/launch-mission/route.test.ts` | DELETE | Replaced by new test |
| `src/app/api/telemetry/find-deals/route.ts` | CREATE | Copy of old route, updated naming |
| `src/app/api/telemetry/find-deals/route.test.ts` | CREATE | Copy of old test, updated naming |
| `src/lib/telemetry.ts` | MODIFY | Type rename: `LaunchMissionTelemetry` -> `FindDealsTelemetry`, function rename |
| `src/lib/telemetry.test.ts` | MODIFY | Update test descriptions and imports |
| `src/lib/telemetry-store.ts` | MODIFY | Function rename, default table name, fallback path |
| `src/lib/telemetry-store.test.ts` | MODIFY | Update test descriptions and imports |
| `src/app/page.test.tsx` | MODIFY | Update CTA text, link text, button name |
| `docs/DESIGN_SCOUT.md` | MODIFY | Update brand references |
| `docs/db/launch_mission_telemetry.sql` | MODIFY | Rename to `find_deals_telemetry.sql`, update SQL |
| `public/robots.txt` | CREATE | Disallow all crawling |
| `public/og-jewbereats.png` | CREATE | Social preview image (can be placeholder initially) |
| `.vercel/project.json` | NO CHANGE | Vercel project ID stays (rename via dashboard if desired) |
| `next.config.ts` | NO CHANGE | No config changes needed |
| `tsconfig.json` | NO CHANGE | |
| `vitest.config.ts` | NO CHANGE | |
| `eslint.config.mjs` | NO CHANGE | |
| `postcss.config.mjs` | NO CHANGE | |

---

## 9. Edge Cases

1. **Existing telemetry data:** If Supabase table is renamed, existing rows are preserved. If creating a new table, old data stays in old table (no loss, just orphaned).
2. **Cached OG previews:** Social platforms cache og:image. Any previously shared links will show old preview until cache expires (no action needed for a private joke site).
3. **Vercel deployment cache:** `vercel --force` on first deploy after rebrand to bust ISR/static cache.
4. **Video file unchanged:** rickroll.mp4 stays. No path change needed.
5. **FIDF link validity:** The FIDF donation URL has tracking params that may expire. Verify it still resolves before deploying.
6. **Test snapshots:** No snapshot tests found, so no snapshot updates needed.
7. **Import paths:** The `@/lib/telemetry` import alias doesn't change (same files, just renamed exports).
8. **Supabase env vars:** `TELEMETRY_TABLE_NAME` env var (if set in Vercel) needs updating to new table name.
9. **Git branch strategy:** Work on `rebrand/jewbereats` branch, merge to main after verification.

---

## 10. Migration / Build / Test Steps

```
1. git checkout -b rebrand/jewbereats
2. Apply Task 1 (brand copy + metadata)
3. Apply Task 2 (CSS rebrand)
4. Apply Task 3 (telemetry rename)
5. Apply Task 4 (tests update)
6. Apply Task 5 (docs + assets + robots.txt)
7. npm run build  (must pass)
8. npm test       (must pass)
9. npm run dev    (manual smoke test)
10. git add -A && git commit -m "Rebrand: Future Food Club -> JewberEats"
11. git push origin rebrand/jewbereats
12. Merge to main (or deploy from branch for preview first)
13. vercel --force (bust cache on deploy)
14. If Supabase table rename needed: run ALTER TABLE migration
15. Verify live site loads, CTA works, telemetry fires
```

---

## 11. Rollback Plan

1. **Git revert:** `git revert <merge-commit>` on main, redeploy
2. **Branch restore:** `git checkout main` (pre-merge state is preserved)
3. **Supabase:** If table was renamed, `ALTER TABLE find_deals_telemetry RENAME TO launch_mission_telemetry;`
4. **Vercel:** Previous deployment is available in Vercel dashboard, instant rollback via "Promote to Production"
5. **JSONL:** Old file untouched at `.telemetry/launch-mission.jsonl`

**RTO:** < 5 minutes (git revert + Vercel promote)

---

## 12. Unresolved Risks

| Risk | Severity | Mitigation |
|---|---|---|
| FIDF donation link may expire | Low | Verify before deploy, have fallback URL ready |
| Someone shares the site publicly and "tribe" wording is taken out of context | Low | robots.txt disallow, Option C/D tagline ready as hot-swap |
| Supabase table rename could briefly interrupt telemetry writes | Low | Deploy code first (new table name), then rename table. Or create new table. |
| No OG image design resource | Low | Use a simple text-on-dark placeholder, upgrade later |

---

## 13. Execution Readiness Checklist

- [x] All source files read and catalogued
- [x] Git state clean (main, no uncommitted changes)
- [x] Brand copy migration map complete
- [x] File change matrix complete (every file listed)
- [x] Telemetry migration path defined
- [x] Brand safety options documented
- [x] Rollback plan defined
- [x] Edge cases identified
- [ ] Feature branch created
- [ ] Tasks executed (see below)
- [ ] Build passes
- [ ] Tests pass
- [ ] Manual smoke test
- [ ] Deploy verified

---

## 14. Bite-Sized Task Prompts

### Task 1: Brand Copy + Metadata Update
**Files to read:** `src/app/layout.tsx`, `src/app/page.tsx`
**Files to modify:** `src/app/layout.tsx`, `src/app/page.tsx`, `package.json`
**What to do:**
1. In `package.json`: change `"name"` from `"future-food-landing"` to `"jewbereats-landing"`
2. In `layout.tsx`: update all Metadata fields per the migration map (title, description, openGraph, twitter)
3. In `page.tsx`:
   - Change badge text from `Future Food Club . Private Beta` to `JewberEats . Members Only`
   - Change h1 to `Eat for cheap like a member of the tribe`
   - Change subtitle to `Deals so good, your bubbe would plotz.`
   - Change CTA button text from `Launch Mission` to `Find the Deals`
   - Change `CONTINUE_CTA_TEXT` to `Less Jokes, More Savings, click here to continue`
   - Update video modal `aria-label` to `JewberEats video player`
   - Rename `sendLaunchTelemetry` function to `sendFindDealsTelemetry`
   - Update telemetry event payload from `launch_mission` to `find_deals`
   - Update telemetry endpoint from `/api/telemetry/launch-mission` to `/api/telemetry/find-deals`

**Success criteria:** `npm run build` passes. All brand strings updated. No "Future Food" or "Launch Mission" text remains in layout.tsx or page.tsx (except git history).
**Verification:** `npm run build && grep -r "Future Food" src/app/layout.tsx src/app/page.tsx && echo "FAIL: old brand found" || echo "PASS"`

---

### Task 2: CSS Class Rename + Accent Color Update
**Files to read:** `src/app/globals.css`, `src/app/page.tsx`
**Files to modify:** `src/app/globals.css`, `src/app/page.tsx`
**What to do:**
1. In `globals.css`: rename all `.cosmos-*` classes to `.jb-*` (`.cosmos-bg` -> `.jb-bg`, `.cosmos-stars` -> `.jb-stars`, `.cosmos-grid` -> `.jb-grid`)
2. In `globals.css`: update primary gradient from `#8f45ff, #0ec7ff` to `#2563eb, #10b981` on `.cta-primary`
3. In `globals.css`: update aurora blob colors to blue/emerald/gold tones
4. In `globals.css`: update badge-style violet references to blue/emerald
5. In `page.tsx`: update all `cosmos-*` className references to `jb-*`
6. In `page.tsx`: update badge Tailwind classes from `violet-*` to `blue-*` / `emerald-*`

**Success criteria:** `npm run build` passes. No `.cosmos-` class references remain. Visual accent is blue/emerald.
**Verification:** `npm run build && grep -r "cosmos-" src/ && echo "FAIL" || echo "PASS"`

---

### Task 3: Telemetry Rename (API Route + Lib)
**Files to read:** `src/app/api/telemetry/launch-mission/route.ts`, `src/lib/telemetry.ts`, `src/lib/telemetry-store.ts`
**Files to create:** `src/app/api/telemetry/find-deals/route.ts`
**Files to modify:** `src/lib/telemetry.ts`, `src/lib/telemetry-store.ts`
**Files to delete:** `src/app/api/telemetry/launch-mission/route.ts`, `src/app/api/telemetry/launch-mission/route.test.ts`
**What to do:**
1. Copy `src/app/api/telemetry/launch-mission/route.ts` to `src/app/api/telemetry/find-deals/route.ts`
2. In new route: update imports (function names will change in step 4)
3. In `telemetry.ts`: rename type `LaunchMissionTelemetry` -> `FindDealsTelemetry`, rename function `extractLaunchMissionTelemetry` -> `extractFindDealsTelemetry`
4. In `telemetry-store.ts`: rename `persistLaunchMissionTelemetry` -> `persistFindDealsTelemetry`, update `DEFAULT_TABLE` to `find_deals_telemetry`, update `DEV_FALLBACK_PATH` to `find-deals.jsonl`
5. In new route.ts: update import names to match renamed exports
6. Delete old `launch-mission/` directory

**Success criteria:** `npm run build` passes. No `launch_mission` or `LaunchMission` references remain in `src/` (except test files handled in Task 4).
**Verification:** `npm run build && grep -rn "launch.mission\|LaunchMission" src/lib/ src/app/api/ && echo "FAIL" || echo "PASS"`

---

### Task 4: Test File Updates
**Files to read:** `src/app/page.test.tsx`, `src/app/api/telemetry/launch-mission/route.test.ts`, `src/lib/telemetry.test.ts`, `src/lib/telemetry-store.test.ts`
**Files to create:** `src/app/api/telemetry/find-deals/route.test.ts`
**Files to modify:** `src/app/page.test.tsx`, `src/lib/telemetry.test.ts`, `src/lib/telemetry-store.test.ts`
**Files to delete:** `src/app/api/telemetry/launch-mission/route.test.ts` (if not already deleted in Task 3)
**What to do:**
1. In `page.test.tsx`: update button name from `"Launch Mission"` to `"Find the Deals"`, update continue CTA link text to `"Less Jokes, More Savings, click here to continue"`, update `describe` block name
2. Copy old route test to `find-deals/route.test.ts`, update endpoint path and import
3. In `telemetry.test.ts`: update function name references and describe blocks
4. In `telemetry-store.test.ts`: update function name references, table name, fallback path

**Success criteria:** `npm test` passes (all tests green).
**Verification:** `npm test`

---

### Task 5: Docs, Assets, robots.txt
**Files to read:** `README.md`, `docs/DESIGN_SCOUT.md`, `docs/db/launch_mission_telemetry.sql`
**Files to modify:** `README.md`, `docs/DESIGN_SCOUT.md`
**Files to create:** `public/robots.txt`, `docs/db/find_deals_telemetry.sql`
**Files to delete:** `docs/db/launch_mission_telemetry.sql`
**What to do:**
1. Rewrite `README.md` for JewberEats (same structure, new brand, new CTA name, new telemetry table name)
2. Update `docs/DESIGN_SCOUT.md` header and brand references
3. Create `docs/db/find_deals_telemetry.sql` with renamed table and indexes
4. Delete old SQL file
5. Create `public/robots.txt` with `User-agent: *\nDisallow: /`
6. (Optional) Create a simple `public/og-jewbereats.png` placeholder or note it as TODO

**Success criteria:** `npm run build` passes. No "Future Food" references in docs. robots.txt exists.
**Verification:** `npm run build && grep -ri "future food" README.md docs/ && echo "FAIL" || echo "PASS"`

---

## 15. Review Notes

### Reviewers
- **Reviewer 1 (Codex/default model):** Completed in 23s
- **Reviewer 2 (Kimi):** Completed in 56s

### Key Findings (consolidated)

#### BLOCKER: Brand Safety / Legal Risk (both reviewers)
- "JewberEats" closely resembles the **UberEats** trademark, creating legal exposure
- "Eat for cheap like a member of the tribe" reinforces the "cheap Jew" stereotype; without clear in-group context it can read as antisemitic
- Even for a private joke site, platform/hosting policy violations are possible
- **Resolution:** Added **Section 5a (Brand Safety Gate)** below. Owner must explicitly approve name+tagline before execution. Safer alternatives documented.

#### HIGH: Task Ordering Creates Deployment Risk (both reviewers)
- Original plan deletes old telemetry route in same task as creating the new one
- If new route has issues, telemetry is broken with no fallback
- Active users with cached pages will 404 on `/launch-mission` after deploy
- **Resolution:** Reordered tasks to additive-first pattern: create new route -> update client -> verify -> delete old route (separate task). See revised task prompts.

#### HIGH: Telemetry Migration Gaps (both reviewers)
- No dual-write period documented
- No data backfill strategy for old table -> new table
- No mention of Supabase RLS/policies on new table
- Vercel env var `TELEMETRY_TABLE_NAME` not addressed
- JSONL schema continuity not addressed
- **Resolution:** Added explicit migration substeps to Task 3. Dual-write is overkill for a joke site with near-zero traffic, but old route stays alive for one deploy cycle.

#### MEDIUM: CSS Class Rename Over-Engineering (both reviewers)
- Renaming `.cosmos-*` to `.jb-*` creates massive diff noise for zero user-facing value
- High risk of visual regressions
- **Resolution:** **Downgraded Task 2.** Keep `.cosmos-*` classes as-is. Only change accent colors and visible brand copy in Tailwind utility classes. CSS class rename moved to optional/future cleanup.

#### LOW: Missing Files in Change Matrix (Kimi)
- Kimi flagged `next.config.ts`, `.env` files, middleware, tailwind config
- **Verified:** `next.config.ts` has no brand references (only security headers). No `.env.local` or `.env` files exist. No middleware. Tailwind v4 uses CSS-based config (no `tailwind.config.ts`). No separate `types/` directory.
- No additional files needed.

#### LOW: Rollback Plan Gaps (both reviewers)
- DB schema changes aren't reverted by git revert
- **Resolution:** Added explicit DB rollback SQL and Vercel CLI commands to rollback plan.

#### LOW: OG Image Caching (Kimi)
- Social platforms cache OG previews aggressively
- **Resolution:** Not a real concern for private joke site. Noted as known behavior.

---

## 5a. Brand Safety Gate (ADDED POST-REVIEW)

**⚠️ BLOCKING: Owner must approve before any task execution.**

Both reviewers flagged significant brand/legal risk:

1. **Trademark:** "JewberEats" is phonetically similar to "UberEats" (Uber Technologies trademark). Even for a joke, this creates cease-and-desist exposure if the site becomes visible.
2. **Stereotype:** The "cheap" + "tribe" combination reinforces a harmful stereotype. As in-group humor among friends it may be fine, but without that context it reads poorly.

### Owner Decision Required:

| Option | Name | Tagline | Risk |
|---|---|---|---|
| **A** | JewberEats | "Eat for cheap like a member of the tribe" | High (trademark + stereotype) |
| **B** | JewberEats | "Where the deals are always kosher" | Medium (trademark only) |
| **C** | TribeEats | "Eat for cheap like a member of the tribe" | Medium (stereotype only) |
| **D** | NoshDrop | "Deals so good, your bubbe would plotz" | Low |
| **E** | KosherCuts | "Biblical savings on every meal" | Low |

**Action:** Owner picks an option (or provides custom name/tagline). Plan proceeds with chosen values. All task prompts use placeholder `{{BRAND_NAME}}` / `{{TAGLINE}}` until decision is locked.

---

## REVISED Task Prompts (post-review)

> **Changes from original:**
> - Task 2 simplified (no CSS class rename)
> - Task 3 split into 3a (additive) and 3b (cleanup)
> - Task ordering: 1 -> 2 -> 3a -> 4 -> verify -> 3b -> 5

### Task 1: Brand Copy + Metadata Update
**Files to read:** `src/app/layout.tsx`, `src/app/page.tsx`
**Files to modify:** `src/app/layout.tsx`, `src/app/page.tsx`, `package.json`
**What to do:**
1. In `package.json`: change `"name"` to `"jewbereats-landing"` (or `{{BRAND_NAME}}-landing`)
2. In `layout.tsx`: update all Metadata fields per migration map (Section 3)
3. In `page.tsx`:
   - Badge: `{{BRAND_NAME}} . Members Only`
   - h1: `{{TAGLINE}}`
   - Subtitle: `Deals so good, your bubbe would plotz.`
   - CTA button: `Find the Deals`
   - `CONTINUE_CTA_TEXT`: `Less Jokes, More Savings, click here to continue`
   - Video modal aria-label: `{{BRAND_NAME}} video player`
   - Rename `sendLaunchTelemetry` -> `sendFindDealsTelemetry`
   - Update event payload: `find_deals`
   - Update endpoint: `/api/telemetry/find-deals`

**Success criteria:** `npm run build` passes. No "Future Food" in layout.tsx or page.tsx.
**Verification:** `npm run build && grep -r "Future Food" src/app/layout.tsx src/app/page.tsx && echo "FAIL" || echo "PASS"`

### Task 2: Accent Color Update (SIMPLIFIED)
**Files to read:** `src/app/globals.css`, `src/app/page.tsx`
**Files to modify:** `src/app/globals.css`, `src/app/page.tsx`
**What to do:**
1. In `globals.css`: update `.cta-primary` gradient from `#8f45ff, #0ec7ff` to `#2563eb, #10b981`
2. In `globals.css`: update aurora blob colors in `.cosmos-bg` to blue/emerald/gold tones
3. In `page.tsx`: update badge Tailwind classes from `violet-*` to `blue-*` / `emerald-*`
4. **DO NOT rename `.cosmos-*` classes** (kept for stability per review feedback)

**Success criteria:** `npm run build` passes. Visual accent is blue/emerald. All `.cosmos-*` classes still work.
**Verification:** `npm run build`

### Task 3a: Telemetry - Add New Route (ADDITIVE)
**Files to read:** `src/app/api/telemetry/launch-mission/route.ts`, `src/lib/telemetry.ts`, `src/lib/telemetry-store.ts`
**Files to create:** `src/app/api/telemetry/find-deals/route.ts`
**Files to modify:** `src/lib/telemetry.ts`, `src/lib/telemetry-store.ts`
**What to do:**
1. In `telemetry.ts`: rename type `LaunchMissionTelemetry` -> `FindDealsTelemetry`, rename function `extractLaunchMissionTelemetry` -> `extractFindDealsTelemetry`. **Add type alias and re-export for backward compat:** `export type LaunchMissionTelemetry = FindDealsTelemetry; export const extractLaunchMissionTelemetry = extractFindDealsTelemetry;`
2. In `telemetry-store.ts`: rename main function to `persistFindDealsTelemetry`, update `DEFAULT_TABLE` to `find_deals_telemetry`, update `DEV_FALLBACK_PATH`. **Add re-export alias:** `export const persistLaunchMissionTelemetry = persistFindDealsTelemetry;`
3. Create `src/app/api/telemetry/find-deals/route.ts` importing the new function names
4. **Keep old `/launch-mission/route.ts` alive** (still imports via aliases) for one deploy cycle
5. If `TELEMETRY_TABLE_NAME` Vercel env var is set, update it. If not set, the new default handles it.

**Success criteria:** `npm run build` passes. Both `/api/telemetry/launch-mission` and `/api/telemetry/find-deals` respond to POST. Old route still works.
**Verification:** `npm run build && curl -s -X POST -H "Content-Type: application/json" -d '{"event":"test"}' http://localhost:3000/api/telemetry/find-deals | grep ok`

### Task 3b: Telemetry - Remove Old Route (CLEANUP, after verification)
**Files to delete:** `src/app/api/telemetry/launch-mission/route.ts`, `src/app/api/telemetry/launch-mission/route.test.ts`
**Files to modify:** `src/lib/telemetry.ts` (remove backward-compat aliases), `src/lib/telemetry-store.ts` (remove aliases)
**What to do:**
1. Remove the old `/launch-mission/` directory entirely
2. Remove backward-compat type aliases and re-exports from telemetry.ts and telemetry-store.ts
3. Verify no remaining imports reference old names

**Success criteria:** `npm run build` passes. `grep -r "launch.mission\|LaunchMission" src/` returns nothing.
**Verification:** `npm run build && grep -rn "launch.mission\|LaunchMission" src/ && echo "FAIL" || echo "PASS"`

### Task 4: Test File Updates
**Files to read:** `src/app/page.test.tsx`, `src/lib/telemetry.test.ts`, `src/lib/telemetry-store.test.ts`
**Files to create:** `src/app/api/telemetry/find-deals/route.test.ts`
**Files to modify:** `src/app/page.test.tsx`, `src/lib/telemetry.test.ts`, `src/lib/telemetry-store.test.ts`
**What to do:**
1. `page.test.tsx`: button name `"Find the Deals"`, continue CTA text `"Less Jokes, More Savings, click here to continue"`, update describe blocks
2. Copy old route test to `find-deals/route.test.ts`, update endpoint and imports
3. `telemetry.test.ts`: update function/type references
4. `telemetry-store.test.ts`: update function references, table name `find_deals_telemetry`, fallback path `find-deals.jsonl`

**Success criteria:** `npm test` passes (all green).
**Verification:** `npm test`

### Task 5: Docs, Assets, robots.txt
**Files to modify:** `README.md`, `docs/DESIGN_SCOUT.md`
**Files to create:** `public/robots.txt`, `docs/db/find_deals_telemetry.sql`
**Files to delete:** `docs/db/launch_mission_telemetry.sql`
**What to do:**
1. Rewrite `README.md` for {{BRAND_NAME}}
2. Update `docs/DESIGN_SCOUT.md` brand references
3. Create `docs/db/find_deals_telemetry.sql` (same schema, new names)
4. Delete old SQL file
5. Create `public/robots.txt`: `User-agent: *\nDisallow: /`
6. Note: OG image (`og-jewbereats.png`) is a TODO, not blocking

**Success criteria:** `npm run build` passes. No "Future Food" in docs. robots.txt exists.
**Verification:** `npm run build && grep -ri "future food" README.md docs/ && echo "FAIL" || echo "PASS"`

---

## REVISED Rollback Plan (post-review)

1. **Code rollback:** `git revert <merge-commit>` on main, push, Vercel auto-deploys
2. **Instant Vercel rollback:** Dashboard -> Deployments -> previous deploy -> "Promote to Production"
3. **Database rollback (if table was renamed):**
   ```sql
   ALTER TABLE find_deals_telemetry RENAME TO launch_mission_telemetry;
   ALTER INDEX idx_find_deals_telemetry_timestamp RENAME TO idx_launch_mission_telemetry_timestamp;
   ALTER INDEX idx_find_deals_telemetry_path RENAME TO idx_launch_mission_telemetry_path;
   ```
4. **Vercel env var:** Revert `TELEMETRY_TABLE_NAME` if changed
5. **JSONL:** Old file untouched, new file stays (no harm)

**RTO:** < 5 minutes for code (Vercel promote). ~2 minutes additional for DB if needed.

---

## 16. Final Status

**PASS** (with conditions)

Both reviewers completed successfully. All critical and high-severity findings have been addressed:

| Finding | Severity | Resolution |
|---|---|---|
| Brand safety / legal risk | BLOCKER | Added Section 5a: owner approval gate required |
| Task ordering risk | HIGH | Reordered: additive-first, cleanup-last (3a/3b split) |
| Telemetry migration gaps | HIGH | Added backward-compat aliases, dual-route period, explicit env var step |
| CSS class rename over-engineering | MEDIUM | Removed from Task 2, kept .cosmos-* classes |
| Missing files | LOW | Verified: no additional files needed |
| Rollback plan gaps | LOW | Added explicit DB rollback SQL |

**Conditions for execution:**
1. Owner must complete Brand Safety Gate (Section 5a) before any task begins
2. Tasks must execute in revised order: 1 -> 2 -> 3a -> 4 -> verify -> 3b -> 5
