import { NotFoundException } from '@nestjs/common';
import { MessageStatus, OrbcommMessageStatus } from '@prisma/client';

export function exists(param: any) {
  if (!param) {
    throw new NotFoundException();
  }
}

export function convertMessageStatus(
  status: OrbcommMessageStatus,
): MessageStatus {
  switch (status) {
    case 'RECEIVED':
    case 'TRANSMITTED':
      return 'SENDED';
    case 'SUBMITTED':
    case 'WAITING':
      return 'SUBMITTED';
    case 'TIMEOUT':
      return 'TIMEOUT';
    case 'DELIVERY_FAILED':
    case 'ERROR':
      return 'FAILED';
    case 'CANCELLED':
      return 'CANCELLED';
    default:
      break;
  }
}
