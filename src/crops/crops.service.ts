import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCropDto } from './dto/create-crop.dto';
import { UpdateCropDto } from './dto/update-crop.dto';
import { Crop } from './entities/crop.entity';
import { CropSeasonCrop } from '../crop_season_crops/entities/crop_season_crop.entity';

@Injectable()
export class CropsService {
  constructor(
    @InjectRepository(Crop)
    private readonly cropsRepository: Repository<Crop>,
    @InjectRepository(CropSeasonCrop)
    private readonly cropSeasonCropsRepository: Repository<CropSeasonCrop>,
  ) {}

  async create(dto: CreateCropDto): Promise<Crop> {
    await this.validateNameNotRegistered(dto.name);

    const crop = this.cropsRepository.create(dto);

    return this.cropsRepository.save(crop);
  }

  async findAll(): Promise<Crop[]> {
    return this.cropsRepository.find();
  }

  async findOne(id: string): Promise<Crop> {
    const crop = await this.cropsRepository.findOne({
      where: { id },
    });

    if (!crop) {
      throw new NotFoundException('Crop not found');
    }

    return crop;
  }

  async update(id: string, dto: UpdateCropDto): Promise<Crop> {
    const crop = await this.findOne(id);

    if (dto.name && dto.name !== crop.name) {
      await this.validateNameNotRegistered(dto.name);
    }

    Object.assign(crop, dto);

    return this.cropsRepository.save(crop);
  }

  async remove(id: string): Promise<void> {
    const crop = await this.findOne(id);

    const used = await this.cropSeasonCropsRepository.exists({
      where: {
        crop: { id },
      },
    });

    if (used) {
      throw new ConflictException(
        'Crop cannot be deleted because it is being used',
      );
    }

    await this.cropsRepository.remove(crop);
  }

  private async validateNameNotRegistered(name: string): Promise<void> {
    const exists = await this.cropsRepository.exists({
      where: { name },
    });

    if (exists) {
      throw new ConflictException('Crop already registered');
    }
  }
}
