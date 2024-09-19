/*
  Warnings:

  - A unique constraint covering the columns `[role]` on the table `Role` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `role` to the `Role` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RoleName" AS ENUM ('USER', 'ADMIN', 'DEV');

-- AlterTable
ALTER TABLE "Role" ADD COLUMN     "role" "RoleName" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Role_role_key" ON "Role"("role");
