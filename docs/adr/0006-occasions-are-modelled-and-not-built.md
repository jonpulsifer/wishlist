# 6. Occasions are modelled and not built; a Wish stays unfiled

Date: 2026-08-02
Status: Accepted

## Context

wishin.app is Christmas-first. The calendar year is the organising fact
everywhere: `lib/season.ts` computes which year is in play, `SecretSantaEvent`
carries a `year`, and how stale a Wish may be is measured against it.

The map chose to model year-round occasions whether or not they are built. That
choice has a known cost — speculative model detail ages badly — so this ADR
exists mostly to record how *little* of it is load-bearing.

## Decision

Four words, deliberately separated:

| term | is |
| --- | --- |
| **[Occasion](../../CONTEXT.md#occasion)** | a shared, dated happening — Christmas 2026. Global, one row per occurrence |
| **[Season](../../CONTEXT.md#season)** | a period of the year with a *look*. Calendar-derived, stored nowhere |
| **[Exchange](../../CONTEXT.md#exchange)** | the container people join, held for one Occasion and one Family |
| **[Draw](../../CONTEXT.md#draw)** | the act of pairing them |

**Shared is the test for an Occasion**: every participant both gives and
receives. A birthday has a single receiver, so it is not one.

**A Wish is not filed under an Occasion.** A Wish is a thing a person wants, not
a thing they want *for* something, and it stays on their list across occasions.
How current a Wish is stays a soft rolling window measured from the calendar.

**Occasion is defined and not built**: no table, no row, no reader. An Exchange
names the Occasion it is held for by year alone.

## Consequences

**Theming ships with zero dependency on any of this.** Season narrows to the
look, which is calendar-derived, so December is festive whether or not anyone is
running an Exchange.

**The live Wishes need no backfill.** Filing them under an Occasion would have
meant assigning several hundred rows to a year they were never tagged with; not
filing them means the entire question does not arise.

An Exchange is held for **one Family**, and that bound is not bookkeeping — it is
what keeps a santa able to see their recipient's Wishes. Participants drawn from
two Families could be paired into an obligation
[ADR-0001](0001-family-is-the-only-visibility-boundary.md) makes impossible to
fulfil, and bounding the Exchange makes that unrepresentable rather than merely
unlikely. It is also why an Exchange grants no visibility of its own.

**Exclusions belong to the two people in them**, not to the Exchange and not to
the Organiser, who therefore runs a Draw shaped by constraints they cannot
inspect or override. They are global and permanent rather than per-Exchange.

## Grounded and anticipated

**Grounded**: the Exchange container, its explicit participants, its undrawn
state, the Draw and its reproducibility. Exclusions, already global and already
symmetric. Theming following the calendar.

**Anticipated**: Occasion entirely — treat it as the most revisable entry in the
glossary. The Family bound on an Exchange, and exclusion ownership.

The `year` on an Exchange is nullable today *only* because there were no
migrations to backfill it with. That reason expires with
[ADR-0007](0007-adopt-migrations-and-rename-physically.md), and `lib/season.ts`'s
null fallback goes with it.

## Options closed

`Season` as the name for a dated happening — it names the look. `Event` — it
names nothing specific. Birthdays as Occasions — one receiver, and modelling
them would put a nullable "whose is it" discriminator on every reader.

Per-Family occasions. A Wish filed under an Occasion, or re-filed each year.
Per-Exchange exclusions, and exclusions the Organiser sets. An Exchange that
grants visibility for its duration — it buys cross-Family exchanges at the cost
of the second edge ADR-0001 declined.

Decided in [#151](https://github.com/jonpulsifer/wishlist/issues/151),
[#152](https://github.com/jonpulsifer/wishlist/issues/152) and
[#160](https://github.com/jonpulsifer/wishlist/issues/160).
