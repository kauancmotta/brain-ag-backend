import { Module } from '@nestjs/common';
import { CropSeasonsService } from './crop_seasons.service';
import { CropSeasonsController } from './crop_seasons.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CropSeason } from './entities/crop_season.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CropSeason])],
  controllers: [CropSeasonsController],
  providers: [CropSeasonsService],
})
export class CropSeasonsModule {}
