import { Module } from '@nestjs/common';
import { EridiumService } from './eridium.service';

@Module({
  providers: [EridiumService],
  exports: [EridiumService],
})
export class EridiumModule {}
