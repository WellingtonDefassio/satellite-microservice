-- DropForeignKey
ALTER TABLE `orbcommgetmessage` DROP FOREIGN KEY `OrbcommGetMessage_deviceId_fkey`;

-- DropForeignKey
ALTER TABLE `orbcommversiondevice` DROP FOREIGN KEY `OrbcommVersionDevice_deviceId_fkey`;

-- AlterTable
ALTER TABLE `orbcommgetmessage` MODIFY `deviceId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `orbcommversiondevice` MODIFY `deviceId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `OrbcommGetMessage` ADD CONSTRAINT `OrbcommGetMessage_deviceId_fkey` FOREIGN KEY (`deviceId`) REFERENCES `Devices`(`deviceId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrbcommVersionDevice` ADD CONSTRAINT `OrbcommVersionDevice_deviceId_fkey` FOREIGN KEY (`deviceId`) REFERENCES `Devices`(`deviceId`) ON DELETE SET NULL ON UPDATE CASCADE;
