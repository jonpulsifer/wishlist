/**
 * What a role lets you do.
 *
 * Callers ask for a capability, never a role name. Role names are an
 * implementation detail of this table; pages and the actions they call can no
 * longer disagree about which role guards a screen, because neither of them
 * names a role.
 *
 * Pure and dependency-free so the table can be asserted directly in tests.
 */

export const CAPABILITIES = [
  'manage:roles',
  'manage:wishlists',
  'manage:secret-santa',
  'view:admin',
] as const;

export type Capability = (typeof CAPABILITIES)[number];

/** Role name -> what it grants. `godmode` grants everything. */
const ROLE_CAPABILITIES: Record<string, readonly Capability[]> = {
  godmode: CAPABILITIES,
  'wishlist-manager': ['manage:wishlists', 'view:admin'],
  'secret-santa-manager': ['manage:secret-santa', 'view:admin'],
};

/**
 * The roles this table knows about, and therefore the only ones that grant
 * anything. A `Role` row with any other name is inert.
 *
 * The bootstrap that creates these rows reads the list from here, so a role
 * added to the table above cannot be forgotten by the seeder.
 */
export const BUILT_IN_ROLES = Object.keys(ROLE_CAPABILITIES);

export function capabilitiesFor(roleNames: readonly string[]): Set<Capability> {
  const granted = new Set<Capability>();
  for (const name of roleNames) {
    for (const capability of ROLE_CAPABILITIES[name] ?? []) {
      granted.add(capability);
    }
  }
  return granted;
}

/**
 * Refusal, in terms of the capability that was missing.
 *
 * It lives here rather than with the `Viewer` because both the viewer and the
 * server-action prologue raise it, and the prologue must stay free of anything
 * that reaches NextAuth or Prisma.
 */
export class UnauthorizedError extends Error {
  constructor(readonly capability?: Capability) {
    super(
      capability
        ? `Unauthorized: this action requires ${capability}`
        : 'Unauthorized: you must be signed in',
    );
    this.name = 'UnauthorizedError';
  }
}

export function roleNamesGranting(capability: Capability): string[] {
  return Object.entries(ROLE_CAPABILITIES)
    .filter(([, caps]) => caps.includes(capability))
    .map(([name]) => name);
}
