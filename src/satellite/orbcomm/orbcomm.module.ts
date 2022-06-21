import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { OrbcommService } from './orbcomm.service';

@Module({
  providers: [OrbcommService],
  exports: [OrbcommService],
  imports: [PrismaModule],
})
export class OrbcommModule {}
