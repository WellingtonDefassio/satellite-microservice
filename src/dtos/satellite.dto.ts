import { DeviceGateway, DeviceStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

class DeviceInfoDto {
  @IsNumber()
  id: number;
  @IsEnum(DeviceGateway)
  gateway: DeviceGateway;
  @IsEnum(DeviceStatus)
  status: DeviceStatus;
}

export class SendMessageDto {
  @IsNotEmpty()
  deviceID: string;
  @IsNotEmpty()
  @IsString()
  payload: string;
  device: DeviceInfoDto;
}
