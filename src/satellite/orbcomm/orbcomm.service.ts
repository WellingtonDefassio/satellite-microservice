/* eslint-disable prettier/prettier */
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { env } from 'process';
import { PrismaService } from '../../prisma/prisma.service';
import {
  saveAndUpdateMessages,
  createListOfFwdIds,
  formatMessageToGetStatus,
  orbcommApiGetStatus,
  updateFwdMessages,
  findMessagesByOrbcommStatus,
  findNextMessage,
  orbcommApiPostMessages,
  formatParamsToGetMessages,
  orbcommApiDownloadMessages,
  orbcommDevices,
  verifyNewDevices,
  createDevicesOrbcomm,
  getString,
  validateDownloadData,
  createNextUtc,
  filterPayload,
  upsertVersionMobile,
  createGetMessages,
  processPrisma,
  BasicOrbcomm,
  findCreatedMessages,
  arrayExistsValidate,
  formatMessagesToPostOrbcomm,
} from './helpers/index';



@Injectable()
export class OrbcommService {
  constructor(private prisma: PrismaService, private http: HttpService) {}

   @Cron(CronExpression.EVERY_10_SECONDS)
  async uploadMessage() {
    console.log('SEND MESSAGES PROCESS.....');

    const credentials = {
      access_id: process.env.ACCESS_ID,
      password: process.env.PASSWORD
    }

    try {
    const formattedMessages = 
      await findCreatedMessages('ORBCOMM_V2', this.prisma)
             .then(arrayExistsValidate('findCreateMessages'))
             .then(formatMessagesToPostOrbcomm(credentials))
      


    console.log(formattedMessages)

      
       
       
        // .then((messageToPost) =>
        //   orbcommApiPostMessages(messageToPost, this.http),
        // )
        // .then((apiResponse) => saveAndUpdateMessages(apiResponse, this.prisma))

        // .catch((erro) => console.log(erro.message));
    } catch (error) {
      console.log(error.message)
    }
  }

  // @Cron(CronExpression.EVERY_10_SECONDS)
  async checkMessages() {
    console.log('UPDATE MESSAGES PROCESS...');

    try {
      findMessagesByOrbcommStatus(this.prisma)
        .then(createListOfFwdIds)
        // .then(messagesExists)
        .then(formatMessageToGetStatus)
        .then((getParam) => orbcommApiGetStatus(getParam, this.http))
        .then((apiResponse) => updateFwdMessages(apiResponse, this.prisma))

        .catch((erro) => console.log(erro.message));
    } catch (error) {
      console.log(error.message)
    }
  }

  // @Cron(CronExpression.EVERY_30_SECONDS)
  async downloadMessages() {
    // console.log('DOWNLOAD MESSAGES PROCESS....');

try {
  const bodyToPost = await findNextMessage(this.prisma).then(formatParamsToGetMessages);
  const downloadMessages = await orbcommApiDownloadMessages(bodyToPost, this.http).then(validateDownloadData);

  const nextMessage = createNextUtc(bodyToPost.start_utc, downloadMessages.NextStartUTC, this.prisma);   
  const versionMobile = upsertVersionMobile(downloadMessages, this.prisma)
  const getMessages = createGetMessages(downloadMessages, this.prisma)

  await processPrisma(nextMessage, ...versionMobile, ...getMessages)(this.prisma)
} catch (error) {
  console.log(error.message)
}

   // processPrisma pode retornar os elementos criados
   //TODO para funcionamento atualizar os links 
  }

  // @Cron(CronExpression.EVERY_30_SECONDS)
  async updateDevices() {
    console.log('DEVICES UPLOAD START.....');

    orbcommDevices(this.http)
      .then((apiResponse) => verifyNewDevices(apiResponse, this.prisma))
      .then((newDevices) => createDevicesOrbcomm(newDevices, this.prisma))

      .catch((erro) => console.log(erro.message));
  }
}
