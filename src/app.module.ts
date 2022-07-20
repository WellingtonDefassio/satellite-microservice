import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { SatelliteModule } from './satellite/satellite.module';

@Module({
  imports: [
    SatelliteModule,
    ScheduleModule.forRoot(),
    HttpModule,
    ThrottlerModule.forRoot({
      ttl: 30,
      limit: 2,
    }),
  ],
  controllers: [],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
