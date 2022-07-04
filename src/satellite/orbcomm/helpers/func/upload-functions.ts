import { HttpService } from '@nestjs/axios';
import {
  MessageBodyPost,
  Submission,
} from '../interfaces/upload-messages.interfaces';

export const postApiMessages = (http: HttpService, body: MessageBodyPost) => {
  return new Promise<Submission[]>((resolve) => {
    http.axiosRef
      .post('http://localhost:3001/orbcomm/post', {
        body,
      })
      .then((apiResponse) => {
        const correctValues = verifyPostMessages(
          body.messages,
          apiResponse.data,
        );
        resolve(correctValues);
      });
  });
};

export const verifyPostMessages = (sendedData, responseData): Submission[] => {
  const validItems: Submission[] = [];
  responseData.Submission.map((apiResponse) => {
    const exists = sendedData.find(
      (data) => data.UserMessageID === apiResponse.UserMessageID,
    );
    if (exists) {
      validItems.push(apiResponse);
    }
  });
  return validItems;
};
