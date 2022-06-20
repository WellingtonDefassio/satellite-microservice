-- CreateTable
CREATE TABLE `OperationalDevices` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `deviceID` VARCHAR(191) NOT NULL,
    `satelliteGateway` ENUM('ORBCOMM_V2', 'ERIDIUM') NOT NULL,
    `status` ENUM('ACTIVE', 'DISABLED') NOT NULL,

    UNIQUE INDEX `OperationalDevices_deviceID_key`(`deviceID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
