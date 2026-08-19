import { Module } from '@nestjs/common';
import { CropSeasonCropsService } from './crop_season_crops.service';
import { CropSeasonCropsController } from './crop_season_crops.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CropSeasonCrop } from './entities/crop_season_crop.entity';
import { CropSeason } from '../crop_seasons/entities/crop_season.entity';
import { Crop } from '../crops/entities/crop.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CropSeasonCrop, CropSeason, Crop])],
  controllers: [CropSeasonCropsController],
  providers: [CropSeasonCropsService],
})
export class CropSeasonCropsModule {}
