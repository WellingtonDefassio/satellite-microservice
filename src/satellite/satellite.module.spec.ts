import { Test } from '@nestjs/testing';
import { OrbcommService } from './orbcomm/orbcomm.service';
import { SatelliteModule } from './satellite.module';
import { SatelliteService } from './satellite.service';

describe('Satellite Module', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [SatelliteModule],
    }).compile();

    expect(module).toBeDefined();
    expect(module.get(SatelliteService)).toBeInstanceOf(SatelliteService);
    expect(module.get(OrbcommService)).toBeInstanceOf(OrbcommService);
  });
});
