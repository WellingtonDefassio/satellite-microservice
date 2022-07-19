/*
  Warnings:

  - You are about to drop the `orbcommgetmessage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sendmessages` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sendmessagesorbcomm` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `orbcommgetmessage` DROP FOREIGN KEY `OrbcommGetMessage_deviceId_fkey`;

-- DropForeignKey
ALTER TABLE `sendmessages` DROP FOREIGN KEY `SendMessages_deviceId_fkey`;

-- DropForeignKey
ALTER TABLE `sendmessagesorbcomm` DROP FOREIGN KEY `SendMessagesOrbcomm_sendMessageId_fkey`;

-- DropTable
DROP TABLE `orbcommgetmessage`;

-- DropTable
DROP TABLE `sendmessages`;

-- DropTable
DROP TABLE `sendmessagesorbcomm`;

-- CreateTable
CREATE TABLE `SatelliteSendMessages` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `payload` VARCHAR(191) NOT NULL,
    `deviceId` VARCHAR(191) NOT NULL,
    `status` ENUM('CREATED', 'SUBMITTED', 'SENDED', 'TIMEOUT', 'FAILED', 'CANCELLED') NOT NULL DEFAULT 'CREATED',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrbcommSendMessages` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sendMessageId` INTEGER NOT NULL,
    `deviceId` VARCHAR(191) NOT NULL,
    `fwrdMessageId` VARCHAR(191) NOT NULL,
    `status` ENUM('SUBMITTED', 'RECEIVED', 'ERROR', 'DELIVERY_FAILED', 'TIMEOUT', 'CANCELLED', 'WAITING', 'INVALID', 'TRANSMITTED') NULL,
    `errorId` INTEGER NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `OrbcommSendMessages_sendMessageId_key`(`sendMessageId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrbcommGetMessages` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `messageId` VARCHAR(191) NOT NULL,
    `messageUTC` DATETIME(3) NOT NULL,
    `receiveUTC` DATETIME(3) NOT NULL,
    `deviceId` VARCHAR(191) NULL,
    `SIN` INTEGER NOT NULL,
    `MIN` INTEGER NOT NULL,
    `payload` MEDIUMTEXT NOT NULL,
    `regionName` VARCHAR(191) NOT NULL,
    `otaMessageSize` INTEGER NOT NULL,
    `costumerID` INTEGER NOT NULL,
    `transport` INTEGER NOT NULL,
    `mobileOwnerID` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `OrbcommGetMessages_messageId_key`(`messageId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SatelliteSendMessages` ADD CONSTRAINT `SatelliteSendMessages_deviceId_fkey` FOREIGN KEY (`deviceId`) REFERENCES `Devices`(`deviceId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrbcommSendMessages` ADD CONSTRAINT `OrbcommSendMessages_sendMessageId_fkey` FOREIGN KEY (`sendMessageId`) REFERENCES `SatelliteSendMessages`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrbcommGetMessages` ADD CONSTRAINT `OrbcommGetMessages_deviceId_fkey` FOREIGN KEY (`deviceId`) REFERENCES `Devices`(`deviceId`) ON DELETE SET NULL ON UPDATE CASCADE;
