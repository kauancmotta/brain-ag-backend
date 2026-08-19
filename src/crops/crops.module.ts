import { Module } from '@nestjs/common';
import { CropsService } from './crops.service';
import { CropsController } from './crops.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Crop } from './entities/crop.entity';
import { CropSeasonCrop } from '../crop_season_crops/entities/crop_season_crop.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Crop, CropSeasonCrop])],
  controllers: [CropsController],
  providers: [CropsService],
})
export class CropsModule {}
