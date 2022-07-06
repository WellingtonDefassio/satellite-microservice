-- CreateTable
CREATE TABLE `OrbcommVersionDevice` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `deviceId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `SIN` INTEGER NOT NULL,
    `MIN` INTEGER NOT NULL,
    `fields` JSON NOT NULL,

    UNIQUE INDEX `OrbcommVersionDevice_deviceId_key`(`deviceId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `OrbcommVersionDevice` ADD CONSTRAINT `OrbcommVersionDevice_deviceId_fkey` FOREIGN KEY (`deviceId`) REFERENCES `Devices`(`deviceId`) ON DELETE RESTRICT ON UPDATE CASCADE;
