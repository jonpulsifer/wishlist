# 5. An Invite is the only door into a Family

Date: 2026-08-02
Status: Accepted

## Context

There are two ways into a Family today and neither works. `WishlistInvite`
exists, and its token, revocation, sign-in cookie and join-on-click route all
work — but creating one requires `manage:wishlists`, so no ordinary member can
invite anyone. The path that *is* reachable is a four-digit plaintext pin on the
Family, typed from a global directory that lists every Family by name to every
signed-in user.

## Context that constrains it

[ADR-0001](0001-family-is-the-only-visibility-boundary.md) makes membership a
one-way ratchet. Following an Invite is therefore **the only irreversible act
anyone performs in this app**, which is what prices everything below.

## Decision

**An [Invite](../../CONTEXT.md#invite) is the only way in, and following one is
the whole of joining** — the link *is* the consent, so there is no secret to
type, no approval queue and no confirmation screen.

**Any member may create one.** A family whose members cannot invite anyone grows
only as fast as its admin answers messages.

An Invite is **single-use**, revocable, and expires. Spent, it is dead: a
forwarded link does nothing, and one forwarded before it is used costs a single
wrong member rather than a group chat's worth.

It is **unaddressed** — a bearer link naming no recipient.

Joining also has a **push** direction, which needs no Invite: a member adds
someone by email, creating a provisional [User](../../CONTEXT.md#user) who is in
the Family at once, with a Wishlist people can fill before she has heard of the
app. **Provisional is derived from the absence of an Account, never stored.**

So the split is by what the sender knows: **push when you have their email, an
Invite when you do not.**

## Consequences

`Wishlist.password` is deleted and the global directory goes with it. Together
with ADR-0001 that makes a Family you are not in *invisible* rather than merely
closed.

**Push is the one act that must speak out of the app**, and it is the only one.
A person who has not heard of wishin.app has no screen to be told on, so the
email is not the best way they find out but the only way — without it, push
silently does nothing.

Mistyping an address is accepted: detection over prevention. Provisional users
are **shown** wherever people are listed, and may be deleted by any member who
can see them, which is the undo. That carve-out closes itself — the moment they
sign in an Account exists and Family membership admits no removal at all.

**A provisional User's list must not fill with Suggestions.** Wishes typed in on
someone's behalf record the subject as proposer, or that person signs in to an
empty list ([#190](https://github.com/jonpulsifer/wishlist/issues/190)).

## Grounded and anticipated

**Grounded**: the token, its revocation, the cookie that carries it through
sign-in, and the join-on-click route all exist and work. The pin, the directory
and the admin gate are all real and all live
([#181](https://github.com/jonpulsifer/wishlist/issues/181)).

**Anticipated**: that an Invite is the only door, that any member may create one,
single-use, and the push direction entirely — nothing calls `user.create` today.

## Options closed

A shared pin. It is not a second mechanism but a worse Invite: a bearer secret
granting membership, four digits long, shared, permanent, reusable, stored in
plaintext and guessable in ten thousand tries.

A multi-use link with a mandatory expiry — it bounds how long the risk lasts
rather than how many people it admits, which is the wrong half of the problem
once nobody can be removed.

Addressing the token, binding it to an email at creation. It removes the
wrong-contact failure entirely, but only where push already applies, and it
fails Grandma in the one way she cannot talk her way out of — she signs in with
the address you did not type, and the link refuses her.

Redemption behind the inviter's approval, which restores an undo before the
irreversible step by giving up the finding that the link *is* the consent.
Joining by email domain, which is a corporate-SSO idea wearing a festive hat.

Decided in [#153](https://github.com/jonpulsifer/wishlist/issues/153),
[#158](https://github.com/jonpulsifer/wishlist/issues/158),
[#159](https://github.com/jonpulsifer/wishlist/issues/159) and
[#160](https://github.com/jonpulsifer/wishlist/issues/160).
