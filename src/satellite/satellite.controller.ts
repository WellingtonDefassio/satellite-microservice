import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SendMessageDto } from '../dtos/satellite.dto';
import { FetchByDeviceID } from '../pipes/transform-device.pipe';
import { SatelliteService } from './satellite.service';

@Controller('satellite')
export class SatelliteController {
  constructor(private satelliteService: SatelliteService) {}

  @Post()
  @UsePipes(FetchByDeviceID, new ValidationPipe())
  async sendMessage(@Body() body: SendMessageDto) {
    return this.satelliteService.sendMessage(body);
  }
}
