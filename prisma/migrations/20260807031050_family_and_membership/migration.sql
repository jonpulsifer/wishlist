-- Hand-edited from `prisma migrate diff`, which wanted to DROP "Wishlist" and
-- CREATE "Family" (ADR-0007). The table is renamed instead, and the implicit
-- join table is copied into an explicit one before it goes.
--
-- The hazard this file exists to make visible: in "_UserToWishlist", "A" is the
-- User and "B" is the Wishlist — Prisma orders the columns alphabetically by
-- model name (prisma/migrations/0_init/migration.sql:278-281 names both FKs).
-- Reading them the wrong way round inverts every membership in the app and
-- raises no error, which is why Membership is explicit from here on.
--
-- Wrapped in BEGIN/COMMIT: Postgres has transactional DDL, so a failure partway
-- applies as nothing rather than as half.
BEGIN;

-- RenameTable
ALTER TABLE "Wishlist" RENAME TO "Family";

-- The pin was deleted in Step 5 and nothing has written it since; the unique
-- name went with the directory that made you type one (#150). A Family is
-- reached by Invite, never by name, so two may share a label.
ALTER TABLE "Family" DROP COLUMN "password";
DROP INDEX "Wishlist_name_key";

-- RenameIndex
ALTER INDEX "Wishlist_pkey" RENAME TO "Family_pkey";
ALTER INDEX "Wishlist_createdAt_idx" RENAME TO "Family_createdAt_idx";

-- CreateTable
CREATE TABLE "Membership" (
    "familyId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Membership_pkey" PRIMARY KEY ("familyId","userId")
);

-- Columns named explicitly, B before A. `joinedAt` cannot be recovered for
-- existing rows and takes this migration's timestamp; nothing reads it.
INSERT INTO "Membership" ("familyId", "userId")
SELECT uw."B", uw."A" FROM "_UserToWishlist" uw;

DROP TABLE "_UserToWishlist";

-- CreateIndex
CREATE INDEX "Membership_userId_idx" ON "Membership"("userId");

-- AddForeignKey. These are the proof the copy went the right way round: with
-- the columns swapped, a family id would have to also be a user id for both to
-- validate, and the transaction aborts instead of shipping inverted membership.
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "Family"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- "WishlistInvite_wishlistId_fkey" needs nothing: a table rename carries the
-- constraint with it, and it now points at "Family". The column and the model
-- keep the old word until Step 16 renames and reshapes them together.

COMMIT;
