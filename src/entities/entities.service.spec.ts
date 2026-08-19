import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EntitiesService } from './entities.service';
import { PropertyEntity } from './entities/entity.entity';
import { Customer } from '../customers/entities/customer.entity';
import { CropSeason } from '../crop_seasons/entities/crop_season.entity';
import { CropSeasonCrop } from '../crop_season_crops/entities/crop_season_crop.entity';
import { Crop } from '../crops/entities/crop.entity';

describe('EntitiesService', () => {
  let service: EntitiesService;
  let repo: {
    create: jest.Mock;
    save: jest.Mock;
    find: jest.Mock;
    findOne: jest.Mock;
    softDelete: jest.Mock;
    manager: {
      transaction: jest.Mock;
    };
  };
  let customerRepo: { findOneBy: jest.Mock };
  let cropSeasonsRepo: {
    create: jest.Mock;
    find: jest.Mock;
    findOne: jest.Mock;
    save: jest.Mock;
  };
  let cropSeasonCropsRepo: {
    create: jest.Mock;
    findOne: jest.Mock;
    save: jest.Mock;
    createQueryBuilder: jest.Mock;
  };
  let cropsRepo: { findOneBy: jest.Mock };

  beforeEach(async () => {
    repo = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      softDelete: jest.fn(),
      manager: {
        transaction: jest.fn(),
      },
    };
    customerRepo = { findOneBy: jest.fn() };
    cropSeasonsRepo = {
      create: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
    };
    cropSeasonCropsRepo = {
      create: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      createQueryBuilder: jest.fn(),
    };
    cropsRepo = { findOneBy: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EntitiesService,
        {
          provide: getRepositoryToken(PropertyEntity),
          useValue: repo,
        },
        {
          provide: getRepositoryToken(Customer),
          useValue: customerRepo,
        },
        {
          provide: getRepositoryToken(CropSeason),
          useValue: cropSeasonsRepo,
        },
        {
          provide: getRepositoryToken(CropSeasonCrop),
          useValue: cropSeasonCropsRepo,
        },
        {
          provide: getRepositoryToken(Crop),
          useValue: cropsRepo,
        },
      ],
    }).compile();

    service = module.get<EntitiesService>(EntitiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should reject create when total area is smaller than agricultural plus vegetation area', async () => {
    await expect(
      service.create({
        name: 'Farm',
        addressId: '123e4567-e89b-12d3-a456-426614174000',
        totalArea: 100,
        agricultureArea: 70,
        vegetationArea: 40,
      } as any),
    ).rejects.toThrow(BadRequestException);
  });

  it('should reject update when the farm areas become inconsistent', async () => {
    repo.findOne.mockResolvedValue({
      id: 'entity-1',
      totalArea: 100,
      agricultureArea: 60,
      vegetationArea: 40,
    });

    await expect(
      service.update('entity-1', { agricultureArea: 80 }),
    ).rejects.toThrow(BadRequestException);
    expect(repo.save).not.toHaveBeenCalled();
  });

  it('should reject create when the customer does not exist', async () => {
    customerRepo.findOneBy.mockResolvedValue(null);

    await expect(
      service.create({
        name: 'Farm',
        customerId: '123e4567-e89b-12d3-a456-426614174000',
        totalArea: 100,
        agricultureArea: 60,
        vegetationArea: 40,
      } as any),
    ).rejects.toThrow(NotFoundException);
  });

  it('should create an entity linked directly to its customer', async () => {
    const addressId = '123e4567-e89b-12d3-a456-426614174000';
    const addressDto = {
      street: 'Main St',
      number: '100',
      city: 'Sao Paulo',
      state: 'SP',
      zipCode: '01000-000',
    };
    const dto = {
      name: 'Farm',
      customerId: 'c50591d2-caaf-4545-8357-7448c70edcab',
      addressId,
      address: addressDto,
      totalArea: 100,
      agricultureArea: 60,
      vegetationArea: 40,
    };
    const address = { id: addressId, ...addressDto };
    const customer = { id: dto.customerId, name: 'Producer' };
    const entity = { id: 'entity-id', name: dto.name, addressId, address, customer };

    customerRepo.findOneBy.mockResolvedValue(customer);
    repo.create.mockReturnValue(entity);
    repo.save.mockResolvedValue(entity);

    await expect(service.create(dto)).resolves.toEqual(entity);
    expect(repo.create).toHaveBeenCalledWith({
      name: dto.name,
      customer,
      address: addressDto,
      totalArea: dto.totalArea,
      agricultureArea: dto.agricultureArea,
      vegetationArea: dto.vegetationArea,
    });
  });

  it('should not create an entity when the customer does not exist', async () => {
    const dto = {
      name: 'Farm',
      customerId: 'c39491c0-9fa4-467d-acec-bd9b55387a6a',
      addressId: 'c39491c0-9fa4-467d-acec-bd9b55387a6a',
      address: {
        street: 'Main St',
        number: '100',
        city: 'Sao Paulo',
        state: 'SP',
        zipCode: '01000-000',
      },
      totalArea: 100,
      agricultureArea: 60,
      vegetationArea: 40,
    };
    customerRepo.findOneBy.mockResolvedValue(null);

    await expect(service.create(dto)).rejects.toThrow(NotFoundException);
    expect(repo.save).not.toHaveBeenCalled();
  });

  it('should create an entity linked to an existing address', async () => {
    const dto = {
      name: 'Farm',
      customerId: '123e4567-e89b-12d3-a456-426614174000',
      addressId: '123e4567-e89b-12d3-a456-426614174000',
      totalArea: 100,
      agricultureArea: 60,
      vegetationArea: 40,
    };
    const address = { id: dto.addressId };
    const customer = { id: dto.customerId };
    const entity = { id: 'entity-id', ...dto, customer };

    customerRepo.findOneBy.mockResolvedValue(customer);
    repo.create.mockReturnValue(entity);
    repo.save.mockResolvedValue(entity);

    await expect(service.create(dto)).resolves.toEqual(entity);
    expect(repo.create).toHaveBeenCalledWith({
      name: dto.name,
      address: undefined,
      totalArea: dto.totalArea,
      agricultureArea: dto.agricultureArea,
      vegetationArea: dto.vegetationArea,
      customer,
    });
    expect(repo.save).toHaveBeenCalledWith(entity);
  });

  it('should throw when entity is not found', async () => {
    repo.findOne.mockResolvedValue(null);

    await expect(service.findOne('missing-id')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should list an entity crop seasons with their crops', async () => {
    const entity = { id: 'entity-1' };
    const seasons = [
      {
        id: 'season-1',
        year: '2026',
        cropSeasonCrops: [{ crop: { id: 'crop-1', name: 'Soja' } }],
      },
    ];
    repo.findOne.mockResolvedValue(entity);
    cropSeasonsRepo.find.mockResolvedValue(seasons);

    await expect(service.findCropSeasons('entity-1')).resolves.toEqual(seasons);
    expect(cropSeasonsRepo.find).toHaveBeenCalledWith({
      where: { entity: { id: 'entity-1' } },
      relations: { cropSeasonCrops: { crop: true } },
      order: { year: 'ASC' },
    });
  });

  it('should create a crop season within an entity', async () => {
    const entity = { id: 'entity-1' };
    const cropSeason = { id: 'season-1', entity, year: '2026' };
    repo.findOne.mockResolvedValue(entity);
    cropSeasonsRepo.findOne.mockResolvedValue(null);
    cropSeasonsRepo.create.mockReturnValue(cropSeason);
    cropSeasonsRepo.save.mockResolvedValue(cropSeason);

    await expect(
      service.createCropSeason('entity-1', {
        entityId: 'entity-1',
        year: '2026',
      }),
    ).resolves.toEqual(cropSeason);
    expect(cropSeasonsRepo.create).toHaveBeenCalledWith({
      entity,
      year: '2026',
    });
  });

  it('should find a crop season within its entity', async () => {
    const cropSeason = { id: 'season-1', entity: { id: 'entity-1' } };
    cropSeasonsRepo.findOne.mockResolvedValue(cropSeason);

    await expect(
      service.findCropSeason('entity-1', 'season-1'),
    ).resolves.toEqual(cropSeason);
    expect(cropSeasonsRepo.findOne).toHaveBeenCalledWith({
      where: {
        id: 'season-1',
        entity: { id: 'entity-1' },
      },
      relations: {
        entity: true,
        cropSeasonCrops: { crop: true },
      },
    });
  });

  it('should update a crop season within its entity', async () => {
    const cropSeason = {
      id: 'season-1',
      year: '2025',
      entity: { id: 'entity-1' },
    };
    cropSeasonsRepo.findOne
      .mockResolvedValueOnce(cropSeason)
      .mockResolvedValueOnce(null);
    cropSeasonsRepo.save.mockResolvedValue({ ...cropSeason, year: '2026' });

    await expect(
      service.updateCropSeason('entity-1', 'season-1', { year: '2026' }),
    ).resolves.toMatchObject({ year: '2026' });
    expect(cropSeasonsRepo.save).toHaveBeenCalledWith(
      expect.objectContaining({ year: '2026' }),
    );
  });

  it('should find a planted crop within its crop season and entity', async () => {
    const plantedCrop = {
      id: 'planting-1',
      plantedArea: 300,
      crop: { id: 'crop-1', name: 'Soja' },
      cropSeason: {
        id: 'season-1',
        entity: { id: 'entity-1', agricultureArea: 700 },
      },
    };
    cropSeasonCropsRepo.findOne.mockResolvedValue(plantedCrop);

    await expect(
      service.findCropSeasonCrop('entity-1', 'season-1', 'planting-1'),
    ).resolves.toEqual(plantedCrop);
  });

  it('should create a planted crop in an entity crop season', async () => {
    const cropSeason = {
      id: 'season-1',
      entity: { id: 'entity-1', agricultureArea: 700 },
    };
    const crop = { id: 'crop-1', name: 'Soja' };
    const plantedCrop = { id: 'planting-1', cropSeason, crop, plantedArea: 300 };
    const queryBuilder = {
      innerJoin: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getRawOne: jest.fn().mockResolvedValue({ total: '0' }),
    };
    cropSeasonsRepo.findOne.mockResolvedValue(cropSeason);
    cropsRepo.findOneBy.mockResolvedValue(crop);
    cropSeasonCropsRepo.findOne.mockResolvedValue(null);
    cropSeasonCropsRepo.createQueryBuilder.mockReturnValue(queryBuilder);
    cropSeasonCropsRepo.create.mockReturnValue(plantedCrop);
    cropSeasonCropsRepo.save.mockResolvedValue(plantedCrop);

    await expect(
      service.createCropSeasonCrop('entity-1', 'season-1', {
        cropSeasonId: 'season-1',
        cropId: 'crop-1',
        plantedArea: 300,
      }),
    ).resolves.toEqual(plantedCrop);
  });

  it('should update planted area within the farm agricultural area', async () => {
    const plantedCrop = {
      id: 'planting-1',
      plantedArea: 300,
      cropSeason: {
        id: 'season-1',
        entity: { id: 'entity-1', agricultureArea: 700 },
      },
    };
    const queryBuilder = {
      innerJoin: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getRawOne: jest.fn().mockResolvedValue({ total: '300' }),
    };
    cropSeasonCropsRepo.findOne.mockResolvedValue(plantedCrop);
    cropSeasonCropsRepo.createQueryBuilder.mockReturnValue(queryBuilder);
    cropSeasonCropsRepo.save.mockResolvedValue({
      ...plantedCrop,
      plantedArea: 400,
    });

    await expect(
      service.updateCropSeasonCrop('entity-1', 'season-1', 'planting-1', {
        plantedArea: 400,
      }),
    ).resolves.toMatchObject({ plantedArea: 400 });
  });

  it('should reject planted area above the farm agricultural area', async () => {
    const plantedCrop = {
      id: 'planting-1',
      cropSeason: {
        id: 'season-1',
        entity: { id: 'entity-1', agricultureArea: 700 },
      },
    };
    const queryBuilder = {
      innerJoin: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getRawOne: jest.fn().mockResolvedValue({ total: '400' }),
    };
    cropSeasonCropsRepo.findOne.mockResolvedValue(plantedCrop);
    cropSeasonCropsRepo.createQueryBuilder.mockReturnValue(queryBuilder);

    await expect(
      service.updateCropSeasonCrop('entity-1', 'season-1', 'planting-1', {
        plantedArea: 400,
      }),
    ).rejects.toThrow(BadRequestException);
  });
});
