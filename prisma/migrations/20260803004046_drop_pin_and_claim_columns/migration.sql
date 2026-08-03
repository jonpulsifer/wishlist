-- Steps 8 and 11. Both are drops with no rule change; visibility and claim
-- secrecy moved in the previous PR, which is why `visibility.ts` and
-- `projections.ts` are not in this diff.
--
-- `_GiftToWishlist` is the one drop in the whole redraw that destroys
-- information no later query can reconstruct: which Families a Wish was pinned
-- to when it was added, including Families its subject has since left.
-- Production measured 18 viewer-pairs across 3 Wishes in exactly that state
-- (see issue #195). The table is regenerable from the new rule, but the history
-- is not — a Wish comes back pinned to the Families its subject is in *today*:
--
--   CREATE TABLE … (copy the definition from 0_init/migration.sql, verbatim)
--   INSERT INTO "_GiftToWishlist" ("A", "B")
--   SELECT g.id, uw."B" FROM "Gift" g
--     JOIN "_UserToWishlist" uw ON uw."A" = g."ownerId";
--
-- The two columns are fully reconstructible, unlike the table:
--
--   UPDATE "Gift" g SET "claimedById" = c."userId", claimed = true
--     FROM "Claimer" c WHERE c."wishId" = g.id;
--
-- Only the first claimer survives that if a Wish has picked up several, which
-- is the point of the new shape and not a loss the old shape could have held.

-- DropForeignKey
ALTER TABLE "Gift" DROP CONSTRAINT "Gift_claimedById_fkey";

-- DropForeignKey
ALTER TABLE "_GiftToWishlist" DROP CONSTRAINT "_GiftToWishlist_A_fkey";

-- DropForeignKey
ALTER TABLE "_GiftToWishlist" DROP CONSTRAINT "_GiftToWishlist_B_fkey";

-- DropIndex
DROP INDEX "Gift_claimedById_createdAt_idx";

-- DropIndex
DROP INDEX "Gift_claimed_createdAt_idx";

-- AlterTable
ALTER TABLE "Gift" DROP COLUMN "claimed",
DROP COLUMN "claimedById";

-- DropTable
DROP TABLE "_GiftToWishlist";

