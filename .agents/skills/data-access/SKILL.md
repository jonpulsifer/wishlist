---
name: data-access
description: >-
  The rules for reading user data and deciding who may see it — visibility and
  authority where clauses, and what may cross to the browser. Use when writing
  any Prisma query, adding a page that shows people or gifts, or gating a screen
  or action.
---

# Data access

This app holds shipping addresses, clothing sizes and who bought whom a
present. A handful of modules own the rules, and nothing else is allowed to
re-derive them. They are pure enough to read in a minute — read them before
writing a query.

## Visibility: `lib/db/visibility.ts`

**Never hand-write a `where` clause that decides what a viewer can see.**
Compose from the builders: `visibleWishesWhere`, `visiblePeopleWhere`,
`visibleProfileWhere`, `visibleFamiliesWhere`, `visibleWishCountWhere`,
`claimedByViewerWhere`.

Six hand-written copies had drifted into three real disclosure defects. The
module exists so that cannot happen again. If a new screen needs a scope none of
the builders express, add a builder there — do not inline one at the call site.

**Never `findUnique` a person by id alone.** The id is a uuid, but uuids leak;
treating one as an authorization token exposes the profile to anyone holding it.
Scope the lookup with `visibleProfileWhere`.

The year window comes from `lib/season.ts`, not from date maths written here or
anywhere else. `currentSeason(now?)` returns `year`, `giftWindow`, `eventWindow`
and `drawHistoryWindow`; `partitionBySeason` splits a list into this year and
past. Every window takes `now` as a parameter, so they are assertable and a
process alive across New Year cannot keep serving the old Season.

## Authority: `lib/db/authority.ts`

Visibility's sibling, and the other question: *what may this viewer change*.
Same shape — pure functions returning Prisma `where` builders, so a row the
viewer may not act on is never loaded rather than loaded by id and judged in
memory.

`subjectOfWhere` (the Wish is about you, and the authority archiving takes),
`editableWishWhere` (subject or proposer, for editing and deleting),
`organiserOfWhere` (you opened the Exchange).

**Spread it into the `where`, do not compare after the read.** A `findUnique`
by id followed by `if (row.subjectId !== viewer.id)` confirms the row exists to
anyone holding a uuid, and it is one `select` away from returning fields that
check never covered.

## Authority is the row, not the person

**There is nobody to ask about.** No roles, no admins, no capabilities — a
`Viewer` is an identity and carries nothing to check (ADR-0002). Authority is a
property of the row: compose the `where` from `lib/db/authority.ts` and let the
query answer.

```ts
const wish = await db.wish.findFirst({
  where: { id, ...subjectOfWhere(viewer.id) },
});
if (!wish) throw new ActionError('Gift not found');
```

Everyone is one of exactly three things — the **subject** of a Wish, a
**member** of a Family, or the **Organiser** of the one Exchange they opened.
If an act does not fit one of those, the act is wrong, not the module.

**Viewer resolution is `lib/auth/viewer.ts`, and nothing else.** Three adapters,
one per caller shape — the only thing that varies is what "no" looks like:

| Adapter | Says no by | Used by |
| --- | --- | --- |
| `currentViewer()` | returning `null` | route handlers, which reply 401 |
| `requireViewer()` | throwing | `defineAction` |
| `requireViewerOrRedirect()` | redirecting | pages |

`auth()` from `app/auth.ts` is NextAuth's own handle. Only the authenticated
layout (for `SessionProvider`) and the catch-all route handler may touch it —
never to work out who is asking. The session carries an identity and nothing
more, so there is nothing on it for a client component to gate on.

## Projections: `lib/db/projections.ts`

This module is the boundary between the database and the browser. Client
components import their types from here — never from `@/prisma/generated/client`
— so a column added to a model cannot silently start shipping to the client.

Select with `personRefSelect`, `wishRowSelect`, `profileSelect`; hand across
`PersonRef`, `WishCard`, `PersonCard`, `Profile`. Filter on the
server and pass the minimum. A client component that receives a whole Prisma row
is a bug even when nothing renders the sensitive fields.

**Claim secrecy is this module's job, not visibility's.** Do not add a claim
clause to a `where` — a subject sees their own list, so filtering a claimed Wish
out of it makes the row *vanish*, and absence is a louder signal than a badge.
`WishCard` is a union on `yours`: the person a Wish is *for* gets a payload with
no `claimed` and no `claimedByViewer` at all — absent, not `false` — so no
component can read it, and `tsc` is the proof rather than a code review.
Everyone else's payload says whether it is claimed, because a claimed Wish has
to stay visible-as-claimed or nobody can find the claim to join it.

## Caching

Read paths that are cached live in `lib/db/queries-cached.ts` under the
`CacheTag` union — `gifts`, `users`, `wishlists`, `secretSanta`. There is no
`roles` tag; nothing declares one. Mutations invalidate through `defineAction`'s
`invalidates` list rather than calling the cache APIs directly.
