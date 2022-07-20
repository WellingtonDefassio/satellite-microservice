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
CREATE TABLE `Devices` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `deviceId` VARCHAR(191) NOT NULL,
    `gatewayId` INTEGER NOT NULL,
    `status` ENUM('ACTIVE', 'DISABLED') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Devices_deviceId_key`(`deviceId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SatelliteGateway` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `SatelliteGateway_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrbcommNextMessage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `previousMessage` VARCHAR(191) NOT NULL,
    `nextMessage` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

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

-- CreateTable
CREATE TABLE `OrbcommVersionDevice` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `deviceId` VARCHAR(191) NULL,
    `name` VARCHAR(191) NOT NULL,
    `SIN` INTEGER NOT NULL,
    `MIN` INTEGER NOT NULL,
    `fields` JSON NOT NULL,

    UNIQUE INDEX `OrbcommVersionDevice_deviceId_key`(`deviceId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SatelliteSendMessages` ADD CONSTRAINT `SatelliteSendMessages_deviceId_fkey` FOREIGN KEY (`deviceId`) REFERENCES `Devices`(`deviceId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrbcommSendMessages` ADD CONSTRAINT `OrbcommSendMessages_sendMessageId_fkey` FOREIGN KEY (`sendMessageId`) REFERENCES `SatelliteSendMessages`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrbcommSendMessages` ADD CONSTRAINT `OrbcommSendMessages_deviceId_fkey` FOREIGN KEY (`deviceId`) REFERENCES `Devices`(`deviceId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Devices` ADD CONSTRAINT `Devices_gatewayId_fkey` FOREIGN KEY (`gatewayId`) REFERENCES `SatelliteGateway`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
