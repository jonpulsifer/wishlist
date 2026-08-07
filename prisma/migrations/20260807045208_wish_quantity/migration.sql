-- Additive, with a default: every existing Wish is wanted once and every
-- existing Claimer speaks for one, which is exactly what they meant before the
-- columns existed. No backfill, nothing to lose, and it applies to 600 rows
-- without a table rewrite.
ALTER TABLE "Wish" ADD COLUMN "quantity" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE "Claimer" ADD COLUMN "quantity" INTEGER NOT NULL DEFAULT 1;
