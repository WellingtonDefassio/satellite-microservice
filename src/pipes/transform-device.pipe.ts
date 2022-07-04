import {
  ArgumentMetadata,
  Injectable,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface bodyParams {
  deviceId: string;
  payload: string;
}

@Injectable()
export class FetchByDeviceID implements PipeTransform {
  constructor(private prisma: PrismaService) {}

  async transform(body: bodyParams, metadata: ArgumentMetadata) {
    const fetchDevice = await this.prisma.devices.findUnique({
      where: { deviceId: body.deviceId },
    });
    if (!fetchDevice) {
      throw new NotFoundException('device not found');
    }
    const device = {
      id: fetchDevice.id,
      gateway: fetchDevice.gatewayId,
      status: fetchDevice.status,
    };
    return { ...body, device: device };
  }
}
