import { Module } from '@nestjs/common';
import { SatelliteService } from './satellite.service';
import { SatelliteController } from './satellite.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { OrbcommModule } from './orbcomm/orbcomm.module';
import { EridiumModule } from './eridium/eridium.module';

@Module({
  providers: [SatelliteService],
  controllers: [SatelliteController],
  imports: [PrismaModule, OrbcommModule, EridiumModule],
})
export class SatelliteModule {}
