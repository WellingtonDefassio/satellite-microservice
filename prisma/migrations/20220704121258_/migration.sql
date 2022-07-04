-- CreateTable
CREATE TABLE `SendMessages` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `payload` VARCHAR(191) NOT NULL,
    `deviceId` VARCHAR(191) NOT NULL,
    `status` ENUM('CREATED', 'SUBMITTED', 'SENDED', 'TIMEOUT', 'FAILED', 'CANCELLED') NOT NULL DEFAULT 'CREATED',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SendMessagesOrbcomm` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sendMessageId` INTEGER NOT NULL,
    `deviceId` VARCHAR(191) NOT NULL,
    `fwrdMessageId` VARCHAR(191) NOT NULL,
    `statusOrbcomm` ENUM('SUBMITTED', 'RECEIVED', 'ERROR', 'DELIVERY_FAILED', 'TIMEOUT', 'CANCELLED', 'WAITING', 'INVALID', 'TRANSMITTED') NULL,
    `errorId` INTEGER NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `SendMessagesOrbcomm_sendMessageId_key`(`sendMessageId`),
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

-- AddForeignKey
ALTER TABLE `SendMessages` ADD CONSTRAINT `SendMessages_deviceId_fkey` FOREIGN KEY (`deviceId`) REFERENCES `Devices`(`deviceId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SendMessagesOrbcomm` ADD CONSTRAINT `SendMessagesOrbcomm_sendMessageId_fkey` FOREIGN KEY (`sendMessageId`) REFERENCES `SendMessages`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Devices` ADD CONSTRAINT `Devices_gatewayId_fkey` FOREIGN KEY (`gatewayId`) REFERENCES `SatelliteGateway`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
