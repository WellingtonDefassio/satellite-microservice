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

describe('Orbcomm-validators', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
  });
  describe('downloadMessages', () => {
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
  });
});
