# 4. Surprise is an invariant, and the projection is what keeps it

Date: 2026-08-02
Status: Accepted

## Context

Four flags on `model Gift` — `published`, `archived`, `claimed`, and
proposer-≠-subject — look like they encode one rule about hiding things. They do
not. They are three unrelated things and one dead column, and naming them
collectively would assert a coherence the row does not have.

Separately, [ADR-0003](0003-a-wish-is-flat-and-a-claim-is-a-set-of-claimers.md)
takes claim state out of the `where` clause so that claimers can find each
other. That removes the thing currently keeping the secret.

## Decision

**[Surprise](../../CONTEXT.md#surprise) is an invariant, not a mechanism.** It
has no flag, no column and no rule of its own. It is what falls out of who owns
which row: a Claim belongs to the claimer and is never projected to the subject;
a Suggestion is a Wish whose proposer is not its subject, and a person's own
view is the Wishes they proposed.

**It cannot be defended by a `where` clause, and this is forced rather than
chosen.** A subject sees their own list, so filtering a claimed Wish out of it
would make the row *disappear* — and a Wish vanishing from your own list is a
louder signal than a badge saying someone has it. **Absence is itself the leak.**

So the half of Surprise that concerns Claims lives in `lib/db/projections.ts`: a
subject's payload must not carry claim state **at all**, rather than carrying it
set to a safe value. The half that concerns Suggestions stays in
`lib/db/visibility.ts`, where a person's own view is the Wishes they proposed.

`projections.ts` also holds what may cross into the one outbound email this app
sends. One module answers *what may cross out of here*.

## Consequences

**The projection becomes load-bearing rather than tidy.** Today a subject's own
payload carries `claimed` through `giftRowSelect` and the invariant holds only
because no component happens to read the field
([#179](https://github.com/jonpulsifer/wishlist/issues/179)). After this, *no
component reads it* is the entire defence, which is not a defence. #179 is the
mechanism, not a small bug.

Naming the invariant rules things out. There is no *third* way to keep a
surprise, so any future proposal to hide a Wish is a Claim, a Suggestion, or a
new concept that has to justify itself against this record.

**Archived is not part of it.** It is a lifecycle state set by the subject, and
the giveaway is that un-archiving releases the Claim — a rule about fulfilment,
not about secrecy.

The outbound message inherits the same discipline for a different reason: the
seam is *irrevocable* rather than merely serialised. It carries the sender's
name, the app and a link. Never the Family name, never Wishes, never a member
list.

## Grounded and anticipated

**Grounded**: the behaviour, all of it. A Wish added for you is hidden from you,
and you are never told a Claim exists.

**Anticipated**: that surprise needs no mechanism, and the move into the
projection. The outbound message is anticipated in every part — there is no mail
dependency, no sender, and nothing that writes one.

## Options closed

A collective name for the four flags. A third hiding mechanism of any kind. A
notification system — a general channel is by construction the thing that reads
around the single safeguard, and naming the category is how it gets built.
Engagement mail. Enforcing claim secrecy in the query layer, which the
own-profile case makes impossible rather than merely awkward.

Decided in [#152](https://github.com/jonpulsifer/wishlist/issues/152),
[#159](https://github.com/jonpulsifer/wishlist/issues/159) and
[#161](https://github.com/jonpulsifer/wishlist/issues/161).
