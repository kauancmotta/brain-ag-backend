import { Test, TestingModule } from '@nestjs/testing';
import { CropSeasonCropsController } from './crop_season_crops.controller';
import { CropSeasonCropsService } from './crop_season_crops.service';

describe('CropSeasonCropsController', () => {
  let controller: CropSeasonCropsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CropSeasonCropsController],
      providers: [{ provide: CropSeasonCropsService, useValue: {} }],
    }).compile();

    controller = module.get<CropSeasonCropsController>(
      CropSeasonCropsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
