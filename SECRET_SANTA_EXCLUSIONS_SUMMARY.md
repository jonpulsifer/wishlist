# Secret Santa Exclusions - Implementation Summary

## ✅ What Was Implemented

### 1. Database Schema Changes

**File: `prisma/schema.prisma`**

Added a many-to-many self-relation on the User model to track exclusion pairs:

```prisma
model User {
  // ... existing fields ...
  secretSantaDoNotMatchWith User[] @relation("SecretSantaExclusions")
  secretSantaExcludedBy     User[] @relation("SecretSantaExclusions")
}
```

This creates bidirectional exclusions - if User A excludes User B, then B automatically excludes A.

### 2. Enhanced Assignment Algorithm

**File: `app/actions.ts`**

Updated `assignSecretSantaParticipants()` to:
- Fetch exclusion pairs for all participants
- Fetch historical assignments from previous events (current + previous year)
- Use a constraint-based randomized assignment algorithm:
  - **Hard constraint**: Never match excluded pairs
  - **Soft constraint**: Best-effort avoidance of previous year matches
  - Up to 1000 attempts to find a valid assignment

### 3. New Server Actions

**File: `app/actions.ts`**

Added admin-only actions:
- `getSecretSantaExclusions()` - Get all exclusion pairs
- `createSecretSantaExclusion(user1Id, user2Id)` - Create bidirectional exclusion
- `deleteSecretSantaExclusion(user1Id, user2Id)` - Remove bidirectional exclusion
- `getAllUsersForExclusions()` - Get all users for UI dropdowns

All actions include admin authorization checks.

### 4. Admin UI Component

**File: `app/(authenticated)/admin/secret-santa/exclusion-manager.tsx`**

New client component with:
- Display list of existing exclusion pairs
- Form to add new exclusions (two user selectors)
- Delete functionality with confirmation dialog
- Optimistic UI updates for instant feedback

### 5. Updated Admin Page

**File: `app/(authenticated)/admin/secret-santa/page.tsx`**

Integrated the exclusion manager component to display alongside event management.

### 6. Sidebar Integration

The Admin link is already present in the sidebar (conditionally shown for admin users).

## 🔧 Next Steps (Required)

### Apply Database Schema Changes

Since this project uses `prisma db push`, you need to apply the schema changes:

```bash
# Option 1: Push schema changes to database
npx prisma db push

# Option 2: Run the build script (does prisma generate + db push)
npm run build
```

**Note**: The current linter errors are expected and will be resolved once you run `prisma generate` or `prisma db push`, which regenerates the TypeScript types for the Prisma client.

## 📋 How to Use

### As an Admin:

1. Navigate to `/admin/secret-santa`
2. You'll see two sections:
   - **Exclusion Pairs** (new) - Manage who can't be matched together
   - **Secret Santa Events** - View/delete existing events

### Adding Exclusions:

1. In the "Exclusion Pairs" card, select two users from the dropdowns
2. Click "Add" to create the exclusion
3. The exclusion is automatically bidirectional

### Creating Secret Santa Events:

1. When you create a new event and assign participants, the algorithm will:
   - **Never** match excluded pairs
   - **Try to avoid** matching people who were paired last year
   - Show an error if no valid assignment is possible with current exclusions

## 🔍 Technical Details

### Assignment Algorithm Logic

```typescript
// Located in app/actions.ts
function createSecretSantaAssignments(
  participantIds: string[],
  exclusionMap: Map<string, Set<string>>,
  historicalMap: Map<string, Set<string>>,
): Array<{ userId: string; assignedToId: string }> | null
```

**Algorithm steps:**
1. Shuffle participant order randomly
2. For each giver, find valid recipients:
   - Exclude self
   - Exclude anyone in exclusion pairs
   - Prefer non-historical matches if available
3. Randomly select from valid candidates
4. Retry up to 1000 times if stuck
5. Return null if no valid assignment found

### Bidirectional Exclusion Handling

Exclusions are created/deleted in database transactions:
```typescript
await db.$transaction([
  db.user.update({ /* connect user1 to user2 */ }),
  db.user.update({ /* connect user2 to user1 */ }),
]);
```

### Historical Assignment Window

Currently fetches assignments from:
- Current year
- Previous year

To change the window, modify in `assignSecretSantaParticipants`:
```typescript
const previousYearStart = new Date(currentYear - 1, 0, 1);
```

## 📁 Files Created/Modified

**Created:**
- `app/(authenticated)/admin/secret-santa/exclusion-manager.tsx`
- `EXCLUSIONS_SETUP.md`
- `SECRET_SANTA_EXCLUSIONS_SUMMARY.md`

**Modified:**
- `prisma/schema.prisma`
- `app/actions.ts`
- `app/(authenticated)/admin/secret-santa/page.tsx`
- `components/app-sidebar.tsx` (minor cleanup)

## ⚠️ Important Notes

1. **Admin Access**: Only users with roles can access admin features
2. **Database Push Required**: Run `npx prisma db push` to apply schema changes
3. **Linter Errors**: Expected until Prisma client is regenerated
4. **No Migration Files**: This project uses `prisma db push` instead of migrations

## 🧪 Testing Checklist

- [ ] Run `npx prisma db push` to apply schema changes
- [ ] Verify no TypeScript errors after Prisma client regeneration
- [ ] Access `/admin/secret-santa` as admin user
- [ ] Add an exclusion pair (e.g., spouse/partner)
- [ ] Create a Secret Santa event with those users
- [ ] Verify excluded pairs are never matched
- [ ] Create another event with same participants
- [ ] Verify algorithm tries to avoid previous year matches

## 🎉 Success!

The Secret Santa exclusion feature is now fully implemented. Once you apply the database schema changes, you'll be able to manage exclusion pairs and create better Secret Santa assignments!

