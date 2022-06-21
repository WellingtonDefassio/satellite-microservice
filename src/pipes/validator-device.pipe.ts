import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { PrismaService } from '../prisma/prisma.service';

@ValidatorConstraint({ name: 'DeviceExists', async: true })
@Injectable()
export class DeviceExistsRule implements ValidatorConstraintInterface {
  constructor(private prisma: PrismaService) {}
  async validate(value: string) {
    try {
      const device = await this.prisma.devices.findUnique({
        where: { deviceId: value },
      });
      if (!device) {
        return false;
      }
    } catch (e) {
      return false;
    }
    return true;
  }
  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'device not found';
  }
}

export function DeviceExists(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'DeviceExists',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: DeviceExistsRule,
    });
  };
}
