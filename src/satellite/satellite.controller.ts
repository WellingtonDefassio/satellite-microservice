import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { SendMessageDto } from '../dtos/satellite.dto';
import { FetchByDeviceID } from '../pipes/transform-device.pipe';
import { SatelliteService } from './satellite.service';

@Controller('satellite')
export class SatelliteController {
  constructor(private satelliteService: SatelliteService) {}

  @Post('messages')
  @UsePipes(FetchByDeviceID)
  async sendMessage(@Body() body: SendMessageDto) {
    console.log('Controller body :' + JSON.stringify(body));
    return this.satelliteService.sendMessage(body);
  }
}
