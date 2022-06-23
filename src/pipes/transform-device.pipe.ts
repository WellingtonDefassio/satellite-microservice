import {
  ArgumentMetadata,
  Injectable,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
@Injectable()
export class FetchByDeviceID implements PipeTransform {
  constructor(private prisma: PrismaService) {}

  async transform(body: any, metadata: ArgumentMetadata) {
    const fetchDevice = await this.prisma.devices.findUnique({
      where: { deviceId: body.deviceID },
    });
    if (!fetchDevice) {
      throw new NotFoundException('DEVICE NOT FOUND');
    }
    const device = {
      id: fetchDevice.id,
      gateway: fetchDevice.satelliteGateway,
      status: fetchDevice.status,
    };
    return { ...body, device: device };
  }
}
