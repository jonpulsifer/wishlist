# The refactor plan

The handoff [the domain-language map](https://github.com/jonpulsifer/wishlist/issues/148)
exists to produce. It sequences the redraw that makes `prisma/schema.prisma`
match `CONTEXT.md`, and it assumes you were in none of the sessions that decided
any of it.

What it consumes: the glossary (`CONTEXT.md`), the seven decisions
(`docs/adr/`), the target schema and its change-by-change classification against
the live rows ([#161](https://github.com/jonpulsifer/wishlist/issues/161)), and
the migration research (`docs/research/prisma-migrate-adoption.md`). Where this
plan and one of those disagree, this plan says so and gives the reason.

What it is not: a licence to redesign. Every decision below was made somewhere
else. This document decides only **order**, **proof** and **undo**.

## The constraint everything is shaped around

Production holds several hundred Wishes and thirty Users — several years of one
family's real history. `package.json`'s `build` runs `prisma db push` with no
`--accept-data-loss`, so today a destructive change does not delete anything; it
**fails the deploy**. Nothing in the redraw can ship until migrations are
adopted, which is why Step 1 is Step 1 and why no step touching a model name is
sequenced before it (ADR-0007).

The risk this plan manages is therefore **not** silent data loss. It is a
partially applied migration, which Prisma records as failed and which then
**blocks every subsequent Vercel deploy** until a human resolves it by hand
against production. That failure has its own runbook at the end of this
document. Read it before Step 1, not after.

## The sequencing principle

**Substance before cosmetics.** The disclosure boundary moves first, the
renames follow. Two reasons: the one destructive drop stops being disclosure-
critical once the new rule is proven live, and the diffs a reviewer has to read
carefully stay small instead of arriving in the same PR as 34 mechanically
renamed files. If this effort stalls halfway, it should stall with the boundary
correct and the words still old, not the other way round.

New things arrive in the **final vocabulary** immediately — `Claimer`,
`Membership`, `lib/db/authority.ts` are created with the names the glossary
gives them, even while the models around them are still called `Gift` and
`Wishlist`. Only existing things wait for their rename.

---

## How to read a step

Each step is **one PR against `main`**. Never stack one on another: a branch cut
from an unmerged branch merged into its base instead of `main` once already in
this effort, and the work was invisible for a week.

Every step states:

- **Changes** — what moves.
- **Migration** — the SQL, or "none".
- **Gate** — how you know it worked.
- **Disclosure** — how it proves it did not widen what a viewer can see.
- **Rollback** — what you do if it fails halfway with 600 Wishes and 30 Users in
  the database.

### The standing gate

Every step, without exception:

| | |
| --- | --- |
| `mise run check` | lint, types, tests — the three CI runs before the build |
| CI green | adds a full `next build` against a throwaway Postgres |

Every step that touches `prisma/schema.prisma` adds:

| | |
| --- | --- |
| `mise run db:reset` | the migration chain applies from empty |
| `mise run db:seed` | the seed still matches the schema |
| `prisma migrate diff --from-migrations ./prisma/migrations --to-schema ./prisma/schema.prisma --script --exit-code` | exit 0 — the hand-edited history and the schema agree |

That last one is the check a hand-edited `RENAME` needs: it replays the history
into a shadow database and compares the end state to `schema.prisma`, so an
index or constraint the rename left behind under its old name shows up as a
non-empty diff.

**`--from-migrations` refuses to run without an explicitly configured shadow
database, and 7.9.1 has no CLI flag for one.** It reads
`datasource.shadowDatabaseUrl` from `prisma.config.ts`, which Step 1 wires to
`SHADOW_DATABASE_URL` and `mise run db:up` creates. The scratch database must
already exist — Migrate resets it but does not create it — and it must not be
the database being migrated, which `migrate deploy` checks and rejects.

### The standing disclosure proof

The repo has had three real disclosure defects, all from visibility rules
written by hand outside `lib/db/visibility.ts`. So:

1. **A rule change appears in `lib/db/visibility.ts` or `lib/db/projections.ts`
   and nowhere else.** If a step's diff adds a membership, claim or ownership
   clause to a page, an action or a query, that step is wrong.
2. **The rule tests assert shape, so assert the new shape.**
   `lib/db/visibility.test.ts` compares the returned `where` object arm by arm;
   `lib/db/projections.test.ts` asserts the *exact key set* a payload carries.
   A field that starts crossing to the browser fails that test until someone
   changes the expected keys deliberately.
3. **A widening is named and counted.** Two are already decided —
   [#156](https://github.com/jonpulsifer/wishlist/issues/156) derives visibility
   from the subject, [#152](https://github.com/jonpulsifer/wishlist/issues/152)
   keeps a claimed Wish visible-as-claimed. Both are steps below, and both quote
   Step 2's measured numbers in the PR body. A widening nobody counted is
   indistinguishable from a leak.
4. **Where a type can carry the proof, make it.** Surprise moves into
   `projections.ts` precisely because a subject's payload must not carry claim
   state *at all* rather than carry it set to a safe value — so the proof is
   `tsc`, not a code review.

### The standing pre-flight for a destructive step

Before merging any step marked **destructive**:

- `pg_dump -Fc "$DIRECT_URL" > wishlist-<step>.dump` from a laptop. Six hundred
  rows; it takes seconds. This is the only undo for a `DROP`.
- Confirm `psql "$DIRECT_URL"` connects from that same laptop **now**, not after
  the deploy has wedged.
- Confirm no preview deployment shares production's `DATABASE_URL`, or it will
  run `migrate deploy` against production on its own schedule.
- Deploy alone. Two builds racing the same database contend on Migrate's
  advisory lock, which has a fixed 10-second timeout and no knob.
- Know that the old deployment keeps serving during the build. A rename is a
  hard cutover: for the length of the build and promotion, the running app
  queries a table that no longer has that name. On this app that is a few
  minutes of errors for thirty people, and it is accepted deliberately —
  expand/contract with views would trade it for double-writing across every
  step, which is a worse deal at this size.

### The docs a step falsifies are part of the step

`AGENTS.md` is normative for every agent that touches this repo, and its hard
rules change under this plan — the role rule dies at Step 17, the visibility
rule's wording changes at Step 7. `.agents/skills/` is worse: three skills
describe `db push` as the way this repo works, and one of them states something
that is already false. A step that leaves them stale has not finished.

Two assertions are wrong **today** and Step 1 corrects them:

- `.agents/skills/schema-change/SKILL.md:18` — "`db push` will drop data to
  reach the declared state". It does not; without `--accept-data-loss` it
  refuses and the deploy fails.
- `docs/research/prisma-migrate-adoption.md` — written against Prisma 6.19.3,
  where the diff flag was `--to-schema-datamodel`. This repo is on **7.9.1**,
  where it is `--to-schema`. The research is correct as of its date and stays;
  the note at the top of it is the thing to trust.

---

## Sequence at a glance

| # | Step | Schema | Destructive | Closes |
| --- | --- | --- | --- | --- |
| 1 | Adopt `prisma migrate`, baseline production | — | no | |
| 2 | Measure production, once | — | no | |
| 3 | Drop what nothing reads | yes | yes | |
| 4 | `/wishlists` becomes your Families | — | no | the hand-written page filter |
| 5 | Delete the pin | — | no | [#181](https://github.com/jonpulsifer/wishlist/issues/181) |
| 6 | `lib/db/authority.ts` | — | no | [#182](https://github.com/jonpulsifer/wishlist/issues/182), [#185](https://github.com/jonpulsifer/wishlist/issues/185) |
| 7 | Visibility derives from the subject | — | no | |
| 8 | Drop `_GiftToWishlist` | yes | **yes** | |
| 9 | `Claimer` arrives, claims are copied | yes | no | |
| 10 | Reads move to `Claimer`; Surprise moves to the projection | — | no | [#179](https://github.com/jonpulsifer/wishlist/issues/179) |
| 11 | Drop `Gift.claimed`, `Gift.claimedById` | yes | yes | |
| 12 | `Gift → Wish` | yes | yes | [#178](https://github.com/jonpulsifer/wishlist/issues/178), [#190](https://github.com/jonpulsifer/wishlist/issues/190) |
| 13 | `Wishlist → Family`, `Membership` goes explicit | yes | **yes** | |
| 14 | `SecretSantaEvent → Exchange` and the rest of Secret Santa | yes | yes | |
| 15 | Exclusions move to your own profile | — | no | |
| 16 | Creating a Family and inviting become member acts | yes | yes | [#186](https://github.com/jonpulsifer/wishlist/issues/186) |
| 17 | Retire roles | yes | yes | |
| 18 | `lib/ai.ts` re-expresses | — | no | |
| 19 | `components/global-search/` and the routes re-express | — | no | |

"Destructive" means the migration contains a `DROP` or a `NOT NULL` tightening.
**Bold** means information is lost that no later query can reconstruct — two
steps, and they are the two that get their own gate.

---

# Phase 0 — Before anything is irreversible

## Step 1. Adopt `prisma migrate`, and baseline production

Adoption is data-safe by construction: `migrate diff` generates the SQL that
*would have* created today's database, and `migrate resolve --applied` writes one
bookkeeping row without executing any of it.

**Changes**

1. Confirm the flag names against the pinned CLI before anything else —
   `bunx --bun prisma migrate diff --help`. This repo is on 7.9.1, so it is
   `--to-schema`; the research doc was written against 6.19.3 and says
   otherwise.
2. Confirm `prisma/schema.prisma` matches production. `prisma db pull` rewrites
   the schema in place, so pull into a scratch copy and diff it.
3. `mkdir -p prisma/migrations/0_init` — the `0_` prefix matters, migrations
   apply in lexicographic order.
4. `prisma migrate diff --from-empty --to-schema prisma/schema.prisma --script >
   prisma/migrations/0_init/migration.sql`.
5. Write `prisma/migrations/migration_lock.toml` with `provider = "postgresql"`.
   `migrate diff --script` does not produce it and `migrate deploy` wants it.
6. `package.json`: `prisma db push` → `prisma migrate deploy` in `build`.
   `prisma generate` stays — `migrate deploy` does not generate the client.
7. `mise.toml`: `db:push` splits into `db:migrate <name>`, which writes a
   migration without applying it, and `db:apply`, which applies pending ones and
   regenerates the client. `db:reset` becomes `prisma migrate reset`, and
   `setup` follows. Locally the data is disposable, so local environments
   migrate from empty rather than baselining.

   **Neither task uses `prisma migrate dev`**, which refuses to run in a
   non-interactive shell and so is unusable from CI or an agent. `db:migrate`
   generates with `migrate diff --from-migrations` into a timestamped
   directory, which is also where the `--create-only` behaviour Phase 3 needs
   comes from: the SQL lands in a file to be read and hand-edited before
   anything applies it.
8. `prisma.config.ts` gains `datasource.shadowDatabaseUrl`, and `db:up` creates
   the database it points at — see the standing gate above.
9. Correct `.agents/skills/schema-change/SKILL.md` (the whole "There are no
   migrations" section, and the false claim at line 18),
   `.agents/skills/local-dev/SKILL.md` (lines 30, 66, 82) and
   `.agents/skills/validate-build/SKILL.md` (line 20). `CONTEXT.md`,
   `prisma.config.ts` and `.claude/settings.json`'s allowlist each name
   `db push` once as well.
10. `prisma/migrations/` is not gitignored — only `prisma/generated` is. Commit
    the whole folder.

**The order of operations is the whole risk in this step.** Run
`prisma migrate resolve --applied 0_init` against **production** — and against
any preview database that was built with `db push` — *before* merging. If the
PR merges first, the production build runs `0_init`'s `CREATE TABLE`s against a
populated database, the first statement fails, the migration is recorded as
failed, and every deploy from then on fails at the same point.

**Migration** — `0_init`, never executed against production.

**Gate**

- CI is the real proof: its Postgres is empty every run, so `migrate deploy`
  executes `0_init` from scratch. A baseline that does not apply cleanly fails
  the PR.
- Production: `SELECT migration_name, finished_at, logs FROM
  "_prisma_migrations"` returns exactly one row, finished, with null logs.
- `mise run db:reset && mise run db:seed`.
- Verify the two open items the research left unconfirmed: that `migrate
  deploy` on Vercel resolves `DIRECT_URL` and not the pooler (`prisma.config.ts`
  prefers it, so confirm the variable is set in Vercel's production
  environment), and that no preview environment points at production.

**Disclosure** — none. No query, rule or projection changes.

**Rollback** — nothing has run. Revert the one-line `package.json` change and
`db push` works again, because the schema and the database still agree. Delete
the `_prisma_migrations` row to return to a pre-adoption state exactly.

## Step 2. Measure production, once

Read-only, against production, from a laptop. Three gates inherited from the map
depend on these numbers, and two later steps quote them in their PR bodies. No
code changes; the deliverable is the output, pasted into the tracking issue.

```sql
-- 1. The audience delta. Today a Gift is visible to members of the Wishlists
-- pinned on it; tomorrow, to members of the Wishlists its subject is in now.
WITH pinned AS (
  SELECT gw."A" AS gift_id, uw."A" AS user_id
    FROM "_GiftToWishlist" gw
    JOIN "_UserToWishlist" uw ON uw."B" = gw."B"
), derived AS (
  SELECT g.id AS gift_id, uw2."A" AS user_id
    FROM "Gift" g
    JOIN "_UserToWishlist" own ON own."A" = g."ownerId"
    JOIN "_UserToWishlist" uw2 ON uw2."B" = own."B"
), gained AS (SELECT * FROM derived EXCEPT SELECT * FROM pinned),
   lost   AS (SELECT * FROM pinned  EXCEPT SELECT * FROM derived)
SELECT (SELECT count(*) FROM gained)                    AS viewer_pairs_gained,
       (SELECT count(DISTINCT gift_id) FROM gained)     AS gifts_gaining_audience,
       (SELECT count(*) FROM lost)                      AS viewer_pairs_lost,
       (SELECT count(DISTINCT gift_id) FROM lost)       AS gifts_losing_audience;

-- 2. Gifts pinned to nothing, and owners in no Wishlist: rows only their
-- subject can see, before and after.
SELECT count(*) FROM "Gift" g
 WHERE NOT EXISTS (SELECT 1 FROM "_GiftToWishlist" gw WHERE gw."A" = g.id);
SELECT count(*) FROM "Gift" g
 WHERE NOT EXISTS (SELECT 1 FROM "_UserToWishlist" uw WHERE uw."A" = g."ownerId");

-- 3. The dead columns, and the two that are kept in step by hand.
SELECT count(*)                                                    AS total,
       count(*) FILTER (WHERE image IS NOT NULL AND image <> '')   AS image_rows,
       count(*) FILTER (WHERE published)                           AS published_rows,
       count(*) FILTER (WHERE "createdById" IS NULL)               AS null_proposer,
       count(*) FILTER (WHERE claimed AND "claimedById" IS NULL)   AS claimed_no_claimer,
       count(*) FILTER (WHERE NOT claimed AND "claimedById" IS NOT NULL) AS claimer_no_flag
  FROM "Gift";

-- 4. Does every past Exchange's participants share one Family? A null
-- common_family is an Exchange that cannot be backfilled by rule.
SELECT e.id, e.name, e.year, e."createdAt",
       (SELECT count(DISTINCT "userId") FROM "SecretSantaParticipant"
         WHERE "eventId" = e.id) AS participants,
       (SELECT uw."B" FROM "_UserToWishlist" uw
         WHERE uw."A" IN (SELECT "userId" FROM "SecretSantaParticipant"
                           WHERE "eventId" = e.id)
         GROUP BY uw."B"
        HAVING count(DISTINCT uw."A") = (SELECT count(DISTINCT "userId")
                    FROM "SecretSantaParticipant" WHERE "eventId" = e.id)
         ORDER BY uw."B" LIMIT 1) AS common_family
  FROM "SecretSantaEvent" e ORDER BY e."createdAt";

-- 5. Santas who cannot see their recipient. If this is not zero, the
-- invariant #160 asserts is already violated in production.
SELECT p."userId", p."assignedToId"
  FROM "SecretSantaParticipant" p
 WHERE p."assignedToId" IS NOT NULL
   AND NOT EXISTS (SELECT 1 FROM "_UserToWishlist" a
                     JOIN "_UserToWishlist" b ON a."B" = b."B"
                    WHERE a."A" = p."userId" AND b."A" = p."assignedToId");

-- 6. Invites, roles, and events with no year.
SELECT count(*) FILTER (WHERE "revokedAt" IS NULL) AS live,
       count(*) AS total FROM "WishlistInvite";
SELECT r.name, count(ur.*) FROM "Role" r
  LEFT JOIN "UserRole" ur ON ur."roleId" = r.id GROUP BY r.name;
SELECT count(*) FROM "SecretSantaEvent" WHERE year IS NULL;
```

**What the answers decide**

- **Query 1** is the price of Step 7 and the gate on Step 8, in both directions.
  Gained pairs are the widening #156 accepted; lost pairs are Wishes that stop
  being visible to a Family their subject has left, which is the rule working.
  Both numbers go in those steps' PR bodies.
- **Query 3** decides whether `Gift.image` is dead (drop it in Step 3) or holds
  real URLs (then it is not a dead column, and dropping it needs its own
  decision). `claimed_no_claimer` and `claimer_no_flag` decide which of the two
  columns Step 9's copy trusts; if both are zero, they agree and it does not
  matter.
- **Query 4** decides Step 14's backfill. Every row with a `common_family` is
  backfilled by rule; the rest are hand-written literal ids, and there should be
  few enough to eyeball. **Query 5** is worth knowing on its own — a non-zero
  answer is a live defect that predates this plan.
- **Query 6** confirms `WishlistInvite` is empty, which is the only reason
  `expiresAt` can become required in Step 16 without a backfill. If it is not
  empty, someone is holding a live link and deleting the rows breaks it.

**Gate** — the numbers exist and are recorded. **Disclosure** — read-only.
**Rollback** — nothing to undo.

---

# Phase 1 — Subtract what nothing reads

Three subtractive steps: one small migration and two code-only. They are here
because they shrink what everything downstream has to rename, because one of
them closes a live hole, and because the first of them is a dress rehearsal.

## Step 3. Drop what nothing reads

**Run the whole migration loop once on a change that cannot hurt.**
`--create-only`, hand-edit, local reset, CI, production deploy, and — if it goes
wrong — the wedged-deploy runbook, all exercised on three things the repo does
not read. What this step costs is the best evidence available for what the rest
of the plan costs.

**Changes** — three columns and a table leave `prisma/schema.prisma`:

- `Gift.published` — `@default(false)`, and outside the generated client nothing
  in the repo reads or writes it: not the seed, not an action, not a query, not
  a component. It is a column, not a term.
- `Gift.image` — the second dead column, **gated on Step 2 query 3**. If
  `image_rows` is zero, drop it here. If it is not, it holds real URLs, it is
  not dead, and dropping it needs a decision this plan has not made.
- `VerificationToken` — dead weight: Google is the only provider and there is no
  email provider to issue one. **Gated on the type-checker**, not on a count.
  `@auth/prisma-adapter` hard-codes the delegate `p.verificationToken`, so drop
  the model on a branch and run `mise run typecheck` first. If the adapter's
  type demands the delegate, keep the model and mark it dead in a comment
  instead. Either way, note that adding an email provider later means restoring
  it.

**Migration**

```sql
ALTER TABLE "Gift" DROP COLUMN "published";
ALTER TABLE "Gift" DROP COLUMN "image";
DROP TABLE "VerificationToken";
```

Prisma generates this one correctly with no hand-editing — a drop is a drop.
Read it before applying it anyway; that habit is the point of the step.

**Gate** — the standing schema gate, and this is the first time all of it runs:
`mise run check`, `mise run db:reset && mise run db:seed`, `migrate diff
--exit-code` returns 0, CI green, and after the deploy, `_prisma_migrations`
holds a second finished row with null logs.

**Disclosure** — nothing reads these, so nothing that reads changes.
`visibility.ts` and `projections.ts` do not appear in the diff.

**Rollback** — the columns come back empty, which is what they held. The dump
holds `image` if query 3 was wrong about it, which is the reason the gate is a
count rather than a grep.

## Step 4. `/wishlists` becomes your Families

`getWishlistsWithMembers` (`lib/db/queries-cached.ts:56`) takes no viewer and
returns every Wishlist with every member. The page filters by hand:

```js
if (!isMember) { wishlist.members = []; }   // app/(authenticated)/wishlists/page.tsx:82-84
```

That is a visibility rule written in a page, which is the first hard rule in
`AGENTS.md`. It is not a leak today — the mutation only ever removes members —
but it is the shape the rule exists to prevent, and the same query is what makes
a global directory of Families exist, which
[#153](https://github.com/jonpulsifer/wishlist/issues/153) deletes.

**Changes** — `getWishlistsWithMembers` takes a `viewerId` and composes
`visibleWishlistsWhere` (already in `lib/db/visibility.ts`, already correct).
The in-page mutation goes. `app/api/search/route.ts`'s wishlist arm loses its
`where: { name: contains }` over every row and gains the same builder, and the
"Private wishlist • Enter PIN to join" subtitle goes with it.

**Migration** — none.

**Gate** — the standing gate. Sign in as someone in one Family and confirm
`/wishlists` and global search show that one and no other.

**Disclosure** — a **narrowing**, and the easy direction. The rule moves *into*
`visibility.ts` from a page, and `visibility.test.ts` gains a case asserting
`visibleWishlistsWhere` is the membership clause. Nothing gains audience.

**Rollback** — `git revert`. No schema, no data.

## Step 5. Delete the pin

`Wishlist.password` is a four-digit plaintext shared secret, compared in an
unthrottled action, that grants the full visibility boundary — every member's
address and sizes ([#181](https://github.com/jonpulsifer/wishlist/issues/181)).
ADR-0005 makes an Invite the only door. This is a deletion, it needs no
migration, and it does not wait for its phase.

**Changes** — delete `joinWishlist` (`app/_actions/wishlists.ts`), the pin
schema, `updateWishlistPinAdmin` and the pin field on `createWishlistAdmin`
(`app/_actions/admin-wishlists.ts`), and the join-by-pin UI in
`app/(authenticated)/wishlists/wishlist-card.tsx`. `leaveWishlist` stays: leaving
is the only exit and remains so. The column stays until Step 13 drops it, so
`prisma/seed.ts` still writes it.

Admin creation of a Family stays for now. It becomes a member act in Step 16,
and until it does, deleting it would leave no way to create one at all.

**Migration** — none.

**Gate** — the standing gate. Grep for `password` under `app/` returns nothing.

**Disclosure** — a narrowing: one path into the boundary disappears and no path
opens. Nothing in `visibility.ts` or `projections.ts` changes.

**Rollback** — `git revert`.

---

# Phase 2 — Move the boundary

The disclosure-critical work, done while the models still have their old names
and while the old rule's data is still on disk. Every step here is reviewable in
isolation.

## Step 6. `lib/db/authority.ts`

`visibility.ts` answers *what may this viewer see*. Nothing answers *what may
this viewer act on*, so two places answer it by hand: `loadEditableGift`
(`app/_actions/gifts.ts:50`) and the Organiser check
(`app/_actions/secret-santa.ts:68`). ADR-0002 retires roles in favour of exactly
three predicates, and they need a home before the role machinery can go.

**Changes** — new `lib/db/authority.ts`, a sibling to `visibility.ts` with the
same shape: pure functions returning Prisma `where` builders, so a row the
viewer may not act on is never loaded rather than loaded and then judged.

- `subjectOfWhere(viewerId)` — the Wish is about you.
- `organiserOfWhere(viewerId)` — the Exchange is yours.
- `memberOfWhere(viewerId)` — the Family is one you are in.

Both hand-written checks compose from it. `addGift` gains the check it never had
— that the viewer may see the recipient — from `visiblePeopleWhere`
([#182](https://github.com/jonpulsifer/wishlist/issues/182)), and
`openSecretSantaEvent` gains the same over its participant list
([#185](https://github.com/jonpulsifer/wishlist/issues/185)).

Note what does **not** move yet: `loadEditableGift` still admits owner-or-
creator. Narrowing archiving to the subject is Step 12's, because it is the same
edit as introducing `subjectId`.

**Migration** — none.

**Gate** — the standing gate, plus `lib/db/authority.test.ts` asserting each
predicate's shape the way `visibility.test.ts` does. These are pure, so they are
directly testable and there is no reason not to.

**Disclosure** — a **narrowing** in two places that had no check at all. The
new module is authority, not visibility: it gates writes. `visibility.ts` is
untouched, and the diff shows it.

**Rollback** — `git revert`.

## Step 7. Visibility derives from the subject

`Gift.wishlists` pins each row to the Families its subject belonged to *at the
moment it was added*. It is a cache of an answer that was true once, and it goes
stale in both directions. #156 replaces it with the rule: who may see a Wish
follows from its subject.

**Changes** — in `lib/db/visibility.ts`, `onAWishlistWithViewer` becomes a clause
over the owner's memberships:

```ts
{ owner: { wishlists: { some: { members: { some: { id: viewerId } } } } } }
```

`visibleGiftsWhere`, `claimedByViewerWhere` and `getGiftWithAccessCheck` follow.
`visiblePeopleWhere` and `visibleProfileWhere` are already subject-derived and
do not change.

**`addGift` keeps writing the pin.** This is the expand half of expand/contract
applied to a *rule* rather than to data: the read switches, the write does not,
so the old rule's inputs stay intact and a revert is a one-commit undo rather
than a restore. The write goes in Step 8, with the table.

**Migration** — none.

**Gate** — the standing gate. `visibility.test.ts`'s `MEMBERSHIP` constant
becomes the new clause and every case that asserts it comes along, which is what
makes this a one-line diff in the test file and a real assertion in six places.
Manually: a Wish added before you joined a Family is now visible to that Family.

**Disclosure** — a **widening**, decided by #156 and counted by Step 2. Quote
`viewer_pairs_gained` and `gifts_gaining_audience` in the PR body. Quote the
lost side too: those are Wishes whose subject has left a Family, which stop
being visible to that Family, and that is the rule rather than a regression.

**Rollback** — `git revert`. The pin table is still written and still correct,
so the old rule resumes exactly. This is the reason Step 8 is a separate step.

## Step 8. Drop `_GiftToWishlist` — **destructive**

The one change in the whole redraw that destroys information no later query can
reconstruct: the record of which Families a Wish was pinned to when it was
added, including Families its subject has since left.

**Gate before the step, not after.** Do not run this until:

- Step 7 has been live long enough for the family to have used the app under the
  new rule — a week, or one visit each from a few people.
- Step 2's audience delta has been read by a human and is not surprising.

**Changes** — `addGift` stops writing the pin; `Gift.wishlists` and
`Wishlist.gifts` leave the schema; `getGiftWithAccessCheck` stops selecting
`wishlists`, and `GiftDetail`'s `wishlists` field goes with the section of the
detail page that renders it.

**Migration**

```sql
DROP TABLE "_GiftToWishlist";
```

**Gate** — the standing schema gate. `migrate diff --exit-code` returns 0, and
the seed still runs (it connects `wishlists` on every Gift today, so this step
edits `prisma/seed.ts`).

**Disclosure** — no rule changes; Step 7 already moved it. The proof is that
`visibility.ts` does not appear in the diff.

**Rollback** — two undos, and it matters which one you need.

- *The migration fails halfway*: `DROP TABLE` is one statement, so it either ran
  or it did not. Follow the wedged-deploy runbook.
- *The rule turns out to be wrong after the drop*: the table is **regenerable**,
  because the new rule can write the snapshot the old rule wanted. Restore the
  table's exact definition from `prisma/migrations/0_init/migration.sql` — which
  is the authoritative copy of what Prisma generates for this join table — and:

  ```sql
  INSERT INTO "_GiftToWishlist" ("A", "B")
  SELECT g.id, uw."B" FROM "Gift" g
    JOIN "_UserToWishlist" uw ON uw."A" = g."ownerId";
  ```

  What that cannot bring back is the history: a Wish pinned to a Family its
  subject has since left comes back pinned to the Families they are in *today*.
  Step 2's `viewer_pairs_lost` is exactly the size of that gap. If it is zero,
  this step destroys nothing at all — which is worth knowing before you run it.

## Step 9. `Claimer` arrives, and claims are copied

A Claim has no field of its own, so it is the set of people committed to a Wish,
held as one `Claimer` row per person (ADR-0003). The row is named `Claimer`
deliberately: a row per person named `Claim` would say a Wish has several, which
is the thing claiming exists to prevent.

**Changes** — the `Claimer` model, in final vocabulary, alongside the untouched
`Gift.claimed` and `claimedById`:

```prisma
model Claimer {
  wishId    String   @db.Uuid   // "Gift" until Step 12; the model is renamed, not this
  userId    String   @db.Uuid
  createdAt DateTime @default(now())
  wish      Gift     @relation(fields: [wishId], references: [id], onDelete: Cascade)
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@id([wishId, userId])
  @@index([userId])
}
```

`claimGift` and `unclaimGift` write **both** shapes. Nothing reads `Claimer`
yet.

`quantity` is deliberately **not** here. #161's target schema puts it on both
`Wish` and `Claimer`, and it is additive and defaulted so it can land any time —
but a column no reader consumes is exactly what `Gift.published` was, and this
plan does not add one. It lands with the UI that reads it. See *Deferred*.

**Migration** — the `CREATE TABLE` Prisma generates, plus a copy in a second
migration so the destination exists before anything is written into it:

```sql
INSERT INTO "Claimer" ("wishId", "userId", "createdAt")
SELECT g.id, g."claimedById", g."updatedAt"
  FROM "Gift" g WHERE g."claimedById" IS NOT NULL;
```

`claimedById` is the column to trust, not `claimed` — the boolean is redundant
with the id and kept in step by hand in two actions. Step 2's
`claimed_no_claimer` and `claimer_no_flag` say whether they ever drifted; if
either is non-zero, resolve those rows by hand before the copy and record what
you decided.

**Gate** — the standing schema gate, plus:

```sql
SELECT (SELECT count(*) FROM "Gift" WHERE "claimedById" IS NOT NULL)
     = (SELECT count(*) FROM "Claimer") AS copied_completely;
```

**Disclosure** — additive, and nothing reads the new table. `visibility.ts` and
`projections.ts` do not appear in the diff.

**Rollback** — `DROP TABLE "Claimer"`. The old columns are still authoritative
and still written, so there is nothing to lose.

## Step 10. Reads move to `Claimer`; Surprise moves into the projection

The step where the app's one secret changes hands. Rule 2 of `visibility.ts` —
*you see a Gift if it is unclaimed, or you claimed it, or you created it* —
leaves the query layer entirely, and there is nowhere in the query layer for it
to go. A subject sees their own list, so filtering a claimed Wish out of it
makes the row **vanish**, and absence is a louder signal than a badge.

So Surprise becomes a property of `lib/db/projections.ts`: a subject's payload
must not carry claim state **at all**, rather than carrying it set to a safe
value (ADR-0004).

**Changes**

- `visibility.ts` loses `claimVisibleToViewer` and every use of it —
  `visibleGiftsWhere`, `visibleGiftCountWhere`. Five rules become three.
- `claimedByViewerWhere` becomes a filter over `claimers: { some: { userId } }`.
- `projections.ts` splits the card. The payload a **subject** receives for their
  own Wish has no `claimed` and no `claimedByViewer` field — not false, absent.
  Everyone else's payload carries `claimed` (now `claimerCount > 0`) and
  `claimedByViewer`, because a claimed Wish must stay **visible-as-claimed** or
  nobody can find the Claim to join it.
- Claimers can see each other, because they cannot coordinate otherwise. The
  subject sees nothing, ever.

This closes [#179](https://github.com/jonpulsifer/wishlist/issues/179), which
stops being a latent leak and becomes the mechanism: today the subject's payload
carries `claimed: true` and holds only because no component reads the field.
After this step, *no component can read it*, and that is the defence.

**Migration** — none.

**Gate** — the standing gate. `projections.test.ts`'s exact-key-set assertion
grows a second case for the subject's card, and it is the load-bearing test in
the repo. `visibility.test.ts` loses its three claim-arm cases and gains one
asserting no claim clause survives anywhere.

**Disclosure** — a **widening**, decided by #152: a claimed Wish stops
disappearing from other viewers and starts showing as claimed. Name it in the PR
body. In the other direction it is a **narrowing** for the subject, and the type
is the proof.

**Rollback** — `git revert`. Both shapes are still written.

## Step 11. Drop `Gift.claimed` and `Gift.claimedById`

**Changes** — the two columns leave the schema and the two actions stop writing
them. `giftRowSelect` stops selecting them.

**Migration**

```sql
ALTER TABLE "Gift" DROP COLUMN "claimed";
ALTER TABLE "Gift" DROP COLUMN "claimedById";
```

**Gate** — the standing schema gate. Claim and unclaim something end to end
against a seeded local database.

**Disclosure** — nothing changes; Step 10 moved it all. `visibility.ts` does not
appear in the diff.

**Rollback** — reconstructible, unlike Step 8: re-add the columns and

```sql
UPDATE "Gift" g SET "claimedById" = c."userId", claimed = true
  FROM "Claimer" c WHERE c."wishId" = g.id;
```

Only the first claimer survives if a Wish has picked up several by then, which
is the point of the new shape and not a loss the old shape could have held.

---

# Phase 3 — Rename physically

Tables and columns, not `@@map` (ADR-0007). Prisma emits DROP+CREATE for a
rename, so **every migration in this phase is generated and then hand-edited**,
one `ALTER` per table and per column, before it is applied anywhere.
`mise run db:migrate <name>` writes the file without applying it, which is what
makes that possible; `mise run db:apply` runs it once you are satisfied.

Three things to know before the first one:

- **Constraints and indexes keep their old names** through an `ALTER TABLE …
  RENAME`. Rename them too, or `migrate diff --exit-code` will tell you at the
  gate — which is what that gate is for.
- **Prisma names implicit join tables alphabetically from the two models.**
  `_UserToWishlist(A=User, B=Wishlist)` becomes `_FamilyToUser(A=Family,
  B=User)` when `Wishlist` becomes `Family`: the table renames *and the columns
  swap meaning*. A migration that renames but forgets the swap inverts every
  membership in the app without erroring. Step 13 sidesteps it by going
  explicit; the hazard applies anywhere else an implicit relation is renamed —
  see the exclusions relation in Step 14.
- **Each of these is a hard cutover.** See the standing pre-flight.

## Step 12. `Gift → Wish`

The big mechanical one: 34 non-generated files mention `Gift`.

**Changes** — `model Gift` → `model Wish`; `ownerId` → `subjectId`;
`createdById` → `proposerId`, and it stops being nullable. Every `prisma.gift.*`
call site, `GiftCard`/`GiftDetail`/`giftRowSelect`/`toGiftCard` in
`projections.ts`, `GiftScope`/`visibleGiftsWhere`/`visibleGiftCountWhere` in
`visibility.ts`, and the queries in `queries-cached.ts` follow.

Two behaviours change with the names, because they *are* the names:

- **Archiving narrows to the subject.** `loadEditableGift` admits owner-or-
  creator today, so a proposer can archive their own Suggestion and strand it
  where nobody can reach it
  ([#178](https://github.com/jonpulsifer/wishlist/issues/178)). Archiving becomes
  `subjectOfWhere`; withdrawing a Suggestion becomes deleting it.
- **Adding a Wish *as* someone becomes possible.** `addGift` always records the
  viewer as proposer, so helping a person fill their list produces Suggestions
  they can never see ([#190](https://github.com/jonpulsifer/wishlist/issues/190)).
  `proposerId = subjectId` is the whole of the fix; the UI is one checkbox on the
  add dialog.

UI copy keeps the word "gift" where it reads naturally — "Add a gift" is fine.
No model, query or type is named for it (`CONTEXT.md`, *Terms this project does
not use*). Route paths are Step 19's.

**Migration** — hand-edited, in this order:

```sql
ALTER TABLE "Gift" RENAME TO "Wish";
ALTER TABLE "Wish" RENAME COLUMN "ownerId"     TO "subjectId";
ALTER TABLE "Wish" RENAME COLUMN "createdById" TO "proposerId";
UPDATE "Wish" SET "proposerId" = "subjectId" WHERE "proposerId" IS NULL;
ALTER TABLE "Wish" ALTER COLUMN "proposerId" SET NOT NULL;
-- then every index and constraint by its generated name; take the old names
-- from prisma/migrations/0_init/migration.sql and the new ones from what
-- `mise run db:migrate` generated before you hand-edited it.
ALTER INDEX "Gift_pkey" RENAME TO "Wish_pkey";
ALTER INDEX "Gift_ownerId_createdAt_idx" RENAME TO "Wish_subjectId_createdAt_idx";
-- …
ALTER TABLE "Wish" RENAME CONSTRAINT "Gift_ownerId_fkey" TO "Wish_subjectId_fkey";
-- …
```

The backfill is the reason `proposerId` can be required: a Wish nobody else
proposed names its own subject rather than naming nobody, which is what removes
the third state from "is this a Suggestion?". Step 2's `null_proposer` is how
many rows it touches.

Wrap the file in `BEGIN;` / `COMMIT;`. Postgres has transactional DDL, so a
multi-statement rename that fails partway then applies as nothing rather than as
half. *Prisma's docs say migrations can be partially applied and do not discuss
this — verify it on the local database by forcing a mid-file failure before
relying on it in production.*

**Gate** — the standing schema gate, and `migrate diff --exit-code` matters
here more than anywhere: it is what catches an index left under its old name.
Then exercise a Wish end to end locally: add, edit, archive, unarchive, claim,
delete.

**Disclosure** — the rule is unchanged; only the field names in it change.
`visibility.test.ts` and `projections.test.ts` change names and no assertions,
which is the proof. The archiving narrowing is a **narrowing**, and
`authority.test.ts` asserts it.

**Rollback** — a rename loses nothing and undoes itself: `ALTER TABLE "Wish"
RENAME TO "Gift"`, and the columns back. The `NOT NULL` tightening does not undo
— the rows that were null are now `subjectId`, and which ones they were is gone.
That is why the count is measured first; it is also, per #156, the value the old
code already treated them as having.

## Step 13. `Wishlist → Family`, and `Membership` goes explicit — **destructive**

The other genuinely destructive step, and it is destructive only by way of the
join-table hazard: get the column mapping wrong and every membership in the app
inverts silently. Going explicit is what forces the migration to say which
column is which.

**Changes** — `model Wishlist` → `model Family`; `password` and the `@unique` on
`name` go (ADR-0005 deleted the pin in Step 5; #150 makes the name a label, and
Step 4 deleted the directory that made you type one). `members` becomes
`memberships: Membership[]`. `visibleWishlistsWhere` becomes
`visibleFamiliesWhere`, and every `wishlists: { some: { members: { some: …` in
`visibility.ts` becomes `memberships: { some: { userId: … } }`.

**Migration** — hand-edited, in this order, in one transaction:

```sql
ALTER TABLE "Wishlist" RENAME TO "Family";
ALTER TABLE "Family" DROP COLUMN "password";
DROP INDEX "Wishlist_name_key";
ALTER INDEX "Wishlist_pkey" RENAME TO "Family_pkey";
-- … the remaining indexes and constraints

CREATE TABLE "Membership" (
  "familyId" UUID NOT NULL,
  "userId"   UUID NOT NULL,
  "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Membership_pkey" PRIMARY KEY ("familyId", "userId")
);
-- Columns named explicitly. In "_UserToWishlist", A is User and B is Wishlist,
-- because Prisma orders them alphabetically by model name. Getting this pair
-- backwards inverts every membership in the app and raises no error.
INSERT INTO "Membership" ("familyId", "userId")
SELECT uw."B", uw."A" FROM "_UserToWishlist" uw;
DROP TABLE "_UserToWishlist";
-- then the FKs and the userId index, from what db:migrate generated
```

`joinedAt` cannot be recovered for existing rows and defaults to the migration's
timestamp. Nothing reads it yet; it is there because the app's only visibility
edge is worth knowing the date of.

**Gate** — the standing schema gate, plus the assertion that catches the
inversion before it ships:

```sql
SELECT count(*) FROM "Membership" m
  JOIN "Family" f ON f.id = m."familyId"
  JOIN "User"   u ON u.id = m."userId";
-- must equal the pre-migration count of "_UserToWishlist"
```

Both foreign keys resolving is the whole proof: with the columns swapped, a
family id would have to also be a user id for the join to succeed. Record the
`_UserToWishlist` count in the PR body before you run it. Then sign in as two
people in different Families and confirm each sees only their own.

**Disclosure** — the boundary itself is being rewritten, so this is the step to
read twice. The rule does not change: `some → some` over an explicit table is
the same rule as `some → some` over an implicit one, and membership stays
mutual. `visibility.test.ts` is the diff to review — every case's expected
clause changes shape and none changes meaning.

**Rollback** — the pre-flight `pg_dump` is the undo of record. The reconstruction
is also exact, because nothing has been dropped that `Membership` does not hold:
recreate `_UserToWishlist` from `0_init` and `INSERT … SELECT "userId",
"familyId"` back. Take care to swap the columns back, for the same reason.

## Step 14. Secret Santa becomes Exchange

**Changes** — `SecretSantaEvent` → `Exchange`, `SecretSantaParticipant` →
`Participant`, `createdById` → `organiserId`. `Exchange` gains a required
`familyId`, `year` stops being nullable, and the exclusions relation is renamed.

Three cleanups fall out and should land in the same PR because they are the same
edit:

- `lib/season.ts`: `occasionYearOf` loses its `createdAt` fallback, and
  `heldForCurrentOccasion` and `withinDrawHistory` lose their `year: null` arms.
  The fallback exists only because `year` is nullable, and `year` is nullable
  only because there were no migrations to backfill it with. Both retire
  together. The comment on the column in `prisma/schema.prisma` deletes itself.
- The `Exchange`/`Family` bound is what keeps a santa able to see their
  recipient. `authority.ts`'s `organiserOfWhere` gets its real subject, and
  participants are chosen from the Family's members rather than from everyone
  the viewer can see.
- The exclusion relation `@relation("SecretSantaExclusions")` becomes
  `@relation("Exclusions")`, which renames the implicit table `_SecretSantaExclusions`
  → `_Exclusions`. **Hand-edit that rename.** Left to Prisma it is a drop and a
  create, and every exclusion in the database disappears — after which the next
  Draw may pair the couple they exist to keep apart. If you would rather not
  hand-edit it, keep the old relation name in the schema, where it emits no SQL
  at all.

**Migration** — hand-edited:

```sql
ALTER TABLE "SecretSantaEvent" RENAME TO "Exchange";
ALTER TABLE "Exchange" RENAME COLUMN "createdById" TO "organiserId";
ALTER TABLE "SecretSantaParticipant" RENAME TO "Participant";
ALTER TABLE "_SecretSantaExclusions" RENAME TO "_Exclusions";
-- … indexes and constraints

UPDATE "Exchange" SET year = EXTRACT(YEAR FROM "createdAt")::int WHERE year IS NULL;
ALTER TABLE "Exchange" ALTER COLUMN year SET NOT NULL;

ALTER TABLE "Exchange" ADD COLUMN "familyId" UUID;
-- by rule, from Step 2 query 4:
UPDATE "Exchange" e SET "familyId" = <common family id> WHERE e.id = '<id>';
-- … one line per Exchange with no common Family, decided by hand
ALTER TABLE "Exchange" ALTER COLUMN "familyId" SET NOT NULL;
-- then the FK
```

`EXTRACT` reads the stored timestamp; `occasionYearOf` reads it in the server's
local time. An Exchange created within a few hours of New Year could differ by
one. Step 2 query 4 lists every null-year row with its `createdAt` — there are
few enough to check by eye, and a wrong year files an Exchange under the wrong
Christmas.

**The gate on the backfill**: query 4's `common_family`. Every row that has one
is backfilled by rule. A row with none means its participants no longer share a
Family, so #160's invariant is *already* violated for it — pick the Family that
holds most of them, and record which Exchange and why in the PR body. Query 5
says whether any santa currently cannot see their recipient, which is the same
defect seen from the other end.

**Gate** — the standing schema gate. Then, locally: create an Exchange, draw it,
and confirm exclusions still bind — the last one is what proves the relation
rename kept its rows.

```sql
SELECT count(*) FROM "_Exclusions";  -- equal to the pre-migration count
```

**Disclosure** — Exchange grants no visibility of its own, and this does not
change that: `visibility.ts` does not appear in the diff. `openSecretSantaEvent`
already gained its check in Step 6; the Family bound makes an unfulfillable
pairing unrepresentable rather than merely unlikely.

**Rollback** — the renames undo themselves. The two `NOT NULL` tightenings do
not: which years were null and which Exchanges had no Family is in the Step 2
output, so keep it.

---

# Phase 4 — Retire the roles

ADR-0002: there are no admins. The capabilities empty out one at a time, and the
order matters because `Role` cannot drop while it is the only way to reach
something the app needs.

## Step 15. Exclusions move to your own profile

**The gate on Step 17, and the only one not about migrations.**
`getSecretSantaExclusions` and its two actions sit behind `manage:secret-santa`
at `/admin/secret-santa`, which is the only place in the app an exclusion can be
created. Drop the roles with nothing built and the answer to *"never match me
with my wife"* goes from "ask Jon" to "nobody can, including Jon".

**Changes** — exclusions become a section on your own profile
(`app/(authenticated)/people/me/edit/`). Either party may create one, it binds
both ways, and it is visible to those two and to nobody else — not to the
Organiser, who runs a Draw shaped by constraints they cannot inspect.
`createSecretSantaExclusion` and `deleteSecretSantaExclusion` lose their
capability and gain `subjectOfWhere`; the picker is scoped by
`visiblePeopleWhere` rather than by `getAllPeople`.

**Migration** — none. Exclusions are already a `User ↔ User` relation and stay
global; whether they belong to an Exchange was settled: they do not.

**Gate** — the standing gate. Two accounts: create an exclusion from one side,
confirm it binds from the other, confirm a third person cannot see it.

**Disclosure** — a **narrowing** of a read that was previously every-person-in-
the-install, and a widening of a *write* from an admin to the two people
concerned. The read moves onto `visiblePeopleWhere`.

**Rollback** — `git revert`.

## Step 16. Creating a Family and inviting to one become member acts

**Changes** — `createWishlistAdmin` becomes `createFamily`, available to any
signed-in viewer; `createWishlistInviteAdmin` becomes `createInvite`, available
to any member of the Family (`memberOfWhere`). `Invite` reshapes to what
ADR-0005 requires and [#186](https://github.com/jonpulsifer/wishlist/issues/186)
reports missing: `expiresAt` becomes **required**, and redemption is recorded —
`redeemedAt` and `redeemedById` — so a token is **single-use**.
`app/invite/[token]/route.ts` writes that record and refuses a spent token; it
currently records nothing, so one link admits everyone who follows it, forever.

Membership becomes a **ratchet** here: nobody may remove anyone, leaving is the
only exit, and the last member leaving deletes the Family. That is what makes
following an Invite the only irreversible act in the model, and it is why an
Invite admits exactly one person.

**Migration** — `WishlistInvite` → `Invite` (rename, hand-edited), then

```sql
DELETE FROM "Invite";   -- Step 2 query 6 says this table is empty
ALTER TABLE "Invite" ALTER COLUMN "expiresAt" SET NOT NULL;
ALTER TABLE "Invite" ADD COLUMN "redeemedAt"   TIMESTAMP(3),
                     ADD COLUMN "redeemedById" UUID;
-- then the FK on redeemedById, ON DELETE SET NULL
```

If query 6 said the table is *not* empty, somebody is holding a live link. Tell
them before you delete it, or backfill `expiresAt` instead of deleting.

**Gate** — the standing schema gate. Then the flow end to end: create a Family
as an ordinary account with no roles at all, invite from it, follow the link
from a second account, confirm the link is dead on a third.

**Disclosure** — creating an Invite widens from an admin to every member, which
ADR-0005 decided: a family whose members cannot invite anyone grows only as fast
as its admin answers messages. It is offset in the same step — single-use is a
narrowing of what one link can do, and it is the reason the widening is
affordable.

**Rollback** — `git revert` plus the reverse rename. The deleted invite rows do
not come back; the dump does.

## Step 17. Retire roles

**Changes** — delete `lib/auth/capabilities.ts` and its test, the `capability`
option on `defineAction` (`lib/actions/prologue.ts:84`) and every use of it,
`app/_actions/roles.ts`, `app/_actions/admin-wishlists.ts`,
`lib/db/queries-admin.ts`, the whole of `app/(authenticated)/admin/`, and
`Viewer.can` / `Viewer.isStaff` with the sidebar link they gate. The session
callback in `app/auth.ts` stops selecting roles and stops putting `capabilities`
on the session.

`AGENTS.md`'s third hard rule — *never name a role* — is replaced rather than
deleted. The reason it existed still holds; the answer is now
`lib/db/authority.ts`. The `data-access` and `server-actions` skills follow.

**Migration**

```sql
DROP TABLE "UserRole";
DROP TABLE "Role";
```

**Gate** — the standing schema gate. `grep -rn "capabilit\|manage:" app lib
components` returns nothing outside git history. Sign in and confirm every act
that used to need a role is reachable: creating a Family (Step 16), inviting
(Step 16), exclusions (Step 15), the Draw and deleting an Exchange (the
Organiser, Step 6 and 14).

**Disclosure** — every check this deletes is replaced by one in `authority.ts`
or by the act belonging to the person it is about. The proof is the checklist
above: if an act has no home after this step, the step is wrong. Note that
deleting `/admin` is itself a narrowing — those screens read every person, every
Family and every Exchange in the install, through the boundary rather than
within it.

**Rollback** — `git revert` and restore the two tables from the dump. Grants are
in the dump; Step 2 query 6 recorded who held what.

---

# Phase 5 — The consuming surfaces

Both of these consume domain language rather than defining it, so they come last
and change nothing but words and types. `app/(authenticated)/plinko/` is out of
scope: it consumes no domain language at all.

## Step 18. `lib/ai.ts`

**Changes** — `GiftRecommendation` → `WishRecommendation`; `recommendGiftsAsProse`
/ `recommendGiftsAsList` → `recommendWishesAsProse` / `AsList`;
`person.gifts` → `person.wishes` in `loadRecipient`. The prompts keep the word
"gift" — they are copy addressed to a model, and a recommendation is a candidate
Wish nothing stores.

One real finding, not a rename: `getFullUserForRecommendations`
(`lib/db/queries-cached.ts:95`) selects `wishlists: { select: { id, name } }`,
and `lib/ai.ts` is its only caller and never reads it. Drop the select. After
Step 13 it would otherwise have to be rewritten as a `Membership` join to
serve nobody.

**Migration** — none.

**Gate** — the standing gate. `lib/ai.test.ts` passes with renamed symbols and
no changed assertions.

**Disclosure** — the recommender reads through `getFullUserForRecommendations`,
which composes `visibleProfileWhere`; dropping a select narrows what it loads.
`visibility.ts` does not appear in the diff.

**Rollback** — `git revert`.

## Step 19. `components/global-search/` and the routes

**Changes** — `SearchItem['type']` becomes `'user' | 'wish' | 'family'`, in the
dialog and in `app/api/search/route.ts`, with the group headings and icons that
follow. The route's three arms are already scoped correctly by Step 4 and Step 7.

The routes themselves re-express, and this is the last thing that still says the
old word out loud:

- `/wishlists` → `/families`. The word moved: a Wishlist is now a person's
  collection, so a route named for it that lists Families is actively wrong.
- `/gifts` **stays**. "Gift" survives in UI copy where it reads naturally, and
  a URL is copy.
- A person's Wishlist is `/people/[id]`, which is already true and needs no
  route of its own — the collection is a view, not a thing.

Add redirects in `next.config.ts` for the old paths. Thirty people have
bookmarks.

**Migration** — none.

**Gate** — the standing gate. Search for a person, a Wish and a Family and
confirm each lands somewhere that exists. Follow an old `/wishlists` link.

**Disclosure** — none; the search route's `where` clauses are unchanged.

**Rollback** — `git revert`.

---

# The wedged-deploy runbook

The failure mode to actually plan for. Migrations are not transactional unless
you make them so, a partially applied one is recorded as **failed**, and
`migrate deploy` then refuses to proceed — so the build fails, the deployment
aborts, the previous deployment keeps serving, and it is serving against a
half-migrated database. Every subsequent deploy fails at the same point,
including one that reverts the offending PR.

1. **Read what happened.** `SELECT migration_name, started_at, finished_at,
   rolled_back_at, logs FROM "_prisma_migrations" ORDER BY started_at DESC LIMIT
   5;` The `logs` column holds the error.
2. **Decide which way to go.** Forward if the remaining statements are safe to
   run by hand; back if they are not.
3. **Forward**: run the remaining statements in `psql`, then
   `prisma migrate resolve --applied <migration_name>`.
4. **Back**: undo by hand the statements that did apply, then
   `prisma migrate resolve --rolled-back <migration_name>`. Now the reverting
   deploy will succeed.
5. **Redeploy.** The build is not retried automatically.

Two things make this survivable and both are pre-flight, not response: the
production connection URL reachable from a laptop, and a `pg_dump` taken minutes
earlier. Neither can be arranged after the fact.

The other failure, in passing: two builds racing the same database lose the
advisory lock with `Timed out trying to acquire a postgres advisory lock`. The
build simply fails, nothing is recorded, and a retry works. Do not disable the
lock — parallel migrations without it fail randomly instead of cleanly.

---

# What each open bug is closed by

None of these should be fixed separately ahead of its step; each is closed by a
change this plan is making anyway. The exception is
[#181](https://github.com/jonpulsifer/wishlist/issues/181), which is a live hole
and is sequenced early *because* it costs nothing to do early.

| Bug | Closed by |
| --- | --- |
| [#181](https://github.com/jonpulsifer/wishlist/issues/181) the 4-digit pin grants the boundary | Step 5 |
| [#182](https://github.com/jonpulsifer/wishlist/issues/182) `addGift` never checks the viewer may see the recipient | Step 6 |
| [#185](https://github.com/jonpulsifer/wishlist/issues/185) `openSecretSantaEvent` is ungated | Step 6, tightened by Step 14 |
| [#179](https://github.com/jonpulsifer/wishlist/issues/179) the subject's payload carries `claimed` | Step 10 |
| [#178](https://github.com/jonpulsifer/wishlist/issues/178) archiving a Suggestion strands it | Step 12 |
| [#190](https://github.com/jonpulsifer/wishlist/issues/190) no way to add a Wish *as* someone | Step 12 |
| [#186](https://github.com/jonpulsifer/wishlist/issues/186) Invites never expire and admit everyone | Step 16 |

---

# What this plan does not build

Stated rather than implied, because the map deliberately modelled futures it is
not building.

- **Occasion.** No table, no row, no reader. Christmas stays the only Occasion
  and `Exchange.year` stays an integer. Defined in `CONTEXT.md`, and the most
  revisable entry there.
- **Declining Suggestions.** One boolean on `User`, defined and deliberately not
  built. Additive and defaulted, so it waits on nothing — including this plan.
- **Quantity and splitting.** `Wish.quantity` and `Claimer.quantity` are in
  #161's target schema and are the only two entries in the glossary the owner
  asked for rather than an agent charting. They are **not** in Step 9, because a
  column with no reader is what `Gift.published` was. They land with the UI that
  reads them — which is a small piece of work: splitting is headcount, so
  *"Jon started this, 2 others joined"* is the `Claimer` row count and the order
  they were created in, both of which Step 9 already stores.
- **Push — adding someone by email.** The half of joining with no mechanism at
  all today. It needs a provisional User (a User with no Account, already legal)
  and an email, which needs a mail dependency this repo does not have.
- **The outbound message shape.** #159 handed `projections.ts` a second seam —
  what may cross into an email — and it arrives with push or not at all. When it
  does: sender's name, the app, a link. Never the Family name, never Wishes,
  never a member list.
- **Removing someone from a Family.** The ratchet is a decision (ADR-0001,
  #160), and three separate tickets have leaned on it. It is the deferred item
  most likely to be asked for first, and the case that motivates it — the
  coworker you are unwilling to hand a permanent mutual membership — is recorded
  as unserved rather than solved.
- **Deleting a provisional User.** The undo for a mistyped address. Nothing to
  delete until push exists.
- **Reshaping `lib/` and `app/`.** The map left this open and it graduates to
  almost nothing: this plan adds one seam (`lib/db/authority.ts`) and retires
  one (`lib/auth/capabilities.ts`). The existing deep modules — `visibility.ts`,
  `season.ts`, `prologue.ts` — keep their shape.
- **`lib/db/outbound.ts`.** #161 named it as the alternative if the outbound
  seam should be structurally separate from `projections.ts` rather than a
  section of it. One module answers *what may cross out of here*; revisit only
  if push lands and the two questions start arguing.
- **`app/(authenticated)/plinko/`.** Out of scope by the map's own terms.

---

# Grounded and anticipated

**Grounded**: the sequence, every path, every line reference, every SQL
statement's target table and column, the standing gates, and the failure modes.
All of it is verified against this repo at the commit this document lands on,
and against `prisma` 7.9.1.

**Anticipated**: that nineteen steps is the right granularity, and the estimate
implied by the phases. Step 3 exists partly to find out — it is the least
consequential migration in the plan and the first to run the whole loop, so what
it costs is the best available evidence for what the rest will.

**Unverified, and marked where it appears**: that wrapping a migration file in
`BEGIN;`/`COMMIT;` makes partial application impossible under Prisma's runner
(Step 12). Force a mid-file failure locally before relying on it.
