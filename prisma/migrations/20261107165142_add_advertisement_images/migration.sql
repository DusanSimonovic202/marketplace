-- AlterTable
ALTER TABLE "Advertisement" ADD COLUMN     "images" TEXT[] DEFAULT ARRAY[]::TEXT[];
