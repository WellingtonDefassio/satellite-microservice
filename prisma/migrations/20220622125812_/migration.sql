/*
  Warnings:

  - You are about to drop the column `message` on the `sendmessages` table. All the data in the column will be lost.
  - You are about to alter the column `status` on the `sendmessages` table. The data in that column could be lost. The data in that column will be cast from `Enum("sendmessages_status")` to `Enum("SendMessages_status")`.
  - Added the required column `payload` to the `SendMessages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `SendMessages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `sendmessages` DROP COLUMN `message`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `payload` VARCHAR(191) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `status` ENUM('CREATED', 'SENDED', 'TIMEOUT', 'FAILED', 'CANCELLED') NOT NULL DEFAULT 'CREATED';
