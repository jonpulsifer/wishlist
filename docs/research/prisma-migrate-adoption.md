# Adopting `prisma migrate` from `prisma db push` with live data

Research for [#155](https://github.com/jonpulsifer/wishlist/issues/155) (part of
[#148](https://github.com/jonpulsifer/wishlist/issues/148)). Every claim is cited
to prisma.io/docs or the `prisma/prisma` source. Where a claim is inference
rather than documentation, it says so.

## Version discipline (read this first)

This repo pins `prisma` and `@prisma/client` at **6.19.3** (`package.json`).
6.19.3 is the last 6.x release; current is 7.9.1
([releases](https://github.com/prisma/prisma/releases)). prisma.io/docs now
serves ORM 7 by default; ORM 6 docs are under `/docs/v6/`.

**The docs are wrong for this pin in one load-bearing place.** Both the v7 and
the `/v6/` copies of the baselining page write the diff command as
`--to-schema`. That flag does not exist in 6.19.3.

- 6.19.3 `packages/migrate/src/commands/MigrateDiff.ts` accepts only
  `--from-schema-datamodel` / `--to-schema-datamodel` (plus `-datasource`
  variants). [source at tag
  6.19.3](https://github.com/prisma/prisma/blob/6.19.3/packages/migrate/src/commands/MigrateDiff.ts)
- 7.9.1 adds `--from-schema` / `--to-schema` and keeps the `-datamodel` names as
  aliases. [source at tag
  7.9.1](https://github.com/prisma/prisma/blob/7.9.1/packages/migrate/src/commands/MigrateDiff.ts)

Verified locally against the pinned CLI, no database touched:

```
DATABASE_URL='postgresql://nobody:nobody@127.0.0.1:1/does-not-exist' \
  bunx prisma migrate diff --from-empty \
    --to-schema-datamodel prisma/schema.prisma --script
```

exits 0 and emits 290 lines of `CREATE TABLE` for this schema. (The
`libssl/openssl` warning from the nix engine wiring is noise; the command still
produces correct output.) `--from-empty --to-schema-datamodel` opens no
connection, which is why it is safe to run before any decision is made.

Everywhere below, **substitute `--to-schema-datamodel` for the docs'
`--to-schema`** until this repo is on Prisma 7.

---

## 1. Baselining: `db push` database to `prisma migrate`, no data loss

The supported path is *baselining*: generate the SQL that would have created the
current database, and record it as already applied without executing it.

> Baselining is necessary because the production database "already contain[s] the
> tables and columns created by the initial migration"; baselining tells Prisma
> Migrate to "pretend that the initial migration(s) have already been applied."
> — [Baselining](https://www.prisma.io/docs/v6/orm/prisma-migrate/workflows/baselining)

### The commands

Documented order is: introspect, create the directory, diff, resolve, commit.
([Getting started §Adding Prisma Migrate to an existing
project](https://www.prisma.io/docs/v6/orm/prisma-migrate/getting-started),
[Baselining](https://www.prisma.io/docs/v6/orm/prisma-migrate/workflows/baselining))

```bash
# 0. Back up production. Not a documented step; it is the only undo.

# 1. Confirm schema.prisma actually matches production.
#    Do this against a scratch copy of the schema and diff the result —
#    db pull rewrites prisma/schema.prisma in place.
prisma db pull

# 2. The 0_ prefix matters: "Prisma Migrate applies migrations in a
#    lexicographic order."
mkdir -p prisma/migrations/0_init

# 3. Generate the baseline SQL. NOTE the 6.x flag name.
prisma migrate diff \
  --from-empty \
  --to-schema-datamodel prisma/schema.prisma \
  --script > prisma/migrations/0_init/migration.sql

# 4. Review, and hand-add anything PSL cannot express (the docs call this out
#    explicitly: "manually modify the generated SQL to include database
#    features not supported by Prisma Schema Language").

# 5. Against PRODUCTION's connection URL. This writes one row; it runs no DDL.
prisma migrate resolve --applied 0_init

# 6. Commit the whole prisma/migrations folder, including migration_lock.toml.
```

### What `migrate resolve --applied` actually does

> "adds the target migration to the `_prisma_migrations` table and marks it as
> applied." When deploying, Prisma Migrate "skips all migrations marked as
> 'applied', including the baseline migration."
> — [Baselining](https://www.prisma.io/docs/v6/orm/prisma-migrate/workflows/baselining)

That is the whole trick: it is a bookkeeping insert. The `migration.sql` for
`0_init` is never executed against production, so the 600 gifts and 30 users are
never at risk from the adoption step itself. The same command with
`--rolled-back` is the recovery path for a failed migration
([CLI reference](https://www.prisma.io/docs/orm/reference/prisma-cli-reference);
[MigrateResolve.ts at
6.19.3](https://github.com/prisma/prisma/blob/6.19.3/packages/migrate/src/commands/MigrateResolve.ts)
— the two flags are mutually exclusive, "Pass either --applied or
--rolled-back, not both").

`migrate resolve` does connect to the database and does take the advisory lock
(see §4).

### Per-environment

`_prisma_migrations` lives in the database, so **every** environment that was
built with `db push` needs its own `migrate resolve --applied 0_init`:
production, plus any preview/branch database. Locally the data is disposable, so
`mise run db:reset` followed by `prisma migrate dev` is simpler than baselining.

### migration_lock.toml

The docs require committing it: it "is used to detect if you have attempted to
change providers"
([Migration histories](https://www.prisma.io/docs/v6/orm/prisma-migrate/understanding-prisma-migrate/migration-histories),
[Limitations](https://www.prisma.io/docs/v6/orm/prisma-migrate/understanding-prisma-migrate/limitations-and-known-issues)).
`migrate diff --script` writes SQL to stdout and nothing else, so the baselining
recipe above does not produce it — check that it exists (provider =
`postgresql`) before the first `migrate deploy`. *Inference from the diff
command's behaviour, not a documented step.*

### One correction to `.agents/skills/schema-change`

That skill says `db push` "will drop data to reach the declared state." The docs
say `db push` refuses: on a destructive change it will "Throw an error" and
"Require the `--accept-data-loss` option if you still want to make the changes"
([Prototyping your
schema](https://www.prisma.io/docs/v6/orm/prisma-migrate/workflows/prototyping-your-schema)).
The current `build` script passes no such flag, so today a rename **fails the
Vercel build** rather than silently deleting rows. The risk being fixed here is
a stuck deploy and an unexpressable change, not silent deletion. Worth
re-verifying live before relying on it.

---

## 2. Expressing a RENAME so Prisma does not drop-and-recreate

Prisma Migrate diffs *end states*. It has no rename detection, which is why the
docs' own rename example shows a generated `DROP COLUMN` + `ADD COLUMN`. Two
distinct tools:

### (a) `@@map` / `@map` — rename in Prisma-land only

> "`@map` and `@@map` allow you to tune the shape of your Prisma Client API by
> decoupling model and field names from table and column names in the underlying
> database."
> — [Database mapping](https://www.prisma.io/docs/v6/orm/prisma-schema/data-model/database-mapping)

Adding `@@map` **does not change the database**. Rename `model Gift` to
`model Item` and add `@@map("Gift")` and Prisma generates no SQL at all — the
table keeps its name, every row is untouched, and `migrate deploy` has nothing
to do. This is the zero-risk rename, and it survives everything because there is
no migration to survive. The cost is permanent divergence between schema names
and database names. (This schema already does this at column level:
`pant_size`, `shirt_size` land as-is.)

### (b) A hand-edited migration — rename in the database

For an actual `ALTER TABLE ... RENAME`, the documented workflow is
`--create-only`
([Customizing
migrations](https://www.prisma.io/docs/v6/orm/prisma-migrate/workflows/customizing-migrations)):

1. Make the schema change.
2. `prisma migrate dev --create-only` — "Creates a new migration but does not
   apply it" ([CLI reference](https://www.prisma.io/docs/orm/reference/prisma-cli-reference)).
3. Edit the generated SQL.
4. `prisma migrate dev` to apply it.

The docs' worked example, verbatim. Generated:

```sql
ALTER TABLE "Profile" DROP COLUMN "biograpy",
ADD COLUMN  "biography" TEXT NOT NULL;
```

Corrected by hand:

```sql
ALTER TABLE "Profile"
RENAME COLUMN "biograpy" TO "biography"
```

> "To actually rename a field and avoid data loss... you need to modify the
> generated migration SQL before applying it to the database."

The model-level equivalent is `ALTER TABLE "Gift" RENAME TO "Item";`.

### Which survives `migrate dev` regenerating?

**The hand-edit survives, permanently — provided you edit before it is applied.**
Once applied, the migration file is history, not a derived artifact:

- The `prisma/migrations` folder is "the **source of truth** for the history of
  your data model", and `_prisma_migrations` records a checksum used to detect
  "modified applied migrations."
  ([Migration histories](https://www.prisma.io/docs/v6/orm/prisma-migrate/understanding-prisma-migrate/migration-histories))
- `migrate dev` never rewrites an already-applied migration; it only generates
  *new* ones for the difference between the migration history's end state and
  `schema.prisma`. Because your `RENAME COLUMN` reaches the same end state as
  the schema, the next `migrate dev` sees no difference and generates nothing.

What does **not** survive is editing a migration after it was applied. The docs:
you "should not edit or delete a migration that has already been applied";
`migrate dev` "produces an error suggesting a database reset", and every later
`migrate deploy` prints `WARNING The following migrations have been modified
since they were applied`. The fix is "fixing the root cause (restoring the file
or reverting the change) rather than resetting."

### Verify the edit before it ships

A hand-written `RENAME` reaches the right *table* name but can leave index and
constraint names Prisma would not have generated. Check the migration history
against the schema without touching production:

```bash
prisma migrate diff \
  --from-migrations ./prisma/migrations \
  --to-schema-datamodel ./prisma/schema.prisma \
  --script --exit-code
```

`--exit-code` signals "Empty: 0, Error: 1, Not empty: 2"
([MigrateDiff.ts at
6.19.3](https://github.com/prisma/prisma/blob/6.19.3/packages/migrate/src/commands/MigrateDiff.ts)),
so exit 0 means the edited history and the schema agree. Note that
`--from-migrations` **requires a shadow database** — it replays the history into
a throwaway database, so this one needs a local Postgres and `CREATEDB`
([Shadow
database](https://www.prisma.io/docs/v6/orm/prisma-migrate/understanding-prisma-migrate/shadow-database)).

---

## 3. Expressing a SPLIT (one table becoming two, rows back-filled)

### Does data-migration SQL belong in the same file as the schema change?

**Both are documented; the docs prefer separate migrations, and separate is
right here.**

- Separate is what the expand-and-contract walkthrough does. The data copy gets
  its own empty migration: "Create an empty migration and copy existing data
  from the `bio` to the `biography` field", via
  `npx prisma migrate dev --name copy_biography --create-only`, containing just
  `UPDATE "Profile" SET biography = bio;`
  ([Customizing
  migrations](https://www.prisma.io/docs/v6/orm/prisma-migrate/workflows/customizing-migrations))
- Same-file is also documented, for cases where it is unavoidable: the intro to
  that same page says "to change the direction of a 1-1 relation (moving the
  foreign key from one side to another) without data loss, you need to move data
  as part of the migration."

For a split, the copy is only safe when the destination exists, so the ordering
constraint is real. The shape that keeps the constraint and the separation:

```
migration N   — CREATE TABLE "NewThing" (...);  columns NULLable, no FK yet
migration N+1 — INSERT INTO "NewThing" (...) SELECT ... FROM "Gift";
                UPDATE "Gift" SET "newThingId" = ...;
migration N+2 — ALTER TABLE ... SET NOT NULL; ADD CONSTRAINT ... FOREIGN KEY ...
```

The nullable-then-backfill-then-tighten order is not decoration.
"[A]dding mandatory columns to tables with existing data" is listed as a cause of
production migration failure
([Patching and
hotfixing](https://www.prisma.io/docs/v6/orm/prisma-migrate/workflows/patching-and-hotfixing)).
A `NOT NULL` column added to the 600 existing gift rows in one step fails unless
it has a default.

### The TypeScript alternative

Prisma's newer guide performs the back-fill with a TypeScript script run between
`migrate dev` invocations rather than SQL inside a migration
([Data migration guide](https://www.prisma.io/docs/guides/data-migration)):
add the column, run `npm run data-migration:...`, then contract. That suits
back-fills needing application logic (parsing, calling the domain layer). The
trade-off: the script is not recorded in `_prisma_migrations`, so nothing
guarantees it ran in a given environment. For a mechanical copy, SQL in a
migration is the stronger option.

---

## 4. `package.json` `build` on Vercel

### Current

```json
"build": "prisma generate --no-hints && prisma db push && bun run --bun next build"
```

### Target

```json
"build": "prisma generate --no-hints && prisma migrate deploy && bun run --bun next build"
```

That matches Prisma's documented Vercel example verbatim in shape:
`"vercel-build": "prisma generate && prisma migrate deploy && next build"`
([Deploy to
Vercel](https://www.prisma.io/docs/v6/orm/prisma-client/deployment/serverless/deploy-to-vercel)).
`prisma generate` must stay: `migrate deploy` "**Does not** reset the database or
generate artifacts (such as Prisma Client)"
([Development and
production](https://www.prisma.io/docs/v6/orm/prisma-migrate/workflows/development-and-production)).

`migrate deploy` "[a]pplies all pending migrations, and creates the database if
it does not exist" ([CLI
reference](https://www.prisma.io/docs/orm/reference/prisma-cli-reference)) and
otherwise:

- **Does not** warn if an applied migration is *missing* from history
- **Does not** detect drift
- **Does not** rely on a shadow database

so it needs no extra database privileges beyond DDL on the app database.

The docs also say `migrate deploy` "should generally be part of an automated
CI/CD pipeline, and we do not recommend running this command locally to deploy
changes to a production database." A Vercel build step satisfies that.

### Failure modes

**(a) Advisory lock timeout.** Migrate takes a database advisory lock for
`migrate deploy`, `migrate dev` and `migrate resolve`, with a "**10 second
timeout** (not configurable)" on PostgreSQL, MySQL and SQL Server
([Development and
production](https://www.prisma.io/docs/v6/orm/prisma-migrate/workflows/development-and-production)).
Two builds racing the same database — a production deploy plus a preview
deployment sharing `DATABASE_URL`, or a redeploy triggered during a slow
migration — and the loser dies with `Timed out trying to acquire a postgres
advisory lock (SELECT pg_advisory_lock(...)). Timeout: 10000ms.` The build
fails; retry. `PRISMA_SCHEMA_DISABLE_ADVISORY_LOCK` exists since 5.3.0, but
disabling it is worse: parallel migrations against the same schema then fail
randomly because they contend on `_prisma_migrations` itself
([prisma/prisma#25996](https://github.com/prisma/prisma/issues/25996);
see also [#12999](https://github.com/prisma/prisma/issues/12999) on locks not
released after failed migrations). Leave it on.

**(b) The one that actually hurts: a partially applied migration wedges every
future deploy.** Migrations "are not transactional — they can be partially
applied", and each row in `_prisma_migrations` "has a `logs` column that stores
the error"
([Patching and
hotfixing](https://www.prisma.io/docs/v6/orm/prisma-migrate/workflows/patching-and-hotfixing)).
Once a migration is recorded as failed, `migrate deploy` refuses to proceed
until a human resolves it, by hand, against production, with either:

```bash
prisma migrate resolve --rolled-back "20260801120000_split_gift"
# or, after manually finishing the remaining statements:
prisma migrate resolve --applied  "20260801120000_split_gift"
```

On Vercel that reads as: build fails, deployment aborted, the previous
deployment keeps serving — against a **half-migrated database**. Every
subsequent deploy fails at the same point. This is the qualitative change from
`db push`, where a failure leaves nothing recorded. Budget for it: keep the
production connection URL reachable from a laptop, and know the resolve command
before you need it.

**(c) Table locks against live traffic.** The old deployment keeps serving
during the build, so any `ALTER TABLE` that takes a heavy lock blocks the running
app for its duration. Prisma exposes no lock-timeout knob; the migration file is
plain SQL, so a `SET lock_timeout` at the top is available if a statement must be
bounded. *Inference — the docs describe migration files as executable SQL but do
not discuss lock timeouts.* On 600 rows the practical exposure is small; on an
index build or a table rewrite it is not zero.

**(d) PgBouncer.** "Errors may occur when running Prisma Migrate with PgBouncer",
about prepared statements already existing
([Limitations](https://www.prisma.io/docs/v6/orm/prisma-migrate/understanding-prisma-migrate/limitations-and-known-issues)).
The schema already declares `directUrl = env("DIRECT_URL")`; confirm that
`migrate deploy` on Vercel resolves to the direct connection and not the pooler
before the first migration ships. **Open item — not confirmed from the docs in
this pass.**

**(e) Preview deployments.** Any Vercel environment whose `DATABASE_URL` points
at production will now run `migrate deploy` against production on every preview
build. Check that before flipping the script.

---

## 5. Is expand/contract the recommended shape, and what does it cost?

**Yes, Prisma documents it by name as the way to reshape a live schema without
downtime**, listed among the reasons to customize a migration
([Customizing
migrations](https://www.prisma.io/docs/v6/orm/prisma-migrate/workflows/customizing-migrations)),
and walked through end to end in the data-migration guide, which describes it as
"breaking down the steps required to alter a field into a series of discrete
steps designed to introduce the change gradually" to "avoid potential downtime"
([Data migration](https://www.prisma.io/docs/orm/prisma-migrate/workflows/data-migration)).

The documented sequence, mapped onto a `Gift` split:

| Phase | Schema | Code | Deploy |
| --- | --- | --- | --- |
| Expand | add the new table/columns, all nullable | write to **both** shapes, keep reading the old | 1 |
| Migrate | empty migration containing the `INSERT ... SELECT` back-fill | switch reads to the new shape | 2 |
| Contract | drop the old columns/table, tighten `NOT NULL` and FKs | stop writing the old shape | 3 |

**Cost: three deploys minimum**, plus one for baselining, plus a verification
step the docs call out explicitly between phases 2 and 3 ("Verify the integrity
of the `biography` field in the database"). The real cost is not the deploys, it
is the middle phase: application code that writes both shapes, plus `lib/db/`
queries and `projections.ts` that tolerate a row existing in either shape.
Roughly double-writing for the length of one PR cycle.

### Judgment for this repo (opinion, not documentation)

Expand/contract exists to avoid downtime. This is a family wishlist with ~30
users and ~600 gifts; a five-minute window with a fresh backup is available in a
way it is not for most applications. So:

- **Baseline first, as its own PR** (§1). It is non-destructive, independently
  verifiable, and unblocks everything else. Do it whether or not the redraw
  proceeds.
- **Use `@@map` for any rename that is cosmetic** (§2a) — free, reversible, no
  migration.
- **For the split, a single migration behind a backup and a short window is
  defensible** and costs one deploy instead of three. Reach for full
  expand/contract only if the back-fill turns out to be slow enough that the
  window is not short, or if the double-write is needed anyway for another
  reason.
- Either way the ordering rule from §3 holds: nullable, back-fill, then tighten.

---

## Sources

Prisma ORM 6 docs (`/docs/v6/`) unless noted:

- [Getting started with Prisma Migrate](https://www.prisma.io/docs/v6/orm/prisma-migrate/getting-started)
- [Baselining](https://www.prisma.io/docs/v6/orm/prisma-migrate/workflows/baselining)
- [Customizing migrations](https://www.prisma.io/docs/v6/orm/prisma-migrate/workflows/customizing-migrations)
- [Development and production](https://www.prisma.io/docs/v6/orm/prisma-migrate/workflows/development-and-production)
- [Patching and hotfixing](https://www.prisma.io/docs/v6/orm/prisma-migrate/workflows/patching-and-hotfixing)
- [Prototyping your schema](https://www.prisma.io/docs/v6/orm/prisma-migrate/workflows/prototyping-your-schema)
- [Migration histories](https://www.prisma.io/docs/v6/orm/prisma-migrate/understanding-prisma-migrate/migration-histories)
- [Shadow database](https://www.prisma.io/docs/v6/orm/prisma-migrate/understanding-prisma-migrate/shadow-database)
- [Limitations and known issues](https://www.prisma.io/docs/v6/orm/prisma-migrate/understanding-prisma-migrate/limitations-and-known-issues)
- [A mental model for Prisma Migrate](https://www.prisma.io/docs/v6/orm/prisma-migrate/understanding-prisma-migrate/mental-model)
- [Database mapping](https://www.prisma.io/docs/v6/orm/prisma-schema/data-model/database-mapping)
- [Deploy to Vercel](https://www.prisma.io/docs/v6/orm/prisma-client/deployment/serverless/deploy-to-vercel)
- [Data migration (current docs)](https://www.prisma.io/docs/orm/prisma-migrate/workflows/data-migration)
- [Data migration guide (current docs)](https://www.prisma.io/docs/guides/data-migration)
- [Prisma CLI reference (current docs)](https://www.prisma.io/docs/orm/reference/prisma-cli-reference)

`prisma/prisma` source:

- [MigrateDiff.ts @ 6.19.3](https://github.com/prisma/prisma/blob/6.19.3/packages/migrate/src/commands/MigrateDiff.ts)
- [MigrateDiff.ts @ 7.9.1](https://github.com/prisma/prisma/blob/7.9.1/packages/migrate/src/commands/MigrateDiff.ts)
- [MigrateResolve.ts @ 6.19.3](https://github.com/prisma/prisma/blob/6.19.3/packages/migrate/src/commands/MigrateResolve.ts)
- [#25996 — parallel migrations with the advisory lock disabled](https://github.com/prisma/prisma/issues/25996)
- [#12999 — advisory locks not released on failed migrations](https://github.com/prisma/prisma/issues/12999)
