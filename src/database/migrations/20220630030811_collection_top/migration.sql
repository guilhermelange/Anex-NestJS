-- CreateEnum
CREATE TYPE "Top" AS ENUM ('NONE', 'ANIME', 'PLAYLIST');

-- AlterTable
ALTER TABLE "collection" ADD COLUMN     "top" "Top" NOT NULL DEFAULT E'NONE';
