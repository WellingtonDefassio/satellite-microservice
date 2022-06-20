import { OperationalStatus, SatelliteGatewayType } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { DeviceExists } from '../pipes/validator-device.pipe';

class DeviceInfoDto {
  @IsNumber()
  id: number;
  @IsEnum(SatelliteGatewayType)
  gateway: SatelliteGatewayType;
  @IsEnum(OperationalStatus)
  status: OperationalStatus;
}

export class SendMessageDto {
  @IsNotEmpty()
  @DeviceExists()
  deviceID: string;
  @IsNotEmpty()
  @IsString()
  message: string;

  device: DeviceInfoDto;
}
