import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { MessageStatus, OrbcommMessageStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  OrbcommStatusMap,
  SendMessagesOrbcommDto,
  UpdateStatusMessagesOrbcommDto,
} from './dtos/upload-message.dto';

interface SubmitResponse {
  ErrorID: number;
  Submission: Submission[];
}

interface Submission {
  ForwardMessageID: number;
  DestinationID: string;
  ErrorID: number;
  UserMessageID: number;
}
@Injectable()
export class OrbcommService {
  constructor(private prisma: PrismaService, private http: HttpService) {}

  @Cron('15 * * * * *')
  async uploadMessage() {
    console.log('SEND MESSAGES PROCESS.....');

    const listOfCreatedMessages = await this.prisma.sendMessages.findMany({
      where: {
        AND: [
          { deviceGateWay: { equals: 'ORBCOMM_V2' } },
          { status: { equals: 'CREATED' } },
        ],
      },
      take: 50,
    });
    console.log(listOfCreatedMessages);

    //TODO implementar logica de envio de lista para orbcomm
    //TODO o envio da mensagem para a api devera colocar o campo USERMESSAGEID = ID SATELLITE

    const { Submission }: SubmitResponse = await this.http.axiosRef
      .post('http://localhost:3001/fakeorbcomm/getobject')
      .then(async (resolve) => {
        return await resolve.data;
      })
      .catch(async (reject) => {
        throw new Error(reject.message);
      });

    const sendingMessages = Submission.map(
      (sub) => new SendMessagesOrbcommDto(sub),
    );

    console.log('SENDING MESSAGES' + sendingMessages);

    listOfCreatedMessages.map(async (itemList) => {
      const elementToPersist = sendingMessages.find(
        (sendM) => sendM.sendMessageId === itemList.id,
      );
      if (!elementToPersist) {
        console.log('entrou');
        return;
      }
      await this.prisma.sendMessages.update({
        where: { id: elementToPersist.sendMessageId },
        data: {
          status: {
            set: this.convertMessageStats(elementToPersist.statusOrbcomm),
          },
        },
      });
    });

    console.log('??????????????');

    await this.prisma.sendMessagesOrbcomm.createMany({
      data: sendingMessages,
      skipDuplicates: true,
    });
  }

  @Cron('45 * * * * *')
  async checkMessages() {
    //TODO lógica para check/atualizar os status das mensagens

    console.log('UPDATE MESSAGES PROCESS....');

    const messagesToUpdate = await this.prisma.sendMessagesOrbcomm.findMany({
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

    const { Statuses } = await this.http.axiosRef
      .post('http://localhost:3001/fakeorbcomm/getfwd')
      .then(async (resolve) => {
        return await resolve.data;
      })
      .catch(async (reject) => {
        throw new Error(reject.message);
      });

    const dataToUpDate = Statuses.map(
      (objects) => new UpdateStatusMessagesOrbcommDto(objects),
    );
    console.log(dataToUpDate);

    //TODO atualizar lista da tabela orbcomm.

    messagesToUpdate.map(async (itemList) => {
      const elementToPersist = await dataToUpDate.find(
        (sendM) => sendM.sendMessageId === itemList.sendMessageId,
      );
      if (!elementToPersist) {
        console.log(elementToPersist);
        return;
      }
      await this.prisma.sendMessages.update({
        where: { id: elementToPersist.sendMessageId },
        data: {
          status: {
            set: this.convertMessageStats(elementToPersist.statusOrbcomm),
          },
        },
      });
    });
    messagesToUpdate.map(async (itemList) => {
      const elementToPersist = dataToUpDate.find(
        (sendM) => sendM.sendMessageId === itemList.sendMessageId,
      );
      if (!elementToPersist) {
        console.log(elementToPersist);
        return;
      }
      await this.prisma.sendMessagesOrbcomm.update({
        where: { sendMessageId: elementToPersist.sendMessageId },
        data: {
          statusOrbcomm: {
            set: elementToPersist.statusOrbcomm,
          },
        },
      });
    });
  }

  convertMessageStats(status: OrbcommMessageStatus): MessageStatus {
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
        return 'FAILED';
      case 'CANCELLED':
        return 'CANCELLED';
      default:
        break;
    }
  }
}
