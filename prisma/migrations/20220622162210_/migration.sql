/*
  Warnings:

  - Added the required column `fwrdMessageId` to the `SendMessagesOrbcomm` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `sendmessages` MODIFY `status` ENUM('CREATED', 'SUBMITTED', 'SENDED', 'TIMEOUT', 'FAILED', 'CANCELLED') NOT NULL DEFAULT 'CREATED';

-- AlterTable
ALTER TABLE `sendmessagesorbcomm` ADD COLUMN `fwrdMessageId` BIGINT NOT NULL;
