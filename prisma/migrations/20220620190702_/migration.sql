/*
  Warnings:

  - You are about to drop the `operationaldevices` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `operationaldevices`;

-- CreateTable
CREATE TABLE `Devices` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `deviceID` VARCHAR(191) NOT NULL,
    `satelliteGateway` ENUM('ORBCOMM_V2', 'ERIDIUM') NOT NULL,
    `status` ENUM('ACTIVE', 'DISABLED') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Devices_deviceID_key`(`deviceID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
