import { Test, TestingModule } from '@nestjs/testing';
import { CropSeasonsService } from './crop_seasons.service';

describe('CropSeasonsService', () => {
  let service: CropSeasonsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CropSeasonsService],
    }).compile();

    service = module.get<CropSeasonsService>(CropSeasonsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
