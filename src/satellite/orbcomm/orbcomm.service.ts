import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrbcommService {
  constructor(private prisma: PrismaService, private http: HttpService) {}
  async uploadMessage(message) {
    console.log(message);

    await this.prisma.sendMessagesOrbcomm.create({
      data: {
        deviceId: message.deviceId,
        sendMessageId: message.id,
      },
    });

    const { ErrorID, Statuses, NextStartUTC } = await this.http.axiosRef
      .get('http://localhost:3001/fakeorbcomm/getobject')
      .then(async (resolve) => {
        return await resolve.data;
      })
      .catch(async (reject) => {
        throw new Error(reject.message);
      });

    console.log(Statuses[0].ReferenceNumber);

    // await this.prisma.sendMessagesOrbcomm.updateMany({
    //   where: { sendMessageId: { equals: Statuses.ReferenceNumber } },
    //   data: { statusOrbcomm: { set: Statuses.State } },
    // });

    //TODO lógica para mandar a mensagem para a orbcomm
    //Perguntar se deve ser feito em uma pasta v2
  }

  async checkMessages() {
    //TODO lógica para check/atualizar os status das mensagens
    //também será responsável por atualizar o SendMessages onde o Gateway for Orbcomm.
  }
}
