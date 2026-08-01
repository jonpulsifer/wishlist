---
name: data-access
description: >-
  The rules for reading user data and deciding who may see it — visibility where
  clauses, capabilities instead of role names, and what may cross to the
  browser. Use when writing any Prisma query, adding a page that shows people or
  gifts, or gating a screen or action.
---

# Data access

This app holds shipping addresses, clothing sizes and who bought whom a
present. Three modules own the rules, and nothing else is allowed to re-derive
them. All three are pure enough to read in a minute — read them before writing
a query.

## Visibility: `lib/db/visibility.ts`

**Never hand-write a `where` clause that decides what a viewer can see.**
Compose from the builders: `visibleGiftsWhere`, `visiblePeopleWhere`,
`visibleProfileWhere`, `visibleWishlistsWhere`, `visibleGiftCountWhere`,
`claimedByViewerWhere`.

Six hand-written copies had drifted into three real disclosure defects. The
module exists so that cannot happen again. If a new screen needs a scope none of
the builders express, add a builder there — do not inline one at the call site.

**Never `findUnique` a person by id alone.** The id is a uuid, but uuids leak;
treating one as an authorization token exposes the profile to anyone holding it.
Scope the lookup with `visibleProfileWhere`.

`giftYearWindow` decides which season a gift belongs to. Take it from the
module rather than reimplementing date maths.

## Capabilities: `lib/auth/capabilities.ts`

**Never ask about a role name.** Ask the viewer what they can do:

```ts
if (!viewer.can('manage:secret-santa')) { … }
```

The capabilities are `manage:roles`, `manage:wishlists`, `manage:secret-santa`
and `view:admin`. `ROLE_CAPABILITIES` maps role names onto them and is the only
place a role name appears; `godmode` grants everything. The table is pure and
covered by `capabilities.test.ts` — extend the test when you extend the table.

Server actions do not check capabilities by hand either; they declare
`capability:` in `defineAction` and the combinator calls `requireViewer`. See
the `server-actions` skill.

Viewer resolution is `lib/auth/viewer.ts`: `currentViewer()` returns `null` when
signed out, `requireViewer(capability?)` throws `UnauthorizedError`.

## Projections: `lib/db/projections.ts`

This module is the boundary between the database and the browser. Client
components import their types from here — never from `@/prisma/generated/client`
— so a column added to a model cannot silently start shipping to the client.

Select with `personRefSelect`, `giftRowSelect`, `profileSelect`; hand across
`PersonRef`, `GiftCard`, `GiftDetail`, `PersonCard`, `Profile`. Filter on the
server and pass the minimum. A client component that receives a whole Prisma row
is a bug even when nothing renders the sensitive fields.

## Caching

Read paths that are cached live in `lib/db/queries-cached.ts` under the
`CacheTag` union — `gifts`, `users`, `wishlists`, `secretSanta`. There is no
`roles` tag; nothing declares one. Mutations invalidate through `defineAction`'s
`invalidates` list rather than calling the cache APIs directly.
