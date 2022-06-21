/*
  Warnings:

  - You are about to drop the column `deviceID` on the `devices` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[deviceId]` on the table `Devices` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `deviceId` to the `Devices` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Devices_deviceID_key` ON `devices`;

-- AlterTable
ALTER TABLE `devices` DROP COLUMN `deviceID`,
    ADD COLUMN `deviceId` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `SendMessages` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `message` VARCHAR(191) NOT NULL,
    `deviceId` VARCHAR(191) NOT NULL,
    `status` ENUM('PENDING', 'SEND', 'TIMEOUT', 'FAILED') NOT NULL DEFAULT 'PENDING',
    `deviceGateWay` ENUM('ORBCOMM_V2', 'ERIDIUM') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SendMessagesOrbcomm` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sendMessageId` INTEGER NOT NULL,
    `deviceId` VARCHAR(191) NOT NULL,
    `fwdMessageIds` BIGINT NOT NULL,
    `statusOrbcomm` ENUM('SUBMITTED', 'RECEIVED', 'ERROR', 'DELIVERY_FAILED', 'TIMEOUT', 'CANCELLED', 'WAITING', 'UNKNOWN', 'TRANSMITTED') NOT NULL,

    UNIQUE INDEX `SendMessagesOrbcomm_sendMessageId_key`(`sendMessageId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Devices_deviceId_key` ON `Devices`(`deviceId`);

-- AddForeignKey
ALTER TABLE `SendMessages` ADD CONSTRAINT `SendMessages_deviceId_fkey` FOREIGN KEY (`deviceId`) REFERENCES `Devices`(`deviceId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SendMessagesOrbcomm` ADD CONSTRAINT `SendMessagesOrbcomm_sendMessageId_fkey` FOREIGN KEY (`sendMessageId`) REFERENCES `SendMessages`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
