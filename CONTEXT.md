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

Who may see a Wish follows from its **subject**: anyone sharing a [Family](#family)
with them.
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
  Families its *proposer* belonged to at the moment it was added, so it is a snapshot
  rather than a rule, and it goes stale when anyone joins a Family.

## Claim

One person's private commitment to fulfil another person's [Wish](#wish).

A Claim is owned by the **claimer**, not by the person who wants the thing — which is
the whole point. The person whose Wish it is must never learn a Claim exists against
it, and that secrecy is a property of the Claim rather than a rule bolted onto the Wish.

Wish and Claim are separate concepts because they have different owners, different
lifecycles and opposite visibility. Holding both on one row is why "who may see what"
currently has to be defended by hand in `lib/db/visibility.ts` rather than falling out
of the model.

A Wish has **at most one Claim**, and a Claim may have **several claimers**. People
chipping in together are not making separate commitments — the thing gets bought once,
and only the participants are plural. Keeping the Claim singular keeps "is this taken?"
a single fact rather than a count a reader has to interpret, and keeps unclaiming mean
"I am out" rather than ambiguously "it is available again". There is no partially-claimed
state: a Claim is a Claim from the moment the first person makes it.

Claimers can see each other, because they cannot coordinate otherwise. The subject sees
nothing, ever. Everyone else who can see the Wish sees only **that** it is claimed —
which is a widening, since today a claimed Wish disappears from their view entirely, and
a Claim nobody can see is a Claim nobody can join.

- **Grounded**: the vocabulary is already the app's own — `claimGift`, `unclaimGift`,
  the `/claimed` route, "Claimed Gifts" in the UI. The two facts already coexist on one
  row with different owners and opposite visibility.
- **Anticipated**: that a Claim is worth its own row rather than staying a flag pair
  ([#149](https://github.com/jonpulsifer/wishlist/issues/149)), and that several claimers
  are wanted at all — nothing in the app expresses chipping in today. Decided in
  [#152](https://github.com/jonpulsifer/wishlist/issues/152).
- **Rejected**: several Claims against one Wish — it makes duplicate buying representable
  again, which is the thing claiming exists to prevent.
- **Schema today**: the `claimed` boolean and `claimedById` on `model Gift` — one claimer,
  and the boolean is redundant with the id, kept in step by hand in both actions. A
  claimed Wish is **removed** from every other viewer rather than badged: rule 2 of
  `lib/db/visibility.ts` is `claimed: false OR claimedById: viewer OR createdById: viewer`,
  so the row is simply not returned. Letting claimers find each other means changing that,
  and [#161](https://github.com/jonpulsifer/wishlist/issues/161) prices it alongside the
  widening from [#156](https://github.com/jonpulsifer/wishlist/issues/156).

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
- **Rejected**: `Wishlist` as the name of the **[Family](#family)** — that is the
  meaning the schema carries today, and it retires in
  [#150](https://github.com/jonpulsifer/wishlist/issues/150). Naming a person's
  collection anything else, when wishin.app is named for this word and every user
  already uses it this way.
- **Schema today**: `model Wishlist` is the [Family](#family), not this. A person's
  collection has no representation beyond `Gift.ownerId`.

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

## Surprise

That a person does not learn what they are getting.

Precisely: the **subject** of a [Wish](#wish) learns neither that a [Claim](#claim) exists
against it, nor that a [Suggestion](#suggestion) was made for them.

Surprise is an **invariant, not a mechanism**. It has no flag, no column and no rule of
its own — it is what falls out of who owns which row. A Claim belongs to the claimer and
is never projected to the subject; a Suggestion is a Wish whose proposer is not its
subject, and a person's own view is the Wishes they proposed. Those two facts are the
whole of it. Nothing else on a Wish defends it, and in particular
[Archived](#archived) does not: that is a lifecycle state, not a secret.

Naming it matters mostly for what it rules out. There is no *third* way to keep a
surprise, so any future proposal to hide a Wish is either a Claim, a Suggestion, or a new
concept that has to justify itself.

- **Grounded**: the behaviour, all of it. A Wish added for you is hidden from you, and you
  are never told a Claim exists.
- **Anticipated**: that surprise needs no mechanism once
  [#149](https://github.com/jonpulsifer/wishlist/issues/149) and
  [#156](https://github.com/jonpulsifer/wishlist/issues/156) land. Decided in
  [#152](https://github.com/jonpulsifer/wishlist/issues/152).
- **Rejected**: one name for the four flags on `Gift` collectively — `published`,
  `archived`, `claimed` and proposer-≠-subject are three unrelated things and one dead
  column, so any collective name would assert a coherence the row does not have.
- **Schema today**: nothing holds this. It is restored after the fact by rules 2 and 5 of
  `lib/db/visibility.ts` — a claim filter, and an own-profile branch narrowing to
  `createdById: viewerId`. The branch cannot filter claims (archived-on-your-own-page
  needs it not to), so `claimed` reaches the subject's own browser through
  `giftRowSelect`; surprise holds there only because no component reads the field.

## Archived

A [Wish](#wish) its subject has taken off their list.

Archiving says *I have this now* or *never mind*. It is a lifecycle state of the Wish and
has nothing to do with [Surprise](#surprise) — the giveaway is that un-archiving releases
the [Claim](#claim), which is a rule about fulfilment, not about secrecy.

Archiving is not deletion. The Wish stays, and it stays visible **to its subject**, which
is what makes it worth having: last year's list is how anyone remembers what was already
given.

Only the **subject** archives. A [Suggestion](#suggestion) is not the proposer's to retire
— withdrawing one is deleting it, because a Wish its subject cannot see and its proposer
has archived is a row no one can reach.

- **Grounded**: the state, the word, the owner-visible archive section, and the
  claim-release on un-archiving all exist today.
- **Anticipated**: that archiving narrows to the subject. Decided in
  [#152](https://github.com/jonpulsifer/wishlist/issues/152).
- **Rejected**: `Retired` — truer to the act, but `archived` is already the column, the
  actions and the UI section, and the meaning is not the part that changes.
- **Schema today**: `Gift.archived`. `loadEditableGift` lets **owner or creator** archive,
  so a proposer can archive their own Suggestion and strand it — the subject cannot see
  Suggestions, every other query filters `archived: false`, and
  `getGiftWithAccessCheck`'s own-profile escape hatch requires owner and creator to be the
  same person. Tracked as a defect.

## Family

The people who can see each other's [Wishes](#wish).

A Family is the app's **only** visibility boundary. Everything anyone may see follows
from sharing one, and after [#151](https://github.com/jonpulsifer/wishlist/issues/151)
declined per-Family occasions and
[#156](https://github.com/jonpulsifer/wishlist/issues/156) dropped the pinning of Wishes
to lists, there is no second edge left.

Families are **flat** and may overlap. A person belongs to as many as they like, so any
subset you would otherwise nest for — "my side", "the immediate family" — is simply
another Family sharing members. A Family's name is a **label, not an identifier**: two
unrelated Smiths may both use it, because you reach a Family by invite or by already
being in it, never by typing its name.

There is **no directory of Families**. A Family you are not in is not merely closed to
you, it is invisible: you cannot see that it exists, learn its name or count its members.
The only way in is an [Invite](#invite).

The word is chosen for what the app is actually for — helping big families track the
wants of their peeps. A friend group or a set of coworkers is modelled as a Family too,
and that is the one place the word is a stretch.

- **Grounded**: the concept, the many-to-many membership and its role as the single
  visibility edge all exist today.
- **Anticipated**: the name, flatness as a decision rather than an accident, names ceasing
  to be unique ([#150](https://github.com/jonpulsifer/wishlist/issues/150)), and Families
  being invisible rather than merely closed
  ([#153](https://github.com/jonpulsifer/wishlist/issues/153)).
- **Rejected**: `Circle` and `Group` — neutral enough to fit coworkers, but they name a
  shape rather than a thing, and the coworkers case is speculative while the family case
  is the product. Nesting — overlapping membership already expresses every subset, and
  making the one remaining visibility rule recursive would be felt everywhere.
- **Schema today**: `model Wishlist`. Its `name` is globally `@unique`, its `password`
  is a plaintext pin, and it has no owner column — so nobody runs a Family
  ([#160](https://github.com/jonpulsifer/wishlist/issues/160)). There *is* a directory:
  `getWishlistsWithMembers` takes no viewer and lists every Family by name to every
  signed-in user, on `/wishlists` and in global search. Both the pin and the directory go
  ([#153](https://github.com/jonpulsifer/wishlist/issues/153)).

## User

A person.

There is no layer between a person and their account: a User **is** the human — their
name, their sizes, their address. An **Account** is how they sign in, and a User may
have none. Someone who has never signed in is not a different kind of thing; they are a
User with no Account.

Such a User is **provisional**: they are here because a member added them by email, not
because they arrived. Provisional is **derived, never stored** — the absence of an Account
row is the entire definition, so no field records it and it stops being true the moment
they sign in. It is shown wherever people are listed, which is the point: a member who
mistypes an address can see the stranger they just added to the Family, instead of finding
out when that address signs in years later.

- **Grounded**: `model User` is this already, and `allowDangerousEmailAccountLinking` is
  on, so an accountless User links correctly when that person later signs in with
  Google.
- **Anticipated**: that a person who will never sign in needs nothing more than this, and
  that provisional stays derived. Nothing creates such a row today — every User comes from
  the Auth.js adapter — and the flow that would is the push half of
  [#153](https://github.com/jonpulsifer/wishlist/issues/153).
- **Rejected**: `Person` as a distinct level above `User`. Decided in
  [#150](https://github.com/jonpulsifer/wishlist/issues/150): the higher-level concept
  the product needed was [Family](#family), and splitting the human from the login costs
  a table across ~60 call sites and the adapter binding in
  [#154](https://github.com/jonpulsifer/wishlist/issues/154) to express a state that is
  already expressible.
- **Schema today**: `model User`, with `Account` and `Session` bound by the adapter.

## Invite

A link that grants membership of a [Family](#family).

An Invite is the **only** way into a Family, and following one is the whole of joining:
the link *is* the consent, so there is no secret to type, no approval queue and no
confirmation screen. Any member of a Family may create an Invite to it — a family whose
members cannot invite anyone is a family that grows only as fast as its admin answers
messages. An Invite is revocable and expires.

An Invite grants **join**, not view. A link that shows someone a Wishlist without making
them a member is a different thing, and belongs to
[#158](https://github.com/jonpulsifer/wishlist/issues/158).

Joining also has a **push** direction, which needs no Invite: a member adds someone by
email, creating a provisional [User](#user) who is in the Family at once. That person has
a [Wishlist](#wishlist) and can be given [Suggestions](#suggestion) before they have heard
of the app, and their first Google sign-in adopts the row that is already waiting. This is
the half of joining that has no mechanism at all today.

- **Grounded**: the token, its revocation, the cookie that carries it through sign-in, and
  the join-on-click route all exist and work.
- **Anticipated**: that an Invite is the only door, that any member may create one — which
  [#160](https://github.com/jonpulsifer/wishlist/issues/160) may refine once Families have
  owners — and the push direction entirely. Decided in
  [#153](https://github.com/jonpulsifer/wishlist/issues/153).
- **Rejected**: a shared pin. It is not a second mechanism but a worse Invite — a bearer
  secret that grants membership, four digits long, shared, permanent, reusable, stored in
  plaintext and guessable in ten thousand tries. Joining by email domain — a Family is not
  a domain, and that is a corporate-SSO idea wearing a festive hat.
- **Schema today**: `model WishlistInvite`, reachable only by an admin —
  `createWishlistInviteAdmin` requires `manage:wishlists`, as does creating a Family at
  all, so no ordinary member can invite anyone or start a family. One active invite per
  Family is enforced by revoking the previous one. `expiresAt` exists and nothing ever
  writes it, so invites do not expire. The pin path
  (`joinWishlist`) is unthrottled and compares in plaintext.

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
- **Schema today**: no table. An [Exchange](#exchange) names the Occasion it is held for
  by year alone, in `SecretSantaEvent.year`.

## Season

A period of the year with a look.

A Season is derived from the calendar and stored nowhere: December is festive whether
or not anyone is running an [Exchange](#exchange). It drives theming and nothing else —
it is not what an Exchange belongs to, and it is not "the year in play".

- **Grounded**: theming follows the calendar today, and needs no rows to keep doing so.
- **Anticipated**: that the word narrows to the look alone.
- **Code today**: `lib/season.ts` uses `Season` for the calendar year in play. It
  computes one window from it — how stale a [Wish](#wish) may be and still count as
  current — which survives this definition, and is not seasonal. The module's other
  export, `occasionYear`, is the [Occasion](#occasion)'s and deliberately not this.

## Exchange

A gift exchange people join and are paired in — what the app calls Secret Santa.

An Exchange belongs to one [Occasion](#occasion) and names its participants explicitly,
so it is the participant-scoped thing and the Occasion is not. It exists before anyone
is paired: people join an undrawn Exchange, and the [Draw](#draw) is what assigns them.

- **Grounded**: the container, its explicit participants and its undrawn state all
  exist. Exclusions ("never match me with my spouse") are **global** rather than per
  Exchange, which is open in
  [#152](https://github.com/jonpulsifer/wishlist/issues/152).
- **Anticipated**: the name, and the [Occasion](#occasion) row a year would become.
- **Schema today**: `model SecretSantaEvent`, carrying the `year` it is held for.
  `lib/season.ts` owns the reading of it: `occasionYearOf` falls a null year back to
  `createdAt`, and the Occasion in play turns over on April 1st rather than New Year, so
  an Exchange opened on January 2nd is for the Christmas just gone.

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
- **Person** — never introduced, by
  [#150](https://github.com/jonpulsifer/wishlist/issues/150). A [User](#user) is the
  person; the higher-level concept the product needed turned out to be
  [Family](#family). "Person" survives in prose where it reads naturally, but no model
  or type is named for it.
- **Pin** / **password** — retired by
  [#153](https://github.com/jonpulsifer/wishlist/issues/153). `Wishlist.password` is a
  join secret, not a credential — nobody authenticates with it, since signing in is
  Google's job. As a way into a [Family](#family) it is a weaker
  [Invite](#invite), so it goes rather than being hashed or lengthened.
- **Published** — never a concept. `Gift.published` exists in
  `prisma/schema.prisma`, defaults to `false`, and outside the generated client nothing
  in the repo reads or writes it: not the seed, not an action, not a query, not a
  component. Every live row is `false`. It is a column, not a term, and
  [#152](https://github.com/jonpulsifer/wishlist/issues/152) drops it.
- **Event** — retired by
  [#151](https://github.com/jonpulsifer/wishlist/issues/151). It named the container
  people join, which is an [Exchange](#exchange), and it names nothing specific enough
  to be worth keeping alongside a dated [Occasion](#occasion).
