/*
  Warnings:

  - You are about to drop the column `statusOrbcomm` on the `sendmessagesorbcomm` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `sendmessagesorbcomm` DROP COLUMN `statusOrbcomm`,
    ADD COLUMN `status` ENUM('SUBMITTED', 'RECEIVED', 'ERROR', 'DELIVERY_FAILED', 'TIMEOUT', 'CANCELLED', 'WAITING', 'INVALID', 'TRANSMITTED') NULL;
