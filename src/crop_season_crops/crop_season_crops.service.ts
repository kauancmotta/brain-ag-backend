import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCropSeasonCropDto } from './dto/create-crop_season_crop.dto';
import { UpdateCropSeasonCropDto } from './dto/update-crop_season_crop.dto';
import { CropSeasonCrop } from './entities/crop_season_crop.entity';

@Injectable()
export class CropSeasonCropsService {
  constructor(
    @InjectRepository(CropSeasonCrop)
    private readonly cropSeasonCropRepository: Repository<CropSeasonCrop>,
  ) {}

  async create(createCropSeasonCropDto: CreateCropSeasonCropDto): Promise<CropSeasonCrop> {
    const cropSeasonCrop = this.cropSeasonCropRepository.create(createCropSeasonCropDto);
    return this.cropSeasonCropRepository.save(cropSeasonCrop);
  }

  findAll(): Promise<CropSeasonCrop[]> {
    return this.cropSeasonCropRepository.find();
  }

  async findOne(id: string): Promise<CropSeasonCrop> {
    const cropSeasonCrop = await this.cropSeasonCropRepository.findOne({ where: { id } });

    if (!cropSeasonCrop) {
      throw new NotFoundException(`Crop season crop with id ${id} not found`);
    }

    return cropSeasonCrop;
  }

  async update(id: string, updateCropSeasonCropDto: UpdateCropSeasonCropDto): Promise<CropSeasonCrop> {
    const cropSeasonCrop = await this.findOne(id);
    Object.assign(cropSeasonCrop, updateCropSeasonCropDto);
    return this.cropSeasonCropRepository.save(cropSeasonCrop);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.cropSeasonCropRepository.softDelete(id);
  }
}
