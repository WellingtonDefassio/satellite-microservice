import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import {
  OrbcommMessageStatus,
  SendMessages,
  SendMessagesOrbcomm,
} from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { formatMessagesToPost } from './helpers/functions/send-messages.functions';
import {
  Submission,
  StatusesType,
  convertMessageStatus,
  SendMessagesOrbcommDto,
  UpdateStatusMessagesOrbcommDto,
  PostMessagesParams,
  SubmitResponse,
  OrbcommStatusMap,
} from './helpers/index';

@Injectable()
export class OrbcommService {
  constructor(private prisma: PrismaService, private http: HttpService) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async uploadMessage() {
    console.log('SEND MESSAGES PROCESS.....');

    try {
      await this.prisma.sendMessages
        .findMany({
          where: {
            AND: [
              { deviceGateWay: { equals: 'ORBCOMM_V2' } },
              { status: { equals: 'CREATED' } },
            ],
          },
          take: 50,
        })
        .then(formatMessagesToPost)
        .then((sendPostMessages) =>
          this.postMessagesOrbcomm('fakeorbcomm/getobject', sendPostMessages),
        )
        .then(this.createAndUpdatePost);

      // if (!messagesWithStatusCreated) return;
      // //TODO logica para caso não haja objetos -> helper
      // console.log(messagesWithStatusCreated);
      // //TODO implementar logica de envio de lista para orbcomm
      // //TODO envio da mensagem para API deve conter (access_id, password) <= padrão + message => {DestinationID = DeviceID, UserMessageID = SendMessagesID, RawPayload = SendMessagesPayload}

      // const { Submission }: SubmitResponse = await this.http.axiosRef
      //   .post('http://localhost:3001/fakeorbcomm/getobject')
      //   .then(async (resolve) => {
      //     return await resolve.data;
      //   })
      //   .catch(async (reject) => {
      //     throw new Error(reject.message);
      //   });

      // await this.createAndUpdateUploadMessages(
      //   messagesWithStatusCreated,
      //   Submission,
      // );
    } catch (error) {
      return 'not found';
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

      // await this.updateUploadMessages(Statuses, messagesToUpdate);
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

  private postMessagesOrbcomm = (link: string, data: PostMessagesParams) => {
    return new Promise((resolve) => {
      resolve(
        this.http.axiosRef
          .post('http://localhost:3001/' + link, {
            data,
          }) //LINK = ORBCOMM/FAKE
          .then((resolve) => {
            return this.verifyPostMessages(data, resolve.data);
          })
          .catch((reject) => {
            return reject.message;
          }),
      );
    });
  };

  private verifyPostMessages = (
    data: PostMessagesParams,
    resolveData: SubmitResponse,
  ): Submission[] => {
    const validItems = [];
    resolveData.Submission.map((apiResponse) => {
      const exists = data.messages.find(
        (data) => data.UserMessageID === apiResponse.UserMessageID,
      );
      if (exists) {
        validItems.push(apiResponse);
      }
    });
    console.log(validItems);
    return validItems;
  };
  createAndUpdatePost = (createAndUpdatePost: Submission[]) => {
    createAndUpdatePost.map(async (item) => {
      await this.prisma.sendMessages.update({
        where: { id: item.UserMessageID },
        data: {
          status: {
            set: convertMessageStatus(
              OrbcommMessageStatus[OrbcommStatusMap[item.ErrorID]],
            ),
          },
        },
      });
      await this.prisma.sendMessagesOrbcomm.create({
        data: {
          deviceId: item.DestinationID,
          fwrdMessageId: item.ForwardMessageID,
          sendMessageId: item.UserMessageID,
          statusOrbcomm: OrbcommMessageStatus[OrbcommStatusMap[item.ErrorID]],
        },
      });
    });
  };
}
