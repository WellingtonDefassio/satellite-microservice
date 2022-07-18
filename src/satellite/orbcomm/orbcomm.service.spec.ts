import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../prisma/prisma.service';
import { OrbcommService } from './orbcomm.service';
import * as dbFunctions from './helpers/func/db/orbcomm-db.func';
import * as formatFunctions from './helpers/func/format/orbcomm-format.func';
import * as httpFunctions from './helpers/func/http/orbcomm-http.func';
import * as validatorFunctions from './helpers/func/validators/orbcomm-validators.func';
import { MessageStatus, OrbcommMessageStatus } from '@prisma/client';

const mockNextMessageReturn = {
  nextMessage: '2021-10-09 00:14:55',
};

const mockNextMessageCreated = {
  id: 1,
  previousMessage: '2021-06-07 22:13:23',
  nextMessage: '2021-06-07 22:13:23',
  createdAt: new Date('2022-07-07 16:49:00'),
};

const mockDownloadWithoutPayload = {
  ErrorID: 0,
  NextStartUTC: '2022-07-06 19:25:33',
  Messages: [
    {
      ID: 11326754042,
      MessageUTC: '2022-07-06 17:13:52',
      ReceiveUTC: '2022-07-06 17:13:52',
      SIN: 130,
      MobileID: '01597865SKYFA8A',
      RawPayload: [
        130, 7, 19, 98, 197, 194, 179, 193, 212, 150, 22, 194, 73, 183, 163, 0,
        10,
      ],
      RegionName: 'AORWSC',
      OTAMessageSize: 17,
      CustomerID: 0,
      Transport: 1,
      MobileOwnerID: 60002657,
    },
  ],
};

const mockDownloadMessageReturn = {
  ErrorID: 0,
  NextStartUTC: '2022-07-06 19:25:33',
  Messages: [
    {
      ID: 11326754042,
      MessageUTC: '2022-07-06 17:13:52',
      ReceiveUTC: '2022-07-06 17:13:52',
      SIN: 130,
      MobileID: '01597865SKYFA8A',
      RawPayload: [
        130, 7, 19, 98, 197, 194, 179, 193, 212, 150, 22, 194, 73, 183, 163, 0,
        10,
      ],
      Payload: {
        Name: 'modemRegistration',
        SIN: 0,
        MIN: 0,
        Fields: [
          {
            Name: 'hardwareMajorVersion',
            Value: '5',
          },
          {
            Name: 'hardwareMinorVersion',
            Value: '0',
          },
          {
            Name: 'softwareMajorVersion',
            Value: '3',
          },
          {
            Name: 'softwareMinorVersion',
            Value: '3',
          },
          {
            Name: 'product',
            Value: '6',
          },
          {
            Name: 'wakeupPeriod',
            Value: 'None',
          },
          {
            Name: 'lastResetReason',
            Value: 'NewVirtualCarrier',
          },
          {
            Name: 'virtualCarrier',
            Value: '501',
          },
          {
            Name: 'beam',
            Value: '1',
          },
          {
            Name: 'vain',
            Value: '0',
          },
          {
            Name: 'reserved',
            Value: '0',
          },
          {
            Name: 'operatorTxState',
            Value: '0',
          },
          {
            Name: 'userTxState',
            Value: '0',
          },
          {
            Name: 'broadcastIDCount',
            Value: '0',
          },
        ],
      },
      RegionName: 'AORWSC',
      OTAMessageSize: 17,
      CustomerID: 0,
      Transport: 1,
      MobileOwnerID: 60002657,
    },
  ],
};

const mockDownloadMessage2Return = {
  ErrorID: 0,
  NextStartUTC: '2022-07-06 19:25:33',
  Messages: [
    {
      ID: 11326754042,
      MessageUTC: '2022-07-06 17:13:52',
      ReceiveUTC: '2022-07-06 17:13:52',
      SIN: 130,
      MobileID: '01597865SKYFA8A',
      RawPayload: [
        130, 7, 19, 98, 197, 194, 179, 193, 212, 150, 22, 194, 73, 183, 163, 0,
        10,
      ],
      Payload: {
        Name: 'modemRegistration',
        SIN: 0,
        MIN: 0,
        Fields: [
          {
            Name: 'hardwareMajorVersion',
            Value: '5',
          },
          {
            Name: 'hardwareMinorVersion',
            Value: '0',
          },
          {
            Name: 'softwareMajorVersion',
            Value: '3',
          },
          {
            Name: 'softwareMinorVersion',
            Value: '3',
          },
          {
            Name: 'product',
            Value: '6',
          },
          {
            Name: 'wakeupPeriod',
            Value: 'None',
          },
          {
            Name: 'lastResetReason',
            Value: 'NewVirtualCarrier',
          },
          {
            Name: 'virtualCarrier',
            Value: '501',
          },
          {
            Name: 'beam',
            Value: '1',
          },
          {
            Name: 'vain',
            Value: '0',
          },
          {
            Name: 'reserved',
            Value: '0',
          },
          {
            Name: 'operatorTxState',
            Value: '0',
          },
          {
            Name: 'userTxState',
            Value: '0',
          },
          {
            Name: 'broadcastIDCount',
            Value: '0',
          },
        ],
      },
      RegionName: 'AORWSC',
      OTAMessageSize: 17,
      CustomerID: 0,
      Transport: 1,
      MobileOwnerID: 60002657,
    },
    {
      ID: 11326754042,
      MessageUTC: '2022-07-06 17:13:52',
      ReceiveUTC: '2022-07-06 17:13:52',
      SIN: 130,
      MobileID: '01597865SKYFA8A',
      RawPayload: [
        130, 7, 19, 98, 197, 194, 179, 193, 212, 150, 22, 194, 73, 183, 163, 0,
        10,
      ],
      Payload: {
        Name: 'modemRegistration',
        SIN: 0,
        MIN: 0,
        Fields: [
          {
            Name: 'hardwareMajorVersion',
            Value: '5',
          },
          {
            Name: 'hardwareMinorVersion',
            Value: '0',
          },
          {
            Name: 'softwareMajorVersion',
            Value: '3',
          },
          {
            Name: 'softwareMinorVersion',
            Value: '3',
          },
          {
            Name: 'product',
            Value: '6',
          },
          {
            Name: 'wakeupPeriod',
            Value: 'None',
          },
          {
            Name: 'lastResetReason',
            Value: 'NewVirtualCarrier',
          },
          {
            Name: 'virtualCarrier',
            Value: '501',
          },
          {
            Name: 'beam',
            Value: '1',
          },
          {
            Name: 'vain',
            Value: '0',
          },
          {
            Name: 'reserved',
            Value: '0',
          },
          {
            Name: 'operatorTxState',
            Value: '0',
          },
          {
            Name: 'userTxState',
            Value: '0',
          },
          {
            Name: 'broadcastIDCount',
            Value: '0',
          },
        ],
      },
      RegionName: 'AORWSC',
      OTAMessageSize: 17,
      CustomerID: 0,
      Transport: 1,
      MobileOwnerID: 60002657,
    },
  ],
};

const mockOrbcommVersionDeviceResolved = [
  {
    id: 25,
    deviceId: 'any_device_id',
    name: 'any_name_payload',
    SIN: 0,
    MIN: 0,
    fields: [
      { Name: 'userTxState', Value: '0' },
      { Name: 'broadcastIDCount', Value: '0' },
    ],
  },
];

const mockGetMessageResolved = [
  {
    id: 6794,
    messageId: '11335689262',
    messageUTC: new Date('2022-07-01 13:00:00'),
    receiveUTC: new Date('2022-07-01 13:00:00'),
    deviceId: '01719703SKYFE30',
    SIN: 130,
    MIN: 7,
    payload: '130,7,211,98,199,84,46,193,143,78,235,194,51,96,26,22,180,2,241',
    regionName: 'AORWSC',
    otaMessageSize: 19,
    costumerID: 0,
    transport: 1,
    mobileOwnerID: '60002657',
  },
];

const mockBodyToPost = {
  access_id: 70002657,
  password: 'ZFLLYNJL',
  include_raw_payload: true,
  start_utc: 'any_utc_body',
};

const mockResolvedFindMany = [
  {
    id: 77,
    payload: 'teste',
    deviceId: '01719298SKY2247',
    status: MessageStatus.CREATED,
    createdAt: new Date('2022-06-07 22:13:23'),
    updatedAt: new Date('2022-06-07 22:13:23'),
  },
  {
    id: 78,
    payload: 'teste2',
    deviceId: '01719298SKY2247',
    status: MessageStatus.CREATED,
    createdAt: new Date('2022-06-07 22:13:23'),
    updatedAt: new Date('2022-06-07 22:13:23'),
  },
];
const mockFormatMessagesToPostOrbcomm = {
  access_id: 'any_mock_access',
  password: 'any_mock_password',
  messages: [
    {
      DestinationID: 'any_mock_deviceID',
      UserMessageID: 1,
      RawPayload: Buffer.from('123456789').toJSON().data,
    },
  ],
};

const mockPostResponse = {
  ErrorID: 0,
  Submissions: [
    {
      ForwardMessageID: 123,
      DestinationID: 'any_destination',
      ErrorID: 0,
      UserMessageID: 1111,
    },
  ],
};

const mockCreateOrbcommSendMessage = [
  {
    id: 1,
    sendMessageId: 2,
    deviceId: 'anyDeviceId',
    fwrdMessageId: 123,
    status: OrbcommMessageStatus.SUBMITTED,
    errorId: 0,
    createdAt: new Date('2022-06-07 22:13:23'),
    updateAt: new Date('2022-06-07 22:13:23'),
  },
];

const mockUpdateSendMessage = [
  {
    id: 1,
    payload: 'any_payload',
    deviceId: 'any_device_id',
    status: MessageStatus.SUBMITTED,
    createdAt: new Date('2022-06-07 22:13:23'),
    updatedAt: new Date('2022-06-07 22:13:23'),
  },
];

describe('Orbcomm-db-func', () => {
  let service: OrbcommService;
  let prisma: PrismaService;
  let http: HttpService;
  const env = process.env;

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetModules();
    process.env = { ...env };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrbcommService,
        {
          provide: PrismaService,
          useValue: {
            orbcommNextMessage: {
              findFirst: jest.fn().mockResolvedValue(mockNextMessageReturn),
              create: jest.fn().mockResolvedValue(mockNextMessageCreated),
            },
            orbcommVersionDevice: {
              upsert: jest
                .fn()
                .mockResolvedValue(mockOrbcommVersionDeviceResolved),
            },
            orbcommGetMessage: {
              create: jest.fn().mockResolvedValue(mockGetMessageResolved),
            },
            sendMessages: {
              findMany: jest.fn().mockResolvedValue(mockResolvedFindMany),
              update: jest.fn().mockResolvedValue(mockUpdateSendMessage),
            },
            sendMessagesOrbcomm: {
              create: jest.fn().mockResolvedValue(mockCreateOrbcommSendMessage),
            },
            $transaction: jest
              .fn()
              .mockResolvedValue([
                mockGetMessageResolved,
                mockOrbcommVersionDeviceResolved,
                mockNextMessageCreated,
              ]),
          },
        },
        {
          provide: HttpService,
          useValue: {
            axiosRef: {
              get: jest.fn().mockReturnValue(mockDownloadMessageReturn),
            },
          },
        },
      ],
    }).compile();

    service = module.get<OrbcommService>(OrbcommService);
    prisma = module.get<PrismaService>(PrismaService);
    http = module.get<HttpService>(HttpService);

    jest.spyOn(http.axiosRef, 'get').mockResolvedValue(
      new Promise((resolve) =>
        resolve({
          data: mockDownloadMessageReturn,
        }),
      ),
    );
  });
  afterEach(() => {
    process.env = env;
  });

  describe('downloadMessage()', () => {
    //mock area
    jest
      .spyOn(dbFunctions, 'findNextMessage')
      .mockResolvedValue(mockNextMessageReturn.nextMessage);

    jest
      .spyOn(formatFunctions, 'formatParamsToGetMessages')
      .mockReturnValue(mockBodyToPost);

    jest
      .spyOn(httpFunctions, 'apiRequest')
      .mockResolvedValue(mockDownloadMessageReturn);

    jest
      .spyOn(validatorFunctions, 'validateDownloadData')
      .mockReturnValue(mockDownloadMessageReturn);

    jest
      .spyOn(dbFunctions, 'createNextUtc')
      .mockReturnValue(mockNextMessageCreated);

    jest
      .spyOn(dbFunctions, 'upsertVersionMobile')
      .mockReturnValue(mockOrbcommVersionDeviceResolved);

    jest
      .spyOn(dbFunctions, 'createGetMessages')
      .mockReturnValue(mockGetMessageResolved);

    describe('findNextMessage()', () => {
      it('should be able spy on downloadMessages', () => {
        const spyDownloadMessages = jest.spyOn(service, 'downloadMessages');
        service.downloadMessages();
        expect(spyDownloadMessages).toBeCalledTimes(1);
      });
      it('should call findNextMessage() when downloadMessages is call', async () => {
        const spyFindNextMessage = jest.spyOn(dbFunctions, 'findNextMessage');

        await service.downloadMessages();

        expect(spyFindNextMessage).toBeCalledTimes(1);
      });
      it('should call findNextMessage() with corrects values', async () => {
        const spyFindNextMessage = jest.spyOn(dbFunctions, 'findNextMessage');

        await service.downloadMessages();

        expect(spyFindNextMessage).toHaveBeenCalledWith(prisma);
      });
    });
    describe('formatParamsToGetMessages()', () => {
      it('should call formatParamsToGetMessages() when downloadMessages is call', async () => {
        const spyFormatParamsToGetMessages = jest.spyOn(
          formatFunctions,
          'formatParamsToGetMessages',
        );
        await service.downloadMessages();

        expect(spyFormatParamsToGetMessages).toBeCalledTimes(1);
      });
      it('should call formatParamsToGetMessages() with corrects values', async () => {
        const spyFormatParamsToGetMessages = jest.spyOn(
          formatFunctions,
          'formatParamsToGetMessages',
        );
        await service.downloadMessages();

        expect(spyFormatParamsToGetMessages).toBeCalledWith(
          mockNextMessageReturn.nextMessage,
        );
      });
      it('should call formatParamsToGetMessages() with resolve value of findNextMessage()', async () => {
        jest.spyOn(dbFunctions, 'findNextMessage').mockResolvedValueOnce(null);

        const spyFormatParamsToGetMessages = jest.spyOn(
          formatFunctions,
          'formatParamsToGetMessages',
        );

        await service.downloadMessages();

        expect(spyFormatParamsToGetMessages).toHaveBeenCalledWith(null);
      });
    });
    describe('apiRequest()', () => {
      const link = (process.env.GET_ORBCOMM_LINK = 'mock_link');

      it('should call apiRequest() when downloadMessages is call', async () => {
        const spyApiRequest = jest.spyOn(httpFunctions, 'apiRequest');

        await service.downloadMessages();

        expect(spyApiRequest).toBeCalledTimes(1);
      });
      it('should call apiRequest() with correct values', async () => {
        const spyApiRequest = jest.spyOn(httpFunctions, 'apiRequest');

        await service.downloadMessages();

        expect(spyApiRequest).toBeCalledWith(
          link,
          'get',
          'params',
          mockBodyToPost,
          http,
        );
      });
    });
    describe('validateDownloadData()', () => {
      it('should call validateDownloadData() when downloadMessages is call', async () => {
        const spyValidateDownloadData = jest.spyOn(
          validatorFunctions,
          'validateDownloadData',
        );

        await service.downloadMessages();

        expect(spyValidateDownloadData).toBeCalledTimes(1);
      });

      it('should call validateDownloadData() with correct values', async () => {
        const spyValidateDownloadData = jest.spyOn(
          validatorFunctions,
          'validateDownloadData',
        );

        await service.downloadMessages();

        expect(spyValidateDownloadData).toBeCalledWith(
          mockDownloadMessageReturn,
        );
      });

      it('should call validateDownloadData() with resolve value of apiRequest()', async () => {
        jest
          .spyOn(httpFunctions, 'apiRequest')
          .mockResolvedValueOnce(mockDownloadWithoutPayload);

        const spyValidateDownloadData = jest.spyOn(
          validatorFunctions,
          'validateDownloadData',
        );

        await service.downloadMessages();

        expect(spyValidateDownloadData).toBeCalledWith(
          mockDownloadWithoutPayload,
        );
      });
    });
    describe('createNextUtc()', () => {
      it('should call createNextUtc() when downloadMessages is call', async () => {
        const spyCreateNextUtc = jest.spyOn(dbFunctions, 'createNextUtc');

        await service.downloadMessages();

        expect(spyCreateNextUtc).toBeCalledTimes(1);
      });
      it('should call createNextUtc() with correct values', async () => {
        const spyCreateNextUtc = jest.spyOn(dbFunctions, 'createNextUtc');

        await service.downloadMessages();

        expect(spyCreateNextUtc).toBeCalledWith(
          mockBodyToPost.start_utc,
          mockDownloadMessageReturn.NextStartUTC,
          prisma,
        );
      });
    });
    describe('upsertVersionMobile()', () => {
      it('should call upsertVersionMobile() when downloadMessages is call', async () => {
        const spyUpsertVersionMobile = jest.spyOn(
          dbFunctions,
          'upsertVersionMobile',
        );
        await service.downloadMessages();

        expect(spyUpsertVersionMobile).toBeCalledTimes(1);
      });
      it('should call upsertVersionMobile() with correct values', async () => {
        const spyUpsertVersionMobile = jest.spyOn(
          dbFunctions,
          'upsertVersionMobile',
        );
        await service.downloadMessages();

        expect(spyUpsertVersionMobile).toBeCalledWith(
          mockDownloadMessageReturn,
          prisma,
        );
      });
    });
    describe('createGetMessages', () => {
      it('should call createGetMessages() when downloadMessages is call', async () => {
        const spyCreateGetMessages = jest.spyOn(
          dbFunctions,
          'createGetMessages',
        );
        await service.downloadMessages();

        expect(spyCreateGetMessages).toBeCalledTimes(1);
      });
      it('should call createGetMessages() with correct values', async () => {
        const spyCreateGetMessages = jest.spyOn(
          dbFunctions,
          'createGetMessages',
        );
        await service.downloadMessages();

        expect(spyCreateGetMessages).toBeCalledWith(
          mockDownloadMessageReturn,
          prisma,
        );
      });
    });
    describe('processPrisma()', () => {
      it('should call processPrisma() when downloadMessages is call', async () => {
        const spyProcessPrisma = jest.spyOn(dbFunctions, 'processPrisma');

        await service.downloadMessages();

        expect(spyProcessPrisma).toBeCalledTimes(1);
      });
      it('should call processPrisma() with correct values', async () => {
        const spyProcessPrisma = jest.spyOn(dbFunctions, 'processPrisma');

        await service.downloadMessages();

        expect(spyProcessPrisma).toBeCalledWith(
          mockNextMessageCreated,
          ...mockOrbcommVersionDeviceResolved,
          ...mockGetMessageResolved,
        );
      });
    });
  });
  describe('uploadMessage()', () => {
    //mock area

    jest
      .spyOn(dbFunctions, 'findCreatedMessages')
      .mockResolvedValue(mockResolvedFindMany);

    jest
      .spyOn(validatorFunctions, 'arrayExistsValidate')
      .mockReturnValue(() => mockResolvedFindMany);

    jest
      .spyOn(formatFunctions, 'formatMessagesToPostOrbcomm')
      .mockReturnValue(() => mockFormatMessagesToPostOrbcomm);

    jest
      .spyOn(validatorFunctions, 'validateApiRes')
      .mockReturnValue(mockPostResponse.Submissions);

    jest
      .spyOn(dbFunctions, 'createOrbcommSendMessage')
      .mockReturnValue(mockCreateOrbcommSendMessage);

    jest
      .spyOn(dbFunctions, 'createOrbcomm')
      .mockReturnValue(mockUpdateSendMessage);

    jest
      .spyOn(validatorFunctions, 'arrayExistsValidate')
      .mockReturnValue(() => mockPostResponse.Submissions);

    describe('findCreatedMessages()', () => {
      it('should call findCreatedMessages() when uploadMessage is call', async () => {
        const spyFindCreatedMessages = jest.spyOn(
          dbFunctions,
          'findCreatedMessages',
        );

        await service.uploadMessage();

        expect(spyFindCreatedMessages).toBeCalledTimes(1);
      });
      it('should call findCreatedMessages() with corrects values', async () => {
        const spyFindCreatedMessages = jest.spyOn(
          dbFunctions,
          'findCreatedMessages',
        );

        await service.uploadMessage();

        expect(spyFindCreatedMessages).toHaveBeenCalledWith(
          'ORBCOMM_V2',
          prisma,
        );
      });
    });
    describe('arrayExistsValidate()', () => {
      it('should call arrayExistsValidate() when uploadMessage is call', async () => {
        const spyArrayExistsValidate = jest.spyOn(
          validatorFunctions,
          'arrayExistsValidate',
        );
        await service.uploadMessage();

        expect(spyArrayExistsValidate).toBeCalledTimes(2);
      });
      it('should call arrayExistsValidate() with corrects values', async () => {
        const spyArrayExistsValidate = jest.spyOn(
          validatorFunctions,
          'arrayExistsValidate',
        );
        await service.uploadMessage();

        expect(spyArrayExistsValidate).toBeCalledWith('findCreateMessages');
      });
      it('should call arrayExistsValidate() with corrects values', async () => {
        const spyArrayExistsValidate = jest.spyOn(
          validatorFunctions,
          'arrayExistsValidate',
        );
        await service.uploadMessage();

        expect(spyArrayExistsValidate).toBeCalledWith('findCreateMessages');
      });
    });
    describe('formatMessagesToPostOrbcomm()', () => {
      const access = (process.env.ACCESS_ID = 'mock_access');
      const password = (process.env.PASSWORD = 'mock_password');
      it('should call formatMessagesToPostOrbcomm() when uploadMessage is call', async () => {
        const spyFormatMessagesToPostOrbcomm = jest.spyOn(
          formatFunctions,
          'formatMessagesToPostOrbcomm',
        );
        await service.uploadMessage();

        expect(spyFormatMessagesToPostOrbcomm).toBeCalledTimes(1);
      });
      it('should call formatMessagesToPostOrbcomm() with corrects values', async () => {
        const spyFormatMessagesToPostOrbcomm = jest.spyOn(
          formatFunctions,
          'formatMessagesToPostOrbcomm',
        );
        await service.uploadMessage();

        expect(spyFormatMessagesToPostOrbcomm).toBeCalledWith({
          access_id: access,
          password: password,
        });
      });
    });
    describe('apiRequest()', () => {
      const link = (process.env.POST_LINK_ORBCOMM = 'mock_link');

      it('should call apiRequest() when uploadMessage is call', async () => {
        const spyApiRequest = jest.spyOn(httpFunctions, 'apiRequest');

        await service.uploadMessage();

        expect(spyApiRequest).toBeCalledTimes(1);
      });
      it('should call apiRequest() with correct values', async () => {
        const spyApiRequest = jest.spyOn(httpFunctions, 'apiRequest');

        await service.uploadMessage();

        expect(spyApiRequest).toBeCalledWith(
          link,
          'post',
          'body',
          mockFormatMessagesToPostOrbcomm,
          http,
        );
      });
    });
    describe('validateApiRes()', () => {
      it('should call validateApiRes() when uploadMessage is call ', async () => {
        const spyValidateApiRes = jest.spyOn(
          validatorFunctions,
          'validateApiRes',
        );

        await service.uploadMessage();

        expect(spyValidateApiRes).toBeCalledTimes(1);
      });
      it('should call validateApiRes() with correct values', async () => {
        jest
          .spyOn(httpFunctions, 'apiRequest')
          .mockResolvedValueOnce(mockPostResponse);

        const spyValidateApiRes = jest.spyOn(
          validatorFunctions,
          'validateApiRes',
        );

        await service.uploadMessage();

        expect(spyValidateApiRes).toBeCalledWith(
          mockFormatMessagesToPostOrbcomm.messages,
          'UserMessageID',
          mockPostResponse.Submissions,
          'UserMessageID',
        );
      });
    });
    describe('createOrbcommSendMessage()', () => {
      it('should call createOrbcommSendMessage() when uploadMessage is call', async () => {
        const spyCreateOrbcommSendMessage = jest.spyOn(
          dbFunctions,
          'createOrbcommSendMessage',
        );

        await service.uploadMessage();

        expect(spyCreateOrbcommSendMessage).toBeCalledTimes(1);
      });
      it('should call createOrbcommSendMessage() with correct values', async () => {
        const spyCreateOrbcommSendMessage = jest.spyOn(
          dbFunctions,
          'createOrbcommSendMessage',
        );

        await service.uploadMessage();

        expect(spyCreateOrbcommSendMessage).toBeCalledWith(
          mockPostResponse.Submissions,
          prisma,
        );
      });
    });
    describe('createOrbcomm()', () => {
      it('should call createOrbcomm() when uploadMessage is call', async () => {
        const spyCreateOrbcomm = jest.spyOn(dbFunctions, 'createOrbcomm');

        await service.uploadMessage();

        expect(spyCreateOrbcomm).toBeCalledTimes(1);
      });
      it('should call createOrbcomm() with correct values', async () => {
        const spyCreateOrbcomm = jest.spyOn(dbFunctions, 'createOrbcomm');

        await service.uploadMessage();

        expect(spyCreateOrbcomm).toBeCalledWith(
          mockPostResponse.Submissions,
          prisma,
        );
      });
    });
    describe('processPrisma()', () => {
      it('should call processPrisma() when uploadMessage is call', async () => {
        const spyProcessPrisma = jest.spyOn(dbFunctions, 'processPrisma');

        await service.uploadMessage();

        expect(spyProcessPrisma).toBeCalledTimes(1);
      });
      it('should call processPrisma() with correct values', async () => {
        const spyProcessPrisma = jest.spyOn(dbFunctions, 'processPrisma');

        await service.uploadMessage();

        expect(spyProcessPrisma).toHaveBeenCalledWith(
          mockCreateOrbcommSendMessage,
          mockUpdateSendMessage,
        );
      });
    });
  });
});
