import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Serialize } from '../interceptor/serialize-response.interceptor';
import { SendMessageDto } from '../dtos/satellite.dto';
import { FetchDevice } from '../pipes/transform-device.pipe';
import { ResponseMessageDto } from './dto/response-message.dto';
import { SatelliteService } from './satellite.service';

@Throttle(3, 30)
@Controller('satellite')
export class SatelliteController {
  constructor(private satelliteService: SatelliteService) {}

  @UsePipes(FetchDevice)
  @Serialize(ResponseMessageDto)
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
