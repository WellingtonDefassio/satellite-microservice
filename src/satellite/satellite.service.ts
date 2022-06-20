import { Injectable } from '@nestjs/common';
import { SendMessageDto } from '../dtos/satellite.dto';

@Injectable()
export class SatelliteService {
  async sendMessage(body: SendMessageDto) {
    switch (body.device.gateway) {
      case 'ORBCOMM_V2':
        break;

      default:
        break;
    }
  }
}
