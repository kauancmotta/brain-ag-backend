import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PropertyEntity } from '../entities/entities/entity.entity';
import { CropSeasonCrop } from '../crop_season_crops/entities/crop_season_crop.entity';
import { Repository } from 'typeorm';
import { DashboardResponseDto } from './dto/dashboard-response.dto';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(PropertyEntity)
    private readonly entitiesRepository: Repository<PropertyEntity>,

    @InjectRepository(CropSeasonCrop)
    private readonly cropSeasonCropRepository: Repository<CropSeasonCrop>,
  ) {}

  async getDashboard(year?: string): Promise<DashboardResponseDto> {
    const [entitySummary, byState, byCrop, landUse] = await Promise.all([
      this.getEntitySummary(year),
      this.getEntityByState(year),
      this.getCrops(year),
      this.getLandUse(year),
    ]);

    return {
      ...entitySummary,
      byState,
      byCrop,
      landUse,
    };
  }

  async getEntitySummary(year?: string) {
    const query = this.entitiesRepository
      .createQueryBuilder('entity')
      .select('COUNT(entity.id)', 'totalEntities')
      .addSelect('COALESCE(SUM(entity.totalArea), 0)', 'totalArea')
      .where('entity.deletedAt IS NULL');

    if (year) {
      query
        .innerJoin('entity.cropSeasons', 'cropSeason')
        .andWhere('cropSeason.year = :year', { year })
        .andWhere('cropSeason.deletedAt IS NULL');
    }

    const result = await query.getRawOne();

    return {
      totalEntities: Number(result.totalEntities),
      totalArea: Number(result.totalArea),
    };
  }

  async getEntityByState(year?: string) {
    const query = this.entitiesRepository
      .createQueryBuilder('entity')
      .innerJoin('entity.address', 'address')
      .select('address.state', 'state')
      .addSelect('COUNT(entity.id)', 'total')
      .where('entity.deletedAt IS NULL');

    if (year) {
      query
        .innerJoin('entity.cropSeasons', 'cropSeason')
        .andWhere('cropSeason.year = :year', { year })
        .andWhere('cropSeason.deletedAt IS NULL');
    }

    const result = await query
      .groupBy('address.state')
      .orderBy('total', 'DESC')
      .getRawMany();

    return result.map((item) => ({
      state: item.state,
      total: Number(item.total),
    }));
  }

  async getCrops(year?: string) {
    const query = this.cropSeasonCropRepository
      .createQueryBuilder('cropSeasonCrop')
      .innerJoin('cropSeasonCrop.crop', 'crop')
      .innerJoin('cropSeasonCrop.cropSeason', 'cropSeason')
      .innerJoin('cropSeason.entity', 'entity')
      .select('crop.name', 'crop')
      .addSelect('COALESCE(SUM(cropSeasonCrop.plantedArea), 0)', 'totalArea')
      .where('cropSeasonCrop.deletedAt IS NULL')
      .andWhere('cropSeason.deletedAt IS NULL')
      .andWhere('entity.deletedAt IS NULL');

    if (year) {
      query.andWhere('cropSeason.year = :year', { year });
    }

    const result = await query
      .groupBy('crop.name')
      .orderBy('totalArea', 'DESC')
      .getRawMany();

    return result.map((item) => ({
      crop: item.crop,
      totalArea: Number(item.totalArea),
    }));
  }

  async getLandUse(year?: string) {
    const query = this.entitiesRepository
      .createQueryBuilder('entity')
      .select('COALESCE(SUM(entity.agricultureArea), 0)', 'agriculture')
      .addSelect('COALESCE(SUM(entity.vegetationArea), 0)', 'vegetation')
      .where('entity.deletedAt IS NULL');

    if (year) {
      query
        .innerJoin('entity.cropSeasons', 'cropSeason')
        .andWhere('cropSeason.year = :year', { year })
        .andWhere('cropSeason.deletedAt IS NULL');
    }

    const result = await query.getRawOne();

    return {
      agriculture: Number(result.agriculture),
      vegetation: Number(result.vegetation),
    };
  }
}
