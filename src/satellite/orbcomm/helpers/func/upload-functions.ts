import { HttpService } from '@nestjs/axios';
import {
  ForwardStatuses,
  MessageBodyGetStatus,
  MessageBodyPost,
  StatusesType,
  Submission,
} from '../interfaces/upload-messages.interfaces';

export const postApiMessages = (http: HttpService, body: MessageBodyPost) => {
  return new Promise<Submission[]>((resolve, reject) => {
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
      })
      .catch((error) => {
        reject(error.message);
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

export const getMessagesOrbcommStatus = (
  http: HttpService,
  body: MessageBodyGetStatus,
) => {
  return new Promise<ForwardStatuses>((resolve, reject) => {
    http.axiosRef
      .get('http://localhost:3001/orbcomm/getfwd', { params: body })
      .then((apiResponse) => {
        resolve(apiResponse.data);
      })
      .catch((error) => {
        reject(error.message);
      });
  });
};
