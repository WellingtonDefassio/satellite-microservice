import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrbcommService {
  constructor(private prisma: PrismaService) {}
  async uploadMessage(message) {
    console.log(message);

    await this.prisma.sendMessagesOrbcomm.create({
      data: {
        deviceId: message.deviceId,
        sendMessageId: message.id,
      },
    });

    //TODO lógica para mandar a mensagem para a orbcomm
    //Perguntar se deve ser feito em uma pasta v2
  }

  async checkMessages() {
    //TODO lógica para check/atualizar os status das mensagens
    //também será responsável por atualizar o SendMessages onde o Gateway for Orbcomm.
  }
}
