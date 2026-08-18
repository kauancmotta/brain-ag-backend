import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CropSeasonCropsService } from './crop_season_crops.service';
import { CropSeasonCrop } from './entities/crop_season_crop.entity';

describe('CropSeasonCropsService', () => {
  let service: CropSeasonCropsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CropSeasonCropsService,
        {
          provide: getRepositoryToken(CropSeasonCrop),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<CropSeasonCropsService>(CropSeasonCropsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
