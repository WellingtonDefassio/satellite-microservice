import { MessageStatus, OrbcommMessageStatus } from '@prisma/client';
import { ReceiveDownloadData, Submission } from '../../index';

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
    default:
      break;
  }
}

export const verifyPostMessages = (sendedData, responseData): Submission[] => {
  const validItems: Submission[] = [];
  responseData.Submissions.map((apiResponse) => {
    const exists = sendedData.find(
      (data) => data.UserMessageID === apiResponse.UserMessageID,
    );
    if (exists) {
      validItems.push(apiResponse);
    }
  });
  return validItems;
};

//TESTED

/**
 * @param {[ReceiveDownloadData]} body [return of api Orbcomm]
 * @returns {[ReceiveDownloadData]} [return the same data of param if validate data pass, else return a error]
 */

export function validateDownloadData(
  body: ReceiveDownloadData,
): ReceiveDownloadData {
  if (body.Messages === null) throw new Error('no more messages available');
  if (body.ErrorID !== 0)
    throw new Error(`Error id ${body.ErrorID} check the api error!`);
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
  return function (args: any[]) {
    if (!args.length) {
      throw new Error(`${nameServiceTest} no more data to processing`);
    } else {
      return args;
    }
  };
}
