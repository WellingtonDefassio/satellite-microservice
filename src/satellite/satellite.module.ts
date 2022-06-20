import { Module } from '@nestjs/common';
import { SatelliteService } from './satellite.service';
import { SatelliteController } from './satellite.controller';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  providers: [SatelliteService],
  controllers: [SatelliteController],
  imports: [PrismaModule],
})
export class SatelliteModule {}
