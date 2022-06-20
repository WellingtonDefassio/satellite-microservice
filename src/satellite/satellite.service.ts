import { Injectable } from '@nestjs/common';
import { SendMessageDto } from './dtos/satellite.dto';

@Injectable()
export class SatelliteService {
  async sendMessage(body: SendMessageDto) {}
}
