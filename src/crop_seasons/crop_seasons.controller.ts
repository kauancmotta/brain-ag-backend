import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CropSeasonsService } from './crop_seasons.service';
import { CreateCropSeasonDto } from './dto/create-crop_season.dto';
import { UpdateCropSeasonDto } from './dto/update-crop_season.dto';

@Controller('crop-seasons')
export class CropSeasonsController {
  constructor(private readonly cropSeasonsService: CropSeasonsService) {}

  @Post()
  create(@Body() createCropSeasonDto: CreateCropSeasonDto) {
    return this.cropSeasonsService.create(createCropSeasonDto);
  }

  @Get()
  findAll() {
    return this.cropSeasonsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cropSeasonsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCropSeasonDto: UpdateCropSeasonDto) {
    return this.cropSeasonsService.update(+id, updateCropSeasonDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cropSeasonsService.remove(+id);
  }
}
