/*
  Warnings:

  - You are about to drop the column `message` on the `sendmessages` table. All the data in the column will be lost.
  - Added the required column `payload` to the `SendMessages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `SendMessages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `sendmessages` DROP COLUMN `message`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `payload` VARCHAR(191) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;
