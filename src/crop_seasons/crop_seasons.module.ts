import { Module } from '@nestjs/common';
import { CropSeasonsService } from './crop_seasons.service';
import { CropSeasonsController } from './crop_seasons.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CropSeason } from './entities/crop_season.entity';
import { PropertyEntity } from '../entities/entities/entity.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CropSeason, PropertyEntity])],
  controllers: [CropSeasonsController],
  providers: [CropSeasonsService],
})
export class CropSeasonsModule {}
