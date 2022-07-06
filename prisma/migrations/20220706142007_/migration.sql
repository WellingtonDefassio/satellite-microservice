-- CreateTable
CREATE TABLE `OrbcommGetMessage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `messageId` VARCHAR(191) NOT NULL,
    `messageUTC` DATETIME(3) NOT NULL,
    `receiveUTC` DATETIME(3) NOT NULL,
    `deviceId` VARCHAR(191) NOT NULL,
    `SIN` INTEGER NOT NULL,
    `MIN` INTEGER NOT NULL,
    `payload` VARCHAR(191) NOT NULL,
    `regionName` VARCHAR(191) NOT NULL,
    `otaMessageSize` INTEGER NOT NULL,
    `costumerID` INTEGER NOT NULL,
    `transport` INTEGER NOT NULL,
    `mobileOwnerID` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `OrbcommGetMessage_messageId_key`(`messageId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `OrbcommGetMessage` ADD CONSTRAINT `OrbcommGetMessage_deviceId_fkey` FOREIGN KEY (`deviceId`) REFERENCES `Devices`(`deviceId`) ON DELETE RESTRICT ON UPDATE CASCADE;
