import { NotFoundException } from '@nestjs/common';
import { OrbcommMessageStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  convertMessageStatus,
  DeviceApi,
  filterPayload,
  formatGetMessages,
  ForwardStatuses,
  OrbcommStatusMap,
  ReceiveDownloadData,
  Submission,
  Terminals,
  validatePrismaPromise,
} from '../../index';

export function verifyNewDevices(
  apiResponse: DeviceApi,
  prisma: PrismaService,
) {
  const listOfDevices = [];
  apiResponse.Terminals.forEach((terminal) => {
    const terminals = prisma.devices.findUnique({
      where: { deviceId: terminal.PrimeID },
    });
    listOfDevices.push(terminals);
  });
  return prisma.$transaction(listOfDevices).then((value) => {
    const newDevices: Terminals[] = [];
    value.forEach((item, index) => {
      if (!item) {
        newDevices.push(apiResponse.Terminals[index]);
      }
    });
    if (!newDevices.length) {
      throw new Error('No more devices to created');
    }
    return newDevices;
  });
}

export function createDevicesOrbcomm(
  apiResponse: Terminals[],
  prisma: PrismaService,
) {
  const orbcommDevicesList = [];
  apiResponse.forEach((terminal) => {
    const orbcommDevice = prisma.devices.create({
      data: {
        deviceId: terminal.PrimeID,
        status: 'ACTIVE',
        satelliteGateway: { connect: { name: 'ORBCOMM_V2' } },
      },
    });
    orbcommDevicesList.push(orbcommDevice);
  });
  return prisma.$transaction(orbcommDevicesList);
}

export function getString(obj) {
  return obj.nextMessage;
}

// TESTED!!

export async function findNextMessage(prisma: PrismaService): Promise<string> {
  const lastMessage = await prisma.orbcommNextMessage.findFirst({
    select: { nextMessage: true },
    orderBy: [{ id: 'desc' }],
    take: 1,
  });
  if (!lastMessage) {
    throw new NotFoundException(
      'NextMessage not found in table, verify your "orbcommNextMessage" table',
    );
  }
  return lastMessage.nextMessage;
}

export function upsertVersionMobile(
  downloadMessages: ReceiveDownloadData,
  prisma: PrismaService,
): any[] {
  try {
    const messagesWithPayload = filterPayload(downloadMessages);

    return messagesWithPayload.map((message) => {
      return prisma.orbcommVersionDevice.upsert({
        create: {
          deviceId: message.MobileID,
          SIN: message.Payload.SIN,
          MIN: message.Payload.MIN,
          name: message.Payload.Name,
          fields: message.Payload.Fields,
        },
        where: { deviceId: message.MobileID },
        update: {
          SIN: message.Payload.SIN,
          MIN: message.Payload.MIN,
          name: message.Payload.Name,
          fields: message.Payload.Fields,
        },
      });
    });
  } catch (error) {
    throw new Error(error.message);
  }
}

export function createNextUtc(
  previousMessage: string,
  nextMessage: string,
  prisma: PrismaService,
): any {
  try {
    return prisma.orbcommNextMessage.create({
      data: {
        previousMessage,
        nextMessage,
      },
    });
  } catch (error) {
    throw new Error(error.message);
  }
}

export function createGetMessages(
  downloadMessages: ReceiveDownloadData,
  prisma: PrismaService,
): any[] {
  try {
    const formattedMessages = formatGetMessages(downloadMessages);

    return formattedMessages.map((message) => {
      return prisma.orbcommGetMessages.create({
        data: message,
      });
    });
  } catch (error) {
    throw new Error(error.message);
  }
}

export function processPrisma(...args: any[]) {
  try {
    const validPrismaPromise = validatePrismaPromise(args);
    return function (prisma: PrismaService) {
      if (!validPrismaPromise.length) {
        throw new Error('processPrisma() receive no data to persist');
      }
      return prisma.$transaction(validPrismaPromise);
    };
  } catch (error) {
    throw new Error(error.message);
  }
}

/**
 *
 * @param gateway [ provide which gateway the function should return messages from ]
 * @param prisma [ provide the prism instance ]
 * @returns [ returns all messages with the status created ]
 */

export async function findCreatedMessages(
  gateway: string,
  prisma: PrismaService,
) {
  return await prisma.satelliteSendMessages.findMany({
    where: {
      AND: [
        { status: { equals: 'CREATED' } },
        {
          device: {
            satelliteGateway: { name: { equals: gateway } },
          },
        },
      ],
    },
    take: 50,
  });
}

export function createOrbcommSendMessage(
  messages: Submission[],
  prisma: PrismaService,
): any[] {
  try {
    return messages.map((message) => {
      return prisma.orbcommSendMessages.create({
        data: {
          sendMessageId: message.UserMessageID,
          deviceId: message.DestinationID,
          fwrdMessageId: message.ForwardMessageID.toString(),
          errorId: message.ErrorID,
          status: OrbcommMessageStatus[OrbcommStatusMap[message.ErrorID]],
        },
      });
    });
  } catch (error) {
    throw new Error(error.message);
  }
}

export function createOrbcomm(
  messages: Submission[],
  prisma: PrismaService,
): any[] {
  try {
    return messages.map((message) => {
      return prisma.satelliteSendMessages.update({
        where: { id: message.UserMessageID },
        data: {
          status: {
            set: convertMessageStatus(
              OrbcommMessageStatus[OrbcommStatusMap[message.ErrorID]],
            ),
          },
        },
      });
    });
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function findMessagesToCheck(prisma: PrismaService) {
  return await prisma.orbcommSendMessages.findMany({
    where: {
      OR: [{ status: 'SUBMITTED' }, { status: 'WAITING' }],
    },
  });
}

export function updateOrbcommStatus(
  apiResponse: ForwardStatuses,
  prisma: PrismaService,
): any[] {
  return apiResponse.Statuses.map((status) => {
    return prisma.orbcommSendMessages.update({
      where: { sendMessageId: status.ReferenceNumber },
      data: {
        status: { set: OrbcommMessageStatus[OrbcommStatusMap[status.State]] },
      },
    });
  });
}

export function updateSatelliteStatus(
  apiResponse: ForwardStatuses,
  prisma: PrismaService,
): any[] {
  return apiResponse.Statuses.map((status) => {
    return prisma.satelliteSendMessages.update({
      where: { id: status.ReferenceNumber },
      data: {
        status: {
          set: convertMessageStatus(
            OrbcommMessageStatus[OrbcommStatusMap[status.State]],
          ),
        },
      },
    });
  });
}
