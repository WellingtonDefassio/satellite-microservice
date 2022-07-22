import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { FetchByDeviceID } from '../pipes/transform-device.pipe';
import { SatelliteController } from './satellite.controller';
import { SatelliteService } from './satellite.service';
import { DeviceStatus } from '@prisma/client';

const mockResolvedBody = {
  deviceId: 'mockDeviceId',
  payload: '1020304050',
  device: { id: 1, deviceId: 1, status: DeviceStatus.ACTIVE },
};

describe('SatelliteController', () => {
  let controller: SatelliteController;
  let service: SatelliteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SatelliteController,
        {
          provide: SatelliteService,
          useValue: {
            sendMessage: jest.fn().mockReturnValue([]),
          },
        },
        {
          provide: FetchByDeviceID,
          useValue: {
            transform: jest.fn().mockReturnValue([]),
          },
        },
        {
          provide: PrismaService,
          useValue: {
            devices: {
              findUnique: jest.fn().mockResolvedValue([]),
            },
          },
        },
      ],
    }).compile();

    service = module.get<SatelliteService>(SatelliteService);
    controller = module.get<SatelliteController>(SatelliteController);
  });
  describe('sendMessage()', () => {
    it('should call service.sendMessages when controller.sendMessages is call', () => {
      const spyService = jest.spyOn(service, 'sendMessage');

      controller.sendMessage(mockResolvedBody);

      expect(spyService).toBeCalledTimes(1);
    });
    it('should call service.sendMessages when controller.sendMessages to be called with', () => {
      const spyService = jest.spyOn(service, 'sendMessage');

      controller.sendMessage(mockResolvedBody);

      expect(spyService).toBeCalledWith(mockResolvedBody);
    });
    it('should call service.sendMessages when controller.sendMessages to be called with', () => {
      jest
        .spyOn(service, 'sendMessage')
        .mockRejectedValueOnce(new Error('service error'));

      expect(controller.sendMessage(mockResolvedBody)).rejects.toThrow(
        'service error',
      );
    });
  });
});
