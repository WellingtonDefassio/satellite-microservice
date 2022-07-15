import { HttpService } from '@nestjs/axios';
import {
  ApiMethods,
  BodyToGetMessage,
  DeviceApi,
  DownloadResponse,
  ForwardStatuses,
  MessageBodyGetStatus,
  MessageBodyPost,
  ReceiveDownloadData,
  SendedType,
  Submission,
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

///TESTED!!

export async function apiRequest(
  link: string,
  method: ApiMethods,
  sendedType: SendedType,
  dataToSend: any,
  http: HttpService,
) {
  try {
    return await http.axiosRef[method](link, {
      [sendedType]: dataToSend,
    })
      .then((apiResponse) => {
        return apiResponse.data;
      })
      .catch((err) => {
        throw new Error(err.message);
      });
  } catch (error) {
    throw Error(error.message);
  }
}
