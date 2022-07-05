import {
  MessageStatus,
  OrbcommMessageStatus,
  SendMessages,
} from '@prisma/client';

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
    case 'INVALID':
      return 'FAILED';
    case 'CANCELLED':
      return 'CANCELLED';
    default:
      break;
  }
}

export function messagesExists(messagesToUpload) {
  console.log(messagesToUpload);
  if (!messagesToUpload.length) {
    throw new Error('no more messages available');
  } else {
    return messagesToUpload;
  }
}
