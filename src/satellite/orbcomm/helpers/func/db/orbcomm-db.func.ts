import { OrbcommMessageStatus, SendMessagesOrbcomm } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  convertMessageStatus,
  DeviceApi,
  DownloadResponse,
  ForwardStatuses,
  OrbcommStatusMap,
  Submission,
  Terminals,
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

export function findMessagesByOrbcommStatus(
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

export function findNextMessage(prisma: PrismaService) {
  const nextMessage = prisma.orbcommNextMessage.findFirst({
    select: { nextMessage: true },
    orderBy: [{ id: 'desc' }],
    take: 1,
  });
  return nextMessage;
}

export function createData(messages: DownloadResponse, prisma: PrismaService) {
  try {
    const dataToPersist = [];
    const nextMessage = prisma.orbcommNextMessage.create({
      data: {
        previousMessage: messages.previousMessage,
        nextMessage: messages.apiResponseData.NextStartUTC,
      },
    });
    dataToPersist.push(nextMessage);
    messages.apiResponseData.Messages.forEach((message) => {
      if (message.Payload) {
        const payload = prisma.orbcommVersionDevice.upsert({
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
        dataToPersist.push(payload);
      }
      const getMessage = prisma.orbcommGetMessage.create({
        data: {
          messageId: message.ID.toString(),
          messageUTC: new Date(message.MessageUTC),
          receiveUTC: new Date(message.ReceiveUTC),
          deviceId: message.MobileID,
          SIN: message.SIN,
          MIN: message.RawPayload[1],
          payload: message.RawPayload.toString(),
          regionName: message.RegionName,
          otaMessageSize: message.OTAMessageSize,
          costumerID: message.CustomerID,
          transport: message.Transport,
          mobileOwnerID: message.MobileOwnerID.toString(),
        },
      });

      dataToPersist.push(getMessage);
    });
    prisma
      .$transaction(dataToPersist)
      .then(() => console.log('messages criadas com sucesso!'))
      .catch((error) => {
        throw new Error(error.message);
      });
  } catch (error) {
    throw new Error(error.message);
  }
}

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
