import { Module } from '@nestjs/common';
import { CropSeasonCropsService } from './crop_season_crops.service';
import { CropSeasonCropsController } from './crop_season_crops.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CropSeasonCrop } from './entities/crop_season_crop.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CropSeasonCrop])],
  controllers: [CropSeasonCropsController],
  providers: [CropSeasonCropsService],
})
export class CropSeasonCropsModule {}
