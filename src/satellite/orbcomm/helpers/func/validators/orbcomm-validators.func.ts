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

export function messagesExists(messagesToUpload) {
  console.log(messagesToUpload);
  if (!messagesToUpload.length) {
    throw new Error('no more messages available');
  } else {
    return messagesToUpload;
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

export function validateDownloadData(
  body: ReceiveDownloadData,
): ReceiveDownloadData {
  if (body.Messages === null) throw new Error('no more messages available');
  if (body.ErrorID !== 0)
    throw new Error(`Error id ${body.ErrorID} check the api error!`);
  else return body;
}
