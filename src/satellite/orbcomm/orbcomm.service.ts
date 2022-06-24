import { HttpService } from '@nestjs/axios';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { SendMessages, SendMessagesOrbcomm } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  SendMessagesOrbcommDto,
  UpdateStatusMessagesOrbcommDto,
} from './helpers/dtos/upload-message.dto';
import {
  SubmitResponse,
  ForwardStatuses,
  Submission,
  StatusesType,
} from './helpers/interfaces/upload-messages.interfaces';
import { convertMessageStatus } from './helpers/validators/orbcomm.validators';

@Injectable()
export class OrbcommService {
  constructor(private prisma: PrismaService, private http: HttpService) {}
  @Cron('15 * * * * *')
  async uploadMessage() {
    console.log('SEND MESSAGES PROCESS.....');

    try {
      const messagesWithStatusCreated: SendMessages[] =
        await this.prisma.sendMessages.findMany({
          where: {
            AND: [
              { deviceGateWay: { equals: 'ORBCOMM_V2' } },
              { status: { equals: 'CREATED' } },
            ],
          },
          take: 50,
        });

      if (!messagesWithStatusCreated) return;
      //TODO logica para caso não haja objetos -> helper
      console.log(messagesWithStatusCreated);
      //TODO implementar logica de envio de lista para orbcomm
      //TODO envio da mensagem para API deve conter (access_id, password) <= padrão + message => {DestinationID = DeviceID, UserMessageID = SendMessagesID, RawPayload = SendMessagesPayload}

      const { Submission }: SubmitResponse = await this.http.axiosRef
        .post('http://localhost:3001/fakeorbcomm/getobject')
        .then(async (resolve) => {
          return await resolve.data;
        })
        .catch(async (reject) => {
          throw new Error(reject.message);
        });

      await this.createAndUpdateUploadMessages(
        messagesWithStatusCreated,
        Submission,
      );
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

  private async createAndUpdateUploadMessages(
    messagesWithStatusCreated: SendMessages[],
    Submission: Submission[],
  ) {
    try {
      const orbcommMessagesDto = Submission.map(
        (returnApiMessage) => new SendMessagesOrbcommDto(returnApiMessage),
      );

      console.log(messagesWithStatusCreated, orbcommMessagesDto);
      messagesWithStatusCreated.map(async (objectStatusCreated) => {
        const submittedMessages = orbcommMessagesDto.find(
          (orbcommObjectSubmitted) =>
            orbcommObjectSubmitted.sendMessageId === objectStatusCreated.id,
        );

        if (!submittedMessages) return;

        await this.prisma.sendMessages.update({
          where: { id: submittedMessages.sendMessageId },
          data: {
            status: {
              set: convertMessageStatus(submittedMessages.statusOrbcomm),
            },
          },
        });
        await this.prisma.sendMessagesOrbcomm.create({
          data: {
            deviceId: submittedMessages.deviceId,
            fwrdMessageId: submittedMessages.fwrdMessageId,
            sendMessageId: submittedMessages.sendMessageId,
            statusOrbcomm: submittedMessages.statusOrbcomm,
          },
        });
      });
    } catch (error) {
      throw Error(error.message);
    }
  }
}
