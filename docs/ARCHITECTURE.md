# Architecture — Menuun Sites

## System boundary
Menuun Sites is a separate web application and deployment from Menu V3.

- Menu V3 continues to own digital-menu workflows and its existing production data.
- Sites owns website drafts, pages, design configuration, assets, domains, publication versions, and site analytics.
- A future Menuun identity/billing service may be shared only through an explicit contract. Until that exists, do not assume shared login, user IDs, or entitlements.
- Sites must not connect directly to Menu V3's database or import its private application modules.

## Logical components
1. **Management app** — authenticated dashboard for site creation, editing, preview, media, and publishing.
2. **Site renderer** — public read-only rendering of published site snapshots.
3. **Domain resolver** — normalizes hostnames, rejects invalid/reserved hosts, resolves verified domains to a site.
4. **Content model** — versioned, validated page/section schema and design tokens.
5. **Asset service** — safe upload, content type/size validation, image processing, and tenant-scoped access.
6. **Publication service** — explicit publish, immutable snapshot, rollback, cache invalidation, and audit events.
7. **Integration adapter** — server-to-server Menuun contracts, timeouts, retries, idempotency, and normalized errors.
8. **Observability** — structured logs, request IDs, security events, metrics, and redaction.

These are logical boundaries, not a requirement to deploy every component separately.

## Core data concepts
- Tenant/workspace
- Site
- Domain (pending, verified, active, disabled)
- Page and localized page content
- Section instances with validated schemas
- Design tokens / theme
- Asset
- Draft revision
- Published immutable snapshot
- Membership and role
- Audit event
- Integration credential / entitlement mapping

Every tenant-owned record must carry an enforceable tenant relationship. Database constraints and server-side authorization should backstop application logic.

## Request flow for public sites
1. Normalize the Host header and reject malformed values.
2. Match platform-owned subdomains or verified custom domains using an authoritative domain mapping.
3. Resolve an active site and its currently published snapshot.
4. Render only public published data.
5. Apply tenant-aware cache keys and purge/invalidate on publish or domain changes.
6. Return a tenant-neutral not-found response for unknown/unverified domains.

Never trust a client-supplied tenant ID or an inbound `x-tenant-id` header. If middleware sets internal tenant context, strip inbound copies first and overwrite only after trusted resolution.

## Menu V3 integration
Use a versioned, server-to-server API boundary. Define before coding:
- API owner and versioning policy
- Auth and key rotation
- Tenant mapping and identity claims
- Entitlement/plan lookup
- Request/response schemas
- Timeouts, retries, idempotency, rate limits
- Error and degraded-mode behavior
- Audit and monitoring
- Data minimization and retention

Do not share database tables, auth cookies, signing secrets, or undocumented internal modules. A user-facing menu can initially be linked from or embedded in a published site using a stable public URL; richer API integration can follow after contract review.

## Publishing model
Edits change drafts. Publishing validates the entire localized site and creates an immutable snapshot. Public rendering reads only the active published snapshot. Rollback reactivates a previous valid snapshot; it does not mutate historical content. Preview URLs must be unguessable, revocable, and never indexed.

## Framework and hosting decision
The repository's initial README alone does not establish an application stack. Choose a framework only after confirming current official documentation and Vercel compatibility. A Next.js App Router + TypeScript stack is a strong candidate because official Next.js/Vercel documentation covers multi-tenant host routing, but the decision must be recorded with a runnable bootstrap and verified build.
