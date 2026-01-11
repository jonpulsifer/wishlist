# AGENTS.md

This repo is a festive wishlist + Secret Santa app built with **Next.js App Router**, **React 19**, **Prisma**, **Auth.js / next-auth v5**, **shadcn/ui**, and **Tailwind CSS v4**.

The Cursor rule files live in `.cursor/rules/*.mdc`. Some of them are scoped (globs) and may not always be applied automatically, so this file restates the working conventions agents should follow.

## Quick commands

- **Install**: `pnpm install` (Node **>= 22**, pnpm per `package.json`)
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
- **Caching**: when mutating, invalidate relevant caches (typically via `revalidateTag(...)` or helpers like `revalidateGiftRelatedCaches()`).

## Security + data access control (non-negotiable)

- **Never trust client state** for access control.
- **Validate authorization on the server** before returning sensitive data or executing mutations.
- **Filter before serialize**: only pass the minimum necessary data from server components to client components.

## Server actions (`app/_actions/*.ts`)

Follow the existing patterns:

- **File header**: start with `'use server';`
- **Auth**: use `getSession()` from `app/auth.ts`
- **Validation**: use `zod` (`safeParse`) for input, especially for form-like payloads
- **Return shape**:
  - Success: `{ success: true, message?: string, ... }`
  - Error: `{ error: string }`
  - Field errors for forms (when applicable): `{ errors: Record<string, string[]>, message: string }`
- **Cache invalidation**: call `revalidateTag(...)` and/or `revalidateGiftRelatedCaches()` after successful writes
- **Reuse existing helpers/queries** instead of inventing parallel ones

## Client components (`'use client'`)

Use client components only when necessary (interactivity, hooks). Prefer these patterns:

- **Optimistic UI**: `useOptimistic` + `startTransition` for list updates (e.g. claim/unclaim flows)
- **Server action forms**: prefer `useActionState` for form state; avoid sprinkling `useFormStatus` across large components
  - If you need pending state, encapsulate it in a small `SubmitButton` that is a **direct child** of the `<form>`
- **UX**: use shadcn components and consistent interaction patterns (hover states, disabled states, toasts)

## UI system (shadcn + Tailwind v4 + “festive dream”)

- **Use Tailwind utility classes** for layout/spacing; keep things readable and consistent.
- **Use `components/ui/*` primitives** (Button, Card, Dialog, etc.) before introducing new patterns.
- **Festive, but accessible**: high contrast, sensible motion (avoid nausea), respect reduced motion, and keep typography clean.
- **Don’t add dependencies casually**: prefer existing utilities (`clsx`, `tailwind-merge`, `cva`).

## Code style

- **Biome is the source of truth** for lint/format (`pnpm lint`).
- Use TypeScript types from Prisma where possible; avoid `any` unless you’re forced (and document why).

