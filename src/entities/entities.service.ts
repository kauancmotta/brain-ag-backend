import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEntityDto } from './dto/create-entity.dto';
import { UpdateEntityDto } from './dto/update-entity.dto';
import { PropertyEntity } from './entities/entity.entity';
import { Customer } from '../customers/entities/customer.entity';
import { CropSeason } from '../crop_seasons/entities/crop_season.entity';
import { UpdateCropSeasonDto } from '../crop_seasons/dto/update-crop_season.dto';
import { CreateCropSeasonDto } from '../crop_seasons/dto/create-crop_season.dto';
import { CropSeasonCrop } from '../crop_season_crops/entities/crop_season_crop.entity';
import { Crop } from '../crops/entities/crop.entity';
import { CreateCropSeasonCropDto } from '../crop_season_crops/dto/create-crop_season_crop.dto';
import { UpdateCropSeasonCropDto } from '../crop_season_crops/dto/update-crop_season_crop.dto';

@Injectable()
export class EntitiesService {
  constructor(
    @InjectRepository(PropertyEntity)
    private readonly entityRepository: Repository<PropertyEntity>,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    @InjectRepository(CropSeason)
    private readonly cropSeasonsRepository: Repository<CropSeason>,
    @InjectRepository(CropSeasonCrop)
    private readonly cropSeasonCropsRepository: Repository<CropSeasonCrop>,
    @InjectRepository(Crop)
    private readonly cropsRepository: Repository<Crop>,
  ) {}

  async create(createEntityDto: CreateEntityDto): Promise<PropertyEntity> {
    if (
      createEntityDto.agricultureArea + createEntityDto.vegetationArea >
      createEntityDto.totalArea
    ) {
      throw new BadRequestException(
        'Agricultural and vegetation areas cannot exceed total area',
      );
    }

    const customer = await this.customerRepository.findOneBy({
      id: createEntityDto.customerId,
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    const { customerId, ...entityData } = createEntityDto;
    const entity = this.entityRepository.create({
      ...entityData,
      customer,
    });

    return this.entityRepository.save(entity);
  }

  async findAll() {
    const entities = await this.entityRepository.find({
      relations: {
        address: true,
        customer: true,
      },
    });

    return entities;
  }

  async findOne(id: string): Promise<PropertyEntity> {
    const entity = await this.entityRepository.findOne({
      where: { id },
      relations: {
        address: true,
        customer: true,
      },
    });

    if (!entity) {
      throw new NotFoundException(`Entity with id ${id} not found`);
    }

    return entity;
  }

  async findCropSeasons(entityId: string): Promise<CropSeason[]> {
    const entity = await this.entityRepository.findOne({
      where: { id: entityId },
    });

    if (!entity) {
      throw new NotFoundException(`Entity with id ${entityId} not found`);
    }

    return this.cropSeasonsRepository.find({
      where: { entity: { id: entityId } },
      relations: {
        cropSeasonCrops: {
          crop: true,
        },
      },
      order: { year: 'ASC' },
    });
  }

  async createCropSeason(
    entityId: string,
    createDto: CreateCropSeasonDto,
  ): Promise<CropSeason> {
    if (createDto.entityId && createDto.entityId !== entityId) {
      throw new BadRequestException(
        'entityId does not match the route entity id',
      );
    }

    const entity = await this.entityRepository.findOne({
      where: { id: entityId },
    });

    if (!entity) {
      throw new NotFoundException(`Entity with id ${entityId} not found`);
    }

    const existing = await this.cropSeasonsRepository.findOne({
      where: {
        entity: { id: entityId },
        year: createDto.year,
      },
    });

    if (existing) {
      throw new BadRequestException(
        'A crop season for this entity and year already exists',
      );
    }

    return this.cropSeasonsRepository.save(
      this.cropSeasonsRepository.create({
        entity,
        year: createDto.year,
      }),
    );
  }

  async findCropSeason(
    entityId: string,
    cropSeasonId: string,
  ): Promise<CropSeason> {
    const cropSeason = await this.cropSeasonsRepository.findOne({
      where: {
        id: cropSeasonId,
        entity: { id: entityId },
      },
      relations: {
        entity: true,
        cropSeasonCrops: {
          crop: true,
        },
      },
    });

    if (!cropSeason) {
      throw new NotFoundException(
        `Crop season with id ${cropSeasonId} not found for entity ${entityId}`,
      );
    }

    return cropSeason;
  }

  async updateCropSeason(
    entityId: string,
    cropSeasonId: string,
    updateCropSeasonDto: UpdateCropSeasonDto,
  ): Promise<CropSeason> {
    const cropSeason = await this.findCropSeason(entityId, cropSeasonId);
    const { entityId: requestedEntityId, year } = updateCropSeasonDto;

    if (requestedEntityId && requestedEntityId !== entityId) {
      throw new BadRequestException(
        'A crop season cannot be moved through a nested entity endpoint',
      );
    }

    if (year && year !== cropSeason.year) {
      const existing = await this.cropSeasonsRepository.findOne({
        where: {
          entity: { id: entityId },
          year,
        },
      });

      if (existing && existing.id !== cropSeasonId) {
        throw new BadRequestException(
          'A crop season for this entity and year already exists',
        );
      }

      cropSeason.year = year;
    }

    return this.cropSeasonsRepository.save(cropSeason);
  }

  async findCropSeasonCrop(
    entityId: string,
    cropSeasonId: string,
    cropSeasonCropId: string,
  ): Promise<CropSeasonCrop> {
    const cropSeasonCrop = await this.cropSeasonCropsRepository.findOne({
      where: {
        id: cropSeasonCropId,
        cropSeason: {
          id: cropSeasonId,
          entity: { id: entityId },
        },
      },
      relations: {
        crop: true,
        cropSeason: {
          entity: true,
        },
      },
    });

    if (!cropSeasonCrop) {
      throw new NotFoundException(
        `Crop season crop with id ${cropSeasonCropId} not found for crop season ${cropSeasonId} and entity ${entityId}`,
      );
    }

    return cropSeasonCrop;
  }

  async createCropSeasonCrop(
    entityId: string,
    cropSeasonId: string,
    createDto: CreateCropSeasonCropDto,
  ): Promise<CropSeasonCrop> {
    if (createDto.cropSeasonId && createDto.cropSeasonId !== cropSeasonId) {
      throw new BadRequestException(
        'cropSeasonId does not match the route crop season id',
      );
    }

    const cropSeason = await this.findCropSeason(entityId, cropSeasonId);
    const crop = await this.cropsRepository.findOneBy({ id: createDto.cropId });

    if (!crop) {
      throw new NotFoundException('Crop not found');
    }

    const existing = await this.cropSeasonCropsRepository.findOne({
      where: {
        cropSeason: { id: cropSeasonId },
        crop: { id: createDto.cropId },
      },
    });

    if (existing) {
      throw new BadRequestException(
        'Crop is already registered in this crop season',
      );
    }

    await this.ensurePlantedAreaAvailable(
      cropSeason,
      createDto.plantedArea,
    );

    const cropSeasonCrop = this.cropSeasonCropsRepository.create({
      cropSeason,
      crop,
      plantedArea: createDto.plantedArea,
    });

    return this.cropSeasonCropsRepository.save(cropSeasonCrop);
  }

  async updateCropSeasonCrop(
    entityId: string,
    cropSeasonId: string,
    cropSeasonCropId: string,
    updateDto: UpdateCropSeasonCropDto,
  ): Promise<CropSeasonCrop> {
    const cropSeasonCrop = await this.findCropSeasonCrop(
      entityId,
      cropSeasonId,
      cropSeasonCropId,
    );
    await this.ensurePlantedAreaAvailable(
      cropSeasonCrop.cropSeason,
      updateDto.plantedArea,
      cropSeasonCropId,
    );

    cropSeasonCrop.plantedArea = updateDto.plantedArea;
    return this.cropSeasonCropsRepository.save(cropSeasonCrop);
  }

  private async ensurePlantedAreaAvailable(
    cropSeason: CropSeason,
    plantedArea: number,
    excludedCropSeasonCropId?: string,
  ): Promise<void> {
    const query = this.cropSeasonCropsRepository
      .createQueryBuilder('cropSeasonCrop')
      .innerJoin('cropSeasonCrop.cropSeason', 'cropSeason')
      .select('COALESCE(SUM(cropSeasonCrop.plantedArea), 0)', 'total')
      .where('cropSeason.id = :cropSeasonId', { cropSeasonId: cropSeason.id })
      .andWhere('cropSeasonCrop.deletedAt IS NULL');

    if (excludedCropSeasonCropId) {
      query.andWhere('cropSeasonCrop.id != :cropSeasonCropId', {
        cropSeasonCropId: excludedCropSeasonCropId,
      });
    }

    const result = await query.getRawOne<{ total: string }>();
    const total = Number(result?.total ?? 0) + plantedArea;

    if (total > cropSeason.entity.agricultureArea) {
      throw new BadRequestException(
        'Planted area exceeds the farm agricultural area',
      );
    }
  }

  async update(
    id: string,
    updateEntityDto: UpdateEntityDto,
  ): Promise<PropertyEntity> {
    const entity = await this.findOne(id);
    const { customerId, ...entityData } = updateEntityDto;

    if (customerId) {
      const customer = await this.customerRepository.findOneBy({
        id: customerId,
      });

      if (!customer) {
        throw new NotFoundException('Customer not found');
      }

      entity.customer = customer;
    }

    Object.assign(entity, entityData);
    return this.entityRepository.save(entity);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.entityRepository.softDelete(id);
  }
}
