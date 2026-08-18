import { Module } from '@nestjs/common';
import { EntitiesService } from './entities.service';
import { EntitiesController } from './entities.controller';
import { PropertyEntity } from './entities/entity.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([PropertyEntity])],
  controllers: [EntitiesController],
  providers: [EntitiesService],
})
export class EntitiesModule {}
