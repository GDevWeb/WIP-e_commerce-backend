-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'MANAGER', 'ADMIN');

-- AlterTable
ALTER TABLE "customers" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';
