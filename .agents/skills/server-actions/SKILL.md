---
name: server-actions
description: >-
  How mutations are written in this repo — the defineAction combinator, the
  single result shape, cache invalidation, and how client components call an
  action. Use when adding or changing anything in app/_actions/, or wiring a
  form or button to a mutation.
---

# Server actions

Every mutation in `app/_actions/*.ts` is built with `defineAction` from
`lib/actions/define.ts`. That combinator owns the session, the capability gate,
zod parsing, `NEXT_REDIRECT` passthrough, error normalisation and cache
invalidation. **Do not re-derive any of it inside a handler.**

`app/_actions/` holds mutations only. A read that a server component needs is a
query in `lib/db/` — see the `data-access` skill. The behaviour of the combinator
lives in `lib/actions/prologue.ts`, which takes its two dependencies as
parameters so it can be asserted without NextAuth or `next/cache`; `define.ts` is
the wiring. Change the prologue, extend `prologue.test.ts`.

```ts
export const claimGift = defineAction(
  {
    capability: 'manage:secret-santa', // omit for "any signed-in viewer"
    input: z.string().min(1, 'Gift ID is required'),
    invalidates: ['gifts', 'users'],
  },
  async ({ viewer, input: id }) => {
    // ...work...
    return { message: `You claimed ${gift.name}` };
  },
);
```

The handler receives a resolved `Viewer` and parsed `input`, and returns its
payload. An action with no `input` schema takes no arguments at all; one with a
schema takes exactly its parsed input — that is why `useActionState`, which
calls `(prevState, formData)`, does not fit.

## Rules

- **File header is still `'use server';`.** That directive only permits async
  function exports, which is why the combinator lives outside `app/_actions/`.
- **Fail by throwing `ActionError`.** Never return a bare `{ error }`.
  `UnauthorizedError` and unexpected throws are normalised for you; `onError`
  sets the fallback message.
- **One return shape, always.**
  - Success: `{ success: true, message?: string, ...payload }`
  - Failure: `{ success: false, error, message, fieldErrors? }`
  `error` and `message` carry the same text on the failure path deliberately —
  callers read both spellings and one being `undefined` produced empty toasts.
- **Callers narrow on `result.success`**, never on `result.error`.
- **Never check a capability by hand.** Declare `capability:`.
- **Multi-row writes go in `db.$transaction`**, not `Promise.all`.
- **Reuse the existing queries and helpers** rather than growing a parallel set.

## Cache invalidation

Prefer `invalidates` — it calls `updateTag` for you. Tags are the `CacheTag`
union: `gifts | users | wishlists | secretSanta`. There is no `roles` tag;
nothing declares one, and the calls that used to revalidate it were no-ops.

Reach for the raw APIs only outside an action, and pick deliberately:

- **`updateTag(tag)`** — Server Actions only. Expires *and* refreshes in the same
  request, so the viewer sees their own write immediately. Calling it outside a
  Server Action throws.
- **`revalidateTag(tag, profile)`** — legal anywhere, but stale-while-revalidate,
  so the next reader may still get the old value. Next 16 makes the profile
  argument mandatory; this repo passes `'max'`. This is what
  `revalidateGiftRelatedCaches()` in `app/_actions/gifts.ts` uses, because its
  caller is the invite route handler rather than an action.

## Calling from a client component

**Always through `useAction` (`hooks/use-action.ts`).** It is the only module
that reads `ActionResult`. Never narrow on `result.success` in a component, and
never call `toast` for an action result.

```ts
const { run, isPending } = useAction(claimGift, {
  optimistic: (giftId) => { apply(giftId); return () => undo(giftId); },
  onSuccess: () => setOpen(false),
});
await run(gift.id); // payload on success, null on failure
```

- The success message defaults to the action's own `message` — the one the
  handler already wrote. Pass `success` to override, `false` to stay silent.
- `optimistic` receives the same arguments `run` did and returns the undo, which
  runs only on failure. Make the undo a real inverse; re-applying a toggle is
  not one when the toggle can fire twice.
- `isPending` comes from the hook. Combine several with `||` when one screen
  drives more than one action.
- If you need pending state inside a `<form action={…}>`, `useFormStatus` still
  needs a small `SubmitButton` that is a **direct child** of the `<form>`.

Notifications are `sonner`, mounted once as `<Toaster />` in `app/layout.tsx`.
There is one queue: a second one meant three screens toasted into nothing.

Route handlers in `app/api/` and `app/invite/` are for API-shaped endpoints.
UI-driven mutations are actions.
