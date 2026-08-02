---
name: local-dev
description: >-
  Run this app locally — the dev server, the local Postgres, and anything that
  shells out to Prisma. Use when starting the app, resetting or seeding the
  database, or when a prisma/next command fails with an engine, OpenSSL, or
  connection error.
---

# Local dev

`mise` is the command source of truth. `mise tasks ls` lists everything; this
file covers only what is easy to get wrong.

## The environment sets itself up

Entering the directory is enough. mise pins bun and node, and
`.mise/nix-env.sh` (wired in via `mise.toml` `[env]._.source`) resolves the
Prisma schema engine and Postgres out of the pinned flake and exports their
paths.

Do **not** wrap commands in `nix develop`. `bunx --bun prisma …`, `bun run
build` and the `db:*` tasks all work in a plain shell because the engine path is
already in the environment. The flake devshell still exists as a fallback and
exports the same variable.

Why any of this is needed: Prisma publishes no schema engine binary for the
`linux-nixos` target — `binaries.prisma.sh` returns a 404 and
`PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1` does not help. The nixpkgs build is
the only one that runs here. Only `db push` and the other schema commands need
it; the client itself talks to Postgres through the `@prisma/adapter-pg` driver
adapter, with no engine involved.

Check the wiring when something looks off:

```
mise env | grep -E 'PRISMA|PGBIN'
```

Empty output means nix did not resolve. Delete `.mise/.cache/` to force a
refresh; the cache also refreshes on its own when `flake.lock` changes or the
store path is garbage-collected.

The nixpkgs schema engine is `prisma-engines_7` (7.8.0) against a 7.9.1 CLI.
The patch mismatch is fine in practice; a *major* mismatch is not — a v6 engine
answers a v7 CLI with `Could not parse schema engine response`.
`prisma:warn Prisma failed to detect the libssl/openssl version` is noise on
NixOS — commands still succeed.

The Prisma CLI does not read `.env` (v7 stopped loading it), which is why every
invocation goes through `bunx --bun` — the bun runtime loads `.env`, and
`prisma.config.ts` reads `DIRECT_URL` out of the environment it gets. A plain
`bunx prisma` runs the CLI under node and fails with
`Cannot resolve environment variable: DIRECT_URL`.

## The database

Docker is unavailable on this machine (the `docker` binary is a Windows Docker
Desktop shim with WSL integration off), so there is no compose file. Postgres
comes out of the nix store and its cluster lives in `.pgdata/`.

| Task | Does |
| --- | --- |
| `mise run db:up` | initdb if needed, start, create the `wishlist` database |
| `mise run db:down` | stop |
| `mise run db:push` | push `schema.prisma` into the database and regenerate the client |
| `mise run db:seed` | faker data |
| `mise run db:reset` | destroy `.pgdata/` and rebuild from the schema |
| `mise run db:psql` | psql shell |

`db:up` is idempotent — run it whenever you are unsure. Server logs go to
`.pgdata/server.log`.

The connection string lives in `.env` (`DATABASE_URL` for the app's driver
adapter, `DIRECT_URL` for the CLI in `prisma.config.ts`), which `mise run setup`
writes from `.env.example`. Next.js loads `.env` itself and bun loads it for the
CLI; mise does not need to.

## Running and building

- `mise run dev` — dev server on :3000.
- `mise run build` — the real build. Runs `prisma db push`, so it needs a live
  database. Start one first.
- `mise run build:next` — `next build` alone. No database needed, because every
  data route is dynamic. This is the one to use for a quick compile check.

Docker image changes cannot be built or tested locally for the same reason —
CI is the only place the Dockerfile gets exercised.
