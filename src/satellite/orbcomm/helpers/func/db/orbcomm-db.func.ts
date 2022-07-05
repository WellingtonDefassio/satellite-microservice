import { OrbcommMessageStatus, SendMessagesOrbcomm } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  convertMessageStatus,
  ForwardStatuses,
  OrbcommStatusMap,
  Submission,
} from '../../index';

export function saveAndUpdateMessages(
  messages: Submission[],
  prisma: PrismaService,
) {
  return new Promise((resolve) => {
    const prismaList = [];
    messages.forEach((message) => {
      const createMessage = prisma.sendMessagesOrbcomm.create({
        data: {
          sendMessageId: message.UserMessageID,
          deviceId: message.DestinationID,
          fwrdMessageId: message.ForwardMessageID.toString(),
          errorId: message.ErrorID,
          status: OrbcommMessageStatus[OrbcommStatusMap[message.ErrorID]],
        },
      });
      const updateMessage = prisma.sendMessages.update({
        where: { id: message.UserMessageID },
        data: {
          status: {
            set: convertMessageStatus(
              OrbcommMessageStatus[OrbcommStatusMap[message.ErrorID]],
            ),
          },
        },
      });
      prismaList.push(createMessage, updateMessage);
    });

    resolve(prisma.$transaction(prismaList));
  });
}

export function updateFwdMessages(
  statusList: ForwardStatuses,
  prisma: PrismaService,
) {
  console.log(statusList);
  const listUpdate = [];
  statusList.Statuses.forEach((status) => {
    const updateSendMessage = prisma.sendMessages.update({
      where: { id: status.ReferenceNumber },
      data: {
        status: {
          set: convertMessageStatus(
            OrbcommMessageStatus[OrbcommStatusMap[status.State]],
          ),
        },
      },
    });
    const updateOrbcommMessage = prisma.sendMessagesOrbcomm.update({
      where: { sendMessageId: status.ReferenceNumber },
      data: {
        status: { set: OrbcommMessageStatus[OrbcommStatusMap[status.State]] },
      },
    });
    listUpdate.push(updateOrbcommMessage, updateSendMessage);
  });

  prisma.$transaction(listUpdate);
}

export function findMessagesByStatus(prisma: PrismaService) {
  const messagesWithStatusCreated = prisma.sendMessages.findMany({
    where: {
      AND: [
        { status: { equals: 'CREATED' } },
        {
          device: {
            satelliteGateway: { name: { equals: 'ORBCOMM_V2' } },
          },
        },
      ],
    },
    take: 50,
  });
  return messagesWithStatusCreated;
}

export async function findMessagesByOrbcommStatus(
  prisma: PrismaService,
): Promise<SendMessagesOrbcomm[]> {
  const orbcommToUpdate = prisma.sendMessagesOrbcomm.findMany({
    where: {
      AND: [
        {
          sendMessage: {
            device: { satelliteGateway: { name: { equals: 'ORBCOMM_V2' } } },
          },
        },
        { status: { equals: 'SUBMITTED' } },
      ],
    },
  });
  return orbcommToUpdate;
}
