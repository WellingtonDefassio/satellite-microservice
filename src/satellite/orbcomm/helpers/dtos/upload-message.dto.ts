import { OrbcommMessageStatus } from '@prisma/client';
import {
  StatusesType,
  Submission,
} from '../interfaces/upload-messages.interfaces';

export enum OrbcommStatusMap {
  SUBMITTED = 0,
  RECEIVED = 1,
  ERROR = 2,
  DELIVERY_FAILED = 3,
  TIMEOUT = 4,
  CANCELLED = 5,
  WAITING = 6,
  INVALID = 7,
  TRANSMITTED = 8,
}

export class SendMessagesOrbcommDto {
  sendMessageId: number;
  deviceId: string;
  fwrdMessageId: number;
  statusOrbcomm: OrbcommMessageStatus;

  constructor(message: Submission) {
    this.sendMessageId = message.UserMessageID;
    this.deviceId = message.DestinationID;
    this.fwrdMessageId = message.ForwardMessageID;
    this.statusOrbcomm =
      OrbcommMessageStatus[OrbcommStatusMap[message.ErrorID]];
  }
}

export class UpdateStatusMessagesOrbcommDto {
  sendMessageId: number;
  statusOrbcomm: OrbcommMessageStatus;

  constructor(message: StatusesType) {
    this.sendMessageId = message.ReferenceNumber;
    this.statusOrbcomm = OrbcommMessageStatus[OrbcommStatusMap[message.State]];
  }
}
