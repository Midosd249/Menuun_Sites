# Menuun — Next.js Migration & Delivery Plan

**Status:** Active — migration not complete  
**Repository:** `Midosd249/Menuun_Sites`  
**Working branch:** `feat/tenant-authorization-rls-tests`  
**Application:** Next.js 15 App Router, React 19, Supabase Auth/DB, Vercel  
**Last updated:** 2026-10-14

## Objective

Replace the legacy standalone owner dashboard (`owner/index.html`) with a fully native, responsive Next.js owner workspace while preserving the existing Supabase project, user accounts, tenant data, and working sign-in path. Deliver a verified Vercel preview before production promotion.

## Current verified facts

- The repository has Next.js 15, React 19, `@supabase/ssr`, and `@supabase/supabase-js` dependencies.
- `app/login/page.tsx` currently re-exports the marketing root page.
- `lib/supabase/client.ts` creates a browser client through `@supabase/ssr`.
- `lib/supabase/server.ts` creates a server client using Next.js cookies.
- `middleware.ts` intentionally does not middleware-protect `/owner`, because it is currently a legacy static HTML application with its own sign-in lifecycle.
- The actual owner UI is still `owner/index.html`; therefore, the previous mobile CSS adjustment did not constitute a Next.js migration.
- A successful login was reported by the owner. This must be retained while migration proceeds.

## Non-negotiable constraints

1. Do not delete the legacy owner page until its required workflows have native replacements and parity checks pass.
2. Never request, store, commit, or print the owner's password, service-role key, or other secrets.
3. Use only Supabase publishable/anon configuration in browser code. Privileged operations remain server-side.
4. Authorization must be enforced by server-side session checks and database RLS, not by hiding UI controls.
5. Keep existing users and tenant data; do not reset auth users, database, or production settings as a migration shortcut.
6. Do not merge into the production branch or claim a deployment is ready until build and preview checks are green.
7. All pages must support Arabic RTL, keyboard access, and mobile widths from 320px without document-level horizontal overflow.

## Target architecture

- **Routes:** App Router route groups and native pages under `app/owner/`.
- **Auth:** one shared browser/server Supabase client using `@supabase/ssr`; preserve callback and recovery routes.
- **Session:** validate with `supabase.auth.getUser()` on protected server routes; middleware refreshes cookies and redirects unauthenticated users without loops.
- **UI:** shared owner shell, responsive navigation, page-level loading/error/empty states, semantic forms, and reusable cards/tables.
- **Data:** typed server-side data access and tenant scoping; Supabase RLS remains the final authorization boundary.
- **Design:** existing Menuun brand direction, polished dark/green surfaces where appropriate, consistent spacing/type, RTL-aware layout, no fixed desktop-width containers on mobile.
- **Delivery:** isolated feature branch, reviewable PR, Vercel preview, build/type/test checks, and explicit manual acceptance checklist.

## Execution phases and acceptance criteria

### Phase 0 — Baseline and inventory
- Inspect all owner dashboard sections, scripts, APIs, database tables, policies, and redirects.
- Record current routes and workflows; identify every dependency on `owner/index.html` and static asset copying.
- Establish baseline build, typecheck, unit tests, and Vercel deployment state.
- **Exit:** inventory and baseline results recorded; no guessed schema or invented success claims.

### Phase 1 — Auth foundation
- Audit public Supabase config and environment variable names without exposing secret values.
- Unify sign-in, sign-up, confirmation callback, sign-out, password recovery, and session refresh.
- Protect owner routes on the server and verify tenant membership/role before returning protected data.
- Ensure `next` redirects are same-origin/local-path only and prevent redirect loops.
- **Exit:** existing owner account signs in, confirmation links return correctly, session survives refresh, and unauthenticated users cannot read owner data.

### Phase 2 — Native owner shell
- Build `app/owner/layout.tsx`, `app/owner/page.tsx`, navigation, mobile drawer/bottom navigation, header, and loading/error states.
- Move shared styles into the application CSS or scoped component styles.
- Use a single content container and prevent document-level horizontal overflow; tables may scroll inside their own wrappers.
- **Exit:** native Next.js owner route renders correctly at 320, 375, 768, 1024, and 1440px; no page-wide horizontal scroll.

### Phase 3 — Feature parity migration
- Port each existing owner workflow one at a time after inventory, preserving data contracts.
- Use server actions or route handlers for privileged mutations; validate input server-side.
- Add tests for loading, empty, failure, unauthorized, and success states.
- Keep legacy route available behind a controlled fallback until parity is confirmed.
- **Exit:** every required legacy workflow has a tested Next.js replacement.

### Phase 4 — Security and quality
- Run production build, TypeScript, unit/integration tests, and SQL/RLS tests.
- Verify tenant isolation for reads, writes, storage paths, and role-specific actions.
- Review auth callback URLs and Vercel environment-variable names; never expose secret values in logs.
- Check accessibility, Arabic RTL, responsive layout, and browser console/network errors.
- **Exit:** all required automated checks pass; any unrun external integration tests are explicitly identified.

### Phase 5 — Preview, acceptance, cutover
- Deploy the feature branch to a Vercel preview.
- Test login, reload/session persistence, owner dashboard workflows, mobile navigation, and logout.
- Compare preview behavior against the legacy page and capture known limitations.
- Only after acceptance, prepare a production cutover and rollback plan.
- **Exit:** preview is READY, tested routes return expected responses, acceptance checklist passes, and rollback path is documented.

## Immediate next actions

1. Finish a route/workflow inventory of `owner/index.html` and the static-copy/build scripts.
2. Inspect existing Supabase auth callback and protected-route behavior before moving redirects.
3. Implement the native owner shell on the feature branch, starting with a read-only dashboard shell and then porting workflows in small reviewable commits.
4. Run build/typecheck/tests and inspect the Vercel preview before claiming completion.

## Manual acceptance checklist

- [ ] Existing account signs in without registering a second account.
- [ ] Email confirmation returns to the correct app route.
- [ ] Refreshing `/owner` retains a valid session.
- [ ] Expired/missing session redirects to login with a safe local `next` path.
- [ ] Owner-only data is not returned to users without the required tenant role.
- [ ] Sign-out clears the session.
- [ ] Mobile widths 320/375/390px show no document-level horizontal scroll.
- [ ] Navigation, forms, cards, and tables remain usable on mobile.
- [ ] Arabic RTL and English layout both render correctly.
- [ ] Build, typecheck, automated tests, and RLS checks pass.
- [ ] Vercel preview status is READY and smoke tests pass.

## Handoff prompt for a new ChatGPT conversation

Continue the Menuun migration from this document: `docs/MENUUN_NEXTJS_MIGRATION_PLAN.md` in repository `Midosd249/Menuun_Sites`, branch `feat/tenant-authorization-rls-tests`. Read this plan and inspect the current repository and latest Vercel deployment before changing code. The goal is a complete native Next.js App Router owner workspace replacing `owner/index.html`, with unified Supabase SSR auth, safe server-side authorization/RLS, polished responsive Arabic RTL mobile UX, workflow parity, tests, and a READY Vercel preview. Preserve existing users and data. Do not claim work or tests succeeded unless tool output proves it. Continue with the next unchecked phase and update this plan as implementation progresses.
