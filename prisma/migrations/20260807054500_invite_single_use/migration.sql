-- Hand-edited from `prisma migrate diff` (ADR-0007): the table is renamed
-- rather than dropped and recreated, so the rows travel with it.
--
-- The rows are then deleted deliberately. Step 2 measured three invites in
-- production, two of them unrevoked, and `expiresAt` is a column nothing has
-- ever written — so a NOT NULL tightening cannot succeed against them. The
-- owner confirmed the three are leftovers rather than links anyone is holding
-- (#196), which makes deleting them cheaper than picking an expiry date for
-- links nobody followed.
BEGIN;

-- RenameTable
ALTER TABLE "WishlistInvite" RENAME TO "Invite";
ALTER TABLE "Invite" RENAME COLUMN "wishlistId" TO "familyId";

-- RenameIndex
ALTER INDEX "WishlistInvite_pkey" RENAME TO "Invite_pkey";
ALTER INDEX "WishlistInvite_token_key" RENAME TO "Invite_token_key";
ALTER INDEX "WishlistInvite_token_idx" RENAME TO "Invite_token_idx";
ALTER INDEX "WishlistInvite_wishlistId_idx" RENAME TO "Invite_familyId_idx";

-- RenameForeignKey
ALTER TABLE "Invite" RENAME CONSTRAINT "WishlistInvite_wishlistId_fkey" TO "Invite_familyId_fkey";
ALTER TABLE "Invite" RENAME CONSTRAINT "WishlistInvite_createdById_fkey" TO "Invite_createdById_fkey";

-- An Invite that never expires is a standing grant of the one irreversible act
-- in the model (ADR-0005), so the column stops being optional. Nothing has
-- written it, so every existing row would fail the tightening.
DELETE FROM "Invite";
ALTER TABLE "Invite" ALTER COLUMN "expiresAt" SET NOT NULL;

-- Single-use, recorded on the token itself: spent, it is dead.
ALTER TABLE "Invite" ADD COLUMN "redeemedAt" TIMESTAMP(3),
                     ADD COLUMN "redeemedById" UUID;

-- AddForeignKey
ALTER TABLE "Invite" ADD CONSTRAINT "Invite_redeemedById_fkey" FOREIGN KEY ("redeemedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT;
