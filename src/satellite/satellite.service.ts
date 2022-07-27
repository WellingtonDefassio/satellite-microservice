import { Injectable } from '@nestjs/common';
import { SendMessageDto } from '../dtos/satellite.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SatelliteService {
  constructor(private prisma: PrismaService) {}

  async sendMessage(body: SendMessageDto) {
    try {
      return await this.prisma.satelliteSendMessages.create({
        data: {
          payload: body.payload,
          device: { connect: { deviceId: body.deviceId } },
        },
      });
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
