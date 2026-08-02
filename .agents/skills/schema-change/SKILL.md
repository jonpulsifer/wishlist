---
name: schema-change
description: >-
  Change prisma/schema.prisma safely. Use when adding or altering a model,
  field, or relation, and to understand how this repo's migrations work.
---

# Schema change

## Migrations are the deploy

`prisma/migrations/` is committed, and `package.json`'s `build` runs
`prisma migrate deploy` on every deploy. So a schema change ships as a
migration or it does not ship: the SQL you commit is the SQL production runs.

**The risk is not data loss, it is a wedged deploy.** A migration that fails
part-way is recorded as failed in `_prisma_migrations`, and every subsequent
Vercel deploy then fails at the same point until a human runs
`prisma migrate resolve` against production. Write migrations that either
apply whole or not at all.

**A rename must be written by hand.** Left to itself Prisma emits a drop and a
create, which loses every row. `mise run db:migrate <name>` writes the SQL to a
file without applying it, so replace the generated statements with
`ALTER TABLE … RENAME` before running `mise run db:apply`. Remember that indexes
and constraints keep their old names through a rename — they need their own
`ALTER … RENAME` lines or the schema and the history quietly disagree.

**Do not reach for `prisma migrate dev`.** It refuses to run in a
non-interactive shell, so it is unusable from CI or an agent, and it resolves
drift by offering to reset the database. `db:migrate` generates the same SQL
with `migrate diff` and works everywhere.

That disagreement has a check:

```
bunx --bun prisma migrate diff \
  --from-migrations ./prisma/migrations \
  --to-schema ./prisma/schema.prisma --script --exit-code
```

Exit 0 means the history replays into exactly what `schema.prisma` declares. It
needs a local Postgres with `CREATEDB`, which `mise run db:up` provides.

## The loop

1. Edit `prisma/schema.prisma`.
2. `mise run db:up` if the local database is not running.
3. `mise run db:migrate <name>` — writes the migration and prints it. Read it.
   If nothing changed it says so and writes no directory.
4. `mise run db:apply` — applies it and regenerates the client.
5. `mise run db:reset` — proves the whole chain still applies from empty.
6. Update `lib/db/projections.ts` if the new field should (or must not) reach
   the browser. A field that is not in a projection select cannot leak; one that
   is added to a select ships to every client component using it.
7. Update `lib/db/visibility.ts` if the field changes who may see a row.
8. `mise run typecheck` — the generated client is typed, so most fallout shows
   up here.

The generated client lands in `prisma/generated/` and is gitignored. Never edit
it, never import from it in a client component — import the types from
`lib/db/projections.ts` instead.

## Sensitive fields

Shipping address and clothing sizes live on the user. Anything of that kind is
covered by the `data-access` skill before it is covered here: a new sensitive
column needs a deliberate decision about `profileSelect` and
`visibleProfileWhere`, not just a migration that applies.

## Seed data

`prisma/seed.ts` builds faker data and runs with `mise run db:seed`. Keep it
working when you change a required field — it is the fastest way to get a
populated database, and a broken seed is discovered at the worst moment.
