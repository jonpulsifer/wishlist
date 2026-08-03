-- CreateTable
CREATE TABLE "Claimer" (
    "wishId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Claimer_pkey" PRIMARY KEY ("wishId","userId")
);

-- CreateIndex
CREATE INDEX "Claimer_userId_idx" ON "Claimer"("userId");

-- AddForeignKey
ALTER TABLE "Claimer" ADD CONSTRAINT "Claimer_wishId_fkey" FOREIGN KEY ("wishId") REFERENCES "Gift"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Claimer" ADD CONSTRAINT "Claimer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

