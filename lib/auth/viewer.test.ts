import assert from 'node:assert/strict';
import { globSync, readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

/**
 * `Viewer` carries `can`, a function. React cannot serialise a function across
 * the server/client seam, so a whole `Viewer` handed to a client component is a
 * runtime error on page load — and TypeScript will not catch it. Assigning a
 * `Viewer` to a narrower prop type is a legal widening, and excess-property
 * checks only fire on object literals, never on a variable.
 *
 * So the rule is: a component takes `viewer.id` and `lib/db/projections` types,
 * never the `Viewer` itself. That rule is mechanical, so check it mechanically
 * rather than trusting the next reader to know why.
 */
const sources = (pattern: string) =>
  globSync(pattern).map((path) => [path, readFileSync(path, 'utf8')] as const);

describe('the viewer never crosses to the browser', () => {
  it('is passed to no component whole', () => {
    const whole = /=\{viewer\}|\{\.\.\.viewer\}/;
    const offenders = sources('{app,components}/**/*.tsx')
      .filter(([, source]) => whole.test(source))
      .map(([path]) => path);

    assert.deepEqual(offenders, []);
  });

  it('is imported by no client component', () => {
    const offenders = sources('{app,components,hooks}/**/*.{ts,tsx}')
      .filter(
        ([, source]) =>
          source.startsWith("'use client'") && source.includes('auth/viewer'),
      )
      .map(([path]) => path);

    assert.deepEqual(offenders, []);
  });
});
