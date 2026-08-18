import { Module } from '@nestjs/common';
import { CustomersModule } from './customers/customers.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { EntitiesModule } from './entities/entities.module';
import { AddressModule } from './address/address.module';
import { CropsModule } from './crops/crops.module';
import { CropSeasonsModule } from './crop_seasons/crop_seasons.module';
import { CropSeasonCropsModule } from './crop_season_crops/crop_season_crops.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [],
      synchronize: process.env.NODE_ENV !== 'production',
    }),
    CustomersModule,
    EntitiesModule,
    AddressModule,
    CropsModule,
    CropSeasonsModule,
    CropSeasonCropsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
