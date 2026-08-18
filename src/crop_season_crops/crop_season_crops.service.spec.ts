import { Test, TestingModule } from '@nestjs/testing';
import { CropSeasonCropsService } from './crop_season_crops.service';

describe('CropSeasonCropsService', () => {
  let service: CropSeasonCropsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CropSeasonCropsService],
    }).compile();

    service = module.get<CropSeasonCropsService>(CropSeasonCropsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
