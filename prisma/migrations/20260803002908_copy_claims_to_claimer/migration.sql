-- Copy every existing claim into Claimer.
--
-- `claimedById` is the column to trust, not `claimed`: the boolean is redundant
-- with the id and was kept in step by hand in two actions. A Gift with the flag
-- set and no id is not a claim anybody can act on, so it does not come across.
--
-- `updatedAt` is the closest thing the old shape has to a claim timestamp.
INSERT INTO "Claimer" ("wishId", "userId", "createdAt")
SELECT g.id, g."claimedById", g."updatedAt"
  FROM "Gift" g
 WHERE g."claimedById" IS NOT NULL;
