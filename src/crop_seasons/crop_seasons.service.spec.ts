import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CropSeasonsService } from './crop_seasons.service';
import { CropSeason } from './entities/crop_season.entity';

describe('CropSeasonsService', () => {
  let service: CropSeasonsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CropSeasonsService,
        {
          provide: getRepositoryToken(CropSeason),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<CropSeasonsService>(CropSeasonsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
