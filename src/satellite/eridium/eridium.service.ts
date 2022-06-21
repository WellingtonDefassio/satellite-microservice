import { Injectable } from '@nestjs/common';

@Injectable()
export class EridiumService {
  async uploadMessage(message) {
    return 'este é um aparelho ERIDUM';
  }
  async checkMessages() {
    //TODO lógica para check/atualizar os status das mensagens
    //também será responsável por atualizar o SendMessages onde o Gateway for Eridium.
  }
}
