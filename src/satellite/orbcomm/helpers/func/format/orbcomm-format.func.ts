import { SendMessages, SendMessagesOrbcomm } from '@prisma/client';
import {
  BodyToGetMessage,
  MessageBodyGetStatus,
  MessageBodyPost,
  ReceiveDownloadData,
  ReceiveDownloadMessageData,
} from '../../index';

export function formatMessageToPost(messages: SendMessages[]): MessageBodyPost {
  const messageBodyPost: MessageBodyPost = {
    access_id: 'any_access',
    password: 'any_password',
    messages: [],
  };
  messages.forEach((message) =>
    messageBodyPost.messages.push({
      DestinationID: message.deviceId,
      UserMessageID: message.id,
      RawPayload: Buffer.from(message.payload).toJSON().data,
    }),
  );
  return messageBodyPost;
}

export function createListOfFwdIds(messagesToCheck: SendMessagesOrbcomm[]) {
  const listOfFwIds = [];

  messagesToCheck.forEach((message) => {
    listOfFwIds.push(message.fwrdMessageId);
  });

  return listOfFwIds;
}

export function formatMessageToGetStatus(listOfFwrId: number[]) {
  const messageBodyPost: MessageBodyGetStatus = {
    access_id: 'any_access',
    password: 'any_password',
    fwIDs: [],
  };
  listOfFwrId.forEach((n) => {
    messageBodyPost.fwIDs.push(n);
  });
  return messageBodyPost;
}

export function formatGetMessages(downloadMessages: ReceiveDownloadData) {
  return downloadMessages.Messages.map((message) => {
    return {
      messageId: message.ID.toString(),
      messageUTC: new Date(message.MessageUTC),
      receiveUTC: new Date(message.ReceiveUTC),
      deviceId: message.MobileID,
      SIN: message.SIN,
      MIN: message.RawPayload[1],
      payload: message.RawPayload.toString(),
      regionName: message.RegionName,
      otaMessageSize: message.OTAMessageSize,
      costumerID: message.CustomerID,
      transport: message.Transport,
      mobileOwnerID: message.MobileOwnerID.toString(),
    };
  });
}

//tested!

export function formatParamsToGetMessages(
  nextMessage: string,
): BodyToGetMessage {
  try {
    const messageBodyToGet: BodyToGetMessage = {
      access_id: 70002657,
      password: 'ZFLLYNJL',
      include_raw_payload: true,
      start_utc: nextMessage,
    };
    Object.values(messageBodyToGet).forEach((value) => {
      if (!!value === false) {
        throw Error('Missing ParamsToGetMessages!!');
      }
    });
    return messageBodyToGet;
  } catch (error) {
    throw Error(error.message);
  }
}

export function filterPayload(
  downloadMessages: ReceiveDownloadData,
): ReceiveDownloadMessageData[] {
  return downloadMessages.Messages.filter((message) => message.Payload);
}
