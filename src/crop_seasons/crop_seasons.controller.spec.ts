import { Test, TestingModule } from '@nestjs/testing';
import { CropSeasonsController } from './crop_seasons.controller';
import { CropSeasonsService } from './crop_seasons.service';

describe('CropSeasonsController', () => {
  let controller: CropSeasonsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CropSeasonsController],
      providers: [{ provide: CropSeasonsService, useValue: {} }],
    }).compile();

    controller = module.get<CropSeasonsController>(CropSeasonsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
