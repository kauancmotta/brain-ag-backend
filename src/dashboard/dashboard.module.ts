import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { PropertyEntity } from '@/src/entities/entities/entity.entity';
import { Address } from '@/src/address/entities/address.entity';
import { CropSeasonCrop } from '../crop_season_crops/entities/crop_season_crop.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PropertyEntity, Address, CropSeasonCrop]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
