import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import {
  MessageStatus,
  OrbcommMessageStatus,
  SendMessages,
  SendMessagesOrbcomm,
} from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  OrbcommStatusMap,
  UpdateStatusMessagesOrbcommDto,
} from './helpers/dtos/upload-message.dto';
import { postApiMessages } from './helpers/func/upload-functions';
import {
  ForwardStatuses,
  Submission,
  StatusesType,
  MessageBodyPost,
} from './helpers/interfaces/upload-messages.interfaces';
import {
  convertMessageStatus,
  messagesExists,
} from './helpers/validators/orbcomm.validators';

@Injectable()
export class OrbcommService {
  constructor(private prisma: PrismaService, private http: HttpService) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async uploadMessage() {
    console.log('SEND MESSAGES PROCESS.....');

    try {
      this.findMessagesByStatus('CREATED', 'ORBCOMM_V2')
        .then(messagesExists)
        .then(this.formatMessageToPost)
        .then((apiPost) => postApiMessages(this.http, apiPost))
        .then((apiResponse) =>
          this.saveAndUpdateMessages(apiResponse, this.prisma),
        )
        .then(console.log)
        .catch(console.log);
    } catch (error) {
      return error.message;
    }
  }

  @Cron('45 * * * * *')
  async checkMessages() {
    try {
      console.log('UPDATE MESSAGES PROCESS....');
      const messagesToUpdate: SendMessagesOrbcomm[] =
        await this.prisma.sendMessagesOrbcomm.findMany({
          where: {
            OR: [
              { statusOrbcomm: { equals: 'SUBMITTED' } },
              { statusOrbcomm: { equals: 'WAITING' } },
            ],
          },
          take: 50,
        });

      console.log(messagesToUpdate);

      //TODO metodo que gera uma lista de menssagens para consulta na api posteriormente atualizada

      const { Statuses }: ForwardStatuses = await this.http.axiosRef
        .post('http://localhost:3001/fakeorbcomm/getfwd')
        .then(async (resolve) => {
          return await resolve.data;
        })
        .catch(async (reject) => {
          throw new Error(reject.message);
        });

      await this.updateUploadMessages(Statuses, messagesToUpdate);
    } catch (error) {
      return 'not found';
    }
  }

  private async updateUploadMessages(
    Statuses: StatusesType[],
    messagesToUpdate: SendMessagesOrbcomm[],
  ) {
    try {
      const apiMessagesWithNewStatus = Statuses.map(
        (returnApiStatus) =>
          new UpdateStatusMessagesOrbcommDto(returnApiStatus),
      );

      messagesToUpdate.map(async (messageUpdate) => {
        const updatedMessage = apiMessagesWithNewStatus.find(
          (messageNewStatus) =>
            messageNewStatus.sendMessageId === messageUpdate.sendMessageId,
        );
        if (!updatedMessage) return;
        await this.prisma.sendMessages.update({
          where: { id: updatedMessage.sendMessageId },
          data: {
            status: {
              set: convertMessageStatus(updatedMessage.statusOrbcomm),
            },
          },
        });
        await this.prisma.sendMessagesOrbcomm.update({
          where: { sendMessageId: updatedMessage.sendMessageId },
          data: { statusOrbcomm: { set: updatedMessage.statusOrbcomm } },
        });
      });
    } catch (error) {
      throw Error(error.message);
    }
  }

  async findMessagesByStatus(status: MessageStatus, gatewayName: string) {
    const messagesWithStatusCreated: SendMessages[] =
      await this.prisma.sendMessages.findMany({
        where: {
          AND: [
            { status: { equals: status } },
            {
              device: {
                satelliteGateway: { name: { equals: gatewayName } },
              },
            },
          ],
        },
        take: 50,
      });
    return messagesWithStatusCreated;
  }
  formatMessageToPost(messages: SendMessages[]): MessageBodyPost {
    const messageBodyPost: MessageBodyPost = {
      access_id: 'any_access',
      password: 'any_password',
      messages: [],
    };
    messages.forEach((message) =>
      messageBodyPost.messages.push({
        DestinationID: message.deviceId,
        UserMessageID: message.id,
        RawPayload: Buffer.from(message.payload).toJSON().data,
      }),
    );
    return messageBodyPost;
  }

  saveAndUpdateMessages(messages: Submission[], prisma: PrismaService) {
    return new Promise((resolve) => {
      const prismaList = [];
      messages.forEach((message) => {
        const createMessage = prisma.sendMessagesOrbcomm.create({
          data: {
            sendMessageId: message.UserMessageID,
            deviceId: message.DestinationID,
            fwrdMessageId: message.ForwardMessageID.toString(),
            errorId: message.ErrorID,
            statusOrbcomm:
              OrbcommMessageStatus[OrbcommStatusMap[message.ErrorID]],
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
}
