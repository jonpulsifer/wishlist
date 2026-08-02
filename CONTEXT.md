# Glossary

The domain language of wishin.app. `docs/agents/domain.md` points every agent skill
here before it explores, so the terms below are the ones to use in issue titles,
hypotheses, test names and code.

**This glossary runs ahead of the schema.** It is being written by
[the domain-language map](https://github.com/jonpulsifer/wishlist/issues/148) one
decision at a time, and the refactor that makes `prisma/schema.prisma` match it has
not landed — `docs/refactor-plan.md` is the sequence that lands it. Each entry
therefore carries a **Schema today** line where the code still
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
carries a name and, optionally, a link and a description.

A Wish also carries a **quantity** — how many of the thing its subject wants, defaulting
to one. Five pairs of socks is one Wish wanted five times, not five Wishes, and it is what
lets a [Claim](#claim) speak for part of a Wish rather than all of it.

Every Wish has a **subject** — the person who would receive it — and a **proposer**,
the person who added it. Usually they are the same person, and the Wish sits on that
person's [Wishlist](#wishlist). When they differ the Wish is a
[Suggestion](#suggestion), which is what makes surprises possible.

Who may see a Wish follows from its **subject**: anyone sharing a [Family](#family)
with them.
Nothing is pinned or filed — a Wish is visible wherever its subject is.

- **Grounded**: the fields, the optionality, and the proposer-is-not-always-the-subject
  rule all exist today. Quantity is wanted by the owner.
- **Anticipated**: that no discriminator is ever needed. Decided in
  [#149](https://github.com/jonpulsifer/wishlist/issues/149) on the grounds that
  "receivable" is exactly the boundary that keeps Claim meaningful. The subject and
  proposer vocabulary is from
  [#156](https://github.com/jonpulsifer/wishlist/issues/156); quantity from
  [#161](https://github.com/jonpulsifer/wishlist/issues/161).
- **Rejected**: `Gift` — too specific, and it names the giving rather than the wanting.
  `Want` — no natural collection noun. `Item` — carries no meaning.
- **Schema today**: `model Gift`; the subject is `ownerId` and the proposer is
  `createdById`, which is **nullable**, so "is this a Suggestion?" has three states rather
  than two. There is a dead `image` column and a dead `published` one: nothing in the repo
  reads or writes either. Visibility is **not** derived — `Gift.wishlists` pins each row
  to the Families its subject belonged to at the moment it was added, so it is a snapshot
  rather than a rule. It goes stale in both directions: a Family joined later never sees
  the Wish, and a Family the subject has **left** sees it forever.

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
and only the participants are plural. Keeping the Claim singular keeps unclaiming mean
"I am out" rather than ambiguously "it is available again".

A Claim is **a term with no table**, like [Wishlist](#wishlist). Stripped down it has no
field of its own — no name, no state, no date any reader consumes — so it is exactly *the
set of people committed to a Wish*, and the model that holds it is a **`Claimer`**: one
row per person, keyed by the Wish and the claimer together. Written that way, "at most one
Claim per Wish" stops being a constraint to enforce and becomes a thing the schema cannot
express, which is the same move that binds an [Exchange](#exchange) to one
[Family](#family).

**The row is named `Claimer` and the word does the work.** A row per person named `Claim`
would say a Wish has several Claims, which is exactly what makes duplicate buying
representable again. Named `Claimer`, the row is a membership edge *in* the one Claim.

**Splitting is headcount.** Several people going in on one thing is several `Claimer`
rows and nothing else — *"Jon started this, 2 others joined"* falls out of the row count
and the order they were created in. No share, no amount, no price on the Wish: the moment
the schema knows an amount it owes an answer about whether the money arrived, and it has
no way to know. Settlement happens where it already happens, in the group chat.

**Quantity makes a Claim partial.** A Wish may be wanted several times over — five pairs
of socks — and a claimer may speak for some of them, so "is this taken?" is
`SUM(claimers.quantity) >= wish.quantity` rather than a fact. That is a count a reader has
to interpret, and it is accepted deliberately: what matters is that there is **one Claim
and no duplicate buying**, and the singular thing is the *claim*, not the *count*. It is
affordable because claim state has left the `where` clause (below), and the sum can be
arithmetic over rows already in hand instead of a `SUM` comparison Prisma cannot express.

Claimers can see each other, because they cannot coordinate otherwise. The subject sees
nothing, ever. Everyone else who can see the Wish sees only **that** it is claimed, and
by how many — which is a widening, since today a claimed Wish disappears from their view
entirely, and a Claim nobody can see is a Claim nobody can join.

That widening moves where the secret is kept. No query filters on claim state any more,
because there is nowhere for such a filter to go: a subject sees their own list, so
removing a claimed Wish from it would make the row **vanish**, and absence is a louder
signal than a badge. So Surprise is not defensible by a `where` clause and becomes a
property of `lib/db/projections.ts` — see [Surprise](#surprise).

- **Grounded**: the vocabulary is already the app's own — `claimGift`, `unclaimGift`,
  the `/claimed` route, "Claimed Gifts" in the UI. The two facts already coexist on one
  row with different owners and opposite visibility. **Splitting and quantity are wanted
  by the owner**, which makes them the only entries in this glossary asked for rather than
  charted.
- **Anticipated**: that several claimers are wanted at all — nothing in the app expresses
  chipping in today ([#152](https://github.com/jonpulsifer/wishlist/issues/152)) — and the
  shape of the row ([#161](https://github.com/jonpulsifer/wishlist/issues/161)).
- **Rejected**: several Claims against one Wish — it makes duplicate buying representable
  again, which is the thing claiming exists to prevent. A `Claim` table with claimers
  hanging off it — two tables, and the Claim row outlives its last claimer, so "claimed"
  and "has a claim row" drift apart. An implicit many-to-many — the cheapest schema of the
  three, but Prisma names the table `_WishToUser` with columns `A` and `B`, and it cannot
  carry the timestamp that orders a split. `Claimer.share` — enough structure to look like
  it is tracking something, not enough to be right. A price on the Wish and an amount on
  the claimer — half the live Wishes are links with no price, prices go stale, and a
  wishlist that knows a debt it cannot collect has become a payments app.
- **Schema today**: the `claimed` boolean and `claimedById` on `model Gift` — one claimer,
  and the boolean is redundant with the id, kept in step by hand in both actions. A
  claimed Wish is **removed** from every other viewer rather than badged: rule 2 of
  `lib/db/visibility.ts` is `claimed: false OR claimedById: viewer OR createdById: viewer`,
  so the row is simply not returned, and there is no way for one claimer to discover
  another. Nothing expresses quantity: a Wish is wanted once and claimed once.

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
  [#151](https://github.com/jonpulsifer/wishlist/issues/151) removed occasion as a way to
  tell two apart, and [#157](https://github.com/jonpulsifer/wishlist/issues/157) removed
  audience: who sees a Wish follows from which [Families](#family) its subject is in, so
  showing different things to different people is joining a different Family rather than
  keeping a second list. Decided in
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
the subject. **Every Wish records a proposer**, so the state is exactly
`proposerId != subjectId`, with no third case for a reader to forget: a Wish nobody else
proposed names its own subject rather than naming nobody.

Typing someone's list in **for** them is therefore not a Suggestion, and the difference is
not cosmetic. Someone who cannot work the app — the grandmother, or a person who has not
signed in yet — needs Wishes that land on *their* [Wishlist](#wishlist), which means the
proposer recorded is the subject, not whoever held the keyboard. Suggest instead and they
can never see their own list.

A subject may **decline Suggestions**: one setting on their [User](#user), on or off for
everyone who can see them, defaulting to accepting. It is the only thing anyone declares
about how they are interacted with; the three levels and four dimensions it collapsed from
are recorded under [Terms this project does not use](#terms-this-project-does-not-use).
Declaring is the only enforcement available, because [Surprise](#surprise) means the
subject can never observe a Suggestion being made and so can never object to one socially.
The setting gates the **write**: it is a check on the adding, never a `where` clause, so
`lib/db/visibility.ts` is not involved.

- **Grounded**: the behaviour exists. `lib/db/visibility.ts` narrows a viewer looking
  at their own list to `createdById: viewerId`, so a Wish added for you is already
  hidden from you.
- **Anticipated**: the name, adoption, and declining. Decided in
  [#156](https://github.com/jonpulsifer/wishlist/issues/156) and
  [#157](https://github.com/jonpulsifer/wishlist/issues/157). Declining is
  **defined and deliberately not built** — no column, no toggle, no reader, and nobody
  has asked for it. It is additive when it lands (a `Boolean` with a default, which
  `db push` applies without data loss and which does not break first sign-in), so it
  waits on nothing.
- **Rejected**: a separate `Suggestion` model — it would force a [Claim](#claim) to
  point at either kind, splitting 600+ rows across two tables to express one rule.
  Declining *per Wish* or *per Family* — the finer grains buy nothing a single answer
  does not, and each costs a row or a join table over live data.
- **Schema today**: `Gift.createdById` differing from `Gift.ownerId`. The rule is
  hand-written as a branch in `visibility.ts` rather than named. Nothing gates the adding
  at all: `addGift` takes `recipientId` from the client and never asks whether the viewer
  may see that person, so today anyone holding a uuid can suggest for a stranger
  ([#182](https://github.com/jonpulsifer/wishlist/issues/182)). There is also no way to
  add a Wish *as* someone: `addGift` always records the viewer as creator, so helping
  another person fill their list produces Suggestions they will never see
  ([#190](https://github.com/jonpulsifer/wishlist/issues/190)).

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

**Surprise cannot be defended by a `where` clause, and this is forced rather than
chosen.** A subject sees their own list, so filtering a claimed Wish out of it would make
the row *disappear* — and a Wish vanishing from your own list is a louder signal than a
badge saying someone has it. Absence is itself the leak. So the half of Surprise that
concerns [Claims](#claim) lives in `lib/db/projections.ts`: a subject's payload must not
carry claim state **at all**, rather than carrying it set to a safe value. The half that
concerns [Suggestions](#suggestion) stays in `lib/db/visibility.ts`, where a person's own
view is the Wishes they proposed.

That makes the projection load-bearing rather than tidy, which is why
[#179](https://github.com/jonpulsifer/wishlist/issues/179) is not a small bug.

- **Grounded**: the behaviour, all of it. A Wish added for you is hidden from you, and you
  are never told a Claim exists.
- **Anticipated**: that surprise needs no mechanism once
  [#149](https://github.com/jonpulsifer/wishlist/issues/149) and
  [#156](https://github.com/jonpulsifer/wishlist/issues/156) land. Decided in
  [#152](https://github.com/jonpulsifer/wishlist/issues/152); the move into the projection
  in [#161](https://github.com/jonpulsifer/wishlist/issues/161).
- **Rejected**: one name for the four flags on `Gift` collectively — `published`,
  `archived`, `claimed` and proposer-≠-subject are three unrelated things and one dead
  column, so any collective name would assert a coherence the row does not have.
- **Schema today**: nothing holds this. It is restored after the fact by rules 2 and 5 of
  `lib/db/visibility.ts` — a claim filter, and an own-profile branch narrowing to
  `createdById: viewerId`. The own-profile branch does **not** filter claims, and cannot:
  a claimed Wish removed from your own list is a hole where a row used to be. So `claimed`
  reaches the subject's own browser through `giftRowSelect`, and surprise holds there only
  because no component reads the field
  ([#179](https://github.com/jonpulsifer/wishlist/issues/179)).

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
  same person ([#178](https://github.com/jonpulsifer/wishlist/issues/178)).

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

Membership is **mutual**: you see everyone who can see you. There is no way to be seen
without seeing, so a Family cannot express a one-directional view.

Membership is a **row of its own** — a `Membership` naming the Family, the person and when
they joined — rather than an anonymous link between the two. It is the app's only
visibility edge, so it is worth being able to read at a database prompt and worth knowing
the date of; and writing it explicitly is what keeps a migration from silently inverting
every membership in the app, which an implicit join table invites by naming its columns
`A` and `B` in an order that changes when the models are renamed.

The word is chosen for what the app is actually for — helping big families track the
wants of their peeps. A friend group or a set of coworkers is modelled as a Family too,
and that is the one place the word is a stretch — though not only in the word. Mutual and
unremovable together mean showing one coworker a list costs a permanent two-way
membership carrying addresses and sizes, which is why
[#158](https://github.com/jonpulsifer/wishlist/issues/158) leaves that case unserved
rather than opening a way around the boundary.

**Nobody runs a Family.** There is no owner, no organiser and no per-Family role: every
member may do everything a Family affords — create an [Invite](#invite), add someone by
email, leave. What no member may do is act on another. **There is no way to remove
anyone**, so membership is a one-way ratchet and following an Invite is the only
irreversible act in the model, which is why an Invite admits exactly one person. Nobody
deletes a Family either: the last member leaving deletes it, so an empty Family is a
consequence rather than a decision, and no one can dissolve a Family out from under the
people still in it.

- **Grounded**: the concept, the many-to-many membership and its role as the single
  visibility edge all exist today. So does its mutuality — `visiblePeopleWhere` is a
  single `some → some`, which has no way to express seen-without-seeing. So does the
  absence of any way to remove a member — `leaveWishlist` only ever disconnects the
  viewer — though today that is an omission rather than a decision.
- **Anticipated**: the name, flatness as a decision rather than an accident, names ceasing
  to be unique ([#150](https://github.com/jonpulsifer/wishlist/issues/150)), and Families
  being invisible rather than merely closed
  ([#153](https://github.com/jonpulsifer/wishlist/issues/153)). Nobody running one, the
  ratchet, and deletion by last exit
  ([#160](https://github.com/jonpulsifer/wishlist/issues/160)).
- **Rejected**: `Circle` and `Group` — neutral enough to fit coworkers, but they name a
  shape rather than a thing, and the coworkers case is speculative while the family case
  is the product. Nesting — overlapping membership already expresses every subset, and
  making the one remaining visibility rule recursive would be felt everywhere. Ejection,
  in every form offered: symmetric removal, removal by whoever admitted you, and a
  per-Family owner holding it. Ejection destroys nothing and is undone by a new Invite,
  so it is cheap — but each form buys a remedy for a forwarded link at the price of a
  hierarchy, a stored `admittedById`, or an owner, and the narrower Invite closes the
  same hole without any of them. One-directional visibility — a Family that some people
  see into without being seen. It is the second axis on `lib/db/visibility.ts` that
  per-Family roles were rejected for, wearing a different hat
  ([#158](https://github.com/jonpulsifer/wishlist/issues/158)).
- **Schema today**: `model Wishlist`. Its `name` is globally `@unique`, its `password`
  is a plaintext pin, and it has no owner column — which
  [#160](https://github.com/jonpulsifer/wishlist/issues/160) makes deliberate.
  `deleteWishlistAdmin` hard-deletes one behind `manage:wishlists`, and after
  [#156](https://github.com/jonpulsifer/wishlist/issues/156) that destroys no
  [Wish](#wish) — a Family owns nothing but its membership edges and its Invites. There
  *is* a directory:
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

**A provisional User may be deleted**, by any member who can see them. This is the undo
for that mistyped address, and it is not an ejection: a row nobody has claimed is not yet
a person, and showing a typo to a Family that has no way to fix it would be theatre. The
carve-out closes itself, because the boundary is the same derived one — the moment they
sign in an Account exists, they are a member like anyone else, and
[Family](#family) membership admits no removal at all.

- **Grounded**: `model User` is this already, and `allowDangerousEmailAccountLinking` is
  on, so an accountless User links correctly when that person later signs in with
  Google.
- **Anticipated**: that a person who will never sign in needs nothing more than this, and
  that provisional stays derived. Nothing creates such a row today — every User comes from
  the Auth.js adapter — and the flow that would is the push half of
  [#153](https://github.com/jonpulsifer/wishlist/issues/153). Deletion while provisional
  ([#160](https://github.com/jonpulsifer/wishlist/issues/160)), which has nothing to
  delete until that flow exists.
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
messages.

An Invite is **single-use**, revocable, and expires. It carries the model's whole weight:
membership cannot be undone, so following an Invite is the only irreversible act anyone
performs, and a link handed out by every member had better admit exactly the person it was
sent to. Spent, it is dead — a forwarded link does nothing, and one forwarded before it is
used costs a single wrong member rather than a group chat's worth. The bulk case it gives
up is served better by push, below, which is reversible while those people remain
provisional.

An Invite grants **join**, and join is the only grant there is. No link shows someone a
Wishlist without making them a member —
[#158](https://github.com/jonpulsifer/wishlist/issues/158) went looking for one and found
a [Family](#family) instead. See *Share link* under
[Terms this project does not use](#terms-this-project-does-not-use).

Single-use is recorded on the token itself — when it was redeemed and by whom — against a
token that today records neither. Expiry is the column that already exists and that
nothing writes; it stops being optional, because an Invite that never expires is a
standing grant of the one irreversible act in the model.

An Invite is **unaddressed** — a bearer link, naming no recipient, so whoever holds it
joins. Binding it to an email is dominated by push, below: it demands the same thing you
would already have to know, then waits for a click that push does not wait for, and gives
up push's undo to do it. It also fails Grandma in the one way she cannot talk her way out
of — she signs in with the address you did not type, and the link refuses her. So the
split is by what the sender knows: push when you have their email, an Invite when you do
not.

Joining also has a **push** direction, which needs no Invite: a member adds someone by
email, creating a provisional [User](#user) who is in the Family at once. That person has
a [Wishlist](#wishlist) and can be given [Suggestions](#suggestion) before they have heard
of the app, and their first Google sign-in adopts the row that is already waiting. This is
the half of joining that has no mechanism at all today.

Push is the one act that has to **speak out of the app**, and it is the only one. A person
who has not heard of wishin.app has no screen to be told on, so the email that says *so-and-so
added you, here is the app* is not the best way they find out but the only way, and without
it push is a feature that silently does nothing.

That message is **written for the stranger**, not for the member it is aimed at. The address
is typed by a member and
[#153](https://github.com/jonpulsifer/wishlist/issues/153) accepts mistyping — detection
over prevention — which held while a mistake stayed inside the app; an email leaves and
cannot be recalled. So the message carries the **sender's name**, the app and a sign-in
link, and nothing else. It never names the [Family](#family), which is the one place a
non-member could otherwise learn one exists; it never lists
[Wishes](#wish), because [Suggestions](#suggestion) are the thing their subject may not
see, and an email of them would break [Surprise](#surprise) before first sign-in; it never
lists members. What is left is the sender's name, which is the whole of why it reads as an
invitation rather than as spam. What may cross into it belongs with
`lib/db/projections.ts` — the seam is outbound and irrevocable rather than merely
serialised, so it is declared as a shape and not assembled as a template.

- **Grounded**: the token, its revocation, the cookie that carries it through sign-in, and
  the join-on-click route all exist and work.
- **Anticipated**: that an Invite is the only door, that any member may create one, and
  the push direction entirely. Decided in
  [#153](https://github.com/jonpulsifer/wishlist/issues/153).
  [#160](https://github.com/jonpulsifer/wishlist/issues/160) confirms who may create one —
  nobody runs a Family, so there is no narrower answer available — and makes it
  single-use. That an unaddressed token is the deliberate shape rather than the
  unfinished one is [#158](https://github.com/jonpulsifer/wishlist/issues/158). The
  message push sends is anticipated in every part — there is no mail dependency, no
  sender and nothing that writes one
  ([#159](https://github.com/jonpulsifer/wishlist/issues/159)).
- **Rejected**: a shared pin. It is not a second mechanism but a worse Invite — a bearer
  secret that grants membership, four digits long, shared, permanent, reusable, stored in
  plaintext and guessable in ten thousand tries. Joining by email domain — a Family is not
  a domain, and that is a corporate-SSO idea wearing a festive hat. A multi-use link with
  a mandatory expiry — it keeps the paste-into-the-family-chat flow and bounds only how
  long the risk lasts, not how many people it admits, which is the wrong half of the
  problem once nobody can be removed. Addressing the token — binding it to an email at
  creation and refusing a Google account that does not match; it removes the wrong-contact
  failure entirely, but only where push already applies, and trades a recoverable mistake
  for one Grandma cannot recover from. Redemption behind the inviter's approval, which
  restores an undo before the irreversible step by giving up the finding that the link
  *is* the consent.
- **Schema today**: `model WishlistInvite`, reachable only by an admin —
  `createWishlistInviteAdmin` requires `manage:wishlists`, as does creating a Family at
  all, so no ordinary member can invite anyone or start a family. A token is multi-use:
  `app/invite/[token]/route.ts` records nothing about redemption, so one link admits
  everyone who follows it, and only one is active per Family because creating one revokes
  the previous. `expiresAt` exists and nothing ever writes it, so invites do not expire.
  The pin path (`joinWishlist`) is unthrottled and compares in plaintext.

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

An Exchange is held **for one [Family](#family)**, and its participants are a subset of
that Family's members — so opting out is simply not being picked. The bound is not
bookkeeping: it is what keeps a santa able to see their recipient's [Wishes](#wish). A
Family is the only visibility edge there is, so participants drawn from two of them could
be paired into an obligation the visibility rules make impossible to fulfil. Bounding the
Exchange makes that unrepresentable rather than merely unlikely, and it is why an Exchange
grants no visibility of its own.

**Exclusions belong to the people in them, not to the Exchange.** Either party may say
they should never be matched with the other; it binds both ways, and it is visible to
those two and to no one else — not to the [Organiser](#organiser), who therefore runs a
Draw shaped by constraints they cannot inspect or override.

- **Grounded**: the container, its explicit participants and its undrawn state all
  exist. So do exclusions, already global and already symmetric — creating one connects
  both directions.
- **Anticipated**: the name, the [Occasion](#occasion) row a year would become, and the
  Family bound and exclusion ownership
  ([#160](https://github.com/jonpulsifer/wishlist/issues/160)).
- **Rejected**: bounding participants by what the Organiser can see and teaching the Draw
  to avoid unseeable pairs — it turns an impossible state into a runtime failure, and can
  strand a participant nobody may be matched with. An Exchange that grants visibility for
  its duration — it would buy cross-Family exchanges at the cost of the second visibility
  edge [#150](https://github.com/jonpulsifer/wishlist/issues/150) declined. Per-Exchange
  exclusions, and exclusions the Organiser sets — the first contradicts
  [#152](https://github.com/jonpulsifer/wishlist/issues/152)'s finding that they are
  permanent, and the second puts the shape of a draw in the hands of someone in it.
- **Schema today**: `model SecretSantaEvent`, carrying the `year` it is held for and no
  Family at all. `lib/season.ts` owns the reading of the year: `occasionYearOf` falls a
  null back to `createdAt`, and the Occasion in play turns over on April 1st rather than
  New Year, so an Exchange opened on January 2nd is for the Christmas just gone. That
  fallback exists only because `year` is nullable, and `year` is nullable only because
  there were no migrations to backfill it with — so both retire together
  ([#161](https://github.com/jonpulsifer/wishlist/issues/161)). Because no Exchange
  records a Family, whether every past Exchange's participants still share one is
  **unknown**; where they do not, a santa cannot see the Wishes of the person they were
  assigned, and the backfill is what would reveal it. Exclusions are the
  `secretSantaDoNotMatchWith` self-relation on `User`, created and deleted only behind
  `manage:secret-santa`, so today they are an administrator's setting rather than the
  subject's — and `/admin/secret-santa` is the only place in the app one can be made.

## Organiser

The person who opened an [Exchange](#exchange) — and the only authority in the app.

An Organiser holds every act on the one Exchange they opened: picking its participants
from the [Family](#family) it is held for, firing the [Draw](#draw), and deleting it.
Nothing else and nowhere else. Organising one Exchange confers nothing over another, over
a Family, or over a person, so this is ownership of an object rather than a rank someone
holds.

Being an Organiser is one of exactly **three** things anyone is: the Organiser of an
Exchange, the **subject** of a Wish, or a **member** of a Family. Those three predicates
are the whole of who may act on what, and they live in `lib/db/authority.ts` — a sibling
to `lib/db/visibility.ts`, the same shape and the other question. `visibility.ts` answers
*what may this viewer see*; `authority.ts` answers *what may this viewer act on*. Both
return Prisma `where` builders, so a row the viewer may not act on is never loaded, rather
than being loaded and then judged.

The Organiser is the creator and **cannot be changed**: no transfer, no co-organisers, no
succession. An Exchange lives for one [Occasion](#occasion), which is short enough that an
abandoned one is cheaper to ignore than to inherit — a drawn Exchange is history nobody
should be editing, and an undrawn one is a stale row the next Occasion's Exchange
replaces. Someone who wants to help runs their own Exchange; that is the whole answer to
co-organising, and it is why nobody needed a per-Family role to get it.

- **Grounded**: half of it, unnamed. `app/_actions/secret-santa.ts:68` already restricts
  the Draw to `event.createdById` — per-object ownership, hand-written against one action
  and known to no shared module.
- **Anticipated**: the word, and the other acts gathering under it
  ([#160](https://github.com/jonpulsifer/wishlist/issues/160)).
- **Rejected**: co-organisers and transfer — they buy succession for an object that
  outlives nothing. Authority following participation, so that any participant may run the
  Exchange — the Draw is irreversible once assignments are written, and any of thirty
  people could fire it early. An instance administrator keeping the destructive acts as a
  backstop for an abandoned Exchange, which was the last job anything global had.
- **Schema today**: `SecretSantaEvent.createdById`. The acts are split against it rather
  than gathered: the creator may run the Draw but not delete the Exchange, while
  `manage:secret-santa` may delete one it has nothing to do with. Opening an Exchange is
  gated by nothing at all, and its participant list is never checked against what the
  viewer may see ([#185](https://github.com/jonpulsifer/wishlist/issues/185)).

## Draw

The act of assigning who gives to whom within an [Exchange](#exchange).

A Draw is not a thing people join — that is the Exchange. It is the moment pairings are
made, and it is reproducible: `lib/secret-santa/draw.ts` takes its randomness as a
parameter.

The [Organiser](#organiser) fires it, once. It consumes exclusions belonging to the
participants rather than to the Organiser, so the person running a Draw cannot see every
constraint shaping it.

- **Grounded**: entirely, including who fires it — `drawAssignments`, `DrawInput`,
  `DrawResult` and the tests already use this word for exactly this meaning, and
  `assignSecretSantaParticipants` already refuses anyone but the creator and refuses a
  second run.
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
- **Interaction policy** — investigated by
  [#157](https://github.com/jonpulsifer/wishlist/issues/157) and retired as a name,
  because the thing it named turned out not to exist. Three levels were proposed and one
  survived: a [Wishlist](#wishlist) is a view with one per person, so a setting on it is a
  setting on the [User](#user), and no case was found for a [Family](#family) that forbids
  anything. Four dimensions were proposed and one survived: *who may see* is already
  answered by which Families you belong to, *who may claim* contradicts the receivable
  boundary that makes a [Wish](#wish) a Wish, and all three arms of *who may see that I
  claimed* were forced by [#152](https://github.com/jonpulsifer/wishlist/issues/152).
  What is left is one boolean — declining [Suggestions](#suggestion), above. There is no
  composition, no precedence and no most-restrictive-wins rule, so there is no policy, and
  a name promising that machinery would assert a shape the domain does not have.
- **Admin** / **Role** / **Capability** — retired by
  [#160](https://github.com/jonpulsifer/wishlist/issues/160). **There are no admins.**
  Every act belongs to a member of a [Family](#family), to the subject it is about, or to
  the [Organiser](#organiser) of one [Exchange](#exchange) — and none of those is granted
  to anyone, so there is nothing for a role to hold. The four capabilities emptied out
  one by one: creating a Family and inviting to one became member acts
  ([#153](https://github.com/jonpulsifer/wishlist/issues/153)), the pin and the directory
  were deleted with them, deleting a Family became a consequence of the last member
  leaving, and every Secret Santa act went to the Organiser or to the participants
  themselves — leaving `manage:roles`, whose sole remaining power was granting
  `manage:roles`.

  The second argument is sharper than the tally. A Family you are not in is *invisible*,
  not merely closed, so an instance administrator could not inspect one without a bypass
  that reads straight through the disclosure boundary — every member's address and sizes.
  The power such a role would need is precisely the one the model is built to deny.

  Per-**Family** roles were rejected too, and first: scoping capabilities would have
  added an axis to `lib/db/visibility.ts` that is not membership, to express acts that
  turned out not to need permission. Authority stays a property of objects and of
  subjects, never of people.
- **Notification** — retired by
  [#159](https://github.com/jonpulsifer/wishlist/issues/159), which found one message
  where it expected a system. The only thing that must speak out of the app is the email
  push sends, because a provisional [User](#user) has no screen to be told on — see
  [Invite](#invite). One message is not a notification system, and the name promises
  events, subscribers, an inbox and preferences that nothing here has.

  The name is worth refusing rather than merely leaving unused. Every disclosure in this
  app is a **pull**: a query whose `where` clause is composed from `lib/db/visibility.ts`,
  which is what defends it. A notification is a **push** — it leaves unbidden, carrying
  content, with no query in the path and so nothing defending it. A general channel is by
  construction the thing that reads around the one safeguard, and naming the category is
  how the channel gets built. One message can be read end to end and shown to be safe.

  [Surprise](#surprise) never became the hard part, though the ticket expected it to.
  It is an invariant rather than a rule, so *someone claimed your Wish* is not a message
  that must be suppressed but one with no way to exist.
- **Engagement mail** — goes with the above, and is the alternative it was weighed
  against: telling a Family that a [Wish](#wish) was added, that an
  [Occasion](#occasion) is near, that a [Draw](#draw) is done. It is the half with an
  audience to decide and therefore the half that would need the channel. Nobody has yet
  failed to use the app for want of an email, and it is opened in December regardless, so
  it stays unbuilt and unnamed.
- **Price** / **contribution** / **share** — never introduced, by
  [#161](https://github.com/jonpulsifer/wishlist/issues/161). Splitting is real and
  wanted, but it is **headcount**: the [Claimers](#claim) on a [Wish](#wish), and nothing
  about money. A price on a Wish goes stale and is absent from half the live rows, which
  are links; an amount on a claimer makes the app know a debt it has no way to collect or
  confirm, so it would owe an answer it cannot give. The people going in on a bike are in
  the same [Family](#family) and already in the same group chat. The app's job is to stop
  the second bike being bought, and a count does that completely.
- **Share link** — retired by
  [#158](https://github.com/jonpulsifer/wishlist/issues/158), which went looking for a
  view-granting bearer token and found a [Family](#family). The case it was for —
  coworkers, a friend group — is one: a Family is *the people who can see each other's
  Wishes*, people belong to as many as they like, and
  [#153](https://github.com/jonpulsifer/wishlist/issues/153) made creating one and
  inviting to it member acts, so there is no friction left to route around. The only case
  a Family cannot express needs a viewer with **no account**, and that was disclaimed at
  the outset: everyone signs in with Google.

  The link would have cost a second axis in `lib/db/visibility.ts` that is not
  membership — the one per-Family roles were rejected for — and it buys nothing to offset
  that, because a screenshot forwards exactly as well as a link. *Show someone my list* is
  served out of band, by copying or printing a list, which grants nothing and so needs no
  revoking; nothing in the app does that today.

  What no rejection serves is the coworker you are unwilling to hand a permanent, mutual
  [Family](#family) membership. That is the ratchet's price — see Family, above — and
  #158 is the third ticket to lean on it.
- **Godmode** — goes with the above. It is instance-wide superuser, and after
  [#160](https://github.com/jonpulsifer/wishlist/issues/160) the instance has nothing to
  administer: the last job on offer was deleting an [Exchange](#exchange) whose
  [Organiser](#organiser) has left, and a stranded Exchange is inert rather than a
  problem.

  **There is no operator work either.** Every act that a role holds today becomes a
  button owned by the person the act is about — exclusions on your own profile, creating a
  Family and inviting to it by any member, the [Draw](#draw) and the deletion by the
  [Organiser](#organiser), deletion of a Family by the last member leaving. The count goes
  *up*, and none of them sits behind a capability check. Retiring roles and wanting
  buttons rather than a database prompt are the same answer, not opposite ones
  ([#161](https://github.com/jonpulsifer/wishlist/issues/161)).
