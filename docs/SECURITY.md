# Security Baseline

## Tenant isolation
- Resolve tenant/site from trusted server-side identity or verified hostname mapping.
- Authorize every read/write using membership and role, not only a record ID.
- Apply tenant scope to database queries, storage paths, cache keys, background jobs, preview tokens, exports, and domain operations.
- Add automated negative tests proving tenant A cannot read or mutate tenant B's content, assets, drafts, preview, domains, or publication state.
- Keep public rendering limited to published snapshots.

## Domains and routing
- Normalize hostname casing and trailing dots; reject malformed hosts and unsafe encodings.
- Maintain a reserved-subdomain list for app, api, sites, admin, auth, assets, www, and infrastructure names.
- Verify domain ownership before activation. Never allow a domain to be attached to multiple tenants.
- Prevent open redirects and host-header poisoning.
- Ensure cookies are not shared across customer-controlled subdomains. Evaluate Public Suffix List implications before allowing arbitrary customer content on a shared parent domain.

## Content and uploads
- Use schema-validated section data; never execute customer-provided HTML/JS or arbitrary code.
- Sanitize any supported rich text and apply a restrictive Content Security Policy.
- Enforce file size, MIME/content signature, dimensions, and upload rate limits. Generate storage keys server-side.
- Avoid SVG uploads unless sanitization and safe serving are explicitly implemented.
- Validate links and prevent unsafe schemes such as javascript:.
- Keep preview tokens random, scoped, expiring, revocable, and non-indexable.

## Secrets and integration
- Never commit secrets or real customer data.
- Validate all required environment variables at startup; fail closed on missing production secrets.
- Keep Menu V3 integration credentials server-side; use rotation, least privilege, short-lived credentials where practical, and idempotent requests.
- AI output is untrusted; validate structured output before persistence or publishing.
- Redact credentials, tokens, email addresses, and sensitive content from logs.

## Release security gate
- Secret scanning and dependency audit.
- Authentication and authorization tests.
- Cross-tenant negative tests.
- Domain verification and reserved-name tests.
- Upload validation tests.
- Review database migrations and rollback behavior.
- Verify production configuration and deployed commit independently of CI.
