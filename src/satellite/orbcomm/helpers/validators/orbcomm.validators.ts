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
      return 'FAILED';
    case 'CANCELLED':
      return 'CANCELLED';
    default:
      break;
  }
}

export function messagesExists(
  messagesToUpload: SendMessages[],
): SendMessages[] {
  console.log(messagesToUpload);
  if (!messagesToUpload.length) {
    throw new Error('MESSAGES NOT AVAILABLE');
  } else {
    return messagesToUpload;
  }
}
