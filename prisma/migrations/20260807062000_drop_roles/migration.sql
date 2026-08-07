-- There are no admins (ADR-0002). Every capability these tables granted has
-- been emptied out by an earlier step: exclusions moved to the two people in
-- them (Step 15), opening a Family and inviting to one became member acts
-- (Step 16), and every remaining Secret Santa act belongs to the Organiser of
-- the one Exchange they opened. What was left granted nothing.
--
-- Step 2 recorded who held what — `godmode` and `secret-santa-manager`, one
-- holder each — and the pre-flight dump holds the grants themselves.
BEGIN;

-- DropTable
DROP TABLE "UserRole";
DROP TABLE "Role";

COMMIT;
