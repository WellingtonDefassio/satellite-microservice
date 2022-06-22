import { Module } from '@nestjs/common';
import { SatelliteService } from './satellite.service';
import { SatelliteController } from './satellite.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { HttpModule } from '@nestjs/axios';
import { OrbcommService } from './orbcomm/orbcomm.service';

@Module({
  providers: [SatelliteService, OrbcommService],
  controllers: [SatelliteController],
  imports: [PrismaModule, HttpModule],
  exports: [SatelliteService],
})
export class SatelliteModule {}
