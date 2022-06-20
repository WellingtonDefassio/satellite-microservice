import { Module } from '@nestjs/common';
import { OrbcommService } from './orbcomm.service';

@Module({
  providers: [OrbcommService],
  exports: [OrbcommService],
})
export class OrbcommModule {}
