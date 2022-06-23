import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { SatelliteModule } from './satellite/satellite.module';
import { HttpModule } from './http/http.module';

@Module({
  imports: [SatelliteModule, ScheduleModule.forRoot(), HttpModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
