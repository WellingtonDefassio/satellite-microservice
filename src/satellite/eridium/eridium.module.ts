import { Module } from '@nestjs/common';
import { EridiumService } from './eridium.service';

@Module({
  providers: [EridiumService]
})
export class EridiumModule {}
