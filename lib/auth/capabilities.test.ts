import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  CAPABILITIES,
  capabilitiesFor,
  roleNamesGranting,
} from './capabilities.ts';

describe('capabilitiesFor', () => {
  it('grants nothing to a viewer with no roles', () => {
    assert.equal(capabilitiesFor([]).size, 0);
  });

  it('grants everything to godmode', () => {
    const granted = capabilitiesFor(['godmode']);
    for (const capability of CAPABILITIES) {
      assert.ok(granted.has(capability), `godmode should grant ${capability}`);
    }
  });

  it('lets secret-santa-manager actually manage secret santa', () => {
    // The admin page used to admit this role while every action it called
    // demanded godmode, so the panel loaded and then returned three errors.
    const granted = capabilitiesFor(['secret-santa-manager']);
    assert.ok(granted.has('manage:secret-santa'));
    assert.ok(granted.has('view:admin'));
    assert.ok(!granted.has('manage:roles'));
    assert.ok(!granted.has('manage:wishlists'));
  });

  it('keeps wishlist-manager away from roles and secret santa', () => {
    const granted = capabilitiesFor(['wishlist-manager']);
    assert.ok(granted.has('manage:wishlists'));
    assert.ok(!granted.has('manage:roles'));
    assert.ok(!granted.has('manage:secret-santa'));
  });

  it('unions multiple roles', () => {
    const granted = capabilitiesFor([
      'wishlist-manager',
      'secret-santa-manager',
    ]);
    assert.ok(granted.has('manage:wishlists'));
    assert.ok(granted.has('manage:secret-santa'));
    assert.ok(!granted.has('manage:roles'));
  });

  it('ignores unknown role names', () => {
    assert.equal(capabilitiesFor(['not-a-role']).size, 0);
    assert.deepEqual(
      capabilitiesFor(['godmode', 'not-a-role']),
      capabilitiesFor(['godmode']),
    );
  });

  it('gates the admin nav on holding any capability', () => {
    assert.equal(capabilitiesFor([]).size > 0, false);
    assert.equal(capabilitiesFor(['wishlist-manager']).size > 0, true);
  });
});

describe('roleNamesGranting', () => {
  it('reports every role behind a capability', () => {
    assert.deepEqual(roleNamesGranting('manage:roles').sort(), ['godmode']);
    assert.deepEqual(roleNamesGranting('manage:secret-santa').sort(), [
      'godmode',
      'secret-santa-manager',
    ]);
  });

  it('leaves no capability unreachable', () => {
    for (const capability of CAPABILITIES) {
      assert.ok(
        roleNamesGranting(capability).length > 0,
        `${capability} is granted by no role`,
      );
    }
  });
});
