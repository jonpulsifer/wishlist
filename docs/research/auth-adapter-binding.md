# What `@auth/prisma-adapter` 2.11.3 binds about `User` / `Account` / `Session` / `VerificationToken`

Research for [#154](https://github.com/jonpulsifer/wishlist/issues/154) (part of #148). Branch
`research/auth-adapter-binding`.

Versions this was verified against, from `package.json`: `@auth/prisma-adapter` 2.11.3,
`next-auth` 5.0.0-beta.32, `@prisma/client` / `prisma` 6.19.3. The adapter depends on
`@auth/core` 0.41.3, and `next-auth@5.0.0-beta.32` depends on the *same* `@auth/core` 0.41.3
(`node_modules/@auth/prisma-adapter/package.json`, `node_modules/next-auth/package.json`).

The installed adapter source at
`node_modules/@auth/prisma-adapter/src/index.ts` is **byte-identical** to
[`packages/adapter-prisma/src/index.ts` at tag `@auth/prisma-adapter@2.11.3`](https://github.com/nextauthjs/next-auth/blob/%40auth%2Fprisma-adapter%402.11.3/packages/adapter-prisma/src/index.ts)
(verified by `diff`), so line references below apply to both.

---

## Answer in one line

**`User` cannot be renamed while keeping `PrismaAdapter(prisma)` as-is** — the adapter hard-codes
the Prisma Client property `p.user`, and that property is generated from the *model* name, which
`@@map` does not change. The table can be renamed freely; the model cannot. The escape hatch is
one small alias object (~6 lines) or a hand-written adapter, and there is no supported
configuration option in between.

---

## 1. Exactly what the adapter binds

The whole adapter is 134 lines. It takes one argument — a Prisma Client — and immediately casts it:

```ts
// node_modules/@auth/prisma-adapter/src/index.ts:26-29
export function PrismaAdapter(
  prisma: PrismaClient | ReturnType<PrismaClient["$extends"]>
): Adapter {
  const p = prisma as PrismaClient
```

There is **no second options argument** — no model-name map, no table prefix, no field map. The
public type confirms it (`node_modules/@auth/prisma-adapter/index.d.ts`):

```ts
export declare function PrismaAdapter(prisma: PrismaClient | ReturnType<PrismaClient["$extends"]>): Adapter;
```

### Model delegates it touches

Exhaustive — these five, and nothing else on the client (no `$transaction`, no `$connect`):

| Delegate | Required Prisma model name | Used at (`src/index.ts`) |
| --- | --- | --- |
| `p.user` | `User` | 32, 33, 34, 43, 48 |
| `p.account` | `Account` | 36, 50, 52, 102 |
| `p.session` | `Session` | 56, 64, 66, 71 |
| `p.verificationToken` | `VerificationToken` | 73, 82 |
| `p.authenticator` | `Authenticator` | 107, 110, 115, 120 |

This repo has no `Authenticator` model. Confirmed in `prisma/generated/client/index.d.ts`, which
generates `get account()` (198), `get session()` (208), `get user()` (218),
`get verificationToken()` (248) and **no** `get authenticator()`. The four
`create/get/list/updateAuthenticatorCounter` methods would throw
`Cannot read properties of undefined` if called — but they are only reachable from a WebAuthn
provider, and `app/auth.ts:20-33` configures Google only. Not a live defect; it *is* a constraint
if WebAuthn is ever added.

### Field and compound-key names it requires

Read off the `where` clauses, not from docs:

- **User**: `id` (`where: { id }`, lines 33, 44, 48) and `email` must be `@unique`
  (`p.user.findUnique({ where: { email } })`, line 34). Everything else on `User` is written
  through spread, not named.
- **Account**: a compound unique named `provider_providerAccountId` — i.e. a Prisma
  `@@unique([provider, providerAccountId])` or `@@id([provider, providerAccountId])`
  (lines 37, 53). Plus a relation field literally named `user` for `include: { user: true }`
  (line 38). `getAccount` additionally filters on scalar `providerAccountId` and `provider`
  (line 103).
- **Session**: `sessionToken` must be `@unique` (lines 57, 67, 71), and a relation field named
  `user` for `include: { user: true }` (line 58).
- **VerificationToken**: a compound unique named `identifier_token`, i.e.
  `@@unique([identifier, token])` or `@@id([identifier, token])` (line 83).

`prisma/schema.prisma` satisfies all four: `Account` has `@@unique([provider, providerAccountId])`
and a `user` relation, `Session` has `sessionToken String @unique` and a `user` relation,
`VerificationToken` has `@@unique([identifier, token])`, and `User` has `email String @unique`.

The scalar payload shapes come from `@auth/core`
(`node_modules/@auth/core/adapters.d.ts`): `AdapterUser` requires `id: string`,
`email: string`, `emailVerified: Date | null` (171-181); `AdapterSession` requires
`sessionToken`, `userId`, `expires` (202-223); `VerificationToken` requires `identifier`,
`token`, `expires` (232-241). Those names reach Prisma verbatim through the spread in
`stripUndefined` (129-133) — which strips `undefined` but **not** `null`.

### Does any indirection let the model be named something else?

Three candidates, evaluated against primary sources:

**`@@map` / `@map` — no, for the model name; yes, for the table and columns.**
Prisma's own docs are explicit that `@@map` decouples model name from *table* name while the
Client API keeps the model name: "`@map` and `@@map` allow you to tune the shape of your Prisma
Client API by decoupling model and field names from table and column names in the underlying
database"
([Prisma: Models](https://www.prisma.io/docs/orm/prisma-schema/data-model/models)) — the Prisma
Client property still follows the model name (`prisma.comment` for a `Comment` model mapped to
table `comments`). The Auth.js Prisma adapter docs recommend exactly this and say what it does and
does not affect:

> "If mixed `snake_case` and `camelCase` column names is an issue for you and/or your underlying
> database system, we recommend using Prisma's `@map()` feature to change the field names. **This
> won't affect Auth.js**, but will allow you to customize the column names to whichever naming
> convention you prefer."
> — [`docs/pages/getting-started/adapters/prisma.mdx:574-576`](https://github.com/nextauthjs/next-auth/blob/main/docs/pages/getting-started/adapters/prisma.mdx)

The worked example in those docs (lines 583-629) renames every *table*: `@@map("accounts")`,
`@@map("sessions")`, `@@map("users")`, `@@map("verification_tokens")` — while every *model* stays
`Account` / `Session` / `User` / `VerificationToken`. That is the shape of the sanctioned rename.

So: `model User { ... @@map("people") }` works today and costs nothing at the adapter boundary.
`model Person { ... }` does not.

**Adapter overrides — do not exist.** There is no options parameter (see the signature above), and
nothing in `@auth/core`'s `Adapter` interface carries model naming; it is a flat bag of methods
(`node_modules/@auth/core/adapters.d.ts:268+`).

**A wrapper / alias — yes, and it is small.** Because `PrismaAdapter` casts its argument
(`const p = prisma as PrismaClient`, line 29) and only ever reaches the five delegates above, the
argument does not have to be a real `PrismaClient`. An alias object satisfies it:

```ts
const person = { ...prisma, user: prisma.person } as unknown as PrismaClient;
PrismaAdapter(person);
```

This is *not documented* by Auth.js — it is a consequence of the source, so it is only as stable
as the file above. It is exactly the kind of thing a minor adapter release could break (e.g. if a
future method reached for `p.$transaction`). Treat it as a supported-by-inspection hack, pinned to
2.11.3, and cover it with a sign-in test.

The fully supported alternative Auth.js does document is writing the adapter yourself:

> "An Auth.js adapter is a function that receives an ORM/database client and returns an object with
> methods that interact with the database. … You can implement only the methods you need, and only
> create the database tables/columns that are actually going to be used."
> — [Creating a database adapter](https://authjs.dev/guides/creating-a-database-adapter)

For this app's surface — Google OAuth, `strategy: 'database'`, no email provider, no WebAuthn —
that is roughly the ten methods `handle-login.js` destructures: `createUser`, `updateUser`,
`getUser`, `getUserByAccount`, `getUserByEmail`, `linkAccount`, `createSession`,
`getSessionAndUser`, `deleteSession` (`node_modules/@auth/core/lib/actions/callback/handle-login.js:28`),
plus `updateSession` / `deleteSession` for session rotation. The adapter's own implementation of
those is ~50 lines of `src/index.ts`, so a repo-owned copy is a real option, at the price of owning
the upstream drift.

### What a `User` rename actually costs in this repo

- The adapter boundary: 1 line at `app/auth.ts:19` plus either an alias object or an owned adapter.
- 60 `prisma.user.*` call sites across `app/auth.ts`, `lib/db/queries-cached.ts`,
  `app/api/stats/route.ts`, `prisma/seed.ts` (plus 12 via the `db.user.` alias).
- Generated type names: `Prisma.UserSelect`, `Prisma.UserGetPayload` are used in
  `lib/db/projections.ts:21,23,94,96` and would all become `Prisma.PersonSelect` etc.
- Every relation field on the other 8 models that points at `User` (`Gift.owner`, `Gift.claimedBy`,
  `Wishlist.members`, `UserRole.user`, `SecretSantaParticipant.user/assignedTo/assignedBy`,
  `WishlistInvite.createdBy`, the self-relation `SecretSantaExclusions`) — the *type* changes even
  where the field name does not.
- Note `Account.user` and `Session.user` relation field names must survive regardless of the model
  rename, because the adapter's `include: { user: true }` names the field, not the model.

Renaming only the **table** (`@@map`) costs one line of schema and one migration, and zero
application code.

---

## 2. Do new required columns on `User` break first sign-in?

**Yes — a new column that is `NOT NULL` with no default and no Prisma-level default breaks
`createUser` on first sign-in.** The chain:

1. Auth.js normalises the OAuth profile and spreads whatever your `profile()` returned:

   ```js
   // node_modules/@auth/core/lib/actions/callback/oauth/callback.js:216-226
   const userFromProfile = await provider.profile(OAuthProfile, tokens)
   const user = { ...userFromProfile, id: crypto.randomUUID(), email: userFromProfile.email?.toLowerCase() }
   ```

2. On the new-user branch it calls the adapter with exactly that object:

   ```js
   // node_modules/@auth/core/lib/actions/callback/handle-login.js:260
   user = await createUser({ ...profile, emailVerified: null })
   ```

3. The adapter drops `id` and inserts the rest, unmodified:

   ```ts
   // node_modules/@auth/prisma-adapter/src/index.ts:32
   createUser: ({ id, ...data }) => p.user.create(stripUndefined(data)),
   ```

So the insert for this repo's Google provider (`app/auth.ts:25-32`) is exactly
`{ name, email, image, emailVerified: null }`. Any other required scalar must be satisfiable by the
database or Prisma, or `p.user.create` throws and sign-in fails with an adapter error.

Safe ways to add a domain field to `User`:

- **Optional (`String?`)** — always safe; `stripUndefined` simply never sends it.
- **Required with a Prisma `@default(...)`** — safe. This is what `hasCompletedOnboarding
  Boolean @default(false)` already does in `prisma/schema.prisma`, and it is the pattern to copy.
- **Required, value known at sign-in — return it from `profile()`.** This is the documented route:

  > "If the first sign-in is via the OAuth Provider, the default data saved is `id`, `name`,
  > `email` and `image`. **You can add more profile data by returning extra fields in your OAuth
  > provider's `profile()` callback.**"
  > — [`docs/pages/concepts/database-models.mdx`](https://github.com/nextauthjs/next-auth/blob/main/docs/pages/concepts/database-models.mdx)

  and the same page states plainly: *"Each model can be extended with additional fields."* Extra
  keys survive because both hops are spreads (steps 1 and 3 above). The constraint runs the other
  way too: a key returned from `profile()` that is **not** a Prisma field on `User` will make
  `p.user.create` fail with an unknown-argument validation error.

- **Required, value only computable after the row exists — use the `createUser` event.**
  `await events.createUser?.({ user })` fires immediately after
  (`handle-login.js:263`), which is the hook for provisioning related rows (e.g. a default
  `UserRole`) rather than columns.

Upstream tests this: the adapter ships a second schema,
[`prisma/custom.prisma`](https://github.com/nextauthjs/next-auth/blob/%40auth%2Fprisma-adapter%402.11.3/packages/adapter-prisma/prisma/custom.prisma),
whose `User` carries extra `phone String?` and `role String?` fields, run under
`CUSTOM_MODEL=1` by the package's `test:custom` script
(`node_modules/@auth/prisma-adapter/package.json`). Extra *optional* User columns are a covered
case. Extra *required* ones are not, in either schema.

One more constraint visible in that pair of test schemas: the default schema has
`email String @unique` while `custom.prisma` has `email String? @unique`. Nullable email is
tolerated by the adapter, but `AdapterUser.email` is typed `string`
(`adapters.d.ts:175`) — keep `email` required, as this repo already does.

---

## 3. Does `next-auth@5.0.0-beta.32` change any of this?

**No.** Three findings:

- The adapter contract is owned by `@auth/core`, not by `next-auth`. Both resolve to `@auth/core`
  0.41.3 here, so `next-auth` is a framework wrapper over the same `Adapter` interface and the same
  `handle-login.js` quoted above. Nothing in `next-auth`'s own code participates in model naming.
- The v5 migration guide states directly:

  > "NextAuth.js v5 **does not introduce any breaking changes to the database schema**."
  > — [Migrating to v5](https://authjs.dev/getting-started/migrating-to-v5)

  The only schema-adjacent v5 note is that the deprecated OAuth 1.0 fields `oauth_token_secret`
  and `oauth_token` may optionally be dropped — neither is present in `prisma/schema.prisma`. The
  adapter *package scope* changed in v5 (`@next-auth/*-adapter` → `@auth/*-adapter`), which this
  repo already follows.
- **Stable-release story: there isn't one yet.** As of this research, npm dist-tags for
  `next-auth` are `latest: 4.24.15` and `beta: 5.0.0-beta.32` (`npm view next-auth dist-tags`) —
  i.e. 5.0.0-beta.32 is the newest v5 published, v5 has never had a stable release, and `latest`
  still points at v4. `@auth/prisma-adapter` by contrast is `latest: 2.11.3` — the *adapter* is on
  a stable channel even though `next-auth` is not. Practical consequence: pin
  `next-auth` exactly (this repo does), and expect adapter-facing churn to arrive from
  `@auth/core` bumps, not from a v5 GA event that has not been scheduled publicly.

---

## 4. Moving `Account` / `Session` / `VerificationToken` out

All three relocation strategies are unconstrained by the adapter, **as long as the Prisma model
names stay `Account`, `Session`, `VerificationToken`** — same rule as `User`.

- **Table prefix / rename** — free. `@@map("auth_accounts")` etc. See the docs example at
  `prisma.mdx:598,608,620,629`, which does precisely this. The adapter never sees a table name.
- **Separate Postgres schema (namespace)** — supported, and now GA. `multiSchema` was promoted to
  General Availability in **Prisma 6.13.0**
  ([Preview features](https://www.prisma.io/docs/orm/reference/preview-features/client-preview-features));
  this repo is on 6.19.3, so `@@schema("auth")` needs no `previewFeatures` flag. Prisma's docs:
  *"You can query models in multiple database schemas without any change to your Prisma Client
  query syntax"* and *"Multi-schema feature is only supported for PostgreSQL, CockroachDB, and SQL
  Server"* — this repo's datasource is `postgresql`, so it qualifies. Enabling it requires
  `schemas = [...]` on the datasource and an `@@schema` on **every** model (including `User`,
  `Gift`, etc.), plus a migration; that is the real cost, not the adapter.
- **A separate `.prisma` file / separate Prisma Client** — *not* possible without the alias
  wrapper. The adapter receives one client and expects all five delegates on it. Splitting auth
  models into a second generated client means `prisma.user` and `prisma.account` live on different
  objects, and you would have to hand `PrismaAdapter` a merged façade — the same
  `as unknown as PrismaClient` cast described in §1, with the same caveat.
- **Cross-schema relations** are fine in Prisma multi-schema, so `Account.user`/`Session.user`
  relations still work if `User` stays in `public` and the auth tables move to `auth`. The adapter's
  `include: { user: true }` is a Prisma-level join and is unaffected.

One caution independent of the adapter: `VerificationToken` is only used by the Email/magic-link
provider (`createVerificationToken`/`useVerificationToken`, `src/index.ts:72-100`). This repo
configures Google only, so that table is currently dead weight — it can be dropped outright rather
than relocated, at the cost of having to re-add it if an email provider is ever introduced.

---

## Recommendation for #148

1. If the redraw wants a different **table** name for users, use `@@map`. Zero adapter risk, zero
   application code, one migration. This is the documented path.
2. If the redraw wants a different **model** name (`Person`), budget for: the alias-object wrapper
   at `app/auth.ts:19` (~6 lines, pinned to adapter 2.11.3, covered by a first-sign-in test), 60
   `prisma.user.*` call sites, the `Prisma.User*` generated types in `lib/db/projections.ts`, and
   every `User` relation across 8 other models. The adapter itself is the *cheapest* part of that
   bill.
3. Any new required column on `User` must carry a Prisma `@default(...)`, or be returned from the
   Google `profile()` callback in `app/auth.ts`, or be optional. Otherwise first sign-in breaks —
   and it breaks for new users only, so it will pass every local test against a seeded database.

## Sources

Primary only.

- `@auth/prisma-adapter` 2.11.3 source — `node_modules/@auth/prisma-adapter/src/index.ts`
  (`index.d.ts`, `package.json`), verified identical to
  <https://github.com/nextauthjs/next-auth/blob/%40auth%2Fprisma-adapter%402.11.3/packages/adapter-prisma/src/index.ts>
- Adapter test schemas at the same tag — `packages/adapter-prisma/prisma/schema.prisma` and
  `prisma/custom.prisma`, and `test/index.test.ts`
- `@auth/core` 0.41.3 — `node_modules/@auth/core/adapters.d.ts`,
  `lib/actions/callback/handle-login.js`, `lib/actions/callback/oauth/callback.js`
- Auth.js docs (source of truth in the same repo) —
  `docs/pages/getting-started/adapters/prisma.mdx`, `docs/pages/concepts/database-models.mdx`,
  <https://authjs.dev/getting-started/migrating-to-v5>,
  <https://authjs.dev/guides/creating-a-database-adapter>
- Prisma docs — <https://www.prisma.io/docs/orm/prisma-schema/data-model/models>,
  <https://www.prisma.io/docs/orm/prisma-schema/data-model/multi-schema>,
  <https://www.prisma.io/docs/orm/reference/preview-features/client-preview-features>
- npm registry — `npm view next-auth dist-tags`, `npm view @auth/prisma-adapter dist-tags`
- This repo — `app/auth.ts`, `prisma/schema.prisma`, `prisma/generated/client/index.d.ts`,
  `lib/db/projections.ts`, `package.json`
