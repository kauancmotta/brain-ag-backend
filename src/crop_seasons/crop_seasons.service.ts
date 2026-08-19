import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCropSeasonDto } from './dto/create-crop_season.dto';
import { UpdateCropSeasonDto } from './dto/update-crop_season.dto';
import { CropSeason } from './entities/crop_season.entity';
import { PropertyEntity } from '../entities/entities/entity.entity';

@Injectable()
export class CropSeasonsService {
  constructor(
    @InjectRepository(CropSeason)
    private readonly cropSeasonsRepository: Repository<CropSeason>,
    @InjectRepository(PropertyEntity)
    private readonly entitiesRepository: Repository<PropertyEntity>,
  ) {}

  async create(createCropSeasonDto: CreateCropSeasonDto): Promise<CropSeason> {
    const { entityId, ...cropSeasonData } = createCropSeasonDto;

    const entity = await this.entitiesRepository.findOne({
      where: {
        id: entityId,
      },
    });

    if (!entity) {
      throw new NotFoundException('Entity not found');
    }

    await this.ensureYearAvailable(entityId, cropSeasonData.year);

    const cropSeason = this.cropSeasonsRepository.create({
      ...cropSeasonData,
      entity,
    });

    return this.cropSeasonsRepository.save(cropSeason);
  }

  findAll(): Promise<CropSeason[]> {
    return this.cropSeasonsRepository.find({
      relations: {
        entity: true,
        cropSeasonCrops: {
          crop: true,
        },
      },
    });
  }

  async findOne(id: string): Promise<CropSeason> {
    const cropSeason = await this.cropSeasonsRepository.findOne({
      where: { id },
      relations: {
        entity: true,
        cropSeasonCrops: {
          crop: true,
        },
      },
    });

    if (!cropSeason) {
      throw new NotFoundException(`Crop season with id ${id} not found`);
    }

    return cropSeason;
  }

  async update(
    id: string,
    updateCropSeasonDto: UpdateCropSeasonDto,
  ): Promise<CropSeason> {
    const cropSeason = await this.findOne(id);
    const { entityId, year, ...seasonData } = updateCropSeasonDto;

    if (entityId) {
      const entity = await this.entitiesRepository.findOneBy({ id: entityId });

      if (!entity) {
        throw new NotFoundException('Entity not found');
      }

      cropSeason.entity = entity;
    }

    if (year && (year !== cropSeason.year || entityId)) {
      await this.ensureYearAvailable(
        entityId ?? cropSeason.entity.id,
        year,
        id,
      );
    }

    Object.assign(cropSeason, seasonData);
    if (year) {
      cropSeason.year = year;
    }
    return this.cropSeasonsRepository.save(cropSeason);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.cropSeasonsRepository.softDelete(id);
  }

  private async ensureYearAvailable(
    entityId: string,
    year: string,
    excludeId?: string,
  ): Promise<void> {
    const existing = await this.cropSeasonsRepository.findOne({
      where: {
        entity: { id: entityId },
        year,
      },
      withDeleted: true,
    });

    if (existing && existing.id !== excludeId) {
      throw new ConflictException(
        'A crop season for this entity and year already exists',
      );
    }
  }
}
