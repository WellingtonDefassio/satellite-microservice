import { SendMessages } from '@prisma/client';
import { PostMessagesParams } from '../interfaces/upload-messages.interfaces';

export const formatMessagesToPost = (
  messagesCreated: SendMessages[],
): PostMessagesParams => {
  const messagesToPost: PostMessagesParams = {
    access_id: 123456,
    password: 'ANY_PASSWORD',
    messages: [],
  };

  for (const messages of messagesCreated) {
    messagesToPost.messages.push({
      DestinationID: messages.deviceId,
      UserMessageID: messages.id,
      RawPayload: Buffer.from(messages.payload).toJSON().data,
    });
  }
  console.log(messagesToPost);
  return messagesToPost;
};
