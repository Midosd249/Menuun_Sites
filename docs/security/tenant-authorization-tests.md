# Tenant authorization tests

These tests exercise the repository migrations against a disposable local Supabase
stack. They do not connect to the hosted project and do not require project secrets.

## Prerequisites

- Docker Engine/Desktop running.
- Supabase CLI installed (CI uses `supabase/setup-cli`).
- Node.js is not required to run the SQL tests.

## Run locally

```sh
supabase start
supabase test db
supabase stop --no-backup
```

The first run downloads the local Supabase container images. The test suite runs
inside a transaction and rolls back deterministic fixtures. Do not replace the
local project configuration with hosted project credentials.

## Current scope and limitations

The initial pgTAP suite checks the core salon membership boundary, inactive
membership denial, manager/receptionist service-write permissions, cross-tenant
mutation denial, and anonymous salon-provisioning rejection. It is a starting
regression suite, not proof that every table, RPC, Storage policy, or SQL grant
is safe. Expand the suite across every tenant-owned table and each CRUD operation
before treating tenant authorization as production-ready.

Public published content intentionally has different visibility from private
workspace data. Tests should use unpublished fixture salons when asserting
private tenant boundaries.
