import { Test, TestingModule } from '@nestjs/testing';
import { CropSeasonsController } from './crop_seasons.controller';
import { CropSeasonsService } from './crop_seasons.service';

describe('CropSeasonsController', () => {
  let controller: CropSeasonsController;
  let service: {
    create: jest.Mock;
    findAll: jest.Mock;
    findOne: jest.Mock;
    update: jest.Mock;
    remove: jest.Mock;
  };

  beforeEach(async () => {
    service = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CropSeasonsController],
      providers: [{ provide: CropSeasonsService, useValue: service }],
    }).compile();

    controller = module.get<CropSeasonsController>(CropSeasonsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should delegate create to service', () => {
    const dto = {
      entityId: 'c50591d2-caaf-4545-8357-7448c70edcab',
      year: '2024',
    };
    controller.create(dto as any);

    expect(service.create).toHaveBeenCalledWith(dto);
  });
});
