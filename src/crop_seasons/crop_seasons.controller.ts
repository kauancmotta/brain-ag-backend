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
import { CropSeasonsService } from './crop_seasons.service';
import { CreateCropSeasonDto } from './dto/create-crop_season.dto';
import { UpdateCropSeasonDto } from './dto/update-crop_season.dto';

@ApiTags('Crop Seasons')
@Controller('crop-seasons')
export class CropSeasonsController {
  constructor(private readonly cropSeasonsService: CropSeasonsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a crop season' })
  @ApiBody({ type: CreateCropSeasonDto })
  create(@Body() createCropSeasonDto: CreateCropSeasonDto) {
    return this.cropSeasonsService.create(createCropSeasonDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all crop seasons' })
  findAll() {
    return this.cropSeasonsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get crop season by id' })
  @ApiParam({ name: 'id', type: String })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.cropSeasonsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a crop season' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateCropSeasonDto })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCropSeasonDto: UpdateCropSeasonDto,
  ) {
    return this.cropSeasonsService.update(id, updateCropSeasonDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a crop season' })
  @ApiParam({ name: 'id', type: String })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.cropSeasonsService.remove(id);
  }

}
