import { MessageStatus, OrbcommMessageStatus } from '@prisma/client';
import { ReceiveDownloadData } from '../../index';

export function convertMessageStatus(
  status: OrbcommMessageStatus,
): MessageStatus {
  switch (status) {
    case 'RECEIVED':
    case 'TRANSMITTED':
      return 'SENDED';
    case 'SUBMITTED':
    case 'WAITING':
      return 'SUBMITTED';
    case 'TIMEOUT':
      return 'TIMEOUT';
    case 'DELIVERY_FAILED':
    case 'ERROR':
    case 'INVALID':
      return 'FAILED';
    case 'CANCELLED':
      return 'CANCELLED';
  }
}

//TESTED

/**
 * @param {[ReceiveDownloadData]} body [return of api Orbcomm]
 * @returns {[ReceiveDownloadData]} [return the same data of param if validate data pass, else return a error]
 */

export function validateDownloadData(
  body: ReceiveDownloadData,
): ReceiveDownloadData {
  if (body.Messages === null && body.ErrorID === 0)
    throw new Error('no more messages available');
  if (body.ErrorID !== 0)
    throw new Error(`ErrorID ${body.ErrorID} check the api error!`);
  else return body;
}

/**
 * @param {any[]} args [receive the return of prisma operation to persist in a prisma.$transaction]
 * @returns {[array]} [if some operation return a empty array this is will be filter of the return]
 */

export function validatePrismaPromise(args: any[]): any[] {
  return args.filter((value) => !Array.isArray(value));
}

/**
 *
 * @param {string} nameServiceTest [ the name of the operation on which the return is being tested ]
 * @returns [ if the tested content is an empty array it will return an error with the given name, otherwise it will return the given content ]
 */

export function arrayExistsValidate(
  nameServiceTest: string,
): (args: any[]) => any[] {
  return function (args: any[]): any[] {
    if (!args.length) {
      throw new Error(`${nameServiceTest} no more data to processing`);
    } else {
      return args;
    }
  };
}

/**
 *
 * @param sendedData [ list of data sent to api ]
 * @param arg [ which argument of the sent list will be compared ]
 * @param responseData [ list of data returned from api ]
 * @param arg2 [ which argument of the returned list should be compared ]
 * @returns [ will return only the data that matches with the data sent ]
 */

export function validateApiRes(
  sendedData: any[],
  arg: string,
  responseData: any[],
  arg2: string,
) {
  if (!Array.isArray(sendedData) || !Array.isArray(responseData)) {
    throw new Error('sendedData and responseData need to be a array!');
  }
  return responseData.filter((res) =>
    sendedData.some((send) => res[arg2] === send[arg]),
  );
}
