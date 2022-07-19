import { Injectable } from '@nestjs/common';
import { SendMessageDto } from 'src/dtos/satellite.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SatelliteService {
  constructor(private prisma: PrismaService) {}

  async sendMessage(body: SendMessageDto) {
    await this.prisma.satelliteSendMessages.create({
      data: {
        payload: body.payload,
        device: { connect: { deviceId: body.deviceId } },
      },
    });
  }
}
