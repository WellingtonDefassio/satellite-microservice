/* eslint-disable prettier/prettier */
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../prisma/prisma.service';
import {
  createListOfFwdIds,
  formatMessageToGetStatus,
  orbcommApiGetStatus,
  updateFwdMessages,
  findMessagesByOrbcommStatus,
  findNextMessage,
  formatParamsToGetMessages,
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
  ApiMethods,
  SendedType,
  apiRequest,
  validateApiRes,
  createOrbcommSendMessage,
  createOrbcomm,
} from './helpers/index';



@Injectable()
export class OrbcommService {
  constructor(private prisma: PrismaService, private http: HttpService) { }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async uploadMessage() {
    console.log('SEND MESSAGES PROCESS.....');
    const postLink = process.env.POST_LINK_ORBCOMM
    const credentials = { access_id: process.env.ACCESS_ID, password: process.env.PASSWORD }

    try {
      const formattedMessages =
        await findCreatedMessages('ORBCOMM_V2', this.prisma)
            .then(arrayExistsValidate('findCreateMessages'))
            .then(formatMessagesToPostOrbcomm(credentials))

      const apiResponse =
        await apiRequest(postLink, ApiMethods.POST, SendedType.BODY, formattedMessages, this.http)
             .then((apiRes) => validateApiRes(formattedMessages.messages, 'UserMessageID', apiRes.Submissions, 'UserMessageID'))
             .then(arrayExistsValidate('apiRequest'))

      const sendMessageOrbcomm = createOrbcommSendMessage(apiResponse, this.prisma)
      const sendMessage = createOrbcomm(apiResponse, this.prisma)

     processPrisma(sendMessageOrbcomm, sendMessage)


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

  //  @Cron(CronExpression.EVERY_30_SECONDS)
  async downloadMessages() {

    const getLink = process.env.GET_ORBCOMM_LINK

    try {
      const paramToPost =
        await findNextMessage(this.prisma)
          .then(formatParamsToGetMessages);

      const downloadMessages =
        await apiRequest(getLink, ApiMethods.GET, SendedType.PARAM, paramToPost, this.http)
          .then(validateDownloadData);

      const nextMessage = createNextUtc(paramToPost.start_utc, downloadMessages.NextStartUTC, this.prisma);
      const versionMobile = upsertVersionMobile(downloadMessages, this.prisma)
      const getMessages = createGetMessages(downloadMessages, this.prisma)

      await processPrisma(nextMessage, ...versionMobile, ...getMessages)(this.prisma)
    } catch (error) {
      console.log(error.message)
    }

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