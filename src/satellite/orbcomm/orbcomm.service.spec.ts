import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../prisma/prisma.service';
import { OrbcommService } from './orbcomm.service';

const mockNextMessageReturn = {
  id: 1,
  previousMessage: '2021-10-09 00:14:55',
  nextMessage: '2021-10-09 00:14:55',
  createdAt: '2022-07-07T17:11:02.769Z',
};

describe('OrbcommService', () => {
  let service: OrbcommService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrbcommService,
        {
          provide: PrismaService,
          useValue: {
            orbcommNextMessage: {
              findFirst: jest.fn().mockReturnValue(mockNextMessageReturn),
            },
          },
        },
        {
          provide: HttpService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<OrbcommService>(OrbcommService);
    prisma = module.get<PrismaService>(PrismaService);
  });
  describe('downloadMessages', () => {
    it('should call prisma orbcommNextMessage.findFirst with correct params', () => {
      const mockPrismaFindNextMessage = jest
        .fn()
        .mockReturnValue(mockNextMessageReturn);

      jest
        .spyOn(prisma.orbcommNextMessage, 'findFirst')
        .mockImplementation(mockPrismaFindNextMessage);

      service.downloadMessages();

      expect(mockPrismaFindNextMessage).toBeCalledWith({
        select: { nextMessage: true },
      });
    });
  });
});
