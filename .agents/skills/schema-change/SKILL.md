---
name: schema-change
description: >-
  Change prisma/schema.prisma safely. Use when adding or altering a model,
  field, or relation, and to understand why this repo has no migrations
  directory.
---

# Schema change

## There are no migrations

This repo uses `prisma db push`, not `prisma migrate`. There is no
`prisma/migrations/` directory and adding one is a decision, not a detail —
`package.json`'s `build` script runs `prisma db push` on every deploy, so the
production schema follows `schema.prisma` directly.

The consequence: **`db push` will drop data to reach the declared state.** A
rename is a drop plus an add. On a change that is not purely additive, say so
explicitly in the PR rather than letting it land quietly.

## The loop

1. Edit `prisma/schema.prisma`.
2. `mise run db:up` if the local database is not running.
3. `mise run db:push` — pushes and regenerates the client in one step.
4. Update `lib/db/projections.ts` if the new field should (or must not) reach
   the browser. A field that is not in a projection select cannot leak; one that
   is added to a select ships to every client component using it.
5. Update `lib/db/visibility.ts` if the field changes who may see a row.
6. `mise run typecheck` — the generated client is typed, so most fallout shows
   up here.

The generated client lands in `prisma/generated/` and is gitignored. Never edit
it, never import from it in a client component — import the types from
`lib/db/projections.ts` instead.

## Sensitive fields

Shipping address and clothing sizes live on the user. Anything of that kind is
covered by the `data-access` skill before it is covered here: a new sensitive
column needs a deliberate decision about `profileSelect` and
`visibleProfileWhere`, not just a successful push.

## Seed data

`prisma/seed.ts` builds faker data and runs with `mise run db:seed`. Keep it
working when you change a required field — it is the fastest way to get a
populated database, and a broken seed is discovered at the worst moment.
