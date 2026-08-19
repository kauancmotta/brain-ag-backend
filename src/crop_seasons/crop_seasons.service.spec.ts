import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { validate } from 'class-validator';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CropSeasonsService } from './crop_seasons.service';
import { CropSeason } from './entities/crop_season.entity';
import { PropertyEntity } from '../entities/entities/entity.entity';
import { CreateCropSeasonDto } from './dto/create-crop_season.dto';

describe('CropSeasonsService', () => {
  let service: CropSeasonsService;
  let cropSeasonsRepository: {
    create: jest.Mock;
    save: jest.Mock;
    find: jest.Mock;
    findOne: jest.Mock;
    softDelete: jest.Mock;
  };
  let entitiesRepository: {
    findOne: jest.Mock;
  };

  beforeEach(async () => {
    cropSeasonsRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      softDelete: jest.fn(),
    };
    entitiesRepository = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CropSeasonsService,
        {
          provide: getRepositoryToken(CropSeason),
          useValue: cropSeasonsRepository,
        },
        {
          provide: getRepositoryToken(PropertyEntity),
          useValue: entitiesRepository,
        },
      ],
    }).compile();

    service = module.get<CropSeasonsService>(CropSeasonsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a crop season when entity exists', async () => {
    const dto = {
      entityId: 'c50591d2-caaf-4545-8357-7448c70edcab',
      year: '2024',
    };

    const entity = { id: dto.entityId };
    const cropSeason = { id: 'season-1', ...dto, entity };

    entitiesRepository.findOne.mockResolvedValue(entity);
    cropSeasonsRepository.create.mockReturnValue(cropSeason);
    cropSeasonsRepository.save.mockResolvedValue(cropSeason);

    await expect(service.create(dto as any)).resolves.toEqual(cropSeason);
    expect(entitiesRepository.findOne).toHaveBeenCalled();
  });

  it('should throw when entity is not found', async () => {
    entitiesRepository.findOne.mockResolvedValue(null);

    await expect(
      service.create({
        entityId: '11111111-1111-1111-1111-111111111111',
        year: '2024',
      } as any),
    ).rejects.toThrow(NotFoundException);
  });

  it('should reject a duplicate year for the same entity', async () => {
    const entity = { id: 'entity-1' };
    entitiesRepository.findOne.mockResolvedValue(entity);
    cropSeasonsRepository.findOne.mockResolvedValue({
      id: 'season-1',
      entity,
      year: '2024',
    });

    await expect(
      service.create({ entityId: 'entity-1', year: '2024' }),
    ).rejects.toThrow(ConflictException);
  });

  it('should allow the same year for a different entity', async () => {
    const entity = { id: 'entity-2' };
    const cropSeason = { id: 'season-2', entity, year: '2024' };
    entitiesRepository.findOne.mockResolvedValue(entity);
    cropSeasonsRepository.findOne.mockResolvedValue(null);
    cropSeasonsRepository.create.mockReturnValue(cropSeason);
    cropSeasonsRepository.save.mockResolvedValue(cropSeason);

    await expect(
      service.create({ entityId: 'entity-2', year: '2024' }),
    ).resolves.toEqual(cropSeason);
  });

  it('should validate crop season years as exactly four digits', async () => {
    const invalidDto = Object.assign(new CreateCropSeasonDto(), {
      entityId: 'c50591d2-caaf-4545-8357-7448c70edcab',
      year: '24',
    });
    const validDto = Object.assign(new CreateCropSeasonDto(), {
      entityId: 'c50591d2-caaf-4545-8357-7448c70edcab',
      year: '2026',
    });

    await expect(validate(invalidDto)).resolves.not.toHaveLength(0);
    await expect(validate(validDto)).resolves.toHaveLength(0);
  });

  it('should list, find, update, and soft-delete crop seasons', async () => {
    const cropSeason = { id: 'season-1', entity: { id: 'entity-1' }, year: '2026' };
    cropSeasonsRepository.find.mockResolvedValue([cropSeason]);
    cropSeasonsRepository.findOne.mockResolvedValue(cropSeason);
    cropSeasonsRepository.save.mockResolvedValue(cropSeason);

    await expect(service.findAll()).resolves.toEqual([cropSeason]);
    await expect(service.findOne('season-1')).resolves.toEqual(cropSeason);
    await expect(
      service.update('season-1', { year: '2026' }),
    ).resolves.toEqual(cropSeason);
    await expect(service.remove('season-1')).resolves.toBeUndefined();
    expect(cropSeasonsRepository.softDelete).toHaveBeenCalledWith('season-1');
  });
});
