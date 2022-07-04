import { DeviceStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

class DeviceInfoDto {
  @IsNumber()
  id: number;
  @IsNumber()
  deviceId: number;
  @IsEnum(DeviceStatus)
  status: DeviceStatus;
}

export class SendMessageDto {
  @IsNotEmpty()
  deviceId: string;
  @IsNotEmpty()
  @IsString()
  payload: string;
  device: DeviceInfoDto;
}
