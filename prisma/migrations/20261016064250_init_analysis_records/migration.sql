-- CreateTable
CREATE TABLE "AnalysisRecord" (
    "id" TEXT NOT NULL,
    "startupName" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "input" JSONB NOT NULL,
    "analysis" JSONB NOT NULL,
    "marketScore" INTEGER NOT NULL,
    "productScore" INTEGER NOT NULL,
    "defensibilityScore" INTEGER NOT NULL,
    "confidence" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnalysisRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AnalysisRecord_createdAt_idx" ON "AnalysisRecord"("createdAt");

-- CreateIndex
CREATE INDEX "AnalysisRecord_startupName_idx" ON "AnalysisRecord"("startupName");

-- CreateIndex
CREATE INDEX "AnalysisRecord_marketScore_idx" ON "AnalysisRecord"("marketScore");

-- CreateIndex
CREATE INDEX "AnalysisRecord_productScore_idx" ON "AnalysisRecord"("productScore");

-- CreateIndex
CREATE INDEX "AnalysisRecord_defensibilityScore_idx" ON "AnalysisRecord"("defensibilityScore");

-- CreateIndex
CREATE INDEX "AnalysisRecord_confidence_idx" ON "AnalysisRecord"("confidence");
