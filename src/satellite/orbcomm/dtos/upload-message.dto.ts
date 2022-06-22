import { StatusOrbcommMessage } from '@prisma/client';

export enum Status {
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

interface Submission {
  ForwardMessageID: number;
  DestinationID: string;
  ErrorID: number;
  UserMessageID: number;
}

export class SendMessagesOrbcommDto {
  sendMessageId: number;
  deviceId: string;
  fwrdMessageId: number;
  statusOrbcomm: StatusOrbcommMessage;

  constructor(message: Submission) {
    this.sendMessageId = message.UserMessageID;
    this.deviceId = message.DestinationID;
    this.fwrdMessageId = message.ForwardMessageID;
    this.statusOrbcomm = StatusOrbcommMessage[Status[message.ErrorID]];
  }
}
