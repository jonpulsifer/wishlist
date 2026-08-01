/**
 * The server-action prologue, as a pure combinator.
 *
 * This is the implementation behind `./define`. It is a separate module for one
 * reason: `defineAction`'s two dependencies — resolving the viewer and
 * invalidating cache tags — reach NextAuth, Prisma and `next/cache`, and a
 * prologue that imports those cannot be exercised. Here they are parameters.
 *
 * This is an internal seam. Callers use `defineAction` from `./define`; the only
 * other thing that crosses this one is `./prologue.test.ts`.
 *
 * Imports nothing but zod, and types.
 */

import { z } from 'zod';
import { type Capability, UnauthorizedError } from '@/lib/auth/capabilities';
import type { Viewer } from '@/lib/auth/viewer';

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

export function failure(
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

/** Throw from a handler to fail the action with a specific message. */
export class ActionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ActionError';
  }
}

/**
 * Next signals `redirect()` and `notFound()` by throwing an error carrying a
 * `digest`. Those must propagate.
 *
 * Every hand-written catch block swallowed them, so an expired session — which
 * makes the session helper call `redirect('/login')` — came back to the browser
 * as `{ error: 'NEXT_REDIRECT;/login;...' }` instead of navigating anywhere.
 */
export function isNextControlFlow(error: unknown): boolean {
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

/** What the prologue needs from the world. */
export type Prologue = {
  /** Resolve the viewer, or throw. Throwing `UnauthorizedError` becomes a result. */
  resolveViewer: (capability?: Capability) => Promise<Viewer>;
  /** Mark a cache tag stale. Called once per tag, only after the handler wins. */
  invalidate: (tag: CacheTag) => void;
};

export type DefineAction = <
  Schema extends z.ZodType | undefined,
  Payload extends object,
>(
  config: ActionConfig<Schema>,
  handler: (args: HandlerArgs<Schema>) => Promise<Payload>,
) => (...args: Args<Schema>) => Promise<ActionResult<Payload>>;

/**
 * Build a `defineAction` against a given prologue.
 *
 * The returned combinator has the interface described on `defineAction` in
 * `./define`; the two dependencies are the only thing that varies.
 */
export function createDefineAction(prologue: Prologue): DefineAction {
  return <Schema extends z.ZodType | undefined, Payload extends object>(
    config: ActionConfig<Schema>,
    handler: (args: HandlerArgs<Schema>) => Promise<Payload>,
  ) => {
    const run = async (rawInput?: unknown): Promise<ActionResult<Payload>> => {
      try {
        const viewer = await prologue.resolveViewer(config.capability);

        let input = rawInput;
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
          input = parsed.data;
        }

        const payload = await handler({
          viewer,
          input: input as Input<Schema>,
        });

        for (const tag of config.invalidates ?? []) {
          prologue.invalidate(tag);
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

    // An action with no schema takes no arguments; one with a schema takes
    // exactly its parsed input. Both arrive here as a single optional value.
    return run as (...args: Args<Schema>) => Promise<ActionResult<Payload>>;
  };
}
