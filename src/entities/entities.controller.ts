import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { EntitiesService } from './entities.service';
import { CreateEntityDto } from './dto/create-entity.dto';
import { UpdateEntityDto } from './dto/update-entity.dto';

@ApiTags('Entities')
@Controller('entities')
export class EntitiesController {
  constructor(private readonly entitiesService: EntitiesService) {}

  @Post()
  @ApiOperation({ summary: 'Create an entity' })
  @ApiBody({ type: CreateEntityDto })
  create(@Body() createEntityDto: CreateEntityDto) {
    return this.entitiesService.create(createEntityDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all entities' })
  findAll() {
    return this.entitiesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get entity by id' })
  @ApiParam({ name: 'id', type: String })
  findOne(@Param('id') id: string) {
    return this.entitiesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an entity' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateEntityDto })
  update(@Param('id') id: string, @Body() updateEntityDto: UpdateEntityDto) {
    return this.entitiesService.update(id, updateEntityDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an entity' })
  @ApiParam({ name: 'id', type: String })
  remove(@Param('id') id: string) {
    return this.entitiesService.remove(id);
  }
}
