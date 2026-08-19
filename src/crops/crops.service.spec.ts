import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CropsService } from './crops.service';
import { Crop } from './entities/crop.entity';
import { CropSeasonCrop } from '../crop_season_crops/entities/crop_season_crop.entity';

describe('CropsService', () => {
  let service: CropsService;
  let cropsRepository: {
    create: jest.Mock;
    save: jest.Mock;
    find: jest.Mock;
    findOne: jest.Mock;
    exists: jest.Mock;
    remove: jest.Mock;
  };
  let cropSeasonCropsRepository: {
    exists: jest.Mock;
  };

  beforeEach(async () => {
    cropsRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      exists: jest.fn(),
      remove: jest.fn(),
    };
    cropSeasonCropsRepository = {
      exists: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CropsService,
        {
          provide: getRepositoryToken(Crop),
          useValue: cropsRepository,
        },
        {
          provide: getRepositoryToken(CropSeasonCrop),
          useValue: cropSeasonCropsRepository,
        },
      ],
    }).compile();

    service = module.get<CropsService>(CropsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should reject duplicate crop names', async () => {
    cropsRepository.exists.mockResolvedValue(true);

    await expect(service.create({ name: 'Corn' } as any)).rejects.toThrow(
      ConflictException,
    );
  });

  it('should create, list, find, and update a crop', async () => {
    const crop = { id: 'crop-1', name: 'Corn' };
    cropsRepository.exists.mockResolvedValue(false);
    cropsRepository.create.mockReturnValue(crop);
    cropsRepository.save.mockResolvedValue(crop);
    cropsRepository.find.mockResolvedValue([crop]);
    cropsRepository.findOne.mockResolvedValue(crop);

    await expect(service.create({ name: 'Corn' })).resolves.toEqual(crop);
    await expect(service.findAll()).resolves.toEqual([crop]);
    await expect(service.findOne('crop-1')).resolves.toEqual(crop);
    await expect(service.update('crop-1', { name: 'Corn' })).resolves.toEqual(
      crop,
    );
  });

  it('should prevent deleting a crop in use', async () => {
    cropsRepository.findOne.mockResolvedValue({ id: 'crop-1', name: 'Corn' });
    cropSeasonCropsRepository.exists.mockResolvedValue(true);

    await expect(service.remove('crop-1')).rejects.toThrow(ConflictException);
  });

    it('should delete an unused crop', async () => {
      const crop = { id: 'crop-1', name: 'Corn' };
      cropsRepository.findOne.mockResolvedValue(crop);
      cropSeasonCropsRepository.exists.mockResolvedValue(false);

      await expect(service.remove('crop-1')).resolves.toBeUndefined();
      expect(cropsRepository.remove).toHaveBeenCalledWith(crop);
    });
});
