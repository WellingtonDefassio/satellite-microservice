import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../../../../prisma/prisma.service';
import * as functions from '../../index';
import { OrbcommService } from '../../../orbcomm.service';
import { ApiMethods, SendedType } from '../../index';

const mockBodyToGetMessage = {
  access_id: 70002657,
  password: 'ZFLLYNJL',
  include_raw_payload: true,
  start_utc: 'any_data',
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

const mockSendPostOrbcomm = {
  access_id: 'any_access',
  password: 'any_password',
  messages: [
    {
      DestinationID: 'DEVICE1',
      UserMessageID: 116,
      RawPayload: [Array],
    },
  ],
};

const mockPostMessageReturn = {
  ErrorID: 0,
  Submissions: [
    {
      ForwardMessageID: 186,
      DestinationID: 'DEVICE1',
      ErrorID: 0,
      UserMessageID: 116,
    },
  ],
};

describe('OrbcommService', () => {
  let http: HttpService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrbcommService,
        {
          provide: HttpService,
          useValue: {
            axiosRef: {
              get: jest.fn().mockResolvedValue(mockDownloadMessageReturn),
              post: jest.fn().mockResolvedValue(mockPostMessageReturn),
            },
          },
        },
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile();

    http = module.get<HttpService>(HttpService);

    jest.spyOn(http.axiosRef, 'get').mockResolvedValue(
      new Promise((resolve) =>
        resolve({
          data: mockDownloadMessageReturn,
        }),
      ),
    );
    jest.spyOn(http.axiosRef, 'post').mockResolvedValue(
      new Promise((resolve) =>
        resolve({
          data: mockPostMessageReturn,
        }),
      ),
    );
  });

  describe('downloadMessages', () => {
    describe('apiRequest()', () => {
      it('should return with correct data', async () => {
        const apiResponse = await functions.apiRequest(
          'any_link.com',
          ApiMethods.GET,
          SendedType.PARAM,
          mockBodyToGetMessage,
          http,
        );
        expect(apiResponse).toEqual(mockDownloadMessageReturn);
      });

      it('should call get when apiRequest() is call', async () => {
        const spyHttp = jest.spyOn(http.axiosRef, 'get');
        await functions.apiRequest(
          'any_link.com',
          ApiMethods.GET,
          SendedType.PARAM,
          mockBodyToGetMessage,
          http,
        );
        expect(spyHttp).toHaveBeenCalledTimes(1);
      });

      it('should throws if get throws', async () => {
        jest.spyOn(http.axiosRef, 'get').mockImplementationOnce(() => {
          throw new Error('Any Error');
        });
        expect(
          async () =>
            await functions.apiRequest(
              'any_link.com',
              ApiMethods.GET,
              SendedType.PARAM,
              mockBodyToGetMessage,
              http,
            ),
        ).rejects.toThrowError('Any Error');
      });
    });
  });
  describe('uploadMessage', () => {
    describe('apiRequest()', () => {
      it('should call http axios when ApiRequest is call', async () => {
        const spyHttp = jest.spyOn(http.axiosRef, 'post');
        await functions.apiRequest(
          'www.any_link.com',
          ApiMethods.POST,
          SendedType.BODY,
          mockSendPostOrbcomm,
          http,
        );
        expect(spyHttp).toBeCalledTimes(1);
      });
      it('should return call with correct data', async () => {
        const result = await functions.apiRequest(
          'www.any_link.com',
          ApiMethods.POST,
          SendedType.BODY,
          mockSendPostOrbcomm,
          http,
        );
        expect(result).toEqual(mockPostMessageReturn);
      });
      it('should throws if axios throws', async () => {
        jest.spyOn(http.axiosRef, 'post').mockImplementationOnce(() => {
          throw new Error('Any Error');
        });
        expect(
          async () =>
            await functions.apiRequest(
              'www.any_link.com',
              ApiMethods.POST,
              SendedType.BODY,
              mockSendPostOrbcomm,
              http,
            ),
        ).rejects.toThrowError('Any Error');
      });
    });
  });
  describe('catching error testing', () => {
    it('should return the message error when axios reject', () => {
      jest
        .spyOn(http.axiosRef, 'post')
        .mockRejectedValueOnce(new Error('MOCKED ERROR'));

      expect(
        async () =>
          await functions.apiRequest(
            'www.any_link.com',
            ApiMethods.POST,
            SendedType.BODY,
            mockSendPostOrbcomm,
            http,
          ),
      ).rejects.toThrowError('MOCKED ERROR');
    });
  });
});
