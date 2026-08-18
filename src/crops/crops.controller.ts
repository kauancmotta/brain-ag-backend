import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CropsService } from './crops.service';
import { CreateCropDto } from './dto/create-crop.dto';
import { UpdateCropDto } from './dto/update-crop.dto';

@ApiTags('Crops')
@Controller('crops')
export class CropsController {
  constructor(private readonly cropsService: CropsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a crop' })
  @ApiBody({ type: CreateCropDto })
  create(@Body() createCropDto: CreateCropDto) {
    return this.cropsService.create(createCropDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all crops' })
  findAll() {
    return this.cropsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get crop by id' })
  @ApiParam({ name: 'id', type: String })
  findOne(@Param('id') id: string) {
    return this.cropsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a crop' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateCropDto })
  update(@Param('id') id: string, @Body() updateCropDto: UpdateCropDto) {
    return this.cropsService.update(id, updateCropDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a crop' })
  @ApiParam({ name: 'id', type: String })
  remove(@Param('id') id: string) {
    return this.cropsService.remove(id);
  }
}
