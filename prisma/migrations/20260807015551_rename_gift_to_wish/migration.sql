-- Hand-edited from `prisma migrate diff`, which wanted to DROP "Gift" and
-- CREATE "Wish" — the same shape, and 630 rows of one family's history in
-- between (ADR-0007). Every statement below renames or backfills; nothing
-- drops a table or a column.
--
-- Postgres has transactional DDL, so the BEGIN/COMMIT means a failure partway
-- applies as nothing rather than as half, and the next deploy is not wedged
-- against a half-renamed database.
BEGIN;

-- RenameTable
ALTER TABLE "Gift" RENAME TO "Wish";

-- RenameColumn
ALTER TABLE "Wish" RENAME COLUMN "ownerId" TO "subjectId";
ALTER TABLE "Wish" RENAME COLUMN "createdById" TO "proposerId";

-- Backfill: a Wish nobody else proposed names its own subject rather than
-- naming nobody, which is what removes the third state from "is this a
-- Suggestion?". 239 of 630 rows in production, and it is the value the old
-- code already treated them as having.
UPDATE "Wish" SET "proposerId" = "subjectId" WHERE "proposerId" IS NULL;
ALTER TABLE "Wish" ALTER COLUMN "proposerId" SET NOT NULL;

-- RenameIndex
ALTER INDEX "Gift_pkey" RENAME TO "Wish_pkey";
ALTER INDEX "Gift_createdAt_idx" RENAME TO "Wish_createdAt_idx";
ALTER INDEX "Gift_ownerId_createdAt_idx" RENAME TO "Wish_subjectId_createdAt_idx";
ALTER INDEX "Gift_createdById_createdAt_idx" RENAME TO "Wish_proposerId_createdAt_idx";
ALTER INDEX "Gift_archived_idx" RENAME TO "Wish_archived_idx";

-- RenameForeignKey
ALTER TABLE "Wish" RENAME CONSTRAINT "Gift_ownerId_fkey" TO "Wish_subjectId_fkey";

-- The proposer's referential action changes with its nullability: ON DELETE SET
-- NULL is not available to a required column, so this one is replaced rather
-- than renamed. "Claimer_wishId_fkey" needs neither — it already carries the
-- new word, and a table rename carries the constraint with it.
ALTER TABLE "Wish" DROP CONSTRAINT "Gift_createdById_fkey";
ALTER TABLE "Wish" ADD CONSTRAINT "Wish_proposerId_fkey" FOREIGN KEY ("proposerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

COMMIT;
