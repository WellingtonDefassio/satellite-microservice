import { Module } from '@nestjs/common';
import { FetchByDeviceID } from '../pipes/transform-device.pipe';
import { DeviceExistsRule } from '../pipes/validator-device.pipe';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService, DeviceExistsRule, FetchByDeviceID],
  exports: [PrismaService],
  imports: [PrismaModule],
})
export class PrismaModule {}
