# 3. A Wish is flat, and a Claim is a set of claimers

Date: 2026-08-02
Status: Accepted

## Context

`model Gift` holds two facts with different owners, different lifecycles and
opposite visibility: what a person wants, and who has quietly agreed to buy it.
Holding both on one row is why "who may see what" has to be defended by hand
rather than falling out of the model.

Splitting them raises the question of what the second thing *is*. It is easy to
assume it is a table.

## Decision

A **[Wish](../../CONTEXT.md#wish)** is flat: no kind or type discriminator, and
none planned. The boundary is *receivable*, which is exactly what keeps claiming
meaningful. It carries a **quantity**, defaulting to one.

A **[Claim](../../CONTEXT.md#claim) is a term with no table.** Stripped down it
has no field of its own, so it is exactly *the set of people committed to a
Wish*, held as a `Claimer` row per person keyed on `(wishId, userId)`.

Written that way, **"at most one Claim per Wish" is not a constraint to enforce
but a thing the schema cannot express** — the same move that binds an Exchange
to one Family in [ADR-0001](0001-family-is-the-only-visibility-boundary.md).

The model is named `Claimer` and the word does the work. A row per person named
`Claim` would say a Wish has several Claims, which is what makes duplicate
buying representable again.

**Splitting is headcount.** Several people going in on one thing is several
`Claimer` rows and nothing else. No share, no amount, no price.

## Consequences

Unclaiming is deleting your row, and the last delete *is* the unclaim — there is
no Claim row left over to drift out of step with "is this claimed?".

Claim state leaves the `where` clause entirely, which is what makes quantity
affordable: Prisma cannot express a `SUM(...) >= ...` comparison in a `where`,
so a quantity that had to be filtered on would force raw SQL into the middle of
the disclosure boundary. See [ADR-0004](0004-surprise-is-an-invariant.md), which
this decision forces.

**A claimed Wish stays visible, badged, rather than vanishing.** A Claim nobody
can see is a Claim nobody can join, and joining is the whole of splitting. This
widens what non-subjects see, and is priced deliberately.

**Quantity makes a Claim partial**, which overrules the earlier finding that
there is no partially-claimed state. What survives is the part that mattered:
one Claim, and no duplicate buying. The singular thing is the *claim*, not the
count.

## Grounded and anticipated

**Grounded**: the vocabulary is already the app's own — `claimGift`,
`unclaimGift`, the `/claimed` route. The two facts already coexist on one row.
**Splitting and quantity were asked for by the owner**, which makes them the
only part of this glossary grounded in a request rather than in charting.

**Anticipated**: that several claimers are wanted at all — nothing in the app
expresses chipping in today — and the shape of the row.

## Options closed

Several Claims against one Wish. A `Claim` table with claimers hanging off it —
two tables, and the Claim row outlives its last claimer. An implicit
many-to-many — the cheapest of the three, but Prisma names the table
`_WishToUser` with columns `A` and `B`, and it cannot carry the timestamp that
orders a split.

A kind or type discriminator on Wish. A separate `Suggestion` model — it would
force a Claim to point at either kind, splitting live rows across two tables to
express one rule.

**Money, in every form**: a price on the Wish, an amount on the claimer, a share
count. Prices go stale and are absent from half the live rows, which are links;
an amount makes the app know a debt it cannot collect or confirm, so it would
owe an answer it has no way to give.

Decided in [#149](https://github.com/jonpulsifer/wishlist/issues/149),
[#152](https://github.com/jonpulsifer/wishlist/issues/152) and
[#161](https://github.com/jonpulsifer/wishlist/issues/161).
