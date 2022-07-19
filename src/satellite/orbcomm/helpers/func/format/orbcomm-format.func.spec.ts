import { MessageStatus, OrbcommMessageStatus } from '@prisma/client';
import * as functions from '../../index';

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

const mockSendMessagesFindMany = [
  {
    id: 1,
    payload: 'any_payload',
    deviceId: 'any_device',
    status: MessageStatus.CREATED,
    createdAt: new Date('2022-07-01 13:00:00'),
    updatedAt: new Date('2022-07-01 13:00:00'),
  },
];

const mockFrwdMessagesToCheck = [
  {
    id: 1,
    sendMessageId: 22,
    deviceId: 'abc123456',
    fwrdMessageId: '231',
    status: OrbcommMessageStatus.SUBMITTED,
    errorId: 0,
    createdAt: new Date('2022-06-07 22:13:23'),
    updatedAt: new Date('2022-06-07 22:13:23'),
  },
  {
    id: 1,
    sendMessageId: 22,
    deviceId: 'abc123456',
    fwrdMessageId: '299',
    status: OrbcommMessageStatus.SUBMITTED,
    errorId: 0,
    createdAt: new Date('2022-06-07 22:13:23'),
    updatedAt: new Date('2022-06-07 22:13:23'),
  },
];
const mockCredentials = {
  access_id: 'mock_credentials_access',
  password: 'mock_password',
};

describe('Orbcomm-format-func', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
  });
  describe('downloadMessages', () => {
    describe('formatParamsToGetMessages()', () => {
      it('should return a correct start_utc', () => {
        const formattedParams =
          functions.formatParamsToGetMessages(mockCredentials)('10-10-10');

        expect(formattedParams).toEqual({
          ...mockCredentials,
          include_raw_payload: true,
          start_utc: '10-10-10',
        });
      });
      it('should return a object with correct body', () => {
        const formattedParams =
          functions.formatParamsToGetMessages(mockCredentials)('10-10-10');

        expect(formattedParams).toHaveProperty('access_id');
        expect(formattedParams).toHaveProperty('password');
        expect(formattedParams).toHaveProperty('start_utc');
        expect(formattedParams).toHaveProperty('include_raw_payload');
      });
      it('should throw if not provides all params to getMessageApi', () => {
        expect(() => {
          functions.formatParamsToGetMessages({
            access_id: '',
            password: '',
          })('10-10-10');
        }).toThrowError('Missing ParamsToGetMessages!!');
      });
    });
    describe('filterPayload()', () => {
      it('should return a message array if payload attribute exists', () => {
        const result = functions.filterPayload(mockDownloadMessageReturn);

        expect(result).toEqual(mockDownloadMessageReturn.Messages);
      });
      it('should return a empty array if attribute payload not exists', () => {
        const result = functions.filterPayload(mockDownloadWithoutPayload);

        expect(result).toEqual([]);
      });
    });
    describe('formatGetMessages()', () => {
      it('should return a formatted downloadMessage', () => {
        const result = functions.formatGetMessages(mockDownloadMessageReturn);

        expect(result).toEqual([
          {
            MIN: 7,
            SIN: 130,
            costumerID: 0,
            deviceId: '01597865SKYFA8A',
            messageId: '11326754042',
            messageUTC: new Date('2022-07-06 17:13:52'),
            mobileOwnerID: '60002657',
            otaMessageSize: 17,
            payload:
              '130,7,19,98,197,194,179,193,212,150,22,194,73,183,163,0,10',
            receiveUTC: new Date('2022-07-06 17:13:52'),
            regionName: 'AORWSC',
            transport: 1,
          },
        ]);
      });
      it('should return a formatted with corrects params', () => {
        const result = functions.formatGetMessages(mockDownloadMessageReturn);

        expect(result[0]).toHaveProperty('messageId');
        expect(result[0]).toHaveProperty('messageUTC');
        expect(result[0]).toHaveProperty('receiveUTC');
        expect(result[0]).toHaveProperty('deviceId');
        expect(result[0]).toHaveProperty('SIN');
        expect(result[0]).toHaveProperty('MIN');
        expect(result[0]).toHaveProperty('payload');
        expect(result[0]).toHaveProperty('regionName');
        expect(result[0]).toHaveProperty('otaMessageSize');
        expect(result[0]).toHaveProperty('costumerID');
        expect(result[0]).toHaveProperty('transport');
        expect(result[0]).toHaveProperty('mobileOwnerID');
      });
    });
  });
  describe('uploadMessage', () => {
    describe('formatMessagesToPostOrbcomm()', () => {
      const mockCredentials = {
        access_id: 'mock_access',
        password: 'mock_password',
      };

      it('should return a body with property', () => {
        const result = functions.formatMessagesToPostOrbcomm(mockCredentials)(
          mockSendMessagesFindMany,
        );
        expect(result.messages[0]).toHaveProperty('RawPayload');
        expect(result.messages[0]).toHaveProperty('DestinationID');
        expect(result.messages[0]).toHaveProperty('UserMessageID');
      });
      it('should return a property with correct value', () => {
        const result = functions.formatMessagesToPostOrbcomm(mockCredentials)(
          mockSendMessagesFindMany,
        );
        expect(result.messages[0].UserMessageID).toEqual(
          mockSendMessagesFindMany[0].id,
        );
        expect(result.messages[0].DestinationID).toEqual(
          mockSendMessagesFindMany[0].deviceId,
        );
        expect(result.messages[0].RawPayload).toEqual(
          Buffer.from(mockSendMessagesFindMany[0].payload).toJSON().data,
        );
      });
      it('should return correct credentials', () => {
        const result = functions.formatMessagesToPostOrbcomm(mockCredentials)(
          mockSendMessagesFindMany,
        );
        expect(result.access_id).toEqual(mockCredentials.access_id);
        expect(result.password).toEqual(mockCredentials.password);
      });
    });
  });
  describe('checkMessages', () => {
    describe('formatMessagesToCheckOrbcomm()', () => {
      const mockCredentials = {
        access_id: 'mock_access',
        password: 'mock_password',
      };
      it('should return a correct body to check messages', () => {
        const result = functions.formatMessagesToCheckOrbcomm(mockCredentials)(
          mockFrwdMessagesToCheck,
        );
        expect(result).toEqual({
          access_id: mockCredentials.access_id,
          password: mockCredentials.password,
          fwIDs: mockFrwdMessagesToCheck.map((value) => value.fwrdMessageId),
        });
      });
      it('should return with correct properties', () => {
        const result = functions.formatMessagesToCheckOrbcomm(mockCredentials)(
          mockFrwdMessagesToCheck,
        );
        expect(result).toHaveProperty('fwIDs');
        expect(result).toHaveProperty('password');
        expect(result).toHaveProperty('access_id');
      });
    });
  });
});
