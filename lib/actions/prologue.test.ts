import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { z } from 'zod';
import type { Capability } from '@/lib/auth/capabilities';
import { UnauthorizedError } from '@/lib/auth/capabilities';
import type { Viewer } from '@/lib/auth/viewer';
import {
  ActionError,
  type CacheTag,
  createDefineAction,
  isNextControlFlow,
} from './prologue.ts';

function viewerHolding(...capabilities: Capability[]): Viewer {
  return {
    id: 'viewer-1',
    name: 'Viewer',
    email: 'viewer@example.com',
    image: null,
    can: (capability) => capabilities.includes(capability),
    isStaff: capabilities.length > 0,
  };
}

/** A prologue that records what it was asked to do. */
function fakePrologue(
  viewer: Viewer | UnauthorizedError = viewerHolding('manage:roles'),
) {
  const invalidated: CacheTag[] = [];
  const askedFor: (Capability | undefined)[] = [];

  return {
    invalidated,
    askedFor,
    resolveViewer: async (capability?: Capability) => {
      askedFor.push(capability);
      if (viewer instanceof UnauthorizedError) throw viewer;
      if (capability && !viewer.can(capability)) {
        throw new UnauthorizedError(capability);
      }
      return viewer;
    },
    invalidate: (tag: CacheTag) => {
      invalidated.push(tag);
    },
  };
}

describe('the success path', () => {
  it('merges the handler payload into a success result', async () => {
    const prologue = fakePrologue();
    const action = createDefineAction(prologue)({}, async () => ({
      id: 'gift-1',
      message: 'Added',
    }));

    const result = await action();

    assert.equal(result.success, true);
    assert.deepEqual(result, { success: true, id: 'gift-1', message: 'Added' });
  });

  it('hands the handler the resolved viewer', async () => {
    const viewer = viewerHolding();
    let seen: Viewer | undefined;
    const action = createDefineAction(fakePrologue(viewer))(
      {},
      async ({ viewer }) => {
        seen = viewer;
        return {};
      },
    );

    await action();
    assert.equal(seen?.id, viewer.id);
  });

  it('invalidates every declared tag, in order, exactly once', async () => {
    const prologue = fakePrologue();
    const action = createDefineAction(prologue)(
      { invalidates: ['gifts', 'users', 'wishlists'] },
      async () => ({}),
    );

    await action();
    assert.deepEqual(prologue.invalidated, ['gifts', 'users', 'wishlists']);
  });
});

describe('authorization', () => {
  it('asks for the declared capability', async () => {
    const prologue = fakePrologue();
    const action = createDefineAction(prologue)(
      { capability: 'manage:roles' },
      async () => ({}),
    );

    await action();
    assert.deepEqual(prologue.askedFor, ['manage:roles']);
  });

  it('turns a refusal into a failure result rather than throwing', async () => {
    const action = createDefineAction(fakePrologue(viewerHolding()))(
      { capability: 'manage:roles' },
      async () => ({}),
    );

    const result = await action();

    assert.equal(result.success, false);
    if (result.success) return;
    assert.match(result.error, /manage:roles/);
  });

  it('does not run the handler when the viewer is refused', async () => {
    let ran = false;
    const action = createDefineAction(fakePrologue(new UnauthorizedError()))(
      {},
      async () => {
        ran = true;
        return {};
      },
    );

    await action();
    assert.equal(ran, false);
  });

  it('invalidates nothing when the viewer is refused', async () => {
    const prologue = fakePrologue(new UnauthorizedError());
    const action = createDefineAction(prologue)(
      { invalidates: ['gifts'] },
      async () => ({}),
    );

    await action();
    assert.deepEqual(prologue.invalidated, []);
  });
});

describe('input validation', () => {
  const schema = z.object({
    name: z.string().min(1, 'Gift name is required'),
    url: z.url('Not a URL'),
  });

  it('passes parsed input to the handler', async () => {
    let seen: unknown;
    const action = createDefineAction(fakePrologue())(
      { input: z.object({ n: z.coerce.number() }) },
      async ({ input }) => {
        seen = input;
        return {};
      },
    );

    await action({ n: '42' } as never);
    assert.deepEqual(seen, { n: 42 });
  });

  it('fails with the first issue message', async () => {
    const action = createDefineAction(fakePrologue())(
      { input: schema },
      async () => ({}),
    );

    const result = await action({ name: '', url: 'nope' });

    assert.equal(result.success, false);
    if (result.success) return;
    assert.equal(result.error, 'Gift name is required');
  });

  it('reports field errors so a form can render them inline', async () => {
    const action = createDefineAction(fakePrologue())(
      { input: schema },
      async () => ({}),
    );

    const result = await action({ name: '', url: 'nope' });

    assert.equal(result.success, false);
    if (result.success) return;
    assert.deepEqual(result.fieldErrors?.name, ['Gift name is required']);
    assert.deepEqual(result.fieldErrors?.url, ['Not a URL']);
  });

  it('does not run the handler on invalid input', async () => {
    let ran = false;
    const action = createDefineAction(fakePrologue())(
      { input: schema },
      async () => {
        ran = true;
        return {};
      },
    );

    await action({ name: '', url: 'nope' });
    assert.equal(ran, false);
  });

  it('invalidates nothing on invalid input', async () => {
    const prologue = fakePrologue();
    const action = createDefineAction(prologue)(
      { input: schema, invalidates: ['gifts'] },
      async () => ({}),
    );

    await action({ name: '', url: 'nope' });
    assert.deepEqual(prologue.invalidated, []);
  });

  it('omits fieldErrors on a non-validation failure', async () => {
    const action = createDefineAction(fakePrologue())({}, async () => {
      throw new ActionError('Gift not found');
    });

    const result = await action();
    assert.equal(result.success, false);
    if (result.success) return;
    assert.equal(result.fieldErrors, undefined);
  });
});

describe('failure results', () => {
  it('carries the same text under both error and message', async () => {
    // Call sites read both spellings; one being undefined produced empty toasts.
    const action = createDefineAction(fakePrologue())({}, async () => {
      throw new ActionError('This gift has already been claimed');
    });

    const result = await action();
    assert.equal(result.success, false);
    if (result.success) return;
    assert.equal(result.error, 'This gift has already been claimed');
    assert.equal(result.message, result.error);
  });

  it('surfaces an unexpected Error message', async () => {
    const action = createDefineAction(fakePrologue())({}, async () => {
      throw new Error('connection reset');
    });

    const result = await action();
    assert.equal(result.success, false);
    if (result.success) return;
    assert.equal(result.error, 'connection reset');
  });

  it('falls back to onError for a non-Error throw', async () => {
    const action = createDefineAction(fakePrologue())(
      { onError: 'Could not save the gift' },
      async () => {
        throw 'a bare string';
      },
    );

    const result = await action();
    assert.equal(result.success, false);
    if (result.success) return;
    assert.equal(result.error, 'Could not save the gift');
  });

  it('has a default message when onError is not given', async () => {
    const action = createDefineAction(fakePrologue())({}, async () => {
      throw 42;
    });

    const result = await action();
    assert.equal(result.success, false);
    if (result.success) return;
    assert.equal(result.error, 'Something went wrong');
  });

  it('does not invalidate when the handler throws', async () => {
    const prologue = fakePrologue();
    const action = createDefineAction(prologue)(
      { invalidates: ['gifts', 'users'] },
      async () => {
        throw new ActionError('nope');
      },
    );

    await action();
    assert.deepEqual(prologue.invalidated, []);
  });
});

describe("Next's control flow", () => {
  // `redirect()` and `notFound()` signal by throwing. Swallowing them turned an
  // expired session into `{ error: 'NEXT_REDIRECT;/login;...' }` in the browser
  // instead of a navigation.
  const redirectError = Object.assign(new Error('NEXT_REDIRECT'), {
    digest: 'NEXT_REDIRECT;replace;/login;307;',
  });

  it('recognises a digest-carrying error', () => {
    assert.equal(isNextControlFlow(redirectError), true);
    assert.equal(isNextControlFlow(new Error('ordinary')), false);
    assert.equal(isNextControlFlow({ digest: 'something-else' }), false);
    assert.equal(isNextControlFlow(null), false);
    assert.equal(isNextControlFlow({ digest: 12345 }), false);
  });

  it('rethrows rather than flattening it into a result', async () => {
    const action = createDefineAction(fakePrologue())({}, async () => {
      throw redirectError;
    });

    await assert.rejects(() => action(), /NEXT_REDIRECT/);
  });

  it('rethrows one raised while resolving the viewer', async () => {
    const prologue = fakePrologue();
    const action = createDefineAction({
      ...prologue,
      resolveViewer: async () => {
        throw redirectError;
      },
    })({}, async () => ({}));

    await assert.rejects(() => action(), /NEXT_REDIRECT/);
  });
});
