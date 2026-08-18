import { Injectable } from '@nestjs/common';
import { CreateCropSeasonCropDto } from './dto/create-crop_season_crop.dto';
import { UpdateCropSeasonCropDto } from './dto/update-crop_season_crop.dto';

@Injectable()
export class CropSeasonCropsService {
  create(createCropSeasonCropDto: CreateCropSeasonCropDto) {
    return 'This action adds a new cropSeasonCrop';
  }

  findAll() {
    return `This action returns all cropSeasonCrops`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cropSeasonCrop`;
  }

  update(id: number, updateCropSeasonCropDto: UpdateCropSeasonCropDto) {
    return `This action updates a #${id} cropSeasonCrop`;
  }

  remove(id: number) {
    return `This action removes a #${id} cropSeasonCrop`;
  }
}
