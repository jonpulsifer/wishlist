/**
 * The server-action prologue, written once.
 *
 * Every action used to re-derive the same opening and closing: resolve the
 * session, check a role, parse input, do the work, revalidate, then a catch
 * block that flattened everything to `{ error: string }`. Thirty-five copies,
 * and they had drifted into seven different return shapes.
 *
 * This module is not `'use server'` — that directive forces every export to be
 * an async RPC endpoint, so the combinator lives here and is called from the
 * files in `app/_actions/`.
 *
 * The interface a caller learns:
 *
 *   export const claimGift = defineAction(
 *     { input: giftIdSchema, invalidates: ['gifts'] },
 *     async ({ viewer, input }) => ({ message: '…' }),
 *   )
 *
 * The handler sees a resolved `Viewer` and parsed `input`, and returns its
 * payload. Authorization, validation, error normalisation and cache invalidation
 * all sit behind this. A handler may return `{ message }` to set the success
 * message, and may throw `ActionError` to fail with a specific one.
 *
 * The behaviour lives in `./prologue`, which takes its two dependencies as
 * parameters so it can be asserted without NextAuth or `next/cache`. This file
 * is the wiring, and the only place those two are named.
 */

import { updateTag } from 'next/cache';
import { requireViewer } from '@/lib/auth/viewer';
import { createDefineAction } from './prologue';

export const defineAction = createDefineAction({
  resolveViewer: requireViewer,
  // `updateTag` (not `revalidateTag`) so the viewer sees their own write
  // immediately instead of the stale-while-revalidate copy. Safe because every
  // `defineAction` consumer is a 'use server' action.
  invalidate: updateTag,
});

export type {
  ActionConfig,
  ActionFailure,
  ActionResult,
  ActionSuccess,
  CacheTag,
} from './prologue';
export { ActionError } from './prologue';
