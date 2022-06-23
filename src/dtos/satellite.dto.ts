import { DeviceGateway, DeviceStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { DeviceExists } from '../pipes/validator-device.pipe';

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
  @DeviceExists()
  deviceID: string;
  @IsNotEmpty()
  @IsString()
  payload: string;
  device: DeviceInfoDto;
}
