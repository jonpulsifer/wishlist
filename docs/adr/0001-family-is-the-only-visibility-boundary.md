# 1. Family is the only visibility boundary

Date: 2026-08-02
Status: Accepted

## Context

Every question this project asked about who may see what resolved to the same
answer, and the map asked it five separate times — as groups, as per-list
audiences, as share links, as scoped roles, and as an interaction policy. Each
time the second mechanism turned out to be a [Family](../../CONTEXT.md#family)
wearing a different hat.

The cost of a *second* edge is not the edge. It is that `lib/db/visibility.ts`
composes one rule, and every additional axis multiplies what a reader must hold
in their head to answer "can she see this?". Three real disclosure defects in
this repo came from hand-written `where` clauses that each believed they knew
the rule.

## Decision

**Sharing a Family is the whole of who may see whom.** There is one edge, and
`lib/db/visibility.ts` composes from it alone.

Families are flat and overlapping. They do not nest, they have no owner, their
names are labels rather than identifiers, and one you are not in is invisible
rather than merely closed. Membership is mutual — there is no way to be seen
without seeing — and it is a one-way ratchet: nobody may remove anyone, and
leaving is the only exit.

A [Wish](../../CONTEXT.md#wish) is not pinned to anything. Who may see it
derives from its **subject's** current memberships, computed rather than stored.

## Consequences

Every disclosure question has one place to look, and adding a second axis is now
a decision someone has to argue for against this record rather than a change
they can make locally.

The rule stops going stale. A snapshot of who could see a Wish is wrong the
moment anyone joins or leaves; a derived rule cannot be.

**Three things become unserved, deliberately.** Showing one coworker a list
costs a permanent, mutual membership carrying addresses and sizes — mutual plus
unremovable is what makes that expensive, and the case stays unserved rather
than opening a way around the boundary. A viewer with no account cannot be given
anything. And an instance administrator cannot inspect a Family they are not in,
which is the argument [ADR-0002](0002-there-are-no-roles.md) turns on.

**Removal is the deferred item most likely to be asked for first.** Three
separate tickets leaned on the ratchet to reach their conclusions, so reopening
it reopens them.

## Grounded and anticipated

**Grounded**: the single edge, the many-to-many membership, and the mutuality —
`visiblePeopleWhere` is a single `some → some`, which has no way to express
seen-without-seeing. The absence of any way to remove a member is also true
today, though as an omission rather than a decision.

**Anticipated**: flatness as a decision, names ceasing to be unique, invisibility
rather than closedness, the ratchet, and deletion by last exit. Multi-family
tenancy is modelled here and needs no further work to arrive — a person already
belongs to as many Families as they like.

## Options closed

Nesting. One-directional visibility. Per-Family roles. View-granting share
links. Per-list audiences. Pinning a Wish to the Families it was created in.
Ejection in every form offered — symmetric, by-whoever-admitted-you, and by a
per-Family owner.

Decided across
[#150](https://github.com/jonpulsifer/wishlist/issues/150),
[#153](https://github.com/jonpulsifer/wishlist/issues/153),
[#156](https://github.com/jonpulsifer/wishlist/issues/156),
[#157](https://github.com/jonpulsifer/wishlist/issues/157),
[#158](https://github.com/jonpulsifer/wishlist/issues/158) and
[#160](https://github.com/jonpulsifer/wishlist/issues/160).
