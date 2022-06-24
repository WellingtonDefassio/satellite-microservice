import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { SatelliteModule } from './satellite/satellite.module';

@Module({
  imports: [SatelliteModule, ScheduleModule.forRoot(), HttpModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
