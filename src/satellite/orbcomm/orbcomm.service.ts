import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
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
import {
  convertMessageStatus,
  exists,
} from './helpers/validators/orbcomm.validators';

@Injectable()
export class OrbcommService {
  constructor(private prisma: PrismaService, private http: HttpService) {}
  // @Cron('15 * * * * *')
  async uploadMessage() {
    console.log('SEND MESSAGES PROCESS.....');

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

    exists(messagesWithStatusCreated);
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
  }

  // @Cron('45 * * * * *')
  async checkMessages() {
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
  }

  private async updateUploadMessages(
    Statuses: StatusesType[],
    messagesToUpdate: SendMessagesOrbcomm[],
  ) {
    const apiMessagesWithNewStatus = Statuses.map(
      (returnApiStatus) => new UpdateStatusMessagesOrbcommDto(returnApiStatus),
    );

    messagesToUpdate.map(async (messageUpdate) => {
      const updatedMessage = apiMessagesWithNewStatus.find(
        (messageNewStatus) =>
          messageNewStatus.sendMessageId === messageUpdate.sendMessageId,
      );
      exists(updatedMessage);
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
  }

  private async createAndUpdateUploadMessages(
    messagesWithStatusCreated: SendMessages[],
    Submission: Submission[],
  ) {
    const orbcommMessagesDto = Submission.map(
      (returnApiMessage) => new SendMessagesOrbcommDto(returnApiMessage),
    );

    messagesWithStatusCreated.map(async (objectStatusCreated) => {
      const submittedMessages = orbcommMessagesDto.find(
        (OrbcommObjectSubmitted) =>
          OrbcommObjectSubmitted.sendMessageId === objectStatusCreated.id,
      );

      exists(submittedMessages);

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
  }
}
