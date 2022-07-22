import { HttpService } from '@nestjs/axios';
import { ApiMethods, SendedType } from '../../index';

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
