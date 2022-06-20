import { Test, TestingModule } from '@nestjs/testing';
import { EridiumService } from './eridium.service';

describe('EridiumService', () => {
  let service: EridiumService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EridiumService],
    }).compile();

    service = module.get<EridiumService>(EridiumService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
