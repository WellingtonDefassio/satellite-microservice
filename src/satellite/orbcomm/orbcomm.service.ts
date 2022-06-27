import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { OrbcommMessageStatus, SendMessagesOrbcomm } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  formatMessagesToPost,
  verifyPostMessages,
} from './helpers/functions/send-messages.functions';
import {
  Submission,
  StatusesType,
  convertMessageStatus,
  UpdateStatusMessagesOrbcommDto,
  PostMessagesParams,
  OrbcommStatusMap,
} from './helpers/index';

@Injectable()
export class OrbcommService {
  constructor(private prisma: PrismaService, private http: HttpService) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async uploadMessage() {
    console.log('SEND MESSAGES PROCESS.....');

    try {
      this.findCreatedList()
        .then(formatMessagesToPost)
        .then((postMessages) =>
          this.postMessagesOrbcomm('fakeorbcomm/getobject', postMessages),
        )
        .then(this.createAndUpdateSendMessages);
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
    } catch (error) {
      return 'not found';
    }
  }
  private postMessagesOrbcomm = (url: string, body: PostMessagesParams) => {
    return new Promise((resolve) => {
      resolve(
        this.http.axiosRef
          .post('http://localhost:3001/' + url, {
            body,
          }) //LINK = ORBCOMM/FAKE
          .then((resolve) => {
            return verifyPostMessages(body.messages, resolve.data.Submission);
          })
          .catch((reject) => {
            return reject.message;
          }),
      );
    });
  };

  private createAndUpdateSendMessages = (createAndUpdatePost: Submission[]) => {
    createAndUpdatePost.map(async (item) => {
      const updateSatellite = this.prisma.sendMessages.update({
        where: { id: item.UserMessageID },
        data: {
          status: {
            set: convertMessageStatus(
              OrbcommMessageStatus[OrbcommStatusMap[item.ErrorID]],
            ),
          },
        },
      });
      const createOrbcomm = this.prisma.sendMessagesOrbcomm.create({
        data: {
          deviceId: item.DestinationID,
          fwrdMessageId: item.ForwardMessageID,
          sendMessageId: item.UserMessageID,
          statusOrbcomm: OrbcommMessageStatus[OrbcommStatusMap[item.ErrorID]],
        },
      });
      this.prisma.$transaction([createOrbcomm, updateSatellite]);
    });
  };
  private findCreatedList = async () => {
    const list = await this.prisma.sendMessages.findMany({
      where: {
        AND: [
          { deviceGateWay: { equals: 'ORBCOMM_V2' } },
          { status: { equals: 'CREATED' } },
        ],
      },
      take: 50,
    });
    return list;
  };

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
}
