import { Module } from '@nestjs/common';
import { PrismaModule } from './satellite/prisma/prisma.module';
import { SatelliteModule } from './satellite/satellite.module';

@Module({
  imports: [SatelliteModule, PrismaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
