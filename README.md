# wishlist

A festive wishlist and Secret Santa app. Family and friends sign in, add the
things they want, claim each other's gifts without spoiling the surprise, and
draw names with exclusions so spouses never get matched.

Next.js App Router, React 19, Prisma on Postgres, Auth.js, shadcn/ui and
Tailwind v4. Deployed on Vercel.

## Getting started

Requires [mise](https://mise.jdx.dev). Nix is required only on NixOS, where it
supplies the Prisma engines and Postgres.

```bash
mise run setup   # install deps, write .env, start and migrate a local database
mise run dev     # http://localhost:3000
```

`mise tasks ls` lists everything else — `db:reset`, `db:seed`, `check`, `build`.
Off NixOS, point `DATABASE_URL` in `.env` at any Postgres you like and skip the
`db:*` tasks.

## Working on it

`mise run check` — lint, types and tests — before every commit. CI runs the same
plus a full build against a throwaway Postgres.

Conventions, architecture and the rules that matter live in
[AGENTS.md](AGENTS.md), with task-scoped depth in `.agents/skills/`. Both are
written for coding agents and are the fastest way for a human to get oriented
too.

## License

MIT. See [LICENSE](LICENSE).
