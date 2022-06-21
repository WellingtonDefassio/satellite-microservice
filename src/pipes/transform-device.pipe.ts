import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { SendMessageDto } from '../dtos/satellite.dto';
import { PrismaService } from '../prisma/prisma.service';
@Injectable()
export class FetchByDeviceID implements PipeTransform {
  constructor(private prisma: PrismaService) {}

  async transform(body: any, metadata: ArgumentMetadata) {
    const sendMessageDto = new SendMessageDto();
    const fetchDevice = await this.prisma.devices.findUnique({
      where: { deviceId: body.deviceID },
    });
    const device = {
      id: fetchDevice.id,
      gateway: fetchDevice.satelliteGateway,
      status: fetchDevice.status,
    };
    return { ...body, device: device, ...sendMessageDto };
  }
}
