import { Module } from '@nestjs/common';
import { CropSeasonsService } from './crop_seasons.service';
import { CropSeasonsController } from './crop_seasons.controller';

@Module({
  controllers: [CropSeasonsController],
  providers: [CropSeasonsService],
})
export class CropSeasonsModule {}
