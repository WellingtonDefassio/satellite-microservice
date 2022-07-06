import { SendMessages, SendMessagesOrbcomm } from '@prisma/client';
import {
  BodyToGetMessage,
  MessageBodyGetStatus,
  MessageBodyPost,
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
  console.log(messageBodyPost);
  return messageBodyPost;
}

export function formatParamsToGetMessages(nextMessage: {
  nextMessage: string;
}) {
  const messageBodyToGet: BodyToGetMessage = {
    access_id: 70002657,
    password: 'ZFLLYNJL',
    include_raw_payload: true,
    start_utc: nextMessage.nextMessage,
  };

  return messageBodyToGet;
}
