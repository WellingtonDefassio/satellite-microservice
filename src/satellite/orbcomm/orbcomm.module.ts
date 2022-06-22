import { Module } from '@nestjs/common';
import { SatelliteModule } from '../satellite.module';
import { OrbcommService } from './orbcomm.service';

@Module({
  providers: [OrbcommService],
  exports: [OrbcommService],
})
export class OrbcommModule {}
