import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { MessageStatus, StatusOrbcommMessage } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  SendMessagesOrbcommDto,
  StatusOrbcommEnum,
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
    });
    console.log(listOfCreatedMessages);

    const { Submission }: SubmitResponse = await this.http.axiosRef
      .post('http://localhost:3001/fakeorbcomm/getobject')
      .then(async (resolve) => {
        return await resolve.data;
      })
      .catch(async (reject) => {
        throw new Error(reject.message);
      });

    const list = Submission.map((sub) => new SendMessagesOrbcommDto(sub));

    list.map(
      async (list) =>
        await this.prisma.sendMessages.update({
          where: { id: list.sendMessageId },
          data: { status: { set: this.transformStatus(list.statusOrbcomm) } },
        }),
    );

    await this.prisma.sendMessagesOrbcomm.createMany({
      data: list,
      skipDuplicates: true,
    });

    // Submission.map((sub) => {
    //   const result = listOfCreatedMessages.find(
    //     (mes) => mes.id === sub.UserMessageID,
    //   );
    //   this.prisma.sendMessagesOrbcomm.create({
    //     data: {
    //       deviceId: result.deviceId,
    //       statusOrbcomm: sub.ErrorID,
    //     },
    //   });
    // });
  }

  // console.log(Statuses[0].ReferenceNumber);

  // await this.prisma.sendMessagesOrbcomm.updateMany({
  //   where: { sendMessageId: { equals: Statuses.ReferenceNumber } },
  //   data: { statusOrbcomm: { set: Statuses.State } },
  // });

  //TODO lógica para mandar a mensagem para a orbcomm
  //Perguntar se deve ser feito em uma pasta v2

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
      take: 3,
    });

    const { Statuses } = await this.http.axiosRef
      .post('http://localhost:3001/fakeorbcomm/getfwd')
      .then(async (resolve) => {
        return await resolve.data;
      })
      .catch(async (reject) => {
        throw new Error(reject.message);
      });
    //TODO atualizar lista da tabela orbcomm.
    Statuses.map(
      async (objects) =>
        await this.prisma.sendMessages.update({
          where: { id: objects.ReferenceNumber },
          data: {
            status: {
              set: this.transformStatus(
                //TODO arrumar metodo de conversao ENUM.
                StatusOrbcommMessage[StatusOrbcommEnum[objects.State]],
              ),
            },
          },
        }),
    );
  }

  transformStatus(status: StatusOrbcommMessage): MessageStatus {
    if (status === 'RECEIVED' || status === 'TRANSMITTED') {
      return 'SENDED';
    }
    if (status === 'SUBMITTED' || status === 'WAITING') {
      return 'SUBMITTED';
    }
    if (status === 'TIMEOUT') {
      return 'TIMEOUT';
    }
    if (status === 'DELIVERY_FAILED' || status === 'ERROR') {
      return 'FAILED';
    }
    if (status === 'CANCELLED') {
      return 'CANCELLED';
    }
  }
}
