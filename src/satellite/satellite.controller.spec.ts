import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { FetchByDeviceID } from '../pipes/transform-device.pipe';
import { SatelliteController } from './satellite.controller';
import { SatelliteService } from './satellite.service';

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
      ],
    }).compile();

    service = module.get<SatelliteService>(SatelliteService);
    controller = module.get<SatelliteController>(SatelliteController);
  });
  describe('sendMessage()', () => {
    it('should ??', () => {});
  });
});
