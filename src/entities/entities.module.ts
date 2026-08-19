import { Module } from '@nestjs/common';
import { EntitiesService } from './entities.service';
import { EntitiesController } from './entities.controller';
import { PropertyEntity } from './entities/entity.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from '../customers/entities/customer.entity';
import { CropSeason } from '../crop_seasons/entities/crop_season.entity';
import { CropSeasonCrop } from '../crop_season_crops/entities/crop_season_crop.entity';
import { Crop } from '../crops/entities/crop.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PropertyEntity,
      Customer,
      CropSeason,
      CropSeasonCrop,
      Crop,
    ]),
  ],
  controllers: [EntitiesController],
  providers: [EntitiesService],
})
export class EntitiesModule {}
