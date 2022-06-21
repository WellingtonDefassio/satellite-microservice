import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SendMessageDto } from '../dtos/satellite.dto';
import { EridiumService } from './eridium/eridium.service';
import { OrbcommService } from './orbcomm/orbcomm.service';

@Injectable()
export class SatelliteService {
  constructor(
    private prisma: PrismaService,
    private orbcommService: OrbcommService,
    private eridiumService: EridiumService,
  ) {}
  async redirectMessage(body: SendMessageDto) {
    const messageBody = await this.prisma.sendMessages.create({
      data: {
        message: body.message,
        deviceGateWay: body.device.gateway,
        device: { connect: { deviceId: body.deviceID } },
      },
    });

    switch (body.device.gateway) {
      case 'ORBCOMM_V2':
        return this.orbcommService.uploadMessage(messageBody);
      case 'ERIDIUM':
        return this.eridiumService.uploadMessage(messageBody);
      default:
        break;
    }
  }
}
