import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CropSeason } from '../crop_seasons/entities/crop_season.entity';
import { UpdateCropSeasonCropDto } from './dto/update-crop_season_crop.dto';
import { CropSeasonCrop } from './entities/crop_season_crop.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCropSeasonCropDto } from './dto/create-crop_season_crop.dto';
import { Crop } from '../crops/entities/crop.entity';

@Injectable()
export class CropSeasonCropsService {
  constructor(
    @InjectRepository(CropSeasonCrop)
    private readonly cropSeasonCropsRepository: Repository<CropSeasonCrop>,

    @InjectRepository(CropSeason)
    private readonly cropSeasonsRepository: Repository<CropSeason>,

    @InjectRepository(Crop)
    private readonly cropsRepository: Repository<Crop>,
  ) {}

  async create(
    createCropSeasonCropDto: CreateCropSeasonCropDto,
  ): Promise<CropSeasonCrop> {
    const cropSeason = await this.findCropSeason(
      createCropSeasonCropDto.cropSeasonId,
    );
    const crop = await this.findCrop(createCropSeasonCropDto.cropId);

    await this.validateCropNotRegistered(
      createCropSeasonCropDto.cropSeasonId,
      createCropSeasonCropDto.cropId,
    );

    await this.validatePlantedArea(
      cropSeason,
      createCropSeasonCropDto.plantedArea,
    );

    const cropSeasonCrop = this.cropSeasonCropsRepository.create({
      cropSeason,
      crop,
      plantedArea: createCropSeasonCropDto.plantedArea,
    });

    return this.cropSeasonCropsRepository.save(cropSeasonCrop);
  }

  async findAll(): Promise<CropSeasonCrop[]> {
    return this.cropSeasonCropsRepository.find({
      relations: {
        cropSeason: true,
        crop: true,
      },
    });
  }

  async findOne(id: string): Promise<CropSeasonCrop> {
    const cropSeasonCrop = await this.cropSeasonCropsRepository.findOne({
      where: { id },
      relations: {
        cropSeason: {
          entity: true,
        },
        crop: true,
      },
    });

    if (!cropSeasonCrop) {
      throw new NotFoundException('Crop-season-crop relationship not found');
    }

    return cropSeasonCrop;
  }

  async update(
    id: string,
    updateCropSeasonCropDto: UpdateCropSeasonCropDto,
  ): Promise<CropSeasonCrop> {
    const cropSeasonCrop = await this.findOne(id);

    await this.validatePlantedArea(
      cropSeasonCrop.cropSeason,
      updateCropSeasonCropDto.plantedArea,
      id,
    );

    cropSeasonCrop.plantedArea = updateCropSeasonCropDto.plantedArea;

    return this.cropSeasonCropsRepository.save(cropSeasonCrop);
  }

  async remove(id: string): Promise<void> {
    const cropSeasonCrop = await this.findOne(id);

    await this.cropSeasonCropsRepository.softRemove(cropSeasonCrop);
  }

  private async findCropSeason(id: string): Promise<CropSeason> {
    const cropSeason = await this.cropSeasonsRepository.findOne({
      where: { id },
      relations: {
        entity: true,
      },
    });

    if (!cropSeason) {
      throw new NotFoundException('Crop season not found');
    }

    return cropSeason;
  }

  private async findCrop(id: string): Promise<Crop> {
    const crop = await this.cropsRepository.findOne({
      where: { id },
    });

    if (!crop) {
      throw new NotFoundException('Crop not found');
    }

    return crop;
  }

  private async validateCropNotRegistered(
    cropSeasonId: string,
    cropId: string,
  ): Promise<void> {
    const exists = await this.cropSeasonCropsRepository.exists({
      where: {
        cropSeason: { id: cropSeasonId },
        crop: { id: cropId },
      },
    });

    if (exists) {
      throw new ConflictException(
        'Crop is already registered in this crop season',
      );
    }

    const deletedRelation = await this.cropSeasonCropsRepository.findOne({
      where: {
        cropSeason: { id: cropSeasonId },
        crop: { id: cropId },
      },
      withDeleted: true,
    });

    if (deletedRelation) {
      throw new ConflictException(
        'Crop was previously registered and soft-deleted in this crop season',
      );
    }
  }

  private async validatePlantedArea(
    cropSeason: CropSeason,
    plantedArea: number,
    currentId?: string,
  ): Promise<void> {
    const query = this.cropSeasonCropsRepository
      .createQueryBuilder('cropSeasonCrop')
      .innerJoin('cropSeasonCrop.cropSeason', 'cropSeason')
      .select('COALESCE(SUM(cropSeasonCrop.plantedArea), 0)', 'total')
      .where('cropSeason.id = :cropSeasonId', {
        cropSeasonId: cropSeason.id,
      })
      .andWhere('cropSeasonCrop.deletedAt IS NULL');

    if (currentId) {
      query.andWhere('cropSeasonCrop.id != :currentId', { currentId });
    }

    const result = await query.getRawOne<{ total: string }>();

    const currentTotal = Number(result?.total ?? 0);
    const newTotal = currentTotal + plantedArea;

    if (newTotal > cropSeason.entity.agricultureArea) {
      throw new ConflictException(
        'Planted area exceeds the farm agricultural area',
      );
    }
  }
}
