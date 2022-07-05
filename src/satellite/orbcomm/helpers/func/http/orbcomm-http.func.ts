import { HttpService } from '@nestjs/axios';
import {
  ForwardStatuses,
  MessageBodyGetStatus,
  MessageBodyPost,
  Submission,
  verifyPostMessages,
} from '../../index';

export const orbcommApiGetStatus = (
  body: MessageBodyGetStatus,
  http: HttpService,
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

export const postApiMessages = (body: MessageBodyPost, http: HttpService) => {
  return new Promise<Submission[]>((resolve, reject) => {
    http.axiosRef
      .post('http://localhost:3001/orbcomm/post', {
        body,
      })
      .then((apiResponse) => {
        console.log(apiResponse.data);
        const correctValues = verifyPostMessages(
          body.messages,
          apiResponse.data,
        );
        console.log(correctValues);
        resolve(correctValues);
      })
      .catch((error) => {
        reject(error.message);
      });
  });
};
