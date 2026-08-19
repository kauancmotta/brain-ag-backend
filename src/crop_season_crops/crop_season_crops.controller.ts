import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CropSeasonCropsService } from './crop_season_crops.service';
import { CreateCropSeasonCropDto } from './dto/create-crop_season_crop.dto';
import { UpdateCropSeasonCropDto } from './dto/update-crop_season_crop.dto';

@ApiTags('Crop Season Crops')
@Controller('crop-season-crops')
export class CropSeasonCropsController {
  constructor(
    private readonly cropSeasonCropsService: CropSeasonCropsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a crop season crop' })
  @ApiBody({ type: CreateCropSeasonCropDto })
  create(@Body() createCropSeasonCropDto: CreateCropSeasonCropDto) {
    return this.cropSeasonCropsService.create(createCropSeasonCropDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all crop season crops' })
  findAll() {
    return this.cropSeasonCropsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get crop season crop by id' })
  @ApiParam({ name: 'id', type: String })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.cropSeasonCropsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a crop season crop' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateCropSeasonCropDto })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCropSeasonCropDto: UpdateCropSeasonCropDto,
  ) {
    return this.cropSeasonCropsService.update(id, updateCropSeasonCropDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a crop season crop' })
  @ApiParam({ name: 'id', type: String })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.cropSeasonCropsService.remove(id);
  }
}
