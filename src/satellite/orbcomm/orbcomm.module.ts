import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { OrbcommService } from './orbcomm.service';

@Module({
  providers: [OrbcommService],
  exports: [OrbcommService],
  imports: [PrismaModule, HttpModule],
})
export class OrbcommModule {}
