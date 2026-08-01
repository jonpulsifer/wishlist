'use client';

/**
 * The browser half of the server-action seam.
 *
 * `defineAction` gives every mutation one result shape. This is the only thing
 * that reads it. Sixteen client modules used to narrow on `result.success` by
 * hand, each picking its own success wording and its own of two notification
 * vocabularies — and one of those two had no adapter mounted, so three screens
 * reported neither success nor failure.
 *
 * The interface a caller learns:
 *
 *   const { run, isPending } = useAction(claimGift, { onSuccess: close })
 *   await run(gift.id)          // payload on success, null on failure
 *
 * The transition, the unwrap, the notification and the optimistic revert are
 * behind it.
 */

import { useCallback, useState, useTransition } from 'react';
import { toast } from 'sonner';
import type { ActionResult, ActionSuccess } from '@/lib/actions/define';

type AnyAction<Args extends unknown[], Payload extends object> = (
  ...args: Args
) => Promise<ActionResult<Payload>>;

export type UseActionOptions<Args extends unknown[], Payload extends object> = {
  /**
   * Success message. A string is used verbatim; a function reads the payload.
   * Omitted means "use the action's own `message`" — the one the handler already
   * wrote, and which the call sites kept discarding for a hardcoded copy.
   * `false` stays silent.
   */
  success?: string | ((payload: ActionSuccess<Payload>) => string) | false;
  /** Failure message override. `false` stays silent. */
  error?: string | false;
  onSuccess?: (payload: ActionSuccess<Payload>) => void;
  onError?: (message: string) => void;
  /**
   * Apply an optimistic change, given the arguments `run` was called with, and
   * return the undo.
   *
   * The undo runs if — and only if — the action fails. That is the part the
   * hand-written copies kept getting wrong: two of them reverted by re-applying
   * the same toggle, so a repeat failure re-applied the change instead.
   */
  optimistic?: (...args: Args) => (() => void) | undefined;
};

export type UseAction<Args extends unknown[], Payload extends object> = {
  run: (...args: Args) => Promise<ActionSuccess<Payload> | null>;
  isPending: boolean;
  /** The last failure message, for forms that render it inline. */
  error: string | null;
  /** Field-level errors from the action's zod schema, if it had one. */
  fieldErrors: Record<string, string[]>;
};

export function useAction<Args extends unknown[], Payload extends object>(
  action: AnyAction<Args, Payload>,
  options: UseActionOptions<Args, Payload> = {},
): UseAction<Args, Payload> {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const {
    success,
    error: errorOverride,
    onSuccess,
    onError,
    optimistic,
  } = options;

  const fail = useCallback(
    (message: string, undo?: () => void) => {
      undo?.();
      setError(message);
      const shown = errorOverride === false ? null : (errorOverride ?? message);
      if (shown) toast.error(shown);
      onError?.(message);
    },
    [errorOverride, onError],
  );

  const run = useCallback(
    (...args: Args) =>
      new Promise<ActionSuccess<Payload> | null>((resolve) => {
        startTransition(async () => {
          const undo = optimistic?.(...args);
          let result: ActionResult<Payload>;

          try {
            result = await action(...args);
          } catch (thrown) {
            // A server action can still fail at the transport layer — an offline
            // browser, a deploy mid-flight. That never produces a result shape,
            // so it never reached the `success` check.
            fail(
              thrown instanceof Error ? thrown.message : 'Something went wrong',
              undo,
            );
            resolve(null);
            return;
          }

          if (!result.success) {
            setFieldErrors(result.fieldErrors ?? {});
            fail(result.error, undo);
            resolve(null);
            return;
          }

          setError(null);
          setFieldErrors({});

          const payload = result as ActionSuccess<Payload>;
          const message =
            success === false
              ? null
              : typeof success === 'function'
                ? success(payload)
                : (success ?? payload.message);
          if (message) toast.success(message);

          onSuccess?.(payload);
          resolve(payload);
        });
      }),
    [action, success, onSuccess, optimistic, fail],
  );

  return { run, isPending, error, fieldErrors };
}
