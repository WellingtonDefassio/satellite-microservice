import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  messagesExists,
  formatMessageToPost,
  postApiMessages,
  saveAndUpdateMessages,
  createListOfFwdIds,
  formatMessageToGetStatus,
  orbcommApiGetStatus,
  updateFwdMessages,
  findMessagesByStatus,
  findMessagesByOrbcommStatus,
} from './helpers/index';

@Injectable()
export class OrbcommService {
  constructor(private prisma: PrismaService, private http: HttpService) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async uploadMessage() {
    console.log('SEND MESSAGES PROCESS.....');

    try {
      findMessagesByStatus(this.prisma)
        .then(messagesExists)
        .then(formatMessageToPost)
        .then((messageToPost) => postApiMessages(messageToPost, this.http))
        .then((apiResponse) => saveAndUpdateMessages(apiResponse, this.prisma))

        .catch((erro) => console.log(erro.message));
    } catch (error) {
      return error.message;
    }
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async checkMessages() {
    console.log('UPDATE MESSAGES PROCESS...');
    try {
      findMessagesByOrbcommStatus(this.prisma)
        .then(createListOfFwdIds)
        .then(messagesExists)
        .then(formatMessageToGetStatus)
        .then((getParam) => orbcommApiGetStatus(getParam, this.http))
        .then((apiResponse) => updateFwdMessages(apiResponse, this.prisma))

        .catch((erro) => console.log(erro.message));
    } catch (error) {
      return error;
    }
  }
}
