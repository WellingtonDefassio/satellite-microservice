import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SendMessageDto } from '../dtos/satellite.dto';

@Injectable()
export class SatelliteService {
  constructor(private prisma: PrismaService) {}

  async redirectMessage(body: SendMessageDto) {
    await this.prisma.sendMessages.create({
      data: {
        payload: body.payload,
        deviceGateWay: body.device.gateway,
        device: { connect: { deviceId: body.deviceID } },
      },
    });
  }
}
