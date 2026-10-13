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
supabase test db --local supabase/tests/tenant_authorization.test.sql supabase/tests/security_surface.test.sql
supabase stop --no-backup
```

The explicit `--local` flag ensures the command targets the disposable local
database rather than a linked hosted project. The first run downloads the local
Supabase container images. Each pgTAP file uses deterministic assertions and
rolls back its test transaction. Do not replace the local project configuration
with hosted project credentials.

## Coverage

- `tenant_authorization.test.sql`: owner/member isolation, inactive membership,
  manager/receptionist service-write permissions, cross-tenant mutation denial,
  and anonymous salon-provisioning rejection.
- `security_surface.test.sql`: RLS enabled on all twelve tenant-owned public
  tables and `storage.objects`, private media bucket configuration, privileged
  helper-function grants, and intended public booking RPC grants.

This is a regression baseline, not a complete authorization sign-off. It does
not yet prove every CRUD operation on every tenant-owned table, appointment
status-transition rules, all Storage object paths, or every function's
security properties. Expand the suite before treating tenant authorization as
production-ready.

Public published content intentionally has different visibility from private
workspace data. Tests should use unpublished fixture salons when asserting
private tenant boundaries.

The explicit file list is intentional: the repository also contains legacy
smoke scripts that use `DO` blocks rather than pgTAP and are not collected by
this initial pgTAP gate.
