/*
  Warnings:

  - Changed the type of `name` on the `SystemField` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "SystemFieldName" AS ENUM ('POSITION', 'POINTS_ESTIMATE', 'DONE_PERCENTAGE');

-- AlterTable
ALTER TABLE "SystemField" DROP COLUMN "name",
ADD COLUMN     "name" "SystemFieldName" NOT NULL;
