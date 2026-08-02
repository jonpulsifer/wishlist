# Glossary

The domain language of wishin.app. `docs/agents/domain.md` points every agent skill
here before it explores, so the terms below are the ones to use in issue titles,
hypotheses, test names and code.

**This glossary runs ahead of the schema.** It is being written by
[the domain-language map](https://github.com/jonpulsifer/wishlist/issues/148) one
decision at a time, and the refactor that makes `prisma/schema.prisma` match it has
not landed. Each entry therefore carries a **Schema today** line where the code still
says something else. When the two disagree, the glossary is the intent and the schema
is the fact — write new prose in glossary terms, and read code in schema terms.

Each entry marks whether it is **grounded** (true of the app as it runs today) or
**anticipated** (chosen to accommodate a future the map decided to model). Anticipated
detail ages badly; treat it as revisable.

---

## Wish

A thing one person would like to **receive** from another.

The boundary is `receive`, not `buy`. A product with a link is a Wish; so is a
hand-me-down, an experience, or a favour. A goal nobody can give you — "learn guitar" —
is not a Wish, because there would be nothing to [Claim](#claim).

A Wish is flat: there is no kind or type discriminator, and none is planned. A Wish
carries a name and, optionally, a link, a description and an image.

Every Wish has a **subject** — the person who would receive it — and a **proposer**,
the person who added it. Usually they are the same person, and the Wish sits on that
person's [Wishlist](#wishlist). When they differ the Wish is a
[Suggestion](#suggestion), which is what makes surprises possible.

Who may see a Wish follows from its **subject**: anyone sharing a group with them.
Nothing is pinned or filed — a Wish is visible wherever its subject is.

- **Grounded**: the fields, the optionality, and the proposer-is-not-always-the-subject
  rule all exist today.
- **Anticipated**: that no discriminator is ever needed. Decided in
  [#149](https://github.com/jonpulsifer/wishlist/issues/149) on the grounds that
  "receivable" is exactly the boundary that keeps Claim meaningful. The subject and
  proposer vocabulary is from
  [#156](https://github.com/jonpulsifer/wishlist/issues/156).
- **Rejected**: `Gift` — too specific, and it names the giving rather than the wanting.
  `Want` — no natural collection noun. `Item` — carries no meaning.
- **Schema today**: `model Gift`; the subject is `ownerId` and the proposer is
  `createdById`. Visibility is **not** derived — `Gift.wishlists` pins each row to the
  groups its *proposer* belonged to at the moment it was added, so it is a snapshot
  rather than a rule, and it goes stale when anyone joins a group.

## Claim

One person's private commitment to fulfil another person's [Wish](#wish).

A Claim is owned by the **claimer**, not by the person who wants the thing — which is
the whole point. The person whose Wish it is must never learn a Claim exists against
it, and that secrecy is a property of the Claim rather than a rule bolted onto the Wish.

Wish and Claim are separate concepts because they have different owners, different
lifecycles and opposite visibility. Holding both on one row is why "who may see what"
currently has to be defended by hand in `lib/db/visibility.ts` rather than falling out
of the model.

- **Grounded**: the vocabulary is already the app's own — `claimGift`, `unclaimGift`,
  the `/claimed` route, "Claimed Gifts" in the UI. The two facts already coexist on one
  row with different owners and opposite visibility.
- **Anticipated**: that a Claim is worth its own row rather than staying a flag pair.
  Decided in [#149](https://github.com/jonpulsifer/wishlist/issues/149).
- **Schema today**: the `claimed` boolean and `claimedById` on `model Gift`. Whether
  several Claims may exist against one Wish — people chipping in together — is open in
  [#152](https://github.com/jonpulsifer/wishlist/issues/152).

## Wishlist

Everything a person has asked for: the [Wishes](#wish) whose subject and proposer are
both them.

A Wishlist is a **view, not a thing**. There is no row and no table — a Wish already
names its subject, so a Wishlist is a query over Wishes, and a table would carry no
field the Wish does not already have. Each person has exactly one, implicitly: nothing
has yet appeared that would distinguish a second.

A Wishlist is what its owner **asked for**, which is precisely why a
[Suggestion](#suggestion) is not on it.

- **Grounded**: the collection exists this way already — it is `ownerId`, queried.
- **Anticipated**: that one per person is enough.
  [#151](https://github.com/jonpulsifer/wishlist/issues/151) removed occasion as a way
  to tell two apart, and audience belongs to interaction policy
  ([#157](https://github.com/jonpulsifer/wishlist/issues/157)) rather than to a list.
  Decided in
  [#156](https://github.com/jonpulsifer/wishlist/issues/156).
- **Rejected**: `Wishlist` as the name of the **group** — that is the meaning the
  schema carries today, and it retires in
  [#150](https://github.com/jonpulsifer/wishlist/issues/150). Naming a person's
  collection anything else, when wishin.app is named for this word and every user
  already uses it this way.
- **Schema today**: `model Wishlist` is the group, not this. A person's collection has
  no representation beyond `Gift.ownerId`.

## Suggestion

Someone else's idea of what a person might want: a [Wish](#wish) whose **proposer is
not its subject**.

A Suggestion is visible to everyone who can see the subject **except the subject**.
That is the whole point, and it is why a Suggestion is not on the subject's
[Wishlist](#wishlist) — a Wishlist is what its owner asked for.

A Suggestion is not a separate kind of row. It is the state a Wish is in when its two
people differ, so a [Claim](#claim) attaches to it exactly as to any other Wish, and
**adopting** one — the subject deciding they do want it — is setting the proposer to
the subject.

- **Grounded**: the behaviour exists. `lib/db/visibility.ts` narrows a viewer looking
  at their own list to `createdById: viewerId`, so a Wish added for you is already
  hidden from you.
- **Anticipated**: the name, and adoption. Decided in
  [#156](https://github.com/jonpulsifer/wishlist/issues/156).
- **Rejected**: a separate `Suggestion` model — it would force a [Claim](#claim) to
  point at either kind, splitting 600+ rows across two tables to express one rule.
- **Schema today**: `Gift.createdById` differing from `Gift.ownerId`. The rule is
  hand-written as a branch in `visibility.ts` rather than named.

## Occasion

A shared, dated happening that people give around — Christmas 2026.

**Shared is the test**: every participant both gives and receives. A birthday has a
single receiver, so it is not an Occasion. An Occasion is global — Christmas 2026 is
one happening, not one per family — and each row is a single occurrence, so Christmas
2027 is a different Occasion rather than the same one coming round again.

An Occasion owns a date and the [Exchanges](#exchange) held for it. It does **not** own
[Wishes](#wish): a Wish is a thing a person wants, not a thing they want *for*
something, and it stays on their list across occasions rather than being re-filed each
year.

- **Grounded**: nothing. There is no table, no row, and no code that reads one.
- **Anticipated**: all of it. Decided in
  [#151](https://github.com/jonpulsifer/wishlist/issues/151). wishin.app is
  Christmas-first and stays that way; the term exists so that the calendar year stops
  being the organising fact once other occasions arrive. Treat it as the most revisable
  entry here.
- **Rejected**: `Season` for this meaning — it names the look, below. `Event` — names
  nothing specific. Birthdays as Occasions — one receiver, and modelling them here
  would put a nullable "whose is it" discriminator on every reader.
- **Schema today**: none. An [Exchange](#exchange)'s occasion is inferred from its
  `createdAt` year.

## Season

A period of the year with a look.

A Season is derived from the calendar and stored nowhere: December is festive whether
or not anyone is running an [Exchange](#exchange). It drives theming and nothing else —
it is not what an Exchange belongs to, and it is not "the year in play".

- **Grounded**: theming follows the calendar today, and needs no rows to keep doing so.
- **Anticipated**: that the word narrows to the look alone.
- **Code today**: `lib/season.ts` uses `Season` for the calendar year in play, and
  computes three windows from it. Only one of those — how stale a [Wish](#wish) may be
  and still count as current — survives this definition, and it is not seasonal.

## Exchange

A gift exchange people join and are paired in — what the app calls Secret Santa.

An Exchange belongs to one [Occasion](#occasion) and names its participants explicitly,
so it is the participant-scoped thing and the Occasion is not. It exists before anyone
is paired: people join an undrawn Exchange, and the [Draw](#draw) is what assigns them.

- **Grounded**: the container, its explicit participants and its undrawn state all
  exist. Exclusions ("never match me with my spouse") are **global** rather than per
  Exchange, which is open in
  [#152](https://github.com/jonpulsifer/wishlist/issues/152).
- **Anticipated**: the name, and that an Exchange records which year it is *for*.
- **Schema today**: `model SecretSantaEvent`, whose year is inferred from `createdAt` —
  so an Exchange for 2026 created on January 2nd 2027 files itself under 2027.

## Draw

The act of assigning who gives to whom within an [Exchange](#exchange).

A Draw is not a thing people join — that is the Exchange. It is the moment pairings are
made, and it is reproducible: `lib/secret-santa/draw.ts` takes its randomness as a
parameter.

- **Grounded**: entirely. `drawAssignments`, `DrawInput`, `DrawResult` and the tests
  already use this word for exactly this meaning.
- **Schema today**: the `assignedToId` and `assignedById` columns on
  `SecretSantaParticipant`. The act has no row of its own.

---

## Terms this project does not use

- **Gift** — retired from the model layer by
  [#149](https://github.com/jonpulsifer/wishlist/issues/149). It survives in UI copy
  where it reads naturally ("Add a gift"), but no model, query or type is named for it.
  It was deliberately **not** reused for Claim, despite fitting: every existing `Gift`
  row becomes a Wish, so keeping the word would silently move its meaning across ~60
  call sites.
- **Event** — retired by
  [#151](https://github.com/jonpulsifer/wishlist/issues/151). It named the container
  people join, which is an [Exchange](#exchange), and it names nothing specific enough
  to be worth keeping alongside a dated [Occasion](#occasion).
