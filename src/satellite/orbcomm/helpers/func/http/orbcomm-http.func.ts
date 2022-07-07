import { HttpService } from '@nestjs/axios';
import {
  BodyToGetMessage,
  DeviceApi,
  DownloadResponse,
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

export const orbcommApiPostMessages = (
  body: MessageBodyPost,
  http: HttpService,
) => {
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

export const orbcommApiDownloadMessages = (
  body: BodyToGetMessage,
  http: HttpService,
) => {
  return new Promise<DownloadResponse>((resolve, reject) => {
    http.axiosRef
      .get('http://localhost:3001/orbcomm/download', {
        params: body,
      })
      .then((apiResponse) => {
        const apiResponseData = apiResponse.data;
        const previousMessage = body.start_utc;
        resolve({ apiResponseData, previousMessage });
      });
  });
};

export const orbcommDevices = (http: HttpService) => {
  return new Promise<DeviceApi>((resolve, reject) => {
    http.axiosRef
      .get(
        'https://isatdatapro.orbcomm.com/GLGW/2/RestMessages.svc/JSON/get_terminals_info/?access_id=70002657&password=ZFLLYNJL',
      )
      .then((value) => {
        resolve(value.data);
      });
  });
};
