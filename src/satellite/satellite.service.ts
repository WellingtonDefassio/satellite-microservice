import { Injectable } from '@nestjs/common';
import { SendMessageDto } from 'src/dtos/satellite.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SatelliteService {
  constructor(private prisma: PrismaService) {}

  async recordMessage(body: SendMessageDto) {
    await this.prisma.sendMessages.create({
      data: {
        payload: body.payload,
        deviceGateWay: body.device.gateway,
        device: { connect: { deviceId: body.deviceID } },
      },
    });
  }
}
