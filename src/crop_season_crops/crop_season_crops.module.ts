import { Module } from '@nestjs/common';
import { CropSeasonCropsService } from './crop_season_crops.service';
import { CropSeasonCropsController } from './crop_season_crops.controller';

@Module({
  controllers: [CropSeasonCropsController],
  providers: [CropSeasonCropsService],
})
export class CropSeasonCropsModule {}
