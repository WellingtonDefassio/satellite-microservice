import { Test, TestingModule } from '@nestjs/testing';
import { DeviceStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { SatelliteService } from './satellite.service';

const mockBody = {
  deviceId: 'mockDeviceId',
  payload: '1020304050',
  device: { id: 1, deviceId: 1, status: DeviceStatus.ACTIVE },
};

const mockCreateMessage = {
  id: 1,
  payload: 'any',
};

describe('SatelliteService', () => {
  let service: SatelliteService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SatelliteService,
        {
          provide: PrismaService,
          useValue: {
            satelliteSendMessages: {
              create: jest.fn().mockResolvedValue(mockCreateMessage),
            },
          },
        },
      ],
    }).compile();

    service = module.get<SatelliteService>(SatelliteService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('sendMessage()', () => {
    it('should call prisma.satelliteMessage.create when sendMessage is call', () => {
      const spySendMessages = jest.spyOn(
        prisma.satelliteSendMessages,
        'create',
      );

      service.sendMessage(mockBody);

      expect(spySendMessages).toBeCalledTimes(1);
    });
    it('should call prisma.satelliteMessage.create with correct values', () => {
      const spySendMessages = jest.spyOn(
        prisma.satelliteSendMessages,
        'create',
      );

      service.sendMessage(mockBody);

      expect(spySendMessages).toBeCalledWith({
        data: {
          payload: mockBody.payload,
          device: { connect: { deviceId: mockBody.deviceId } },
        },
      });
    });
    it('should throw a Error message if this.prisma throws', () => {
      jest
        .spyOn(prisma.satelliteSendMessages, 'create')
        .mockRejectedValueOnce(new Error('error!'));

      expect(service.sendMessage(mockBody)).rejects.toThrowError('error');
    });
  });
});
