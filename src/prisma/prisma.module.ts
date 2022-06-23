import { Module } from '@nestjs/common';
import { FetchByDeviceID } from '../pipes/transform-device.pipe';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService, FetchByDeviceID],
  exports: [PrismaService],
  imports: [PrismaModule],
})
export class PrismaModule {}
