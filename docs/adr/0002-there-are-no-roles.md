# 2. There are no roles: authority belongs to objects and subjects

Date: 2026-08-02
Status: Accepted

## Context

The app has `Role`, `UserRole`, four capabilities, a capability option on
`defineAction` and an `/admin` surface. The driver for extending it was
ordinary — *"my wife just wants to help"* — and it is the kind of request that
normally grows a role system rather than shrinking one.

Asked what each capability was actually holding, all four emptied out. Creating
a Family and inviting to one became member acts; the pin and the global
directory were deleted with them; deleting a Family became a consequence of the
last member leaving; every Secret Santa act belongs to whoever opened the
Exchange or to the participants. What remained was `manage:roles`, whose only
power is granting `manage:roles`.

## Decision

**No roles, no capabilities, no admin.** Authority is a property of objects and
of subjects, never of people, and nothing is granted to anyone.

Exactly three predicates cover every act in the app:

| predicate | affords |
| --- | --- |
| **member of** a Family | invite, add someone by email, leave |
| **subject of** a Wish | edit, archive, delete, set exclusions |
| **[Organiser](../../CONTEXT.md#organiser) of** an Exchange | pick participants, fire the [Draw](../../CONTEXT.md#draw), delete it |

They live in `lib/db/authority.ts` — a sibling to `lib/db/visibility.ts`, the
same shape and the other question. `visibility.ts` answers *what may this viewer
see*; `authority.ts` answers *what may this viewer act on*. Both return Prisma
`where` builders, so a row the viewer may not act on is **never loaded**, rather
than loaded and then judged.

## Consequences

`Role`, `UserRole`, `lib/auth/capabilities.ts`, `defineAction`'s capability
option and `/admin` all retire.

The two hand-written per-object checks — `app/_actions/gifts.ts:50` and
`app/_actions/secret-santa.ts:68` — get a home. Both currently load a row by id
and compare in memory, which is the same shape as the bare `findUnique` that
AGENTS.md's person rule already forbids.

**The count of buttons goes up, not down.** Every act a role holds today becomes
one owned by the person the act is about — exclusions on your own profile,
creating a Family and inviting to it by any member, the Draw and the deletion by
the Organiser. Retiring roles and wanting to press buttons rather than open
`psql` are the same answer.

**There is no operator work left either.** The last job on offer was deleting an
Exchange whose Organiser has left, and a stranded Exchange is inert.

**Ordering constraint.** `Role` cannot drop before exclusions have a user-facing
home: `/admin/secret-santa` is the only place in the app one can be created
today, so dropping the roles first takes the feature away from everyone.

## Grounded and anticipated

**Grounded**: the driver, and half of Organiser — `secret-santa.ts:68` already
restricts the Draw to the creator, per-object ownership hand-written against one
action and known to no shared module.

**Anticipated**: the word Organiser, the other acts gathering under it, and
`authority.ts` itself. Interaction policy is **defined and deliberately not
built** — it collapsed to a single boolean (declining Suggestions) with no
composition and no precedence, so there is no policy for a role to interact
with.

## Options closed

An instance administrator, in every form: a `Role` table, an environment-variable
allowlist, and a hardcoded superuser. The sharper argument is not the tally —
[ADR-0001](0001-family-is-the-only-visibility-boundary.md) makes a Family you
are not in *invisible*, so an admin could not inspect one without a bypass that
reads straight through the disclosure boundary. **The power such a role would
need is precisely the one the model exists to deny.**

Per-Family roles, rejected first and separately: scoping capabilities adds an
axis to `lib/db/visibility.ts` that is not membership, to express acts that turn
out not to need permission.

Co-organisers, transfer and succession. Authority following participation, so
any participant may run the Exchange.

Decided in [#160](https://github.com/jonpulsifer/wishlist/issues/160) and
confirmed against the owner in
[#161](https://github.com/jonpulsifer/wishlist/issues/161).
