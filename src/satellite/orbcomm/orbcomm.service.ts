import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import {
  OrbcommMessageStatus,
  SendMessages,
  SendMessagesOrbcomm,
} from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  OrbcommStatusMap,
  postApiMessages,
  ForwardStatuses,
  Submission,
  MessageBodyPost,
  convertMessageStatus,
  messagesExists,
  MessageBodyGetStatus,
  getMessagesOrbcommStatus,
} from './helpers/index';

@Injectable()
export class OrbcommService {
  constructor(private prisma: PrismaService, private http: HttpService) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async uploadMessage() {
    console.log('SEND MESSAGES PROCESS.....');

    try {
      this.findMessagesByStatus()
        .then(messagesExists)
        .then(this.formatMessageToPost)
        .then((apiPost) => postApiMessages(this.http, apiPost))
        .then((apiResponse) =>
          this.saveAndUpdateMessages(apiResponse, this.prisma),
        )
        .catch(console.log);
    } catch (error) {
      return error.message;
    }
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async checkMessages() {
    try {
      console.log('UPDATE MESSAGES');
      this.findMessagesByOrbcommStatus()
        .then(this.createListOfFwdIds)
        .then(this.formatMessageToGetStatus)
        .then((getParam) => getMessagesOrbcommStatus(this.http, getParam))
        .then((apiResponse) => this.updateFwdMessages(apiResponse, this.prisma))

        .then(console.log)
        .catch(console.log);
    } catch (error) {
      return error.message;
    }
  }

  async findMessagesByStatus() {
    const messagesWithStatusCreated = this.prisma.sendMessages.findMany({
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

  async findMessagesByOrbcommStatus(): Promise<SendMessagesOrbcomm[]> {
    const orbcommToUpdate = await this.prisma.sendMessagesOrbcomm.findMany({
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

  createListOfFwdIds(messagesToCheck: SendMessagesOrbcomm[]) {
    const listOfFwIds = [];

    messagesToCheck.forEach((message) => {
      listOfFwIds.push(message.fwrdMessageId);
    });

    return listOfFwIds;
  }
  formatMessageToGetStatus(listOfFwrId: number[]) {
    const messageBodyPost: MessageBodyGetStatus = {
      access_id: 'any_access',
      password: 'any_password',
      fwIDs: [],
    };
    listOfFwrId.forEach((n) => {
      messageBodyPost.fwIDs.push(n);
    });

    return messageBodyPost;
  }
  updateFwdMessages(statusList: ForwardStatuses, prisma: PrismaService) {
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

    this.prisma.$transaction(listUpdate);
  }
}
