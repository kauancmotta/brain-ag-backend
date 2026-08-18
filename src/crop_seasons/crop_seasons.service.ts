import { Injectable } from '@nestjs/common';
import { CreateCropSeasonDto } from './dto/create-crop_season.dto';
import { UpdateCropSeasonDto } from './dto/update-crop_season.dto';

@Injectable()
export class CropSeasonsService {
  create(createCropSeasonDto: CreateCropSeasonDto) {
    return 'This action adds a new cropSeason';
  }

  findAll() {
    return `This action returns all cropSeasons`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cropSeason`;
  }

  update(id: number, updateCropSeasonDto: UpdateCropSeasonDto) {
    return `This action updates a #${id} cropSeason`;
  }

  remove(id: number) {
    return `This action removes a #${id} cropSeason`;
  }
}
