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
carries a name and, optionally, a link, a description and an image. It belongs to the
person who wants it, but it need not have been **added** by them — anyone who can see
someone may add a Wish on their behalf, which is what makes surprises possible.

- **Grounded**: the fields, the optionality, and the adder-is-not-always-the-owner rule
  all exist today.
- **Anticipated**: that no discriminator is ever needed. Decided in
  [#149](https://github.com/jonpulsifer/wishlist/issues/149) on the grounds that
  "receivable" is exactly the boundary that keeps Claim meaningful.
- **Rejected**: `Gift` — too specific, and it names the giving rather than the wanting.
  `Want` — no natural collection noun. `Item` — carries no meaning.
- **Schema today**: `model Gift`.

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

---

## Terms this project does not use

- **Gift** — retired from the model layer by
  [#149](https://github.com/jonpulsifer/wishlist/issues/149). It survives in UI copy
  where it reads naturally ("Add a gift"), but no model, query or type is named for it.
  It was deliberately **not** reused for Claim, despite fitting: every existing `Gift`
  row becomes a Wish, so keeping the word would silently move its meaning across ~60
  call sites.
