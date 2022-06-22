/*
  Warnings:

  - The values [UNKNOWN] on the enum `SendMessagesOrbcomm_statusOrbcomm` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `sendmessagesorbcomm` MODIFY `statusOrbcomm` ENUM('SUBMITTED', 'RECEIVED', 'ERROR', 'DELIVERY_FAILED', 'TIMEOUT', 'CANCELLED', 'WAITING', 'INVALID', 'TRANSMITTED') NULL;
