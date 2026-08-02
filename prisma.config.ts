import { defineConfig } from 'prisma/config';

// The Prisma CLI's half of the connection story — `migrate`, `studio`, `db
// execute`. The application's half is the driver adapter in lib/db/client.ts.
// Schema files no longer carry a url in v7.
//
// DIRECT_URL is the unpooled connection; schema changes must not go through a
// pooler. Locally the two are the same.
//
// This file is read by every CLI command, `generate` included, so it resolves
// the URL leniently rather than with prisma's `env()` — a missing DIRECT_URL
// should fail the push that needs it, not an install-time generate.
// SHADOW_DATABASE_URL is a local-only scratch database. `migrate diff
// --from-migrations` refuses to run without one and there is no CLI flag for
// it, so the gate that proves the migration history and the schema agree needs
// it configured here. `migrate deploy` never uses one, so it stays unset in CI
// and on Vercel.
export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? '',
    shadowDatabaseUrl: process.env.SHADOW_DATABASE_URL,
  },
});
