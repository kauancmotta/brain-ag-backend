import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCropDto } from './dto/create-crop.dto';
import { UpdateCropDto } from './dto/update-crop.dto';
import { Crop } from './entities/crop.entity';

@Injectable()
export class CropsService {
  constructor(
    @InjectRepository(Crop)
    private readonly cropRepository: Repository<Crop>,
  ) {}

  async create(createCropDto: CreateCropDto): Promise<Crop> {
    const crop = this.cropRepository.create(createCropDto);
    return this.cropRepository.save(crop);
  }

  findAll(): Promise<Crop[]> {
    return this.cropRepository.find();
  }

  async findOne(id: string): Promise<Crop> {
    const crop = await this.cropRepository.findOne({ where: { id } });

    if (!crop) {
      throw new NotFoundException(`Crop with id ${id} not found`);
    }

    return crop;
  }

  async update(id: string, updateCropDto: UpdateCropDto): Promise<Crop> {
    const crop = await this.findOne(id);
    Object.assign(crop, updateCropDto);
    return this.cropRepository.save(crop);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.cropRepository.softDelete(id);
  }
}
