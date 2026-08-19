import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CropSeasonCropsService } from './crop_season_crops.service';
import { CropSeasonCrop } from './entities/crop_season_crop.entity';
import { CropSeason } from '../crop_seasons/entities/crop_season.entity';
import { Crop } from '../crops/entities/crop.entity';

describe('CropSeasonCropsService', () => {
  let service: CropSeasonCropsService;
  let cropSeasonCropsRepository: {
    create: jest.Mock;
    save: jest.Mock;
    find: jest.Mock;
    findOne: jest.Mock;
    exists: jest.Mock;
    softRemove: jest.Mock;
    createQueryBuilder: jest.Mock;
  };
  let cropSeasonsRepository: {
    findOne: jest.Mock;
  };
  let cropsRepository: {
    findOne: jest.Mock;
  };

  beforeEach(async () => {
    cropSeasonCropsRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      exists: jest.fn(),
      softRemove: jest.fn(),
      createQueryBuilder: jest.fn(),
    };
    cropSeasonsRepository = {
      findOne: jest.fn(),
    };
    cropsRepository = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CropSeasonCropsService,
        {
          provide: getRepositoryToken(CropSeasonCrop),
          useValue: cropSeasonCropsRepository,
        },
        {
          provide: getRepositoryToken(CropSeason),
          useValue: cropSeasonsRepository,
        },
        {
          provide: getRepositoryToken(Crop),
          useValue: cropsRepository,
        },
      ],
    }).compile();

    service = module.get<CropSeasonCropsService>(CropSeasonCropsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should reject a duplicate crop in the same crop season', async () => {
    cropSeasonsRepository.findOne.mockResolvedValue({
      id: 'season-1',
      entity: { agricultureArea: 100 },
    });
    cropsRepository.findOne.mockResolvedValue({ id: 'crop-1', name: 'Corn' });
    cropSeasonCropsRepository.exists.mockResolvedValue(true);

    await expect(
      service.create({
        cropSeasonId: 'season-1',
        cropId: 'crop-1',
        plantedArea: 10,
      } as any),
    ).rejects.toThrow(ConflictException);
  });

  it('should throw not found for missing crop season', async () => {
    cropSeasonsRepository.findOne.mockResolvedValue(null);

    await expect(
      service.create({
        cropSeasonId: 'missing',
        cropId: 'crop-1',
        plantedArea: 10,
      } as any),
    ).rejects.toThrow(NotFoundException);
  });

  it('should associate an existing crop with an existing crop season', async () => {
    const cropSeason = {
      id: 'season-1',
      entity: { id: 'entity-1', agricultureArea: 100 },
    };
    const crop = { id: 'crop-1', name: 'Corn' };
    const cropSeasonCrop = { id: 'season-crop-1', cropSeason, crop, plantedArea: 25 };
    const queryBuilder = {
      select: jest.fn().mockReturnThis(),
      innerJoin: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getRawOne: jest.fn().mockResolvedValue({ total: '0' }),
    };

    cropSeasonsRepository.findOne.mockResolvedValue(cropSeason);
    cropsRepository.findOne.mockResolvedValue(crop);
    cropSeasonCropsRepository.exists.mockResolvedValue(false);
    cropSeasonCropsRepository.createQueryBuilder.mockReturnValue(queryBuilder);
    cropSeasonCropsRepository.create.mockReturnValue(cropSeasonCrop);
    cropSeasonCropsRepository.save.mockResolvedValue(cropSeasonCrop);

    await expect(
      service.create({
        cropSeasonId: 'season-1',
        cropId: 'crop-1',
        plantedArea: 25,
      }),
    ).resolves.toEqual(cropSeasonCrop);
    expect(cropSeasonCropsRepository.create).toHaveBeenCalledWith({
      cropSeason,
      crop,
      plantedArea: 25,
    });
  });

  it('should reject an unknown crop', async () => {
    cropSeasonsRepository.findOne.mockResolvedValue({
      id: 'season-1',
      entity: { agricultureArea: 100 },
    });
    cropsRepository.findOne.mockResolvedValue(null);

    await expect(
      service.create({
        cropSeasonId: 'season-1',
        cropId: 'missing',
        plantedArea: 10,
      }),
    ).rejects.toThrow(NotFoundException);
  });
});
