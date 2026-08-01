# AGENTS.md

A festive wishlist and Secret Santa app. Next.js App Router, React 19, Prisma,
Auth.js (next-auth v5), shadcn/ui, Tailwind v4, deployed on Vercel.

This file is a **router**, not a manual. It holds the rules you must know before
you touch anything, and pointers to where the depth lives. Depth lives in
`.agents/skills/` and in the modules themselves — several of them carry a header
comment explaining what they exist to prevent.

## Hard rules

Read these before your first edit. They are prohibitions — routing you to them
after the fact is too late. Every one exists because the opposite shipped.

- **Never hand-write a visibility `where` clause.** "Which gifts or people may
  this viewer see" lives in `lib/db/visibility.ts`. Compose from its builders.
  Six hand-written copies had drifted into three real disclosure defects.
- **Never look a person up by id alone.** A bare `findUnique` hands shipping
  addresses and clothing sizes to anyone holding a uuid. Scope it.
- **Never name a role.** Ask `viewer.can('manage:secret-santa')`. The
  role → capability table is `lib/auth/capabilities.ts`; roles are its
  implementation detail.
- **Never return a bare `{ error }` from a server action.** Actions are built
  with `defineAction`; failures are `throw new ActionError(...)`. There is one
  return shape, and callers narrow on `result.success`.
- **Never trust client state for access control**, and filter before you
  serialize — only the minimum crosses from a server component to a client one.
  `lib/db/projections.ts` is that boundary.
- **Never commit to `main`.** Branch, PR, let CI do its job.

## Commands

**`mise` is the command source of truth.** Run `mise tasks ls` to see what
exists, then `mise run <task>`. The tasks encode the correct binary and flags.

Entering the directory is enough to get a working environment. mise pins bun and
node, and `.mise/nix-env.sh` exports the Prisma engine paths out of the pinned
flake — so `bunx prisma`, `bun run build` and the `db:*` tasks work in a plain
shell. There is no `nix develop` wrapper to remember and no docker-compose to
start; `mise run db:up` runs Postgres out of the nix store.

`package.json` scripts stay the source of truth for what Vercel and CI run. The
mise tasks delegate to them, and add what `package.json` cannot express — the
local database, the no-database build.

New clone: `mise run setup`.

## Repo map

One line per top-level directory. Look in the tree for what is inside; this file
does not list contents.

| Path | What lives here |
| --- | --- |
| `app/` | App Router routes. Server components by default. `(authenticated)/` requires a session, `_actions/` holds the server actions, `api/` the route handlers, `auth.ts` the session helpers. |
| `components/` | App components, with the shadcn/ui primitives under `ui/`. |
| `lib/` | The domain. Database access, auth, the Secret Santa draw, the action combinator. |
| `hooks/` | Client-side React hooks. |
| `prisma/` | Schema and seed. The generated client lands in `prisma/generated/` and is not committed. |
| `types/` | Ambient and shared type declarations. |
| `docs/` | Domain docs and ADRs, plus `agents/` — the tracker, label and domain-doc config the agent skills read. |
| `.agents/skills/` | Repo-local agent skills. Tool-agnostic source; `.claude/skills` is a symlink to it. |

## Where depth lives

`lib/` is the part worth reading before you write. Four modules carry rules the
rest of the codebase is not allowed to re-derive:

| Module | Owns |
| --- | --- |
| `lib/actions/define.ts` | The server-action prologue — session, capability gate, zod parsing, error normalisation, cache invalidation. |
| `lib/db/visibility.ts` | Who may see what, as Prisma `where` builders. |
| `lib/db/projections.ts` | What may cross to the browser. |
| `lib/auth/capabilities.ts` | Role → capability. Pure, and covered by tests. |

Business rules that do not need a database live in plain modules with no
`'use server'` and no Prisma import, so they can be tested directly.
`lib/secret-santa/draw.ts` takes its randomness as a parameter, which is why
draws are reproducible under a seeded generator.

## Agent skills

| Skill | Use when |
| --- | --- |
| `local-dev` | Running the app, the local database, or anything Prisma on this machine. |
| `data-access` | Reading or returning user data — the visibility, capability and projection rules. |
| `server-actions` | Writing or changing anything in `app/_actions/`. |
| `schema-change` | Editing `prisma/schema.prisma`. |
| `validate-build` | Before a commit or a PR. |

### Issue tracker

Issues live in the `jonpulsifer/wishlist` GitHub Issues, reached with the `gh`
CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

The five canonical triage roles, each label string equal to its name. See
`docs/agents/triage-labels.md`.

### Domain docs

Single-context — `CONTEXT.md` and `docs/adr/` at the repo root. See
`docs/agents/domain.md`.

## UI conventions

Reach for `components/ui/*` before introducing a new pattern, and Tailwind
utilities for layout. Festive but accessible: high contrast, respect reduced
motion, keep typography clean. Don't add a dependency where `clsx`,
`tailwind-merge` or `cva` will do. Biome is the source of truth for style —
`mise run lint`.

## Writing rule for these docs

1. **Present tense, today only.** Describe what is. No "formerly", "used to",
   "migrated from", "no longer". If a thing is gone, it does not appear — git
   history is the archaeology record.
2. **Point, don't restate.** Never enumerate what the tree enumerates. Name the
   directory. A list of components in prose is a list that will be wrong.
3. **Verify before you write.** Every path must exist, every command must match
   what the repo runs.

The reason a rule exists is worth a sentence; the story of the incident is not.
