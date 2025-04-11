/*
  Warnings:

  - The values [TEAM_MANAGER] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `assistId` on the `goals` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `goals` table. All the data in the column will be lost.
  - You are about to drop the column `attendance` on the `matches` table. All the data in the column will be lost.
  - You are about to drop the column `awayHalfScore` on the `matches` table. All the data in the column will be lost.
  - You are about to drop the column `homeHalfScore` on the `matches` table. All the data in the column will be lost.
  - You are about to drop the column `stadiumId` on the `matches` table. All the data in the column will be lost.
  - You are about to alter the column `height` on the `players` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `weight` on the `players` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to drop the column `awayColor` on the `teams` table. All the data in the column will be lost.
  - You are about to drop the column `stadiumId` on the `teams` table. All the data in the column will be lost.
  - You are about to drop the column `rules` on the `tournaments` table. All the data in the column will be lost.
  - You are about to drop the column `teamsCount` on the `tournaments` table. All the data in the column will be lost.
  - You are about to drop the `cards` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `match_referees` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `player_matches` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `referees` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `seasons` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `stadiums` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `staff` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tournament_referees` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `tournaments` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "Foot" AS ENUM ('LEFT', 'RIGHT', 'BOTH');

-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('ADMIN', 'ORGANIZER', 'REFEREE', 'USER');
ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "UserRole_old";
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'USER';
COMMIT;

-- DropForeignKey
ALTER TABLE "cards" DROP CONSTRAINT "cards_matchId_fkey";

-- DropForeignKey
ALTER TABLE "cards" DROP CONSTRAINT "cards_playerId_fkey";

-- DropForeignKey
ALTER TABLE "match_referees" DROP CONSTRAINT "match_referees_matchId_fkey";

-- DropForeignKey
ALTER TABLE "match_referees" DROP CONSTRAINT "match_referees_refereeId_fkey";

-- DropForeignKey
ALTER TABLE "matches" DROP CONSTRAINT "matches_stadiumId_fkey";

-- DropForeignKey
ALTER TABLE "player_matches" DROP CONSTRAINT "player_matches_matchId_fkey";

-- DropForeignKey
ALTER TABLE "player_matches" DROP CONSTRAINT "player_matches_playerId_fkey";

-- DropForeignKey
ALTER TABLE "seasons" DROP CONSTRAINT "seasons_tournamentId_fkey";

-- DropForeignKey
ALTER TABLE "staff" DROP CONSTRAINT "staff_teamId_fkey";

-- DropForeignKey
ALTER TABLE "teams" DROP CONSTRAINT "teams_stadiumId_fkey";

-- DropForeignKey
ALTER TABLE "tournament_referees" DROP CONSTRAINT "tournament_referees_refereeId_fkey";

-- DropForeignKey
ALTER TABLE "tournament_referees" DROP CONSTRAINT "tournament_referees_tournamentId_fkey";

-- AlterTable
ALTER TABLE "goals" DROP COLUMN "assistId",
DROP COLUMN "description";

-- AlterTable
ALTER TABLE "matches" DROP COLUMN "attendance",
DROP COLUMN "awayHalfScore",
DROP COLUMN "homeHalfScore",
DROP COLUMN "stadiumId";

-- AlterTable
ALTER TABLE "players" ADD COLUMN     "preferredFoot" "Foot",
ALTER COLUMN "height" SET DATA TYPE INTEGER,
ALTER COLUMN "weight" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "teams" DROP COLUMN "awayColor",
DROP COLUMN "stadiumId",
ADD COLUMN     "address" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT NOT NULL DEFAULT 'England',
ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION,
ADD COLUMN     "stadium" TEXT;

-- AlterTable
ALTER TABLE "tournaments" DROP COLUMN "rules",
DROP COLUMN "teamsCount";

-- DropTable
DROP TABLE "cards";

-- DropTable
DROP TABLE "match_referees";

-- DropTable
DROP TABLE "player_matches";

-- DropTable
DROP TABLE "referees";

-- DropTable
DROP TABLE "seasons";

-- DropTable
DROP TABLE "stadiums";

-- DropTable
DROP TABLE "staff";

-- DropTable
DROP TABLE "tournament_referees";

-- DropEnum
DROP TYPE "CardType";

-- DropEnum
DROP TYPE "RefereeType";

-- DropEnum
DROP TYPE "StaffRole";

-- CreateIndex
CREATE UNIQUE INDEX "tournaments_name_key" ON "tournaments"("name");
