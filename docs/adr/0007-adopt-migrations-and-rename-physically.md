# 7. Adopt `prisma migrate`, and rename the database physically

Date: 2026-08-02
Status: Accepted

## Context

`package.json`'s `build` runs `prisma generate && prisma db push && next build`
on every Vercel deploy. It does **not** pass `--accept-data-loss`, and that flag
appears nowhere in the repo.

That matters more than it looks. Production holds several years of one family's
real history — several hundred Wishes and thirty Users — and the common fear is
that `db push` silently drops it. It does not: a destructive change makes the
**deploy fail** instead. The redraw is blocked not by risk of data loss but
because it *cannot ship at all*.

Every rename the glossary asks for is a destructive change by that definition.

## Decision

**Adopt `prisma migrate` before anything touches a model name.** Adoption is
itself data-safe: `migrate diff` generates a `0_init`, and
`migrate resolve --applied 0_init` writes a bookkeeping row without executing
the SQL.

**Rename the database physically — tables *and* columns.** Not `@@map`.

The alternative was real: `@@map` renames only the table, emits **no SQL at
all**, and would have made every rename free. It was rejected because the cost
is permanent. The database would say `Wishlist` where the code says `Family`,
and `ownerId` where the model says `subjectId`, forever — in the one place a
human reads when they have no context loaded and are already having a bad day.
`@@map` does not avoid that cost; it makes it permanent.

## Consequences

**Prisma will not generate a rename.** It emits DROP+CREATE, so every rename is
a permanent hand-edit to a migration file, one per table and per column.

**The risk is not data loss — it is a wedged deploy.** A rename preserves every
row; it is the same table. But a partially applied migration is recorded as
failed and **blocks every subsequent Vercel deploy** until a human runs
`migrate resolve` against production. That is the failure mode to plan for.

**One trap is silent and deserves naming.** Prisma names implicit join tables
from the two models *alphabetically*. Renaming `Wishlist → Family` turns
`_UserToWishlist(A=User, B=Wishlist)` into `_FamilyToUser(A=Family, B=User)` —
the table renames **and the columns swap meaning**. A migration that renames but
forgets the swap inverts every membership in the app without erroring. Making
membership an explicit `Membership` model sidesteps it by forcing the migration
to state which column is which, but the hazard applies anywhere an implicit
relation is renamed.

**Backfills become available**, which retires two nullables that only existed
because they were not: an Exchange's `year`, and a Wish's proposer.

## What the redraw actually costs

Renames, additions and two copies. Exactly **one `DROP TABLE` destroys anything**
that cannot be reconstructed — the join table pinning Wishes to Families — and
it is called out separately so it cannot hide in a list. The full
change-by-change classification is on
[#161](https://github.com/jonpulsifer/wishlist/issues/161).

Two measurement gates come before anything irreversible runs: the audience delta
per Wish before the join table is dropped, and whether any past Exchange's
participants still share a Family before one is backfilled.

## Grounded and anticipated

**Grounded**: all of it. The build command, the absence of the flag, the
adoption mechanics and the rename behaviour are all verified against this repo
and its pinned Prisma.

## A stale finding to not carry forward

`prisma` is **7.9.1**. The flag is `migrate diff --to-schema`;
`--to-schema-datamodel` was the 6.x spelling and no longer exists. Earlier
research in [#155](https://github.com/jonpulsifer/wishlist/issues/155) says the
opposite and was correct when written.

`.agents/skills/schema-change/SKILL.md` asserts that "db push will drop data to
reach the declared state". That is wrong for this repo, for the reason at the
top of this ADR, and correcting it belongs with the refactor.

Decided in [#155](https://github.com/jonpulsifer/wishlist/issues/155) and
[#161](https://github.com/jonpulsifer/wishlist/issues/161).
