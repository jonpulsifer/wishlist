-- Hand-edited from `prisma migrate diff` (ADR-0007). Left to Prisma this is
-- three drops and three creates, and the one that matters is
-- "_SecretSantaExclusions": dropping it loses every exclusion in the database,
-- after which the next Draw may pair the couple they exist to keep apart.
--
-- Wrapped in BEGIN/COMMIT: a failure partway applies as nothing, which matters
-- here because the two NOT NULL tightenings come after the renames.
BEGIN;

-- RenameTable
ALTER TABLE "SecretSantaEvent" RENAME TO "Exchange";
ALTER TABLE "Exchange" RENAME COLUMN "createdById" TO "organiserId";
ALTER INDEX "SecretSantaEvent_pkey" RENAME TO "Exchange_pkey";
ALTER TABLE "Exchange" RENAME CONSTRAINT "SecretSantaEvent_createdById_fkey" TO "Exchange_organiserId_fkey";

-- RenameTable
ALTER TABLE "SecretSantaParticipant" RENAME TO "Participant";
ALTER TABLE "Participant" RENAME COLUMN "eventId" TO "exchangeId";
ALTER INDEX "SecretSantaParticipant_pkey" RENAME TO "Participant_pkey";
ALTER INDEX "SecretSantaParticipant_eventId_userId_key" RENAME TO "Participant_exchangeId_userId_key";
ALTER TABLE "Participant" RENAME CONSTRAINT "SecretSantaParticipant_eventId_fkey" TO "Participant_exchangeId_fkey";
ALTER TABLE "Participant" RENAME CONSTRAINT "SecretSantaParticipant_userId_fkey" TO "Participant_userId_fkey";
ALTER TABLE "Participant" RENAME CONSTRAINT "SecretSantaParticipant_assignedToId_fkey" TO "Participant_assignedToId_fkey";
ALTER TABLE "Participant" RENAME CONSTRAINT "SecretSantaParticipant_assignedById_fkey" TO "Participant_assignedById_fkey";

-- RenameTable. Renamed rather than recreated, which is the whole reason this
-- file is hand-written: the rows are the exclusions.
ALTER TABLE "_SecretSantaExclusions" RENAME TO "_Exclusions";
ALTER INDEX "_SecretSantaExclusions_AB_pkey" RENAME TO "_Exclusions_AB_pkey";
ALTER INDEX "_SecretSantaExclusions_B_index" RENAME TO "_Exclusions_B_index";
ALTER TABLE "_Exclusions" RENAME CONSTRAINT "_SecretSantaExclusions_A_fkey" TO "_Exclusions_A_fkey";
ALTER TABLE "_Exclusions" RENAME CONSTRAINT "_SecretSantaExclusions_B_fkey" TO "_Exclusions_B_fkey";

-- `year` was nullable only because there were no migrations to backfill it
-- with. EXTRACT reads the stored timestamp; `occasionYearOf` read the server's
-- local time, so a row opened within hours of New Year could differ by one.
-- Step 2 query 4 lists all three null-year rows: October 2024, October 2025,
-- October 2025 — none near the boundary.
UPDATE "Exchange" SET "year" = EXTRACT(YEAR FROM "createdAt")::int WHERE "year" IS NULL;
ALTER TABLE "Exchange" ALTER COLUMN "year" SET NOT NULL;

-- The Family bound, backfilled by rule rather than by literal id: the one
-- Family every participant of the Exchange belongs to. An Exchange whose
-- participants no longer share one gets NULL here and the SET NOT NULL below
-- aborts the whole migration — which is the right failure, because such a row
-- already violates #160's invariant and wants a decision, not a default. Step 2
-- query 4 says all three production Exchanges share one Family, and query 5
-- found no santa who cannot see their recipient.
ALTER TABLE "Exchange" ADD COLUMN "familyId" UUID;

UPDATE "Exchange" e SET "familyId" = (
  SELECT m."familyId"
  FROM "Membership" m
  WHERE m."userId" IN (
    SELECT p."userId" FROM "Participant" p WHERE p."exchangeId" = e.id
  )
  GROUP BY m."familyId"
  HAVING count(*) = (
    SELECT count(*) FROM "Participant" p2 WHERE p2."exchangeId" = e.id
  )
  ORDER BY m."familyId"
  LIMIT 1
);

ALTER TABLE "Exchange" ALTER COLUMN "familyId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Exchange" ADD CONSTRAINT "Exchange_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "Family"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

COMMIT;
