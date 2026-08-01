---
name: validate-build
description: >-
  Verify the repo is clean before committing or opening a PR — lint, types,
  tests, build. Use after making changes, and when a check fails for a reason
  that is not the code.
---

# Validate

`mise run check` is lint + typecheck + tests. Run it before every commit; it is
fast and needs no database.

| Task | Needs | Notes |
| --- | --- | --- |
| `mise run lint` | nothing | Biome. `lint:fix` applies the autofixes. |
| `mise run typecheck` | generated client | `tsc --noEmit`. Run `mise run generate` first on a fresh clone. |
| `mise run test` | nothing | `bun test lib` — the pure modules only. |
| `mise run build:next` | `.env` with `DATABASE_URL` | `next build` alone. No live database: every data route is dynamic. |
| `mise run build` | a live database | The real build — runs `prisma db push` first. `mise run db:up`. |

CI (`.github/workflows/ci.yml`) does install → lint → test → build against a
throwaway Postgres service. Matching it locally means `mise run check` plus
`mise run build` with `db:up` running.

## Tests

`lib/**/*.test.ts`, written against `node:test` and `node:assert/strict`, which
bun implements — so there is no test framework dependency and none should be
added. Test files import with an explicit `.ts` extension. There is no database
in the test run: cover the pure modules (`lib/secret-santa/draw.ts`,
`lib/auth/capabilities.ts`, `lib/db/visibility.ts`) and pass fixtures in.

`draw.ts` takes its randomness as a parameter, so assert on draws with a seeded
generator rather than on statistical properties.

## When the failure is not the code

- **`Found a nested root configuration, but there's already a root
  configuration.`** — Biome has found a second `biome.json` in a nested
  checkout. `.gitignore` covers `.claude/worktrees/` and Biome honours it via
  `vcs.useIgnoreFile`, so this should not recur; if it does, find the nested
  copy before blaming the change. Scoping the run works as a stopgap:
  `bunx biome check app components lib hooks types`.
- **`Prisma failed to detect the libssl/openssl version`** — noise on NixOS. The
  command still succeeds.
- **Prisma cannot find an engine** — the environment did not resolve. See the
  `local-dev` skill; `mise env | grep PRISMA` should print four paths.
