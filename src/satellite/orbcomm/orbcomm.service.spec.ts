import { Test, TestingModule } from '@nestjs/testing';
import { OrbcommService } from './orbcomm.service';

describe('OrbcommService', () => {
  let service: OrbcommService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrbcommService],
    }).compile();

    service = module.get<OrbcommService>(OrbcommService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
