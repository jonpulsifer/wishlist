-- DropForeignKey
ALTER TABLE "Gift" DROP CONSTRAINT "Gift_claimedById_fkey";

-- DropIndex
DROP INDEX "Gift_claimedById_createdAt_idx";

-- DropIndex
DROP INDEX "Gift_claimed_createdAt_idx";

-- AlterTable
ALTER TABLE "Gift" DROP COLUMN "claimed",
DROP COLUMN "claimedById";

