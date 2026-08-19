import { Test, TestingModule } from '@nestjs/testing';
import { EntitiesController } from './entities.controller';
import { EntitiesService } from './entities.service';

describe('EntitiesController', () => {
  let controller: EntitiesController;
  let service: {
    create: jest.Mock;
    findAll: jest.Mock;
    findOne: jest.Mock;
    update: jest.Mock;
    remove: jest.Mock;
    findCropSeasons: jest.Mock;
    createCropSeason: jest.Mock;
    findCropSeason: jest.Mock;
    updateCropSeason: jest.Mock;
    findCropSeasonCrop: jest.Mock;
    updateCropSeasonCrop: jest.Mock;
    createCropSeasonCrop: jest.Mock;
  };

  beforeEach(async () => {
    service = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      findCropSeasons: jest.fn(),
      createCropSeason: jest.fn(),
      findCropSeason: jest.fn(),
      updateCropSeason: jest.fn(),
      findCropSeasonCrop: jest.fn(),
      updateCropSeasonCrop: jest.fn(),
      createCropSeasonCrop: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [EntitiesController],
      providers: [{ provide: EntitiesService, useValue: service }],
    }).compile();

    controller = module.get<EntitiesController>(EntitiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should delegate create to service', () => {
    const dto = {
      name: 'Farm',
      addressId: '123e4567-e89b-12d3-a456-426614174000',
      totalArea: 150,
      agricultureArea: 100,
      vegetationArea: 50,
    };
    controller.create(dto);

    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should delegate crop season listing to service', () => {
    controller.findCropSeasons('entity-1');

    expect(service.findCropSeasons).toHaveBeenCalledWith('entity-1');
  });

  it('should delegate a crop season detail request to service', () => {
    controller.findCropSeason('entity-1', 'season-1');

    expect(service.findCropSeason).toHaveBeenCalledWith(
      'entity-1',
      'season-1',
    );
  });

  it('should delegate crop season creation to service', () => {
    const dto = {
      entityId: 'entity-1',
      year: '2026',
    };

    controller.createCropSeason('entity-1', dto);

    expect(service.createCropSeason).toHaveBeenCalledWith('entity-1', dto);
  });

  it('should delegate a crop season update to service', () => {
    const dto = { year: '2026' };

    controller.updateCropSeason('entity-1', 'season-1', dto);

    expect(service.updateCropSeason).toHaveBeenCalledWith(
      'entity-1',
      'season-1',
      dto,
    );
  });

  it('should delegate a crop season replacement to service', () => {
    const dto = { year: '2026' };

    controller.replaceCropSeason('entity-1', 'season-1', dto);

    expect(service.updateCropSeason).toHaveBeenCalledWith(
      'entity-1',
      'season-1',
      dto,
    );
  });

  it('should delegate a planted crop detail request to service', () => {
    controller.findCropSeasonCrop('entity-1', 'season-1', 'planting-1');

    expect(service.findCropSeasonCrop).toHaveBeenCalledWith(
      'entity-1',
      'season-1',
      'planting-1',
    );
  });

  it('should delegate a planted crop creation to service', () => {
    const dto = {
      cropSeasonId: 'season-1',
      cropId: 'crop-1',
      plantedArea: 300,
    };

    controller.createCropSeasonCrop('entity-1', 'season-1', dto);

    expect(service.createCropSeasonCrop).toHaveBeenCalledWith(
      'entity-1',
      'season-1',
      dto,
    );
  });

  it('should delegate a planted crop update to service', () => {
    const dto = { plantedArea: 400 };

    controller.updateCropSeasonCrop(
      'entity-1',
      'season-1',
      'planting-1',
      dto,
    );

    expect(service.updateCropSeasonCrop).toHaveBeenCalledWith(
      'entity-1',
      'season-1',
      'planting-1',
      dto,
    );
  });
});
