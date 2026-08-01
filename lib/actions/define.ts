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
 */

import { updateTag } from 'next/cache';
import { z } from 'zod';
import type { Capability } from '@/lib/auth/capabilities';
import {
  requireViewer,
  UnauthorizedError,
  type Viewer,
} from '@/lib/auth/viewer';

/**
 * Cache tags that actually exist.
 *
 * Declaring them as a union makes a dead tag unrepresentable — `roles` used to
 * be revalidated four times against a tag no cache had ever declared.
 */
export type CacheTag = 'gifts' | 'users' | 'wishlists' | 'secretSanta';

export type ActionFailure = {
  success: false;
  /** Human-readable reason. Safe to show. */
  error: string;
  /**
   * Same text as `error`. Callers in this repo read both spellings, and having
   * one be `undefined` on the failure path was a live source of empty toasts.
   */
  message: string;
  /** Present only when input validation failed. */
  fieldErrors?: Record<string, string[]>;
};

export type ActionSuccess<T> = { success: true; message?: string } & T;

export type ActionResult<T> = ActionSuccess<T> | ActionFailure;

function failure(
  error: string,
  fieldErrors?: Record<string, string[]>,
): ActionFailure {
  return {
    success: false,
    error,
    message: error,
    ...(fieldErrors ? { fieldErrors } : {}),
  };
}

/**
 * Next signals `redirect()` and `notFound()` by throwing an error carrying a
 * `digest`. Those must propagate.
 *
 * Every hand-written catch block swallowed them, so an expired session — which
 * makes `getSession()` call `redirect('/login')` — came back to the browser as
 * `{ error: 'NEXT_REDIRECT;/login;...' }` instead of navigating anywhere.
 */
function isNextControlFlow(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'digest' in error &&
    typeof (error as { digest: unknown }).digest === 'string' &&
    (error as { digest: string }).digest.startsWith('NEXT_')
  );
}

export type ActionConfig<Schema extends z.ZodType | undefined> = {
  /** Required capability. Omit for "any signed-in viewer". */
  capability?: Capability;
  /** Validates the action's single argument. */
  input?: Schema;
  /** Tags revalidated after the handler succeeds. */
  invalidates?: readonly CacheTag[];
  /** Message used when the handler throws something unexpected. */
  onError?: string;
};

type Input<Schema> = Schema extends z.ZodType ? z.infer<Schema> : undefined;

/**
 * An action with no `input` schema takes no arguments at all; one with a schema
 * takes exactly its parsed input.
 */
type Args<Schema> = Schema extends z.ZodType ? [input: z.infer<Schema>] : [];

type HandlerArgs<Schema> = {
  viewer: Viewer;
  input: Input<Schema>;
};

/**
 * Wrap a handler into a server action.
 *
 * The handler sees a resolved `Viewer` and parsed `input`, and returns its
 * payload. Authorization, validation, error normalisation and cache
 * invalidation all sit behind this interface.
 *
 * A handler may return `{ message }` to set the success message, and may throw
 * `ActionError` to fail with a specific message.
 */
export function defineAction<
  Schema extends z.ZodType | undefined,
  Payload extends object,
>(
  config: ActionConfig<Schema>,
  handler: (args: HandlerArgs<Schema>) => Promise<Payload>,
): (...args: Args<Schema>) => Promise<ActionResult<Payload>> {
  return async (rawInput?: unknown) => {
    try {
      const viewer = await requireViewer(config.capability);

      let input = rawInput as Input<Schema>;
      if (config.input) {
        const parsed = config.input.safeParse(rawInput);
        if (!parsed.success) {
          return failure(
            parsed.error.issues[0]?.message ?? 'Invalid input',
            z.flattenError(parsed.error).fieldErrors as Record<
              string,
              string[]
            >,
          );
        }
        input = parsed.data as Input<Schema>;
      }

      const payload = await handler({ viewer, input });

      for (const tag of config.invalidates ?? []) {
        // `updateTag` (not `revalidateTag`) so the viewer sees their own write
        // immediately instead of the stale-while-revalidate copy. Safe because
        // every `defineAction` consumer is a 'use server' action.
        updateTag(tag);
      }

      return { success: true, ...payload } as ActionSuccess<Payload>;
    } catch (error) {
      if (isNextControlFlow(error)) throw error;
      if (error instanceof ActionError) return failure(error.message);
      if (error instanceof UnauthorizedError) return failure(error.message);
      if (error instanceof Error) return failure(error.message);
      return failure(config.onError ?? 'Something went wrong');
    }
  };
}

/** Throw from a handler to fail the action with a specific message. */
export class ActionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ActionError';
  }
}
