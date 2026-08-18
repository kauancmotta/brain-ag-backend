import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCropSeasonDto } from './dto/create-crop_season.dto';
import { UpdateCropSeasonDto } from './dto/update-crop_season.dto';
import { CropSeason } from './entities/crop_season.entity';

@Injectable()
export class CropSeasonsService {
  constructor(
    @InjectRepository(CropSeason)
    private readonly cropSeasonRepository: Repository<CropSeason>,
  ) {}

  async create(createCropSeasonDto: CreateCropSeasonDto): Promise<CropSeason> {
    const cropSeason = this.cropSeasonRepository.create(createCropSeasonDto);
    return this.cropSeasonRepository.save(cropSeason);
  }

  findAll(): Promise<CropSeason[]> {
    return this.cropSeasonRepository.find();
  }

  async findOne(id: string): Promise<CropSeason> {
    const cropSeason = await this.cropSeasonRepository.findOne({ where: { id } });

    if (!cropSeason) {
      throw new NotFoundException(`Crop season with id ${id} not found`);
    }

    return cropSeason;
  }

  async update(id: string, updateCropSeasonDto: UpdateCropSeasonDto): Promise<CropSeason> {
    const cropSeason = await this.findOne(id);
    Object.assign(cropSeason, updateCropSeasonDto);
    return this.cropSeasonRepository.save(cropSeason);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.cropSeasonRepository.softDelete(id);
  }
}
