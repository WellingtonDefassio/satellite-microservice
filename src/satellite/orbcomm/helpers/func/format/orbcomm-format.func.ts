import { SendMessages, SendMessagesOrbcomm } from '@prisma/client';
import {
  BodyToGetMessage,
  MessageBodyCheck,
  MessageBodyPost,
  ReceiveDownloadData,
  ReceiveDownloadMessageData,
} from '../../index';

//tested!

export function formatParamsToGetMessages(credentials: {
  access_id: string;
  password: string;
}) {
  return function (nextMessage: string) {
    try {
      const messageBodyToGet: BodyToGetMessage = {
        access_id: credentials.access_id,
        password: credentials.password,
        include_raw_payload: true,
        start_utc: nextMessage.trim(),
      };
      Object.values(messageBodyToGet).forEach((value) => {
        if (!!value == false) {
          throw Error('Missing ParamsToGetMessages!!');
        }
      });
      return messageBodyToGet;
    } catch (error) {
      throw Error(error.message);
    }
  };
}

export function filterPayload(
  downloadMessages: ReceiveDownloadData,
): ReceiveDownloadMessageData[] {
  return downloadMessages.Messages.filter((message) => message.Payload);
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

/**
 * @param credentials
 * @returns {( (messages: SendMessages[]) => MessageBodyPost )} [ returns a function that receives the messages and returns a MessageBodyToPost ]
 */

export function formatMessagesToPostOrbcomm(credentials: {
  access_id: string;
  password: string;
}): (messages: SendMessages[]) => MessageBodyPost {
  const messageBodyPost: MessageBodyPost = {
    access_id: credentials.access_id,
    password: credentials.password,
    messages: [],
  };
  return function (messages: SendMessages[]): MessageBodyPost {
    messages.forEach((message) =>
      messageBodyPost.messages.push({
        DestinationID: message.deviceId,
        UserMessageID: message.id,
        RawPayload: Buffer.from(message.payload).toJSON().data,
      }),
    );
    return messageBodyPost;
  };
}

export function formatMessagesToCheckOrbcomm(credentials: {
  access_id: string;
  password: string;
}) {
  const messageBodyCheck: MessageBodyCheck = {
    access_id: credentials.access_id,
    password: credentials.password,
    fwIDs: [],
  };

  return function (messagesToCheck: SendMessagesOrbcomm[]) {
    messageBodyCheck.fwIDs = messagesToCheck.map(
      (message) => message.fwrdMessageId,
    );
    return messageBodyCheck;
  };
}
