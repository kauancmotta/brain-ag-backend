import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEntityDto } from './dto/create-entity.dto';
import { UpdateEntityDto } from './dto/update-entity.dto';
import { Entity } from './entities/entity.entity';

@Injectable()
export class EntitiesService {
  constructor(
    @InjectRepository(Entity)
    private readonly entityRepository: Repository<Entity>,
  ) {}

  async create(createEntityDto: CreateEntityDto): Promise<Entity> {
    const entity = this.entityRepository.create(createEntityDto);
    return this.entityRepository.save(entity);
  }

  findAll(): Promise<Entity[]> {
    return this.entityRepository.find();
  }

  async findOne(id: string): Promise<Entity> {
    const entity = await this.entityRepository.findOne({ where: { id } });

    if (!entity) {
      throw new NotFoundException(`Entity with id ${id} not found`);
    }

    return entity;
  }

  async update(id: string, updateEntityDto: UpdateEntityDto): Promise<Entity> {
    const entity = await this.findOne(id);
    Object.assign(entity, updateEntityDto);
    return this.entityRepository.save(entity);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.entityRepository.softDelete(id);
  }
}
