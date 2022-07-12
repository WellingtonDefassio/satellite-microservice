import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../../../prisma/prisma.service';
import * as functions from '../../index';
import { OrbcommService } from '../../../orbcomm.service';
import { NotFoundException } from '@nestjs/common';

const mockNextMessageReturn = {
  nextMessage: '2021-10-09 00:14:55',
};

const mockNextMessageCreated = {
  id: 1,
  previousMessage: '2021-06-07 22:13:23',
  nextMessage: '2021-06-07 22:13:23',
  createdAt: '2022-07-07 16:49:00',
};

const mockBodyToGetMessage = {
  access_id: 70002657,
  password: 'ZFLLYNJL',
  include_raw_payload: true,
  start_utc: 'any_data',
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

const mockOrbcommVersionDeviceResolved = {
  id: 25,
  deviceId: 'any_device_id',
  name: 'any_name_payload',
  SIN: 0,
  MIN: 0,
  fields: [
    { Name: 'userTxState', Value: '0' },
    { Name: 'broadcastIDCount', Value: '0' },
  ],
};

describe('OrbcommService', () => {
  let service: OrbcommService;
  let prisma: PrismaService;
  let http: HttpService;

  beforeEach(async () => {
    jest.clearAllMocks();
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
          },
        },
        {
          provide: HttpService,
          useValue: {
            axiosRef: {
              get: jest.fn().mockResolvedValue(mockDownloadMessageReturn),
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
  describe('downloadMessages', () => {
    describe('findNextMessage', () => {
      const mockPrismaFindNextMessage = jest
        .fn()
        .mockReturnValue(mockNextMessageReturn);

      it('should call prisma.orbcommNextMessage.findFirst with correct params', () => {
        jest
          .spyOn(prisma.orbcommNextMessage, 'findFirst')
          .mockImplementationOnce(mockPrismaFindNextMessage);

        functions.findNextMessage(prisma).then((value) => console.log(value));

        expect(mockPrismaFindNextMessage).toBeCalledWith({
          select: { nextMessage: true },
          orderBy: [{ id: 'desc' }],
          take: 1,
        });
      });
      it('should prisma.orbcommNextMessage.findFirst return a correct value', async () => {
        jest
          .spyOn(prisma.orbcommNextMessage, 'findFirst')
          .mockImplementation(mockPrismaFindNextMessage);

        expect(functions.findNextMessage(prisma)).resolves.toEqual(
          '2021-10-09 00:14:55',
        );
      });
      it('should throws prisma.orbcommNextMessage.findFirst if nextMessages not found', async () => {
        const mockPrismaFindNextMessageError = jest.fn().mockReturnValue(null);

        jest
          .spyOn(prisma.orbcommNextMessage, 'findFirst')
          .mockImplementation(mockPrismaFindNextMessageError);

        await expect(functions.findNextMessage(prisma)).rejects.toThrowError(
          NotFoundException,
        );
      });
    });

    describe('validateDownloadData', () => {
      const mockDownloadMessageErrorID = {
        ErrorID: 100,
        NextStartUTC: '2022-07-06 19:25:33',
        Messages: [
          {
            ID: 11326754042,
            MessageUTC: '2022-07-06 17:13:52',
            ReceiveUTC: '2022-07-06 17:13:52',
            SIN: 130,
            MobileID: '01597865SKYFA8A',
            RawPayload: [
              130, 7, 19, 98, 197, 194, 179, 193, 212, 150, 22, 194, 73, 183,
              163, 0, 10,
            ],
            RegionName: 'AORWSC',
            OTAMessageSize: 17,
            CustomerID: 0,
            Transport: 1,
            MobileOwnerID: 60002657,
          },
        ],
      };
      const mockDownloadMessagesNull = {
        ErrorID: 0,
        NextStartUTC: '2022-07-06 19:25:33',
        Messages: null,
      };

      it('should the same input body if not throws', () => {
        const correctBody = functions.validateDownloadData(
          mockDownloadMessageReturn,
        );
        expect(correctBody).toEqual(mockDownloadMessageReturn);
      });
      it('should throws if api return ErrorID different of zero 0 ', () => {
        expect(() =>
          functions.validateDownloadData(mockDownloadMessageErrorID),
        ).toThrowError('Error id 100 check the api error!');
      });
      it('should throws if api return messages with null params ', () => {
        expect(() =>
          functions.validateDownloadData(mockDownloadMessagesNull),
        ).toThrowError('no more messages available');
      });
    });
    describe('createNextUtc', () => {
      const mockPrismaCreateNextMessage = jest
        .fn()
        .mockReturnValue(mockNextMessageCreated);

      const previousMessage = 'any_previousMessage';
      const nextMessage = 'any_nextMessage';

      it('should call orbcommNextMessage.create with corrects params', async () => {
        jest
          .spyOn(prisma.orbcommNextMessage, 'create')
          .mockImplementationOnce(mockPrismaCreateNextMessage);

        functions.createNextUtc(previousMessage, nextMessage, prisma);

        expect(mockPrismaCreateNextMessage).toBeCalledWith({
          data: {
            previousMessage,
            nextMessage,
          },
        });
      });
      it('should orbcommNextMessage.create return correct value', async () => {
        jest
          .spyOn(prisma.orbcommNextMessage, 'create')
          .mockImplementation(mockPrismaCreateNextMessage);

        expect(
          functions.createNextUtc(previousMessage, nextMessage, prisma),
        ).toEqual(mockNextMessageCreated);
      });
      it('should throw a error if prisma throws', async () => {
        jest
          .spyOn(prisma.orbcommNextMessage, 'create')
          .mockRejectedValueOnce(new Error('Prisma Error'));

        expect(() =>
          functions.createNextUtc(previousMessage, nextMessage, prisma),
        ).rejects.toThrowError('Prisma Error');
      });
    });
    describe('upsertVersionMobile', () => {
      it('should call orbcommVersionDevice.upsert when upsertVersionMobile is call', async () => {
        const spyUpsert = jest.spyOn(prisma.orbcommVersionDevice, 'upsert');

        functions.upsertVersionMobile(mockDownloadMessageReturn, prisma);

        expect(spyUpsert).toBeCalledTimes(1);
      });
      it('should call orbcommVersionDevice.upsert 2 times when 2 payloadObjects is provide ', async () => {
        const spyUpsert = jest.spyOn(prisma.orbcommVersionDevice, 'upsert');

        functions.upsertVersionMobile(mockDownloadMessage2Return, prisma);

        expect(spyUpsert).toBeCalledTimes(2);
      });
      it('should not call orbcommVersionDevice.upsert if no payloadObjects is provide ', async () => {
        const spyUpsert = jest.spyOn(prisma.orbcommVersionDevice, 'upsert');

        functions.upsertVersionMobile(mockDownloadWithoutPayload, prisma);

        expect(spyUpsert).toBeCalledTimes(0);
      });
      it('should return a empty array if no payloadObjects is provide', async () => {
        const result = functions.upsertVersionMobile(
          mockDownloadWithoutPayload,
          prisma,
        );

        expect(result).toEqual([]);
      });
      it('should call prisma.orbcommNextMessage.findFirst with correct params', async () => {
        const mockResult = jest
          .spyOn(prisma.orbcommVersionDevice, 'upsert')
          .mockResolvedValue(mockOrbcommVersionDeviceResolved);

        functions.upsertVersionMobile(mockDownloadMessageReturn, prisma);

        expect(mockResult).toBeCalledWith({
          create: {
            deviceId: mockDownloadMessageReturn.Messages[0].MobileID,
            SIN: mockDownloadMessageReturn.Messages[0].Payload.SIN,
            MIN: mockDownloadMessageReturn.Messages[0].Payload.MIN,
            name: mockDownloadMessageReturn.Messages[0].Payload.Name,
            fields: mockDownloadMessageReturn.Messages[0].Payload.Fields,
          },
          where: { deviceId: mockDownloadMessageReturn.Messages[0].MobileID },
          update: {
            SIN: mockDownloadMessageReturn.Messages[0].Payload.SIN,
            MIN: mockDownloadMessageReturn.Messages[0].Payload.MIN,
            name: mockDownloadMessageReturn.Messages[0].Payload.Name,
            fields: mockDownloadMessageReturn.Messages[0].Payload.Fields,
          },
        });
      });
    });
  });
});
