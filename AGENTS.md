# AGENTS.md

This repo is a festive wishlist + Secret Santa app built with **Next.js App Router**, **React 19**, **Prisma**, **Auth.js / next-auth v5**, **shadcn/ui**, and **Tailwind CSS v4**.

The Cursor rule files live in `.cursor/rules/*.mdc`. Some of them are scoped (globs) and may not always be applied automatically, so this file restates the working conventions agents should follow.

## Quick commands

- **Install**: `pnpm install` (Node **>= 24**, pnpm per `package.json`)
- **Dev**: `pnpm dev` (Turbopack)
- **Lint/format**: `pnpm lint` (Biome), `pnpm lint:fix`
- **Build**: `pnpm build` (runs Prisma generate/db push, then `next build`)

## Project layout (high-level)

- **`app/`**: Next.js App Router routes (server components by default)
  - **`app/(authenticated)/`**: routes that require auth
  - **`app/_actions/`**: server actions for mutations (see patterns below)
  - **`app/api/`**: route handlers
  - **`app/auth.ts`**: session helpers (`getSession`, role checks, etc.)
- **`components/`**: UI and app components
  - **`components/ui/`**: shadcn/ui primitives (don’t fork unless necessary)
- **`lib/`**: shared utilities + DB
  - **`lib/db/client.ts`**: Prisma client
- **`prisma/`**: Prisma schema + seed

## Next.js 16 (and App Router) guidance

This codebase uses App Router + React Server Components. Keep changes compatible with **Next.js 16** conventions:

- **Server-first**: components in `app/` are server components unless you add `'use client'`.
- **Prefer server data fetching**: fetch and filter data on the server, pass minimal props to client components.
- **Route handlers vs server actions**: use **server actions** for UI-driven mutations; use **route handlers** for API-style endpoints.
- **Caching**: when mutating, invalidate relevant caches. Prefer `defineAction`'s `invalidates` list — it calls `updateTag` for you. Reach for the raw APIs only outside an action, and pick deliberately:
  - **`updateTag(tag)`** — Server Actions only. Expires *and* refreshes in the same request, so the viewer sees their own write immediately. This is what `defineAction` uses.
  - **`revalidateTag(tag, profile)`** — anywhere, but stale-while-revalidate, so the next reader may still get the old value. Next 16 makes the profile argument mandatory; we pass `'max'`. Used by `revalidateGiftRelatedCaches()`, which the invite route handler calls.
  - Calling `updateTag` outside a Server Action throws — that is why the two helpers differ.

## Security + data access control (non-negotiable)

- **Never trust client state** for access control.
- **Validate authorization on the server** before returning sensitive data or executing mutations.
- **Filter before serialize**: only pass the minimum necessary data from server components to client components.
- **Never hand-write a visibility `where` clause.** "Which gifts / people may this viewer see" lives in `lib/db/visibility.ts`. Compose from `visibleGiftsWhere`, `visiblePeopleWhere`, `visibleProfileWhere`, `claimedByViewerWhere`. Six hand-written copies had drifted into three real defects; the module exists so that cannot happen again.
- **Never look a person up by id alone.** A bare `findUnique` exposes shipping addresses and sizes to anyone holding a uuid.
- **Never ask about a role name.** Ask `viewer.can('manage:secret-santa')`. The role → capability table is `lib/auth/capabilities.ts`; it is pure and covered by tests.

## Server actions (`app/_actions/*.ts`)

Actions are built with `defineAction` from `lib/actions/define.ts`. It owns the session, the capability gate, zod parsing, `NEXT_REDIRECT` passthrough, error normalisation and cache invalidation — do not re-derive any of it inside a handler.

```ts
export const claimGift = defineAction(
  {
    capability: 'manage:wishlists', // omit for "any signed-in viewer"
    input: z.string().min(1, 'Gift ID is required'),
    invalidates: ['gifts', 'users'],
  },
  async ({ viewer, input: id }) => {
    // ...work...
    return { message: `You claimed ${gift.name}` }; // becomes { success: true, message }
  },
);
```

- **File header**: still `'use server';`. Because that directive only allows async function exports, the combinator itself lives outside `app/_actions/`.
- **Failing**: `throw new ActionError('...')`. Never return a bare `{ error }`.
- **One return shape**, always:
  - Success: `{ success: true, message?: string, ...payload }`
  - Failure: `{ success: false, error: string, message: string, fieldErrors?: Record<string, string[]> }`
- **Callers must narrow on `result.success`**, not on `result.error`.
- **Cache tags** are the `CacheTag` union — `gifts | users | wishlists | secretSanta`. There is no `roles` tag; nothing declares one.
- **Multi-row writes go in `db.$transaction`**, not `Promise.all`.
- **Reuse existing helpers/queries** instead of inventing parallel ones.

## Domain modules (`lib/`)

Business rules that do not need the database live in plain modules with no `'use server'` and no Prisma import, so they can be tested directly:

- `lib/secret-santa/draw.ts` — the draw. Takes participants, exclusions and history; returns pairings or a typed failure. Randomness is a parameter, so draws are reproducible under a seeded generator.
- `lib/secret-santa/schema.ts` — intake rules, shared by the create form and the action.
- `lib/db/visibility.ts` — the visibility rules, as Prisma `where` builders.
- `lib/db/projections.ts` — what may cross to the browser. Client components import types from here, never from `@/prisma/generated/client`.

## Tests

`pnpm test` runs `node --test` over `lib/**/*.test.ts` using Node's native TypeScript support — no test framework dependency. Test files import with an explicit `.ts` extension. Cover the pure modules; there is no database in the test run.

## Client components (`'use client'`)

Use client components only when necessary (interactivity, hooks). Prefer these patterns:

- **Optimistic UI**: `useOptimistic` + `startTransition` for list updates (e.g. claim/unclaim flows)
- **Server action forms**: `useTransition` + call the action directly, then branch on `result.success`. (`useActionState` does not fit `defineAction`, whose actions take their parsed input as the only argument rather than `(prevState, formData)`.)
  - If you need pending state, encapsulate it in a small `SubmitButton` that is a **direct child** of the `<form>`
- **Never toast success before checking `result.success`**
- **UX**: use shadcn components and consistent interaction patterns (hover states, disabled states, toasts)

## UI system (shadcn + Tailwind v4 + “festive dream”)

- **Use Tailwind utility classes** for layout/spacing; keep things readable and consistent.
- **Use `components/ui/*` primitives** (Button, Card, Dialog, etc.) before introducing new patterns.
- **Festive, but accessible**: high contrast, sensible motion (avoid nausea), respect reduced motion, and keep typography clean.
- **Don’t add dependencies casually**: prefer existing utilities (`clsx`, `tailwind-merge`, `cva`).

## Code style

- **Biome is the source of truth** for lint/format (`pnpm lint`).
- Use TypeScript types from Prisma where possible; avoid `any` unless you’re forced (and document why).

