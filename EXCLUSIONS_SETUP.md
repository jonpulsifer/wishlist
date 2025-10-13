# Secret Santa Exclusions Setup

## Overview

This feature adds the ability to manage exclusion pairs (spouses, partners, etc.) who should never be matched together in Secret Santa events. The assignment algorithm also attempts to avoid repeating matches from previous events.

## Database Changes

### Schema Updates

Added a many-to-many self-relation on the `User` model:

```prisma
model User {
  // ... existing fields ...
  secretSantaDoNotMatchWith User[] @relation("SecretSantaExclusions")
  secretSantaExcludedBy     User[] @relation("SecretSantaExclusions")
}
```

This creates an implicit join table for bidirectional exclusions.

## Applying Database Changes

Since this project uses `prisma db push` (not migrations), apply the schema changes with:

```bash
npx prisma db push
```

Or regenerate the Prisma client (which the build script does automatically):

```bash
npx prisma generate
```

Then run the build:

```bash
npm run build
```

## Features Added

### 1. Admin UI for Exclusion Management

Access the admin panel at `/admin/secret-santa` (admin users only) to:

- View all exclusion pairs
- Add new exclusion pairs by selecting two users
- Remove existing exclusion pairs

### 2. Enhanced Assignment Algorithm

The Secret Santa assignment algorithm now:

1. **Hard Constraint**: Never matches users who are in an exclusion pair
2. **Soft Constraint**: Tries to avoid matching users who were paired in previous events (best effort)
3. **Fallback**: If no valid assignment exists with both constraints, it allows historical repeats but still respects exclusions

The algorithm uses a randomized assignment approach with up to 1000 attempts to find a valid configuration.

### 3. Server Actions

New admin-only actions in `app/actions.ts`:

- `getSecretSantaExclusions()` - Fetch all exclusion pairs
- `createSecretSantaExclusion(user1Id, user2Id)` - Create bidirectional exclusion
- `deleteSecretSantaExclusion(user1Id, user2Id)` - Remove bidirectional exclusion
- `getAllUsersForExclusions()` - Get all users for the exclusion UI

### 4. Historical Assignment Tracking

The algorithm automatically fetches assignments from the current and previous year to avoid repetition where possible.

## Usage

1. As an admin, navigate to `/admin/secret-santa`
2. In the "Exclusion Pairs" section, select two users who should not be matched
3. Click "Add" to create the exclusion
4. When creating a new Secret Santa event, the algorithm will automatically respect these exclusions

## Technical Details

### Assignment Algorithm

Located in `app/actions.ts` as `createSecretSantaAssignments()`:

- Creates a random derangement (everyone gives to someone else)
- Enforces hard constraints (exclusions, no self-assignment)
- Prefers avoiding historical matches when possible
- Uses greedy randomized approach with backtracking

### Bidirectional Exclusions

Exclusions are automatically bidirectional:
- If A is excluded from B, then B is automatically excluded from A
- This is handled at the database level through the Prisma relation
- Both directions are updated in transactions to maintain consistency

## Testing

To test the feature:

1. Create some exclusion pairs in the admin panel
2. Create a Secret Santa event with those users as participants
3. Verify that excluded pairs are never matched together
4. Create another event with the same participants to verify historical avoidance

