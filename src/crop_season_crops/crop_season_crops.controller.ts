import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CropSeasonCropsService } from './crop_season_crops.service';
import { CreateCropSeasonCropDto } from './dto/create-crop_season_crop.dto';
import { UpdateCropSeasonCropDto } from './dto/update-crop_season_crop.dto';

@Controller('crop-season-crops')
export class CropSeasonCropsController {
  constructor(private readonly cropSeasonCropsService: CropSeasonCropsService) {}

  @Post()
  create(@Body() createCropSeasonCropDto: CreateCropSeasonCropDto) {
    return this.cropSeasonCropsService.create(createCropSeasonCropDto);
  }

  @Get()
  findAll() {
    return this.cropSeasonCropsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cropSeasonCropsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCropSeasonCropDto: UpdateCropSeasonCropDto) {
    return this.cropSeasonCropsService.update(+id, updateCropSeasonCropDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cropSeasonCropsService.remove(+id);
  }
}
