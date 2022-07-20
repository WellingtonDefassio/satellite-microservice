import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { SendMessageDto } from '../dtos/satellite.dto';
import { FetchByDeviceID } from '../pipes/transform-device.pipe';
import { SatelliteService } from './satellite.service';

@Controller('satellite')
export class SatelliteController {
  constructor(private satelliteService: SatelliteService) {}

  @Throttle(3, 30)
  @UsePipes(FetchByDeviceID)
  @Post('messages')
  async sendMessage(@Body() body: SendMessageDto) {
    try {
      console.log('Controller body :' + JSON.stringify(body));
      return this.satelliteService.sendMessage(body);
    } catch (error) {
      throw Error(error.message);
    }
  }
}
